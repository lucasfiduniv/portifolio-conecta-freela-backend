import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { IUserRepository } from '../../UserRepository/IUserRepository';

@Injectable()
export class FindUserByEmailUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly usersRepository: IUserRepository,
  ) { }

  async execute(email: string): Promise<User> {
    const user = await this.usersRepository.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }
}