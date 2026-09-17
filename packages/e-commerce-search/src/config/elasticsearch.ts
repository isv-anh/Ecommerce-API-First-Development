import { Client, ClientOptions } from "@elastic/elasticsearch";

const clientOptions: ClientOptions = {};

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

export const esClient = new Client(clientOptions);
