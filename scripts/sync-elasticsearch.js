const { Client: PgClient } = require('pg');
const { Client: EsClient } = require('@elastic/elasticsearch');
const OpenAI = require('openai');
require('dotenv').config(); // Load root .env
require('dotenv').config({ path: './packages/e-commerce-search/.env' });

// Supabase Connection (using env variables)
const pgClient = new PgClient({
  host: process.env.DB_HOST || 'aws-0-ap-northeast-1.pooler.supabase.com',
  port: process.env.DB_PORT || 6543,
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USERNAME || process.env.POSTGRES_USER,
  password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

// Elasticsearch Connection
const clientOptions = {};

if (process.env.ELASTIC_CLOUD_ID) {
  clientOptions.cloud = {
    id: process.env.ELASTIC_CLOUD_ID,
  };
} else {
  clientOptions.node = process.env.ELASTICSEARCH_NODE || "http://localhost:9200";
}

if (process.env.ELASTIC_API_KEY) {
  clientOptions.auth = {
    apiKey: process.env.ELASTIC_API_KEY,
  };
} else if (process.env.ELASTIC_USERNAME && process.env.ELASTIC_PASSWORD) {
  clientOptions.auth = {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD,
  };
}

const esClient = new EsClient(clientOptions);

// Dashscope/OpenAI connection
const qwenClient = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
});

async function getEmbedding(text) {
  if (!text) return null;
  const cleanedText = text.replace(/\n+/g, " ").trim();
  const response = await qwenClient.embeddings.create({
    model: "text-embedding-v3",
    input: cleanedText,
    dimensions: 1024,
    encoding_format: "float",
  });
  return response.data[0].embedding;
}

async function run() {
  try {
    console.log('Connecting to Postgres database...');
    await pgClient.connect();
    
    console.log('Checking Elasticsearch connection...');
    const isHealthy = await esClient.ping();
    if (!isHealthy) {
      throw new Error("Elasticsearch ping failed");
    }

    // Ensure index exists
    const indexExists = await esClient.indices.exists({ index: "products" });
    if (!indexExists) {
      console.log("Index 'products' does not exist. Creating with mapping...");
      await esClient.indices.create({
        index: "products",
        mappings: {
          properties: {
            productId: { type: "keyword" },
            productName: {
              type: "text",
              fields: { keyword: { type: "keyword", ignore_above: 256 } },
            },
            description: { type: "text" },
            price: { type: "double" },
            categoryName: {
              type: "text",
              fields: { keyword: { type: "keyword" } },
            },
            brandName: {
              type: "text",
              fields: { keyword: { type: "keyword" } },
            },
            thumbnailUrl: { type: "keyword", index: false },
            slug: { type: "keyword" },
            product_vector: {
              type: "dense_vector",
              dims: 1024,
              index: true,
              similarity: "cosine",
            },
          },
        },
      });
      console.log("Index 'products' created successfully.");
    }

    console.log('Fetching products from Postgres...');
    const result = await pgClient.query(`
      SELECT 
        p.id as "productId", 
        p.name as "productName", 
        p.description, 
        v.price, 
        c.name as "categoryName", 
        b.name as "brandName", 
        p.thumbnail_url as "thumbnailUrl", 
        p.slug 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      LEFT JOIN brands b ON p.brand_id = b.id 
      LEFT JOIN (
        SELECT product_id, min(price) as price 
        FROM product_variants 
        GROUP BY product_id
      ) v ON p.id = v.product_id;
    `);

    const products = result.rows;
    console.log(`Found ${products.length} products to sync.`);

    if (products.length === 0) {
      console.log('No products to sync. Exiting.');
      return;
    }

    console.log('Generating embeddings and indexing to Elasticsearch...');
    const batchSize = 25; // Smaller batch size to avoid rate limits and too many concurrent API requests
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(products.length / batchSize)}...`);
      
      const operations = [];
      
      // Process batch sequentially to avoid hitting rate limits on Dashscope
      for (const doc of batch) {
         const textToEmbed = `${doc.productName} ${doc.categoryName || ''} ${doc.brandName || ''} ${doc.description || ''}`;
         let vector = null;
         try {
             vector = await getEmbedding(textToEmbed);
         } catch (e) {
             console.error(`Failed to get embedding for product ${doc.productId}:`, e.message);
         }
         
         operations.push({ index: { _index: 'products', _id: doc.productId } });
         operations.push({
            productId: doc.productId,
            productName: doc.productName,
            description: doc.description,
            price: doc.price ? parseFloat(doc.price) : 0,
            categoryName: doc.categoryName || '',
            brandName: doc.brandName || '',
            thumbnailUrl: doc.thumbnailUrl || '',
            slug: doc.slug || '',
            product_vector: vector // Include the generated vector
         });
      }

      const bulkResponse = await esClient.bulk({ refresh: true, operations });

      if (bulkResponse.errors) {
        const erroredDocuments = [];
        bulkResponse.items.forEach((action, idx) => {
          const operation = Object.keys(action)[0];
          if (action[operation].error) {
            erroredDocuments.push({
              status: action[operation].status,
              error: action[operation].error,
              operation: operations[idx * 2],
              document: operations[idx * 2 + 1]
            });
          }
        });
        console.error('Errors occurred during bulk index for this batch:', JSON.stringify(erroredDocuments, null, 2));
      }
    }
    
    console.log(`Successfully indexed ${products.length} products with embeddings to Elasticsearch.`);

  } catch (error) {
    console.error('Error during synchronization:', error);
  } finally {
    await pgClient.end();
  }
}

run();
