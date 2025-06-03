import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../UserRepository/IUserRepository';
import { User } from '../../entities/user.entity';

@Injectable()
export class FindAllUsersUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly usersRepository: IUserRepository,
  ) { }

  async execute(): Promise<User[]> {
    return this.usersRepository.findAll();
  }
}
