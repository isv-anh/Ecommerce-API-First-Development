import { Client } from "@elastic/elasticsearch";

export const esClient = new Client({
  node: process.env.ELASTICSEARCH_NODE || "http://localhost:9200",
  // Nếu có bật bảo mật (Basic Auth hoặc API Key):
  /*
  auth: {
    username: process.env.ELASTIC_USERNAME || 'elastic',
    password: process.env.ELASTIC_PASSWORD || 'changeme',
    // Hoặc dùng API Key:
    // apiKey: process.env.ELASTIC_API_KEY
  },
  tls: {
    rejectUnauthorized: false // Chỉ dùng trong dev nếu dùng chứng chỉ tự ký
  }
  */
});
