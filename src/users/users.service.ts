import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from './enums/role.enum';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { FindAllUsersUseCase } from './usecases/find-all-users.usecase';
import { FindOneUserUseCase } from './usecases/find-one-user.usecase';
import { FindUserByEmailUseCase } from './usecases/find-user-by-email.usecase';
import { AddRoleUseCase } from './usecases/add-role/add-role.usecase';
import { UpdateRatingUseCase } from './usecases/update-rating.usecase';

@Injectable()
export class UsersService {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly findOneUserUseCase: FindOneUserUseCase,
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    private readonly addRoleUseCase: AddRoleUseCase,
    private readonly updateRatingUseCase: UpdateRatingUseCase,
  ) { }

  create(dto: CreateUserDto): Promise<User> {
    return this.createUserUseCase.execute(dto);
  }

  findAll(): Promise<User[]> {
    return this.findAllUsersUseCase.execute();
  }

  findOne(id: string): Promise<User> {
    return this.findOneUserUseCase.execute(id);
  }

  findByEmail(email: string): Promise<User> {
    return this.findUserByEmailUseCase.execute(email);
  }

  addRole(userId: string, role: Role): Promise<User> {
    return this.addRoleUseCase.execute(userId, role);
  }

  updateRating(userId: string, rating: number): Promise<User> {
    return this.updateRatingUseCase.execute(userId, rating);
  }
}
