import { FindOneProposalUseCase } from './find-one-proposal.usecase';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Proposal } from '../../entities/proposal.entity';
import { User } from '../../../users/entities/user.entity';
import { Project } from '../../../projects/entities/project.entity';
import { ProposalStatus } from '@/proposals/enums/proposal-status.enum';

describe('FindOneProposalUseCase', () => {
    let useCase: FindOneProposalUseCase;
    let proposalRepository: jest.Mocked<Repository<Proposal>>;

    beforeEach(() => {
        proposalRepository = {
            findOne: jest.fn(),
        } as any;

        useCase = new FindOneProposalUseCase(proposalRepository);
    });

    it('deve retornar a proposta com relações corretamente', async () => {
        const client = { id: 'client-id', name: 'Cliente Exemplo' } as any as User;
        const project = { id: 'project-id', client } as Project;
        const freelancer = { id: 'freelancer-id', name: 'João Dev' } as User;

        const fakeProposal: Proposal = {
            id: 'proposal-id',
            price: 5000,
            deliveryTime: 10,
            coverLetter: 'Carta exemplo',
            status: ProposalStatus.PENDING,
            freelancer,
            freelancerId: freelancer.id,
            project,
            projectId: project.id,
            contract: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        proposalRepository.findOne.mockResolvedValue(fakeProposal);

        const result = await useCase.execute('proposal-id');

        expect(proposalRepository.findOne).toHaveBeenCalledWith({
            where: { id: 'proposal-id' },
            relations: {
                freelancer: true,
                project: { client: true },
            },
        });
        expect(result).toEqual(fakeProposal);
    });

    it('deve lançar NotFoundException quando a proposta não for encontrada', async () => {
        proposalRepository.findOne.mockResolvedValue(undefined);

        await expect(useCase.execute('nonexistent-id')).rejects.toThrow(NotFoundException);
        expect(proposalRepository.findOne).toHaveBeenCalledWith({
            where: { id: 'nonexistent-id' },
            relations: {
                freelancer: true,
                project: { client: true },
            },
        });
    });
});
