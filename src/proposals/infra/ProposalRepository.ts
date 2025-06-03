// proposals/repositories/ProposalRepository.ts
import { InjectRepository } from '@nestjs/typeorm';
import { Proposal } from '../entities/proposal.entity';
import { Repository, Not, Equal } from 'typeorm';
import { CreateProposalDto } from '../dto/create-proposal.dto';
import { ProposalStatus } from '../enums/proposal-status.enum';
import { IProposalRepository } from '../ProposalRepository/IProposalRepository';

export class ProposalRepository implements IProposalRepository {
    constructor(
        @InjectRepository(Proposal)
        private readonly repo: Repository<Proposal>,
    ) { }

    create(dto: CreateProposalDto & { freelancerId: string }): Proposal {
        return this.repo.create(dto);
    }

    async save(proposal: Proposal): Promise<Proposal> {
        return await this.repo.save(proposal);
    }

    async findById(id: string): Promise<Proposal | null> {
        return await this.repo.findOne({
            where: { id },
            relations: { freelancer: true, project: { client: true }, },
        });
    }

    async findByProjectAndFreelancer(projectId: string, freelancerId: string): Promise<Proposal | null> {
        return await this.repo.findOne({ where: { projectId, freelancerId } });
    }

    async findAllByProject(projectId: string): Promise<Proposal[]> {
        return await this.repo.find({
            where: { projectId },
            relations: ['freelancer'],
        });
    }

    async findAllByProjectAndFreelancer(projectId: string, freelancerId: string): Promise<Proposal[]> {
        return await this.repo.find({
            where: { projectId, freelancerId },
            relations: { freelancer: true },
        });
    }

    async updateStatusByProject(projectId: string, excludeId: string): Promise<void> {
        await this.repo.update(
            {
                projectId,
                id: Not(Equal(excludeId)),
                status: ProposalStatus.PENDING,
            },
            { status: ProposalStatus.REJECTED },
        );
    }
}
