import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../UserRepository/IUserRepository';
import { User } from '../../entities/user.entity';
import { FindOneUserUseCase } from '../find-one-user/find-one-user.usecase';

@Injectable()
export class UpdateRatingUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly usersRepository: IUserRepository,
    private readonly findOneUserUseCase: FindOneUserUseCase,
  ) { }

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
