import { ForbiddenException } from '@nestjs/common';
import { Repository, Not, Equal } from 'typeorm';
import { Proposal } from '../entities/proposal.entity';
import { UpdateProposalStatusDto } from '../dto/update-proposal-status.dto';
import { QueueService } from '../../queue/queue.service';
import { ProposalStatus } from '../enums/proposal-status.enum';
import { Role } from '../../users/enums/role.enum';
import { FindOneProposalUseCase } from './find-one-proposal.usecase';

export class UpdateProposalStatusUseCase {
    constructor(
        private proposalsRepository: Repository<Proposal>,
        private findOneUseCase: FindOneProposalUseCase,
        private queueService: QueueService,
    ) { }

    async execute(id: string, dto: UpdateProposalStatusDto, userId: string, roles: Role[]): Promise<Proposal> {
        const proposal = await this.findOneUseCase.execute(id);

        if (proposal.project.clientId !== userId && !roles.includes(Role.ADMIN)) {
            throw new ForbiddenException('You do not have permission to update this proposal');
        }

        proposal.status = dto.status;

        if (dto.status === ProposalStatus.ACCEPTED) {
            await this.proposalsRepository.update(
                { projectId: proposal.projectId, id: Not(Equal(id)), status: ProposalStatus.PENDING },
                { status: ProposalStatus.REJECTED },
            );

            await this.queueService.addNotification({
                to: proposal.freelancer.email,
                subject: 'Your proposal was accepted',
                template: 'proposal-accepted',
                context: {
                    freelancerName: proposal.freelancer.name,
                    projectTitle: proposal.project.title,
                },
            });
        }

        return this.proposalsRepository.save(proposal);
    }
}
