import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { ContractsService } from '../contracts/contracts.service';
import { UsersService } from '../users/users.service';
import { ContractStatus } from '../contracts/enums/contract-status.enum';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    private contractsService: ContractsService,
    private usersService: UsersService,
  ) {}

  async create(createReviewDto: CreateReviewDto, clientId: string): Promise<Review> {
    const { contractId, rating } = createReviewDto;
    
    // Get contract
    const contract = await this.contractsService.findOne(contractId);
    
    // Check if user is the client of the contract
    if (contract.clientId !== clientId) {
      throw new ForbiddenException('Only the client can review the contract');
    }
    
    // Check if contract is completed
    if (contract.status !== ContractStatus.COMPLETED) {
      throw new ConflictException('Cannot review a contract that is not completed');
    }
    
    // Check if review already exists
    const existingReview = await this.reviewsRepository.findOne({
      where: { contractId },
    });
    
    if (existingReview) {
      throw new ConflictException('Review already exists for this contract');
    }
    
    // Create review
    const review = this.reviewsRepository.create({
      ...createReviewDto,
      clientId,
      freelancerId: contract.freelancerId,
    });
    
    const savedReview = await this.reviewsRepository.save(review);
    
    // Update freelancer's rating
    await this.usersService.updateRating(contract.freelancerId, rating);
    
    return savedReview;
  }

  async findAll(freelancerId: string): Promise<Review[]> {
    return this.reviewsRepository.find({
      where: { freelancerId },
      relations: ['client', 'freelancer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: ['client', 'freelancer', 'contract'],
    });
    
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    
    return review;
  }
}