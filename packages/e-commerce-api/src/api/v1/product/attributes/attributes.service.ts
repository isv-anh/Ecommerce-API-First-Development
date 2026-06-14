import { Injectable, NotFoundException } from '@nestjs/common';
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
import type { BaseAttributesControllerInterface } from '@generated-controller/product/attributes/base-attributes.controller.interface';
import { AttributesRepository } from '@/api/v1/product/attributes/attributes.repository';
import { randomUUID } from 'crypto';

@Injectable()
export class AttributesService implements BaseAttributesControllerInterface {
  constructor(private readonly attributesRepository: AttributesRepository) {}
  /**
   * DELETE /api/v1/attributes/:attributeId
   *
   * @param params - Path parameters typed as {@link DeleteAttributeParams}
   * @returns void
   */
  async deleteAttribute(params: DeleteAttributeParams): Promise<void> {
    const attribute = await this.attributesRepository.findById(
      params.attributeId,
    );
    if (!attribute) throw new NotFoundException('Attribute not found');

    await this.attributesRepository.delete(params.attributeId);
  }

  /**
   * GET /api/v1/attributes/:attributeId
   *
   * @param params - Path parameters typed as {@link GetAttributeByIdParams}
   * @returns {@link GetAttributeById200Response}
   */
  async getAttributeById(
    params: GetAttributeByIdParams,
  ): Promise<GetAttributeById200Response> {
    const attribute = await this.attributesRepository.findById(
      params.attributeId,
    );
    if (!attribute) throw new NotFoundException('Attribute not found');

    return {
      attributeId: attribute.id,
      attributeName: attribute.name, // fix: name → attributeName
    };
  }

  /**
   * GET /api/v1/attributes
   *
   * @param query - Query parameters typed as {@link GetattributesQueryParams}
   * @returns {@link Getattributes200Response}
   */
  async getAttributes(
    query: GetAttributesQueryParams,
  ): Promise<GetAttributes200Response> {
    const { attributes, totalCount } =
      await this.attributesRepository.findAll(query);

    return {
      totalCount,
      totalPages: Math.ceil(totalCount / query.pageSize),
      attributes: attributes.map((a) => ({
        attributeId: a.id,
        attributeName: a.name,
      })),
    };
  }

  /**
   * PATCH /api/v1/attributes/:attributeId
   *
   * @param params - Path parameters typed as {@link PatchAttributeParams}
   * @param body - Request body typed as {@link PatchAttributeBody}
   * @returns void
   */
  async patchAttribute(
    params: PatchAttributeParams,
    body: PatchAttributeBody,
  ): Promise<void> {
    const attribute = await this.attributesRepository.findById(
      params.attributeId,
    );
    if (!attribute) throw new NotFoundException('Attribute not found');

    await this.attributesRepository.update(params.attributeId, {
      name: body.attributeName,
    });
  }

  /**
   * POST /api/v1/attributes
   *
   * @param body - Request body typed as {@link PostattributesBody}
   * @returns {@link Postattributes201Response}
   */
  async postAttributes(
    body: PostAttributesBody,
  ): Promise<PostAttributes201Response> {
    const attribute = await this.attributesRepository.create({
      id: randomUUID(),
      name: body.attributeName,
    });

    return {
      attributeId: attribute.id,
    };
  }
}
