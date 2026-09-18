const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, '../../../e-commerce/packages/proto/order/v1/order.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const orderService = protoDescriptor.order.v1.OrderService;

const client = new orderService('localhost:50052', grpc.credentials.createInsecure());

console.log('Testing PlaceOrder...');
client.PlaceOrder({
  customer_id: 'cust-123',
  items: [{ product_id: 'prod-1', quantity: 2 }],
  payment_method: 'CREDIT_CARD',
  shipping_address: '123 Main St'
}, (err, response) => {
  if (err) {
    console.error('PlaceOrder Error:', err);
    return;
  }
  console.log('PlaceOrder Response:', response);
  
  console.log('\nTesting GetOrder...');
  client.GetOrder({ order_id: response.order_id }, (err2, response2) => {
    if (err2) {
      console.error('GetOrder Error:', err2);
      return;
    }
    console.log('GetOrder Response:', response2);
    
    console.log('\nTesting CancelOrder...');
    client.CancelOrder({ order_id: response.order_id, reason: 'changed mind' }, (err3, response3) => {
      if (err3) {
        console.error('CancelOrder Error:', err3);
        return;
      }
      console.log('CancelOrder Response:', response3);
    });
  });
});
