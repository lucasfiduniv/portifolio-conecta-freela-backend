import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../enums/role.enum';
import { FindOneUserUseCase } from './find-one-user.usecase';

@Injectable()
export class AddRoleUseCase {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private findOneUserUseCase: FindOneUserUseCase,
  ) {}

  async execute(userId: string, role: Role): Promise<User> {
    const user = await this.findOneUserUseCase.execute(userId);
    
    if (!user.roles.includes(role)) {
      user.roles = [...user.roles, role];
      return this.usersRepository.save(user);
    }
    
    return user;
  }
}