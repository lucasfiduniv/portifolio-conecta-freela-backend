import { Test, TestingModule } from '@nestjs/testing';
import { FindReviewByIdUseCase } from './find-review-by-id.usecase';
import { IReviewRepository } from '@/reviews/ReviewsRepository/IReviewRepository';
import { Review } from '@/reviews/entities/review.entity';
import { NotFoundException } from '@nestjs/common';

describe('FindReviewByIdUseCase', () => {
    let useCase: FindReviewByIdUseCase;
    let reviewRepo: jest.Mocked<IReviewRepository>;

    const mockReview = (overrides: Partial<Review> = {}): Review => ({
        id: 'review-1',
        contractId: 'contract-1',
        freelancerId: 'freelancer-1',
        clientId: 'client-1',
        rating: 5,
        comment: 'Excellent work!',
        createdAt: new Date(),
        updatedAt: new Date(),
        client: {} as any,
        freelancer: {} as any,
        contract: {} as any,
        ...overrides,
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FindReviewByIdUseCase,
                {
                    provide: 'IReviewRepository',
                    useValue: {
                        findOneById: jest.fn(),
                    },
                },
            ],
        }).compile();

        useCase = module.get(FindReviewByIdUseCase);
        reviewRepo = module.get('IReviewRepository');
    });

    it('should return a review when found', async () => {
        const review = mockReview();
        reviewRepo.findOneById.mockResolvedValue(review);

        const result = await useCase.execute('review-1');

        expect(result).toEqual(review);
        expect(reviewRepo.findOneById).toHaveBeenCalledWith('review-1');
    });

    it('should throw NotFoundException when review is not found', async () => {
        reviewRepo.findOneById.mockResolvedValue(null);

        await expect(useCase.execute('nonexistent-id')).rejects.toThrow(
            NotFoundException,
        );

        expect(reviewRepo.findOneById).toHaveBeenCalledWith('nonexistent-id');
    });
});
