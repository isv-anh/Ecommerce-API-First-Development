import { Injectable } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import type {
  DeleteAttributeParams,
  GetAttributeByIdParams,
  GetAttributeById200Response,
  GetAttributesQueryParams,
  GetAttributes200Response,
  PatchAttributeParams,
  PatchAttributeBody,
  PostAttributesBody,
  PostAttributes201Response,
} from '@e-commerce/api-validation/types/product';
import { BaseAttributesControllerInterface } from '@generated-controller/product/attributes/base-attributes.controller.interface';

@Injectable()
export class AttributesController implements BaseAttributesControllerInterface {
  constructor(private readonly service: AttributesService) {}

  /**
   * DELETE /api/v1/attributes/:attributeId
   */
  async deleteAttribute(params: DeleteAttributeParams): Promise<void> {
    await this.service.deleteAttribute(params);
  }

  /**
   * GET /api/v1/attributes/:attributeId
   */
  async getAttributeById(
    params: GetAttributeByIdParams,
  ): Promise<GetAttributeById200Response> {
    return await this.service.getAttributeById(params);
  }

  /**
   * GET /api/v1/attributes
   */
  async getAttributes(
    query: GetAttributesQueryParams,
  ): Promise<GetAttributes200Response> {
    return await this.service.getAttributes(query);
  }

  /**
   * PATCH /api/v1/attributes/:attributeId
   */
  async patchAttribute(
    params: PatchAttributeParams,

    body: PatchAttributeBody,
  ): Promise<void> {
    await this.service.patchAttribute(
      params,

      body,
    );
  }

  /**
   * POST /api/v1/attributes
   */
  async postAttributes(
    body: PostAttributesBody,
  ): Promise<PostAttributes201Response> {
    return await this.service.postAttributes(body);
  }
}
