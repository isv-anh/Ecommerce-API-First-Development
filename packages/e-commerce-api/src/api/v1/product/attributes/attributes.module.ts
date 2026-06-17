import { Module } from '@nestjs/common';
import { AttributesController } from './attributes.controller';
import { AttributesService } from './attributes.service';
import {
  ATTRIBUTES_CONTROLLER,
  BaseAttributesController,
} from '@generated-controller/product/attributes/base-attributes.controller';
import { AttributesRepository } from '@/api/v1/product/attributes/attributes.repository';

@Module({
  controllers: [BaseAttributesController],
  providers: [
    AttributesService,
    AttributesRepository,
    {
      provide: ATTRIBUTES_CONTROLLER,
      useClass: AttributesController,
    },
  ],
})
export class AttributesModule {}
