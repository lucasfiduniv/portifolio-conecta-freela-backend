import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { FindAllUsersUseCase } from './usecases/find-all-users.usecase';
import { FindOneUserUseCase } from './usecases/find-one-user.usecase';
import { FindUserByEmailUseCase } from './usecases/find-user-by-email.usecase';
import { AddRoleUseCase } from './usecases/add-role.usecase';
import { UpdateRatingUseCase } from './usecases/update-rating.usecase';
import { UsersService } from './users.service';
import { UserRepository } from './infra/UserRepository'; // caminho correto da implementação
import { IUserRepository } from './UserRepository/IUserRepository'; // apenas para tipo, não obrigatório aqui

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    CreateUserUseCase,
    FindAllUsersUseCase,
    FindOneUserUseCase,
    FindUserByEmailUseCase,
    AddRoleUseCase,
    UpdateRatingUseCase,
  ],
  exports: [
    UsersService,
    CreateUserUseCase,
    FindAllUsersUseCase,
    FindOneUserUseCase,
    FindUserByEmailUseCase,
    AddRoleUseCase,
    UpdateRatingUseCase,
  ],
})
export class UsersModule { }
