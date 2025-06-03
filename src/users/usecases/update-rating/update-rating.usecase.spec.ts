import { IUserRepository } from '@/users/UserRepository/IUserRepository';
import { UpdateRatingUseCase } from './update-rating.usecase';
import { FindOneUserUseCase } from '../find-one-user/find-one-user.usecase';
import { User } from '@/users/entities/user.entity';
import { Role } from '@/users/enums/role.enum';

describe('UpdateRatingUseCase', () => {
    let useCase: UpdateRatingUseCase;
    let userRepositoryMock: jest.Mocked<IUserRepository>;
    let findOneUserUseCaseMock: jest.Mocked<FindOneUserUseCase>;

    beforeEach(() => {
        userRepositoryMock = {
            findById: jest.fn(),
            findAll: jest.fn(),
            findOneByEmail: jest.fn(),
            createUser: jest.fn(),
            save: jest.fn(),
        };

        findOneUserUseCaseMock = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<FindOneUserUseCase>;

        useCase = new UpdateRatingUseCase(userRepositoryMock, findOneUserUseCaseMock);
    });

    it('should correctly update user rating and review count', async () => {
        const mockUser: User = {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashed',
            roles: [Role.CLIENT],
            rating: 4.0,
            reviewCount: 2,
            clientProjects: [],
            proposals: [],
            givenReviews: [],
            receivedReviews: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const newRating = 5;

        findOneUserUseCaseMock.execute.mockResolvedValue(mockUser);
        userRepositoryMock.save.mockImplementation(async (user) => user);

        const result = await useCase.execute(mockUser.id, newRating);

        const expectedAverage = (4.0 * 2 + 5) / 3;

        expect(findOneUserUseCaseMock.execute).toHaveBeenCalledWith(mockUser.id);
        expect(result.rating).toBeCloseTo(expectedAverage);
        expect(result.reviewCount).toBe(3);
        expect(userRepositoryMock.save).toHaveBeenCalledWith(result);
    });
});
