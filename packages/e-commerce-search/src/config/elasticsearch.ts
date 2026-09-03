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

// Hàm kiểm tra kết nối khi khởi động ứng dụng
export async function checkEsConnection(): Promise<void> {
  try {
    const health = await esClient.cluster.health();
    console.log(
      `Elasticsearch connected: Cluster status is "${health.status}"`,
    );
  } catch (error) {
    console.error("Không thể kết nối tới Elasticsearch:", error);
    throw error;
  }
}
