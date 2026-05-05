// ─── Imports ──────────────────────────────────────────────────────────────────

import { Test, TestingModule } from '@nestjs/testing';

import type {
  GetReviewsQueryParams,
  PatchReviewBody,
  PostReviewBody,
} from '@e-commerce/api-validation/types/customer';
import { CustomerReviewsService } from '@/api/v1/customer/customer-reviews/customer-reviews.service';
import { CustomerReviewsRepository } from '@/api/v1/customer/customer-reviews/customer-reviews.repository';

jest.mock('@/common/services/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    reviews: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

jest.mock('./customer-reviews.repository');

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const reviewId = '123e4567-e89b-12d3-a456-426614174800';
const userId = '123e4567-e89b-12d3-a456-426614174700';
const productId = '123e4567-e89b-12d3-a456-426614174000';

const mockReview = {
  reviewId,
  userId,
  productId,
  rating: 5,
  comment: 'Sản phẩm rất tốt, mua lần sau chắc chắn!',
};

const mockReviewsResponse = {
  reviews: [mockReview],
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('CustomerReviewsService', () => {
  let service: CustomerReviewsService;
  let repository: jest.Mocked<CustomerReviewsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerReviewsService, CustomerReviewsRepository],
    }).compile();

    service = module.get<CustomerReviewsService>(CustomerReviewsService);
    repository = module.get(CustomerReviewsRepository);

    jest.clearAllMocks();
  });

  // ─── deleteReview ──────────────────────────────────────────────────────

  describe('deleteReview', () => {
    it('should call repository.deleteReview with correct reviewId', async () => {
      repository.deleteReview.mockResolvedValue(undefined);

      await service.deleteReview({ reviewId });

      expect(repository.deleteReview).toHaveBeenCalledTimes(1);
      expect(repository.deleteReview).toHaveBeenCalledWith(reviewId);
    });

    it('should throw if repository throws', async () => {
      repository.deleteReview.mockRejectedValue(new Error('Not found'));

      await expect(service.deleteReview({ reviewId })).rejects.toThrow(
        'Not found',
      );
    });
  });

  // ─── getReviews ───────────────────────────────────────────────────────

  describe('getReviews', () => {
    const query: GetReviewsQueryParams = { productId };

    it('should return reviews from repository', async () => {
      repository.getReviews.mockResolvedValue(mockReviewsResponse);

      const result = await service.getReviews(query);

      expect(repository.getReviews).toHaveBeenCalledTimes(1);
      expect(repository.getReviews).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockReviewsResponse);
    });

    it('should throw if repository throws', async () => {
      repository.getReviews.mockRejectedValue(new Error('DB error'));

      await expect(service.getReviews(query)).rejects.toThrow('DB error');
    });
  });

  // ─── getReviewById ─────────────────────────────────────────────

  describe('getReviewById', () => {
    it('should return review from repository', async () => {
      repository.getReviewById.mockResolvedValue(mockReview);

      const result = await service.getReviewById({ reviewId });

      expect(repository.getReviewById).toHaveBeenCalledTimes(1);
      expect(repository.getReviewById).toHaveBeenCalledWith(reviewId);
      expect(result).toEqual(mockReview);
    });

    it('should throw if repository throws', async () => {
      repository.getReviewById.mockRejectedValue(new Error('Not found'));

      await expect(service.getReviewById({ reviewId })).rejects.toThrow(
        'Not found',
      );
    });
  });

  // ─── patchReview ───────────────────────────────────────────────────────

  describe('patchReview', () => {
    const body: PatchReviewBody = {
      rating: 4,
    };

    it('should call repository.updateReview with correct params', async () => {
      repository.updateReview.mockResolvedValue(undefined);

      await service.patchReview({ reviewId }, body);

      expect(repository.updateReview).toHaveBeenCalledTimes(1);
      expect(repository.updateReview).toHaveBeenCalledWith(reviewId, body);
    });

    it('should throw if repository throws', async () => {
      repository.updateReview.mockRejectedValue(new Error('DB error'));

      await expect(service.patchReview({ reviewId }, body)).rejects.toThrow(
        'DB error',
      );
    });
  });

  // ─── postReview ────────────────────────────────────────────────────────

  describe('postReview', () => {
    const body: PostReviewBody = {
      userId,
      productId,
      rating: 5,
      comment: 'Sản phẩm rất tốt',
    };

    it('should return reviewId after creation', async () => {
      repository.createReview.mockResolvedValue(reviewId);

      const result = await service.postReview(body);

      expect(repository.createReview).toHaveBeenCalledTimes(1);
      expect(repository.createReview).toHaveBeenCalledWith(body);
      expect(result).toEqual({ reviewId });
    });

    it('should throw if repository throws', async () => {
      repository.createReview.mockRejectedValue(new Error('DB error'));

      await expect(service.postReview(body)).rejects.toThrow('DB error');
    });
  });
});
