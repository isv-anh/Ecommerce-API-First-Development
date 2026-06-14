import { BadRequestException, Injectable } from '@nestjs/common';
import type {
  PostPresignedUrlBody,
  PostPresignedUrl200Response,
} from '@e-commerce/api-validation/types/system';
import type { BaseUploadsControllerInterface } from '@generated-controller/system/uploads/base-uploads.controller.interface';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { PrismaService } from '@/common/services/prisma.service';

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

const ALLOWED_MIME_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
};

@Injectable()
export class UploadsService implements BaseUploadsControllerInterface {
  private s3: S3Client;

  constructor(
    private configService: ConfigService,
    // TODO: save upload record to database, then link to other records (e.g. product) to support delete file in the future
    private prismaService: PrismaService,
  ) {
    this.s3 = new S3Client({
      region: this.configService.getOrThrow<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  /**
   * POST /api/v1/uploads/presigned-url
   *
   * @param body - Request body typed as {@link PostPresignedUrlBody}
   * @returns {@link PostPresignedUrl200Response}
   */
  async postPresignedUrl(
    body: PostPresignedUrlBody,
  ): Promise<PostPresignedUrl200Response> {
    const bucket = this.configService.getOrThrow<string>('S3_BUCKET_NAME');

    const cloudfront =
      this.configService.getOrThrow<string>('CLOUDFRONT_DOMAIN');

    const uploads = await Promise.all(
      body.files.map(async (file) => {
        const ext = file.fileName.split('.').pop();

        if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
          throw new BadRequestException(
            `File extension .${ext} is not allowed`,
          );
        }

        if (ALLOWED_MIME_TYPES[ext] !== file.contentType) {
          throw new BadRequestException(
            `Content-Type does not match file extension`,
          );
        }

        const key = `${crypto.randomUUID()}.${ext}`;

        const { url, fields } = await createPresignedPost(this.s3, {
          Bucket: bucket,
          Key: key,
          Expires: 300, // 5 minutes
          Conditions: [
            ['content-length-range', 0, 5 * 1024 * 1024],
            ['eq', '$Content-Type', file.contentType],
          ],
          Fields: {
            'Content-Type': file.contentType,
          },
        });

        return {
          uploadUrl: url,
          fields,
          key,
          fileUrl: `https://${cloudfront}/${key}`,
        };
      }),
    );

    return { uploads };
  }
}
