import * as amqp from "amqplib";
import { updateProduct } from "./handlers/product";

export async function initRabbitMQConsumer() {
  const rabbitMqUrl = process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";
  const exchangeName = "product_events";
  const queueName = "search_product_sync_queue";

  try {
    console.log(`Connecting to RabbitMQ at ${rabbitMqUrl}`);
    const connection = await amqp.connect(rabbitMqUrl);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, "topic", { durable: true });
    
    const q = await channel.assertQueue(queueName, { durable: true });
    
    // Bind the queue to the exchange. Use '#' to listen to all product events
    await channel.bindQueue(q.queue, exchangeName, "product.#");

    console.log(`RabbitMQ consumer connected and listening on queue: ${q.queue}`);

    channel.consume(q.queue, async (msg) => {
      if (msg !== null) {
        try {
          const content = msg.content.toString();
          const event = JSON.parse(content);
          
          console.log(`Received RabbitMQ event: ${event.eventType} for product ${event.aggregateId}`);
          
          if (event.aggregateType === 'product') {
             // For deleted, we might want a different handler, but updateProduct might handle it or we can ignore for now
             if (event.eventType === 'deleted') {
                console.log(`Product ${event.aggregateId} deleted, skipping sync for now (TODO: delete from ES)`);
             } else {
                // The payload contains the full product object (as any in API)
                // We map it to what updateProduct expects
                const p = event.payload;
                
                const productToUpdate = {
                  productId: p.id,
                  productName: p.name,
                  description: p.description || '',
                  price: p.product_variants?.[0]?.price || 0,
                  categoryName: p.categories?.name || '',
                  thumbnailUrl: p.thumbnail_url || '',
                  brandName: p.brands?.name || '',
                  slug: p.slug || ''
                };
                
                await updateProduct(productToUpdate as any);
             }
          }
          
          channel.ack(msg);
        } catch (error) {
          console.error("Error processing RabbitMQ message", error);
          // If we fail to process, we can Nack and it will be requeued depending on configuration
          channel.nack(msg, false, false);
        }
      }
    });

  } catch (error) {
    console.error("Failed to connect to RabbitMQ consumer", error);
    setTimeout(initRabbitMQConsumer, 5000);
  }
}
