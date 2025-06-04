// create-proposal.usecase.ts
import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { IProposalRepository } from '../../ProposalRepository/IProposalRepository';
import { CreateProposalDto } from '../../dto/create-proposal.dto';
import { Proposal } from '../../entities/proposal.entity';
import { ProjectsService } from '../../../projects/projects.service';
import { QueueService } from '../../../queue/queue.service';

@Injectable()
export class CreateProposalUseCase {
    constructor(
        @Inject('IProposalRepository')
        private readonly proposalRepo: IProposalRepository,
        private readonly projectsService: ProjectsService,
        private readonly queueService: QueueService,
    ) { }

    async execute(dto: CreateProposalDto, freelancerId: string): Promise<Proposal> {
        const project = await this.projectsService.findOne(dto.projectId);

        const existing = await this.proposalRepo.findByProjectAndFreelancer(dto.projectId, freelancerId);
        if (existing) {
            throw new ConflictException('You have already submitted a proposal for this project');
        }

        const proposal = this.proposalRepo.create({ ...dto, freelancerId });
        const saved = await this.proposalRepo.save(proposal);

        await this.queueService.addNotification({
            to: project.client.email,
            subject: 'New proposal received',
            template: 'new-proposal',
            context: {
                clientName: project.client.name,
                projectTitle: project.title,
                freelancerId,
            },
        });

        return saved;
    }
}
