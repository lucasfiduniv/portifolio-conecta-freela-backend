import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Role } from '../../enums/role.enum';
import { User } from '../../entities/user.entity';
import { IUserRepository } from '../../UserRepository/IUserRepository';

@Injectable()
export class AddRoleUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly usersRepository: IUserRepository,
  ) { }

  async execute(userId: string, role: Role): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.roles.includes(role)) {
      user.roles = [...user.roles, role];
      return this.usersRepository.save(user);
    }

    return user;
  }
}
