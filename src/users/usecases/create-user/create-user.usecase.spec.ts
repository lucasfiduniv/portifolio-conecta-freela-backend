import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../../dto/create-user.dto';
import { IUserRepository } from '../../UserRepository/IUserRepository';
import { User } from '../../entities/user.entity';
import { CreateUserUseCase } from './create-user.usecase';

describe('CreateUserUseCase', () => {
    let createUserUseCase: CreateUserUseCase;
    let usersRepository: jest.Mocked<IUserRepository>;

    beforeEach(() => {
        usersRepository = {
            findOneByEmail: jest.fn(),
            createUser: jest.fn(),
        } as unknown as jest.Mocked<IUserRepository>;

        createUserUseCase = new CreateUserUseCase(usersRepository);
    });

    it('should create a user successfully when email does not exist', async () => {
        const createUserDto: CreateUserDto = {
            email: 'test@example.com',
            password: '123456',
            name: 'Test User',
        };

        const mockCreatedUser: User = {
            id: '1',
            email: createUserDto.email,
            name: createUserDto.name,
            password: 'hashed_password',
            roles: [],
            rating: 0,
            reviewCount: 0,
            clientProjects: [],
            givenReviews: [],
            proposals: [],
            receivedReviews: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        usersRepository.findOneByEmail.mockResolvedValue(null);
        usersRepository.createUser.mockResolvedValue(mockCreatedUser);
        const hashSpy = jest.spyOn(bcrypt, 'hash') as jest.Mock;
        hashSpy.mockResolvedValue('hashed_password');




        const result = await createUserUseCase.execute(createUserDto);

        expect(usersRepository.findOneByEmail).toHaveBeenCalledWith(createUserDto.email);
        expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
        expect(usersRepository.createUser).toHaveBeenCalledWith({
            ...createUserDto,
            password: 'hashed_password',
        });
        expect(result).toEqual(mockCreatedUser);
    });

    it('should throw ConflictException if email already exists', async () => {
        const createUserDto: CreateUserDto = {
            email: 'test@example.com',
            password: '123456',
            name: 'Test User',
        };

        usersRepository.findOneByEmail.mockResolvedValue({} as User);

        await expect(createUserUseCase.execute(createUserDto)).rejects.toThrow(ConflictException);
        expect(usersRepository.findOneByEmail).toHaveBeenCalledWith(createUserDto.email);
        expect(usersRepository.createUser).not.toHaveBeenCalled();
    });
});
