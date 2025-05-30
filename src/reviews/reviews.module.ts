import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { ContractsModule } from '../contracts/contracts.module';
import { UsersModule } from '../users/users.module';
import { ReviewRepository } from './infra/ReviewRepository';
import { CreateReviewUseCase } from './usecases/create-review/create-review.usecase';
import { FindAllReviewsByFreelancerUseCase } from './usecases/find-all-reviews-by-freelancer.usecase';
import { FindReviewByIdUseCase } from './usecases/find-review-by-id.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    ContractsModule,
    UsersModule,
  ],
  controllers: [ReviewsController],
  providers: [
    ReviewsService,
    {
      provide: 'IReviewRepository',
      useClass: ReviewRepository,
    },
    CreateReviewUseCase,
    FindAllReviewsByFreelancerUseCase,
    FindReviewByIdUseCase,
  ],
  exports: [ReviewsService],
})
export class ReviewsModule { }
