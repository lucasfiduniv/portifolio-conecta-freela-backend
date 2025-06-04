import { ForbiddenException } from '@nestjs/common';
import { UpdateProposalStatusUseCase } from './update-proposal-status.usecase';
import { Repository } from 'typeorm';
import { Proposal } from '../../entities/proposal.entity';
import { UpdateProposalStatusDto } from '../../dto/update-proposal-status.dto';
import { QueueService } from '../../../queue/queue.service';
import { ProposalStatus } from '../../enums/proposal-status.enum';
import { Role } from '../../../users/enums/role.enum';
import { FindOneProposalUseCase } from '../find-one-proposal/find-one-proposal.usecase';

describe('UpdateProposalStatusUseCase', () => {
    let useCase: UpdateProposalStatusUseCase;
    let proposalsRepository: jest.Mocked<Repository<Proposal>>;
    let findOneUseCase: jest.Mocked<FindOneProposalUseCase>;
    let queueService: jest.Mocked<QueueService>;

    const mockProposal: Proposal = {
        id: 'proposal-id',
        price: 1000,
        deliveryTime: 10,
        coverLetter: 'Carta',
        status: ProposalStatus.PENDING,
        freelancer: {
            id: 'freelancer-id',
            name: 'Freelancer',
            email: 'freelancer@example.com',
        } as any,
        freelancerId: 'freelancer-id',
        project: {
            id: 'project-id',
            title: 'Projeto 1',
            clientId: 'client-id',
        } as any,
        projectId: 'project-id',
        contract: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(() => {
        proposalsRepository = {
            update: jest.fn(),
            save: jest.fn().mockResolvedValue({ ...mockProposal, status: ProposalStatus.ACCEPTED }),
        } as any;

        findOneUseCase = {
            execute: jest.fn().mockResolvedValue(mockProposal),
        } as any;

        queueService = {
            addNotification: jest.fn(),
        } as any;

        useCase = new UpdateProposalStatusUseCase(proposalsRepository, findOneUseCase, queueService);
    });

    it('deve atualizar o status da proposta se for o cliente', async () => {
        const dto: UpdateProposalStatusDto = { status: ProposalStatus.REJECTED };

        const result = await useCase.execute('proposal-id', dto, 'client-id', [Role.CLIENT]);

        expect(findOneUseCase.execute).toHaveBeenCalledWith('proposal-id');
        expect(proposalsRepository.save).toHaveBeenCalledWith({ ...mockProposal, status: ProposalStatus.REJECTED });
        expect(result.status).toBe(ProposalStatus.ACCEPTED || ProposalStatus.REJECTED);
    });

    it('deve rejeitar outras propostas e notificar se aceitar a proposta', async () => {
        const dto: UpdateProposalStatusDto = { status: ProposalStatus.ACCEPTED };

        await useCase.execute('proposal-id', dto, 'client-id', [Role.CLIENT]);

        expect(proposalsRepository.update).toHaveBeenCalledWith(
            {
                projectId: mockProposal.projectId,
                id: expect.anything(),
                status: ProposalStatus.PENDING,
            },
            { status: ProposalStatus.REJECTED },
        );

        expect(queueService.addNotification).toHaveBeenCalledWith({
            to: mockProposal.freelancer.email,
            subject: 'Your proposal was accepted',
            template: 'proposal-accepted',
            context: {
                freelancerName: mockProposal.freelancer.name,
                projectTitle: mockProposal.project.title,
            },
        });

        expect(proposalsRepository.save).toHaveBeenCalled();
    });

    it('deve lançar ForbiddenException se não for o cliente nem admin', async () => {
        const dto: UpdateProposalStatusDto = { status: ProposalStatus.ACCEPTED };

        await expect(
            useCase.execute('proposal-id', dto, 'unauthorized-user', [Role.CLIENT]),
        ).rejects.toThrow(ForbiddenException);

        expect(proposalsRepository.save).not.toHaveBeenCalled();
    });

    it('deve permitir atualização se for ADMIN', async () => {
        const dto: UpdateProposalStatusDto = { status: ProposalStatus.REJECTED };

        const result = await useCase.execute('proposal-id', dto, 'outro-user', [Role.ADMIN]);

        expect(result.status).toBe(ProposalStatus.ACCEPTED || ProposalStatus.REJECTED);
        expect(proposalsRepository.save).toHaveBeenCalled();
    });
});
