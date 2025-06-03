// proposals.service.ts
import { Injectable } from '@nestjs/common';
import { CreateProposalUseCase } from './use-cases/create-proposal.usecase';
import { FindAllProposalsUseCase } from './use-cases/find-all-proposals.usecase';
import { FindOneProposalUseCase } from './use-cases/find-one-proposal.usecase';
import { UpdateProposalStatusUseCase } from './use-cases/update-proposal-status.usecase';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalStatusDto } from './dto/update-proposal-status.dto';
import { Role } from '@/users/enums/role.enum';
import { Proposal } from './entities/proposal.entity';

@Injectable()
export class ProposalsService {
  constructor(
    private readonly createUseCase: CreateProposalUseCase,
    private readonly findAllUseCase: FindAllProposalsUseCase,
    private readonly findOneUseCase: FindOneProposalUseCase,
    private readonly updateStatusUseCase: UpdateProposalStatusUseCase,
  ) { }

  create(dto: CreateProposalDto, freelancerId: string): Promise<Proposal> {
    return this.createUseCase.execute(dto, freelancerId);
  }

  findAll(projectId: string, userId: string, roles: Role[]): Promise<Proposal[]> {
    return this.findAllUseCase.execute(projectId, userId, roles);
  }

  findOne(id: string): Promise<Proposal> {
    return this.findOneUseCase.execute(id);
  }

  updateStatus(id: string, dto: UpdateProposalStatusDto, userId: string, roles: Role[]): Promise<Proposal> {
    return this.updateStatusUseCase.execute(id, dto, userId, roles);
  }
}
