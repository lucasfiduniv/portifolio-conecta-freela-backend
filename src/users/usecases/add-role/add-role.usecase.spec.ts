import { Test, TestingModule } from '@nestjs/testing';
import { AddRoleUseCase } from './add-role.usecase';
import { NotFoundException } from '@nestjs/common';
import { IUserRepository } from '@/users/UserRepository/IUserRepository';
import { User } from '@/users/entities/user.entity';
import { Role } from '@/users/enums/role.enum';

describe('AddRoleUseCase', () => {
    let useCase: AddRoleUseCase;
    let userRepo: jest.Mocked<IUserRepository>;

    const mockUser = (overrides: Partial<User> = {}): User => ({
        id: 'user-1',
        name: 'Test User',
        email: 'user@example.com',
        password: 'hashed-password',
        roles: [],
        rating: 0,
        reviewCount: 0,
        clientProjects: [],
        proposals: [],
        givenReviews: [],
        receivedReviews: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides,
    });


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AddRoleUseCase,
                {
                    provide: 'IUserRepository',
                    useValue: {
                        findById: jest.fn(),
                        save: jest.fn(),
                    },
                },
            ],
        }).compile();

        useCase = module.get(AddRoleUseCase);
        userRepo = module.get('IUserRepository');
    });

    it('should add the role to the user if not already present', async () => {
        const user = mockUser({ roles: [Role.CLIENT] });
        const updatedUser = { ...user, roles: [Role.CLIENT, Role.FREELANCER] };

        userRepo.findById.mockResolvedValue(user);
        userRepo.save.mockResolvedValue(updatedUser);

        const result = await useCase.execute('user-1', Role.FREELANCER);

        expect(result.roles).toContain(Role.FREELANCER);
        expect(userRepo.save).toHaveBeenCalledWith(expect.objectContaining({
            id: 'user-1',
            roles: expect.arrayContaining([Role.CLIENT, Role.FREELANCER])
        }));
    });

    it('should not add the role if already present', async () => {
        const user = mockUser({ roles: [Role.CLIENT, Role.FREELANCER] });

        userRepo.findById.mockResolvedValue(user);

        const result = await useCase.execute('user-1', Role.FREELANCER);

        expect(result.roles).toEqual([Role.CLIENT, Role.FREELANCER]);
        expect(userRepo.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if user does not exist', async () => {
        userRepo.findById.mockResolvedValue(null);

        await expect(useCase.execute('invalid-id', Role.CLIENT)).rejects.toThrow(NotFoundException);
        expect(userRepo.save).not.toHaveBeenCalled();
    });
});
