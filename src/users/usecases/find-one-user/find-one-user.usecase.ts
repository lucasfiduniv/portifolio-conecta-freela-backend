
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../UserRepository/IUserRepository';
import { User } from '../../entities/user.entity';

@Injectable()
export class FindOneUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly usersRepository: IUserRepository,
  ) { }

  async execute(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
