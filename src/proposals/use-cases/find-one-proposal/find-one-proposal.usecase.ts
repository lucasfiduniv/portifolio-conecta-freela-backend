import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Proposal } from '../../entities/proposal.entity';

export class FindOneProposalUseCase {
    constructor(private proposalsRepository: Repository<Proposal>) { }

    async execute(id: string): Promise<Proposal> {
        const proposal = await this.proposalsRepository.findOne({
            where: { id },
            relations: { freelancer: true, project: { client: true }, },
        });

        if (!proposal) {
            throw new NotFoundException(`Proposal with ID ${id} not found`);
        }

        return proposal;
    }
}
