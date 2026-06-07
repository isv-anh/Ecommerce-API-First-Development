import { Injectable } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import type {
  PostPresignedUrlBody,
  PostPresignedUrl200Response,
} from '@e-commerce/api-validation/types/system';
import { BaseUploadsControllerInterface } from '@generated-controller/system/uploads/base-uploads.controller.interface';

@Injectable()
export class UploadsController implements BaseUploadsControllerInterface {
  constructor(private readonly service: UploadsService) {}

  /**
   * POST /api/v1/uploads/presigned-url
   */
  async postPresignedUrl(
    body: PostPresignedUrlBody,
  ): Promise<PostPresignedUrl200Response> {
    return await this.service.postPresignedUrl(body);
  }
}
