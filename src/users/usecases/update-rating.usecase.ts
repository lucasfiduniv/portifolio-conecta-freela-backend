import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { FindOneUserUseCase } from './find-one-user.usecase';

@Injectable()
export class UpdateRatingUseCase {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private findOneUserUseCase: FindOneUserUseCase,
  ) {}

  async execute(userId: string, newRating: number): Promise<User> {
    const user = await this.findOneUserUseCase.execute(userId);
    
    const totalRating = user.rating * user.reviewCount + newRating;
    const newCount = user.reviewCount + 1;
    const newAverageRating = totalRating / newCount;
    
    user.rating = newAverageRating;
    user.reviewCount = newCount;
    
    return this.usersRepository.save(user);
  }
}