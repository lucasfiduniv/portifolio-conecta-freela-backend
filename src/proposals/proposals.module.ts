// proposals.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proposal } from './entities/proposal.entity';
import { ProjectsModule } from '../projects/projects.module';
import { QueueModule } from '../queue/queue.module';
import { ProposalsService } from './proposals.service';



import { CreateProposalUseCase } from './use-cases/create-proposal.usecase';
import { ProposalRepository } from './infra/ProposalRepository';

@Module({
  imports: [TypeOrmModule.forFeature([Proposal]), ProjectsModule, QueueModule],
  providers: [
    ProposalsService,
    CreateProposalUseCase,
    {
      provide: 'IProposalRepository',
      useClass: ProposalRepository,
    },
  ],
  exports: [ProposalsService],
})
export class ProposalsModule { }
