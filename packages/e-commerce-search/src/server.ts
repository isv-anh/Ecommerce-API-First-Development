import * as grpc from "@grpc/grpc-js";
import {
  UserServiceService,
  UserServiceServer,
  UserRequest,
  UserResponse,
} from "./generated/user";

const serverImpl: UserServiceServer = {
  getUser: (
    call: grpc.ServerUnaryCall<UserRequest, UserResponse>,
    callback: grpc.sendUnaryData<UserResponse>,
  ) => {
    const userId = call.request.id;

    // Giả lập truy vấn dữ liệu
    const user: UserResponse = {
      id: userId,
      name: "Nguyen Van A",
      email: "vana@example.com",
    };

    callback(null, user);
  },
};

const server = new grpc.Server();
server.addService(UserServiceService, serverImpl);

const PORT = "0.0.0.0:50051";
server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`gRPC Server running on port ${port}`);
});
