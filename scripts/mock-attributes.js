const { Client } = require('pg');
const crypto = require('crypto');
require('dotenv').config();

const client = new Client({
  host: process.env.DB_HOST || 'aws-0-ap-northeast-1.pooler.supabase.com',
  port: process.env.DB_PORT || 6543,
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USERNAME || process.env.POSTGRES_USER,
  password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  console.log('Connected to DB');

  try {
    // 1. Create attributes
    const sizeAttrId = crypto.randomUUID();
    const colorAttrId = crypto.randomUUID();

    await client.query(`
      INSERT INTO attributes (id, name) VALUES ($1, 'Size'), ($2, 'Màu sắc')
      ON CONFLICT (name) DO NOTHING
    `, [sizeAttrId, colorAttrId]);

    const sizeAttrRes = await client.query("SELECT id FROM attributes WHERE name = 'Size'");
    const colorAttrRes = await client.query("SELECT id FROM attributes WHERE name = 'Màu sắc'");
    
    const dbSizeAttrId = sizeAttrRes.rows[0].id;
    const dbColorAttrId = colorAttrRes.rows[0].id;

    // 2. Find fashion categories (Thời trang nam, Thời trang nữ, Giày - Dép Nam)
    const catRes = await client.query("SELECT id FROM categories WHERE name IN ('Thời trang nam', 'Thời trang nữ', 'Giày - Dép Nam', 'Ba lô và Vali')");
    if (catRes.rowCount === 0) {
      console.log('No fashion categories found.');
      return;
    }
    const catIds = catRes.rows.map(r => r.id);

    // 3. Find products in these categories
    const productsRes = await client.query(`SELECT id, name, description, thumbnail_url FROM products WHERE category_id = ANY($1::uuid[])`, [catIds]);
    console.log(`Found ${productsRes.rowCount} fashion products to mock variants and attributes.`);

    // 4. Update descriptions and generate variants
    const sizes = ['S', 'M', 'L', 'XL'];
    const colors = ['Đen', 'Trắng', 'Xanh', 'Đỏ'];

    let count = 0;
    const warehouseRes = await client.query('SELECT id FROM warehouses LIMIT 1');
    const warehouseId = warehouseRes.rows[0]?.id;

    for (const p of productsRes.rows) {
      count++;
      // Append size/color to description so Elasticsearch indexes it and AI can read it
      const appendedDesc = (p.description || '') + '\\n\\nThông tin chi tiết:\\n- Các size hiện có: S, M, L, XL\\n- Màu sắc: Đen, Trắng, Xanh, Đỏ';
      await client.query(`UPDATE products SET description = $1 WHERE id = $2`, [appendedDesc, p.id]);

      // Assign product_attributes
      await client.query(`
        INSERT INTO product_attributes (product_id, attribute_id, sort_order) VALUES ($1, $2, 1), ($1, $3, 2)
        ON CONFLICT (product_id, attribute_id) DO NOTHING
      `, [p.id, dbSizeAttrId, dbColorAttrId]);

      // Generate 2 variants for each product just to have some data
      const randomSizes = [sizes[Math.floor(Math.random() * sizes.length)], sizes[Math.floor(Math.random() * sizes.length)]];
      const randomColors = [colors[Math.floor(Math.random() * colors.length)], colors[Math.floor(Math.random() * colors.length)]];

      for (let i = 0; i < 2; i++) {
        const variantId = crypto.randomUUID();
        const sku = crypto.randomUUID().substring(0, 8);
        const price = Math.floor(Math.random() * 500000) + 50000;
        
        await client.query(`
          INSERT INTO product_variants (id, product_id, sku, thumbnail_url, price, compare_price, stock, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        `, [variantId, p.id, sku, p.thumbnail_url, price, price + 50000, 100]);

        // Add variant attributes
        await client.query(`
          INSERT INTO variant_attribute_values (product_variant_id, attribute_id, value) 
          VALUES ($1, $2, $3), ($1, $4, $5)
        `, [variantId, dbSizeAttrId, randomSizes[i], dbColorAttrId, randomColors[i]]);

        // Add warehouse inventory
        if (warehouseId) {
          await client.query(`
            INSERT INTO warehouse_inventory (warehouse_id, product_variant_id, stock)
            VALUES ($1, $2, $3)
          `, [warehouseId, variantId, 100]);
        }
      }

      if (count % 20 === 0) console.log(`Processed ${count}/${productsRes.rowCount} products...`);
    }

    console.log('Successfully mocked variants and attributes for fashion products.');
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await client.end();
  }
}

run();
