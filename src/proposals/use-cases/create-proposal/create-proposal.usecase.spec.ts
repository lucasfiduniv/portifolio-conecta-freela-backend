import { ConflictException } from '@nestjs/common';
import { CreateProposalUseCase } from './create-proposal.usecase';
import { IProposalRepository } from '../../ProposalRepository/IProposalRepository';
import { ProjectsService } from '../../../projects/projects.service';
import { QueueService } from '../../../queue/queue.service';
import { CreateProposalDto } from '../../dto/create-proposal.dto';
import { Proposal } from '../../entities/proposal.entity';
import { ProposalStatus } from '../../enums/proposal-status.enum';
import { Project } from '@/projects/entities/project.entity';
import { User } from '@/users/entities/user.entity';

describe('CreateProposalUseCase', () => {
    let useCase: CreateProposalUseCase;
    let proposalRepo: jest.Mocked<IProposalRepository>;
    let projectsService: jest.Mocked<ProjectsService>;
    let queueService: jest.Mocked<QueueService>;

    const freelancerId = 'freelancer-123';
    const projectId = 'project-123';

    const mockDto: CreateProposalDto = {
        price: 950,
        deliveryTime: 14,
        coverLetter: 'I am interested in your project because...',
        projectId,
    };



    const mockProject: Project = {
        id: 'project-123',
        title: 'Website Development',
        description: 'Build a responsive company website with admin panel.',
        budget: 5000,
        deadline: new Date('2025-12-31'),
        isActive: true,
        clientId: 'client-1',
        client: {
            id: 'client-1',
            name: 'John Doe',
            email: 'client@example.com',
            password: 'hashedpassword',
            isFreelancer: false,
            proposals: [],
            clientProjects: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            givenReviews: [],
            rating: 0,
            receivedReviews: [],
            reviewCount: 0,
            roles: [],
        } as User,
        proposals: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };




    const mockProposal: Proposal = {
        id: 'proposal-1',
        price: mockDto.price,
        deliveryTime: mockDto.deliveryTime,
        coverLetter: mockDto.coverLetter,
        status: ProposalStatus.PENDING,
        freelancerId,
        projectId,
        freelancer: null,
        project: null,
        contract: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(() => {
        proposalRepo = {
            findByProjectAndFreelancer: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
        } as any;

        projectsService = {
            findOne: jest.fn(),
        } as any;

        queueService = {
            addNotification: jest.fn(),
        } as any;

        useCase = new CreateProposalUseCase(proposalRepo, projectsService, queueService);
    });

    it('should create a new proposal successfully', async () => {
        projectsService.findOne.mockResolvedValue(mockProject);
        proposalRepo.findByProjectAndFreelancer.mockResolvedValue(null);
        proposalRepo.create.mockReturnValue(mockProposal);
        proposalRepo.save.mockResolvedValue(mockProposal);

        const result = await useCase.execute(mockDto, freelancerId);

        expect(projectsService.findOne).toHaveBeenCalledWith(mockDto.projectId);
        expect(proposalRepo.findByProjectAndFreelancer).toHaveBeenCalledWith(mockDto.projectId, freelancerId);
        expect(proposalRepo.create).toHaveBeenCalledWith({
            ...mockDto,
            freelancerId,
        });
        expect(proposalRepo.save).toHaveBeenCalledWith(mockProposal);
        expect(queueService.addNotification).toHaveBeenCalledWith({
            to: mockProject.client.email,
            subject: 'New proposal received',
            template: 'new-proposal',
            context: {
                clientName: mockProject.client.name,
                projectTitle: mockProject.title,
                freelancerId,
            },
        });
        expect(result).toEqual(mockProposal);
    });

    it('should throw ConflictException if proposal already exists', async () => {
        projectsService.findOne.mockResolvedValue(mockProject);
        proposalRepo.findByProjectAndFreelancer.mockResolvedValue(mockProposal);

        await expect(useCase.execute(mockDto, freelancerId)).rejects.toThrow(ConflictException);
        expect(proposalRepo.create).not.toHaveBeenCalled();
        expect(proposalRepo.save).not.toHaveBeenCalled();
        expect(queueService.addNotification).not.toHaveBeenCalled();
    });
});
