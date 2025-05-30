import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './entities/review.entity';
import { CreateReviewUseCase } from './usecases/create-review/create-review.usecase';
import { FindAllReviewsByFreelancerUseCase } from './usecases/find-all-reviews-by-freelancer.usecase';
import { FindReviewByIdUseCase } from './usecases/find-review-by-id.usecase';


@Injectable()
export class ReviewsService {
  constructor(
    private readonly createReviewUseCase: CreateReviewUseCase,
    private readonly findAllReviewsUseCase: FindAllReviewsByFreelancerUseCase,
    private readonly findReviewByIdUseCase: FindReviewByIdUseCase,
  ) { }

  async create(createReviewDto: CreateReviewDto, clientId: string): Promise<Review> {
    return this.createReviewUseCase.execute(createReviewDto, clientId);
  }

  async findAll(freelancerId: string): Promise<Review[]> {
    return this.findAllReviewsUseCase.execute(freelancerId);
  }

  async findOne(id: string): Promise<Review> {
    return this.findReviewByIdUseCase.execute(id);
  }
}
