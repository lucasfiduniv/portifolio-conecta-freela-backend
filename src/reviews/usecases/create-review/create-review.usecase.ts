import {
    Injectable,
    ConflictException,
    ForbiddenException,
    Inject,
} from '@nestjs/common';
import { CreateReviewDto } from '../../dto/create-review.dto';
import { Review } from '../../entities/review.entity';
import { ContractStatus } from '../../../contracts/enums/contract-status.enum';
import { ContractsService } from '../../../contracts/contracts.service';
import { UsersService } from '../../../users/users.service';
import { IReviewRepository } from '../../ReviewsRepository/IReviewRepository';


@Injectable()
export class CreateReviewUseCase {
    constructor(
        @Inject('IReviewRepository')
        private readonly reviewRepository: IReviewRepository,
        private readonly contractsService: ContractsService,
        private readonly usersService: UsersService,
    ) { }

    async execute(createReviewDto: CreateReviewDto, clientId: string): Promise<Review> {
        const { contractId, rating } = createReviewDto;

        const contract = await this.contractsService.findOne(contractId);

        if (contract.clientId !== clientId) {
            throw new ForbiddenException('Only the client can review the contract');
        }

        if (contract.status !== ContractStatus.COMPLETED) {
            throw new ConflictException('Cannot review a contract that is not completed');
        }

        const existingReview = await this.reviewRepository.findOneByContract(contractId);
        if (existingReview) {
            throw new ConflictException('Review already exists for this contract');
        }

        const review = this.reviewRepository.create({
            ...createReviewDto,
            clientId,
            freelancerId: contract.freelancerId,
        });

        const savedReview = await this.reviewRepository.save(review);

        await this.usersService.updateRating(contract.freelancerId, rating);

        return savedReview;
    }
}
