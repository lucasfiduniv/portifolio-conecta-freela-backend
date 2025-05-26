import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalsController } from './proposals.controller';
import { ProposalsService } from './proposals.service';
import { Proposal } from './entities/proposal.entity';
import { ProjectsModule } from '../projects/projects.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Proposal]),
    ProjectsModule,
    QueueModule,
  ],
  controllers: [ProposalsController],
  providers: [ProposalsService],
  exports: [ProposalsService],
})
export class ProposalsModule {}