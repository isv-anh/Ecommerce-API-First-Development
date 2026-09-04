import * as grpc from "@grpc/grpc-js";
import { UserServiceClient } from "./generated/user";

const client = new UserServiceClient(
  "localhost:50051",
  grpc.credentials.createInsecure(),
);

client.getUser({ id: "123" }, (err, response) => {
  if (err) {
    console.error("Lỗi RPC:", err);
    return;
  }
  console.log("Kết quả từ Server:", response);
});
