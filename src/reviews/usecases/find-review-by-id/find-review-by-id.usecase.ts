import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Review } from '../../entities/review.entity';
import { IReviewRepository } from '../../ReviewsRepository/IReviewRepository';

@Injectable()
export class FindReviewByIdUseCase {
    constructor(
        @Inject('IReviewRepository')
        private readonly reviewRepository: IReviewRepository,
    ) { }

    async execute(id: string): Promise<Review> {
        const review = await this.reviewRepository.findOneById(id);

        if (!review) {
            throw new NotFoundException(`Review with ID ${id} not found`);
        }

        return review;
    }
}
