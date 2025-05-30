import { Test, TestingModule } from '@nestjs/testing';
import { CreateReviewUseCase } from './create-review.usecase';
import { ConflictException, ForbiddenException } from '@nestjs/common';
import { IReviewRepository } from '@/reviews/ReviewsRepository/IReviewRepository';
import { ContractsService } from '@/contracts/contracts.service';
import { UsersService } from '@/users/users.service';
import { ContractStatus } from '@/contracts/enums/contract-status.enum';
import { Contract } from '@/contracts/entities/contract.entity';
import { Review } from '@/reviews/entities/review.entity';

describe('CreateReviewUseCase', () => {
    let useCase: CreateReviewUseCase;
    let reviewRepo: jest.Mocked<IReviewRepository>;
    let contractsService: jest.Mocked<ContractsService>;
    let usersService: jest.Mocked<UsersService>;

    const mockContract = (overrides: Partial<Contract> = {}): Contract => ({
        id: 'contract-1',
        clientId: 'client-1',
        freelancerId: 'freelancer-1',
        price: 1000,
        deliveryDate: new Date(),
        status: ContractStatus.COMPLETED,
        createdAt: new Date(),
        updatedAt: new Date(),
        client: {} as any,
        freelancer: {} as any,
        proposal: {} as any,
        proposalId: 'proposal-1',
        ...overrides,
    });

    const mockReview = (overrides: Partial<Review> = {}): Review => ({
        id: 'review-1',
        rating: 5,
        comment: 'Great work',
        contractId: 'contract-1',
        clientId: 'client-1',
        freelancerId: 'freelancer-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        contract: {} as any,
        client: {} as any,
        freelancer: {} as any,
        ...overrides,
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateReviewUseCase,
                {
                    provide: 'IReviewRepository',
                    useValue: {
                        findOneByContract: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                    },
                },
                {
                    provide: ContractsService,
                    useValue: {
                        findOne: jest.fn(),
                    },
                },
                {
                    provide: UsersService,
                    useValue: {
                        updateRating: jest.fn(),
                    },
                },
            ],
        }).compile();

        useCase = module.get(CreateReviewUseCase);
        reviewRepo = module.get('IReviewRepository');
        contractsService = module.get(ContractsService);
        usersService = module.get(UsersService);
    });

    it('should create a review if all conditions are met', async () => {
        const dto = { contractId: 'contract-1', rating: 5 } as any;
        const contract = mockContract();

        contractsService.findOne.mockResolvedValue(contract);
        reviewRepo.findOneByContract.mockResolvedValue(null);
        reviewRepo.create.mockReturnValue(mockReview());
        reviewRepo.save.mockResolvedValue(mockReview());

        const result = await useCase.execute(dto, 'client-1');

        expect(result).toHaveProperty('id', 'review-1');
        expect(usersService.updateRating).toHaveBeenCalledWith('freelancer-1', 5);
    });

    it('should throw if user is not the contract client', async () => {
        const dto = { contractId: 'contract-1', rating: 5 } as any;
        contractsService.findOne.mockResolvedValue(mockContract({ clientId: 'other-client' }));

        await expect(useCase.execute(dto, 'client-1')).rejects.toThrow(ForbiddenException);
    });

    it('should throw if contract is not completed', async () => {
        const dto = { contractId: 'contract-1', rating: 5 } as any;
        contractsService.findOne.mockResolvedValue(mockContract({
            status: ContractStatus.ACTIVE
        }));

        await expect(useCase.execute(dto, 'client-1')).rejects.toThrow(ConflictException);
    });

    it('should throw if a review already exists', async () => {
        const dto = { contractId: 'contract-1', rating: 5 } as any;

        contractsService.findOne.mockResolvedValue(mockContract());
        reviewRepo.findOneByContract.mockResolvedValue(mockReview());

        await expect(useCase.execute(dto, 'client-1')).rejects.toThrow(ConflictException);
    });
});
