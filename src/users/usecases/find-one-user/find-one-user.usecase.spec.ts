import { FindOneUserUseCase } from './find-one-user.usecase';
import { IUserRepository } from '../../UserRepository/IUserRepository';
import { User } from '../../entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { Role } from '../../enums/role.enum';

describe('FindOneUserUseCase', () => {
    let useCase: FindOneUserUseCase;
    let userRepositoryMock: jest.Mocked<IUserRepository>;

    beforeEach(() => {
        userRepositoryMock = {
            findById: jest.fn(),
            findAll: jest.fn(),
            findOneByEmail: jest.fn(),
            createUser: jest.fn(),
            save: jest.fn(),
        };

        useCase = new FindOneUserUseCase(userRepositoryMock);
    });

    it('should return a user when a valid ID is provided', async () => {
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

        userRepositoryMock.findById.mockResolvedValue(mockUser);

        const result = await useCase.execute('user-1');

        expect(userRepositoryMock.findById).toHaveBeenCalledWith('user-1');
        expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
        userRepositoryMock.findById.mockResolvedValue(null);

        await expect(useCase.execute('non-existent-id')).rejects.toThrow(NotFoundException);
        expect(userRepositoryMock.findById).toHaveBeenCalledWith('non-existent-id');
    });
});
