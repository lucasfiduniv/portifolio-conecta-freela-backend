import { ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FindAllProposalsUseCase } from './find-all-proposals.usecase';
import { Proposal } from '@/proposals/entities/proposal.entity';
import { ProjectsService } from '@/projects/projects.service';
import { Role } from '@/users/enums/role.enum';
import { Project } from '@/projects/entities/project.entity';
import { User } from '@/users/entities/user.entity';
import { ProposalStatus } from '@/proposals/enums/proposal-status.enum';


describe('FindAllProposalsUseCase', () => {
    let useCase: FindAllProposalsUseCase;
    let proposalsRepository: jest.Mocked<Repository<Proposal>>;
    let projectsService: jest.Mocked<ProjectsService>;

    const mockClient: User = {
        id: 'client-1',
        name: 'Client Name',
        email: 'client@example.com',
        password: 'hashed-password',
        proposals: [],
        clientProjects: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        givenReviews: [],
        rating: 0,
        receivedReviews: [],
        reviewCount: 0,
        roles: [],
    };

    const mockProject: Project = {
        id: 'project-1',
        title: 'Test Project',
        description: 'This is a mock project used for unit testing.',
        budget: 5000.00,
        deadline: new Date(),
        isActive: true,
        clientId: 'client-1',
        client: mockClient,
        proposals: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };


    const mockUser: User = {
        id: 'freelancer-1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
        clientProjects: [],
        givenReviews: [],
        rating: 0,
        receivedReviews: [],
        reviewCount: 0,
        roles: [Role.FREELANCER],
        proposals: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockProposals: Proposal[] = [
        {
            id: 'proposal-1',
            projectId: 'project-1',
            freelancerId: 'freelancer-1',
            price: 1000,
            deliveryTime: 10,
            coverLetter: 'I will do a great job',
            status: ProposalStatus.PENDING,
            freelancer: mockUser,
            project: mockProject,
            contract: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];


    beforeEach(() => {
        proposalsRepository = {
            createQueryBuilder: jest.fn(),
        } as any;

        projectsService = {
            findOne: jest.fn(),
        } as any;

        useCase = new FindAllProposalsUseCase(proposalsRepository, projectsService);
    });

    it('should allow client to view all proposals', async () => {
        projectsService.findOne.mockResolvedValue(mockProject);

        const queryMock = {
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue(mockProposals),
        };

        (proposalsRepository.createQueryBuilder as jest.Mock).mockReturnValue(queryMock);

        const result = await useCase.execute('project-1', 'client-1', [Role.CLIENT]);

        expect(projectsService.findOne).toHaveBeenCalledWith('project-1');
        expect(result).toEqual(mockProposals);
    });

    it('should allow admin to view all proposals', async () => {
        projectsService.findOne.mockResolvedValue(mockProject);

        const queryMock = {
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue(mockProposals),
        };

        (proposalsRepository.createQueryBuilder as jest.Mock).mockReturnValue(queryMock);

        const result = await useCase.execute('project-1', 'some-admin-id', [Role.ADMIN]);

        expect(result).toEqual(mockProposals);
    });

    it('should allow freelancer to view only their proposals', async () => {
        projectsService.findOne.mockResolvedValue(mockProject);

        const queryMock = {
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue(mockProposals),
        };

        (proposalsRepository.createQueryBuilder as jest.Mock).mockReturnValue(queryMock);

        const result = await useCase.execute('project-1', 'freelancer-1', [Role.FREELANCER]);

        expect(queryMock.andWhere).toHaveBeenCalledWith('proposal.freelancerId = :userId', { userId: 'freelancer-1' });
        expect(result).toEqual(mockProposals);
    });

    it('should throw ForbiddenException if user is unauthorized', async () => {
        projectsService.findOne.mockResolvedValue(mockProject);

        await expect(
            useCase.execute('project-1', 'unauthorized-user', [Role.CLIENT])
        ).rejects.toThrow(ForbiddenException);
    });
});
