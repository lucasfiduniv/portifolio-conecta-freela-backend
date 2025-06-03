import { Injectable, ConflictException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../../dto/create-user.dto';
import { IUserRepository } from '../../UserRepository/IUserRepository';
import { User } from '../../entities/user.entity';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly usersRepository: IUserRepository,
  ) { }

  async execute(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    const existingUser = await this.usersRepository.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userWithHashedPassword = {
      ...createUserDto,
      password: hashedPassword,
    };

    return await this.usersRepository.createUser(userWithHashedPassword);
  }
}
