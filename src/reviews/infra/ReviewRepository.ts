import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { IReviewRepository } from '../ReviewsRepository/IReviewRepository';


@Injectable()
export class ReviewRepository implements IReviewRepository {
    constructor(
        @InjectRepository(Review)
        private readonly repo: Repository<Review>,
    ) { }

    create(data: Partial<Review>): Review {
        return this.repo.create(data);
    }

    save(review: Review): Promise<Review> {
        return this.repo.save(review);
    }

    findOneByContract(contractId: string): Promise<Review | null> {
        return this.repo.findOne({ where: { contractId } });
    }

    findOneById(id: string): Promise<Review | null> {
        return this.repo.findOne({
            where: { id },
            relations: ['client', 'freelancer', 'contract'],
        });
    }

    findAllByFreelancer(freelancerId: string): Promise<Review[]> {
        return this.repo.find({
            where: { freelancerId },
            relations: ['client', 'freelancer'],
            order: { createdAt: 'DESC' },
        });
    }
}
