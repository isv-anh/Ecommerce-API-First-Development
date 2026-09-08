import grpc

from app.buf.generated.product.v1 import product_pb2_grpc


class ProductClientManager:
    _instance: "ProductClientManager | None" = None
    _client: product_pb2_grpc.ProductServiceStub | None = None
    _channel: grpc.aio.Channel | None = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def get_client(self, target: str = "localhost:50051") -> product_pb2_grpc.ProductServiceStub:
        if self._client is None:
            self._channel = grpc.aio.insecure_channel(target)
            self._client = product_pb2_grpc.ProductServiceStub(self._channel)
        return self._client

    async def close(self):
        if self._channel:
            await self._channel.close()

product_client_manager = ProductClientManager()