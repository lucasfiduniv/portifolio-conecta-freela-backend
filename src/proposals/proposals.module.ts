import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Proposal } from './entities/proposal.entity';
import { ProposalsService } from './proposals.service';
import { ProjectsModule } from '../projects/projects.module';
import { QueueModule } from '../queue/queue.module';

import { ProposalRepository } from './infra/ProposalRepository';

import { CreateProposalUseCase } from './use-cases/create-proposal/create-proposal.usecase';
import { FindAllProposalsUseCase } from './use-cases/find-all-proposals/find-all-proposals.usecase';
import { FindOneProposalUseCase } from './use-cases/find-one-proposal/find-one-proposal.usecase';
import { UpdateProposalStatusUseCase } from './use-cases/update-proposal-status/update-proposal-status.usecase';


@Module({
  imports: [
    TypeOrmModule.forFeature([Proposal]),
    ProjectsModule,
    QueueModule,
  ],
  providers: [
    ProposalsService,


    CreateProposalUseCase,
    FindAllProposalsUseCase,
    FindOneProposalUseCase,
    UpdateProposalStatusUseCase,

    {
      provide: 'IProposalRepository',
      useClass: ProposalRepository,
    },
  ],
  exports: [ProposalsService],
})
export class ProposalsModule { }
