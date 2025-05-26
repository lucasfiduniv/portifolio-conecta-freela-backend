import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { FindAllUsersUseCase } from './usecases/find-all-users.usecase';
import { FindOneUserUseCase } from './usecases/find-one-user.usecase';
import { FindUserByEmailUseCase } from './usecases/find-user-by-email.usecase';
import { AddRoleUseCase } from './usecases/add-role.usecase';
import { UpdateRatingUseCase } from './usecases/update-rating.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    FindAllUsersUseCase,
    FindOneUserUseCase,
    FindUserByEmailUseCase,
    AddRoleUseCase,
    UpdateRatingUseCase,
  ],
  exports: [
    CreateUserUseCase,
    FindAllUsersUseCase,
    FindOneUserUseCase,
    FindUserByEmailUseCase,
    AddRoleUseCase,
    UpdateRatingUseCase,
  ],
})
export class UsersModule {}