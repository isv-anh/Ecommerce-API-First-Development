import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import {
  BaseAIController,
  AI_CONTROLLER,
} from '@generated-controller/system/ai/base-ai.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AI_ASSISTANT_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'ai_assistant.v1',
          protoPath: join(
            process.cwd(),
            '../proto/ai_assistant/v1/ai_assistant.proto',
          ),
          url: 'localhost:50051',
        },
      },
    ]),
  ],
  controllers: [BaseAIController],
  providers: [
    AiService,
    {
      provide: AI_CONTROLLER,
      useClass: AiController,
    },
  ],
})
export class AiModule {}
