import { Review } from '../entities/review.entity';
import { CreateReviewDto } from '../dto/create-review.dto';

export interface IReviewRepository {
    create(data: Partial<Review>): Review;
    save(review: Review): Promise<Review>;
    findOneByContract(contractId: string): Promise<Review | null>;
    findOneById(id: string): Promise<Review | null>;
    findAllByFreelancer(freelancerId: string): Promise<Review[]>;
}
