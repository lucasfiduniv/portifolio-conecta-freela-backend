
import { Proposal } from '../entities/proposal.entity';
import { CreateProposalDto } from '../dto/create-proposal.dto';


export interface IProposalRepository {
    create(dto: CreateProposalDto & { freelancerId: string }): Proposal;
    save(proposal: Proposal): Promise<Proposal>;
    findById(id: string): Promise<Proposal | null>;
    findByProjectAndFreelancer(projectId: string, freelancerId: string): Promise<Proposal | null>;
    findAllByProject(projectId: string): Promise<Proposal[]>;
    findAllByProjectAndFreelancer(projectId: string, freelancerId: string): Promise<Proposal[]>;
    updateStatusByProject(projectId: string, excludeId: string): Promise<void>;
}
