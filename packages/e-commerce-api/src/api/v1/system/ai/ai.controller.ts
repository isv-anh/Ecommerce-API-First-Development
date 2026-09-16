import { ClsService } from '@/common/services/cls/cls.service';
import { BaseAIControllerInterface } from '@generated-controller/system/ai/base-ai.controller.interface';
import { AiService } from './ai.service';
import {
  AiRoutesChat200Response,
  AiRoutesChatBody,
} from '@e-commerce/api-validation/types/system';

export class AiController implements BaseAIControllerInterface {
  constructor(
    private readonly aiService: AiService,
    private readonly clsService: ClsService,
  ) {}

  async aiRoutesChat(
    requestBody: AiRoutesChatBody,
  ): Promise<AiRoutesChat200Response> {
    const userId = this.clsService.userId;
    const grpcResponse: any = await this.aiService.chat(
      requestBody.message as string,
      requestBody.sessionId as string,
      userId,
    );

    return {
      message: grpcResponse.message,
      data: grpcResponse.data,
      sessionId: grpcResponse.sessionId,
    };
  }
}
