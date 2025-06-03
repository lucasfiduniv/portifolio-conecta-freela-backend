import { FindAllUsersUseCase } from './find-all-users.usecase';
import { IUserRepository } from '../../UserRepository/IUserRepository';
import { User } from '../../entities/user.entity';
import { Role } from '../../enums/role.enum';

describe('FindAllUsersUseCase', () => {
    let useCase: FindAllUsersUseCase;
    let userRepositoryMock: jest.Mocked<IUserRepository>;

    beforeEach(() => {
        userRepositoryMock = {
            findAll: jest.fn(),
            createUser: jest.fn(),
            findById: jest.fn(),
            findOneByEmail: jest.fn(),
            save: jest.fn(),
        };

        useCase = new FindAllUsersUseCase(userRepositoryMock);
    });

    it('should return a list of users', async () => {
        const mockUsers: User[] = [
            {
                id: '1',
                name: 'John Doe',
                email: 'john@example.com',
                password: 'hashed_password',
                roles: [Role.CLIENT],
                rating: 4.5,
                reviewCount: 2,
                clientProjects: [],
                proposals: [],
                givenReviews: [],
                receivedReviews: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: '2',
                name: 'Jane Doe',
                email: 'jane@example.com',
                password: 'hashed_password',
                roles: [Role.FREELANCER],
                rating: 4.8,
                reviewCount: 3,
                clientProjects: [],
                proposals: [],
                givenReviews: [],
                receivedReviews: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        userRepositoryMock.findAll.mockResolvedValue(mockUsers);

        const result = await useCase.execute();

        expect(userRepositoryMock.findAll).toHaveBeenCalled();
        expect(result).toEqual(mockUsers);
    });

    it('should return an empty array when no users are found', async () => {
        userRepositoryMock.findAll.mockResolvedValue([]);

        const result = await useCase.execute();

        expect(userRepositoryMock.findAll).toHaveBeenCalled();
        expect(result).toEqual([]);
    });
});
