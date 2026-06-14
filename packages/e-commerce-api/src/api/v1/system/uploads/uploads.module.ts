import { Module } from '@nestjs/common';

import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import {
  BaseUploadsController,
  UPLOADS_CONTROLLER,
} from '@generated-controller/system/uploads/base-uploads.controller';

@Module({
  controllers: [BaseUploadsController],
  providers: [
    UploadsService,
    {
      provide: UPLOADS_CONTROLLER,
      useClass: UploadsController,
    },
  ],
})
export class UploadsModule {}
