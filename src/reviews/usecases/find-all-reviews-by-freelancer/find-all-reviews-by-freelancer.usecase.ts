import { Injectable, Inject } from '@nestjs/common';

import { Review } from '../../entities/review.entity';
import { IReviewRepository } from '../../ReviewsRepository/IReviewRepository';

@Injectable()
export class FindAllReviewsByFreelancerUseCase {
    constructor(
        @Inject('IReviewRepository')
        private readonly reviewRepository: IReviewRepository,
    ) { }

    async execute(freelancerId: string): Promise<Review[]> {
        return this.reviewRepository.findAllByFreelancer(freelancerId);
    }
}
