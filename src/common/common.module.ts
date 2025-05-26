import { Module, Global } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesGuard } from './guards/roles.guard';
import { MetricsController } from './controllers/metrics.controller';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';
import { Proposal } from '../proposals/entities/proposal.entity';
import { Contract } from '../contracts/entities/contract.entity';
import { Review } from '../reviews/entities/review.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Project,
      Proposal,
      Contract,
      Review,
    ]),
  ],
  controllers: [MetricsController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [],
})
export class CommonModule {}