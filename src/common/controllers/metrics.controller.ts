import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Equal } from 'typeorm'; // ✅ adicione isso
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { Proposal } from '../../proposals/entities/proposal.entity';
import { Contract } from '../../contracts/entities/contract.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Role } from '../../users/enums/role.enum';
import { ContractStatus } from '@/contracts/enums/contract-status.enum';

@ApiTags('metrics')
@Controller('metrics')
export class MetricsController {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(Proposal)
    private proposalsRepository: Repository<Proposal>,
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>,
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
  ) { }

  @Get()
  @ApiOperation({ summary: 'Get platform metrics' })
  @ApiResponse({ status: 200, description: 'Return platform metrics' })
  async getMetrics() {
    const [
      totalUsers,
      clientCount,
      freelancerCount,
      projectCount,
      activeProjectCount,
      proposalCount,
      contractCount,
      completedContractCount,
      reviewCount,
    ] = await Promise.all([
      this.usersRepository.count(),
      this.usersRepository.count({
        where: { roles: In([Role.CLIENT]) },
      }),
      this.usersRepository.count({
        where: { roles: In([Role.FREELANCER]) },
      }),
      this.projectsRepository.count(),
      this.projectsRepository.count({
        where: { isActive: true },
      }),
      this.proposalsRepository.count(),
      this.contractsRepository.count(),
      this.contractsRepository.count({
        where: { status: Equal(ContractStatus.COMPLETED) },
      }),
      this.reviewsRepository.count(),
    ]);

    const averageRating = await this.reviewsRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avg')
      .getRawOne();

    return {
      users: {
        total: totalUsers,
        clients: clientCount,
        freelancers: freelancerCount,
      },
      projects: {
        total: projectCount,
        active: activeProjectCount,
      },
      proposals: {
        total: proposalCount,
        averagePerProject: projectCount > 0 ? proposalCount / projectCount : 0,
      },
      contracts: {
        total: contractCount,
        completed: completedContractCount,
        completionRate: contractCount > 0 ? completedContractCount / contractCount : 0,
      },
      reviews: {
        total: reviewCount,
        averageRating: Number(averageRating?.avg) || 0,
      },
    };
  }
}
