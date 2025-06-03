import { IUserRepository } from '../../UserRepository/IUserRepository';
import { User } from '../../entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { Role } from '../../enums/role.enum';
import { FindUserByEmailUseCase } from './find-user-by-email.usecase';

describe('FindUserByEmailUseCase', () => {
    let useCase: FindUserByEmailUseCase;
    let userRepositoryMock: jest.Mocked<IUserRepository>;

    beforeEach(() => {
        userRepositoryMock = {
            findById: jest.fn(),
            findAll: jest.fn(),
            findOneByEmail: jest.fn(),
            createUser: jest.fn(),
            save: jest.fn(),
        };

        useCase = new FindUserByEmailUseCase(userRepositoryMock);
    });

    it('should return a user when a valid email is provided', async () => {
        const mockUser: User = {
            id: 'user-1',
            name: 'Alice',
            email: 'alice@example.com',
            password: 'hashed_password',
            roles: [Role.CLIENT],
            rating: 4.5,
            reviewCount: 3,
            clientProjects: [],
            proposals: [],
            givenReviews: [],
            receivedReviews: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        userRepositoryMock.findOneByEmail.mockResolvedValue(mockUser);

        const result = await useCase.execute('alice@example.com');

        expect(userRepositoryMock.findOneByEmail).toHaveBeenCalledWith('alice@example.com');
        expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found by email', async () => {
        userRepositoryMock.findOneByEmail.mockResolvedValue(null);

        await expect(useCase.execute('nonexistent@example.com')).rejects.toThrow(NotFoundException);
        expect(userRepositoryMock.findOneByEmail).toHaveBeenCalledWith('nonexistent@example.com');
    });
});
