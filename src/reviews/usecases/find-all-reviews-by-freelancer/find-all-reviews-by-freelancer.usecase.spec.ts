import { Test, TestingModule } from '@nestjs/testing';
import { FindAllReviewsByFreelancerUseCase } from './find-all-reviews-by-freelancer.usecase';
import { IReviewRepository } from '@/reviews/ReviewsRepository/IReviewRepository';
import { Review } from '@/reviews/entities/review.entity';

describe('FindAllReviewsByFreelancerUseCase', () => {
    let useCase: FindAllReviewsByFreelancerUseCase;
    let reviewRepo: jest.Mocked<IReviewRepository>;

    const mockReview = (overrides: Partial<Review> = {}): Review => ({
        id: 'review-1',
        contractId: 'contract-1',
        freelancerId: 'freelancer-1',
        clientId: 'client-1',
        rating: 5,
        comment: 'Great job',
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
                FindAllReviewsByFreelancerUseCase,
                {
                    provide: 'IReviewRepository',
                    useValue: {
                        findAllByFreelancer: jest.fn(),
                    },
                },
            ],
        }).compile();

        useCase = module.get(FindAllReviewsByFreelancerUseCase);
        reviewRepo = module.get('IReviewRepository');
    });

    it('should return a list of reviews for the given freelancer', async () => {
        const freelancerId = 'freelancer-1';
        const reviews = [mockReview(), mockReview({ id: 'review-2' })];

        reviewRepo.findAllByFreelancer.mockResolvedValue(reviews);

        const result = await useCase.execute(freelancerId);

        expect(result).toHaveLength(2);
        expect(reviewRepo.findAllByFreelancer).toHaveBeenCalledWith(freelancerId);
    });

    it('should return an empty array if freelancer has no reviews', async () => {
        const freelancerId = 'freelancer-no-reviews';
        reviewRepo.findAllByFreelancer.mockResolvedValue([]);

        const result = await useCase.execute(freelancerId);

        expect(result).toEqual([]);
        expect(reviewRepo.findAllByFreelancer).toHaveBeenCalledWith(freelancerId);
    });
});
