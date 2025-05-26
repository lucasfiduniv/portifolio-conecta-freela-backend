import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from './enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;
    
    // Check if user exists
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async addRole(userId: string, role: Role): Promise<User> {
    const user = await this.findOne(userId);
    
    if (!user.roles.includes(role)) {
      user.roles = [...user.roles, role];
      return this.usersRepository.save(user);
    }
    
    return user;
  }

  async updateRating(userId: string, newRating: number): Promise<User> {
    const user = await this.findOne(userId);
    
    // Calculate new average rating
    const totalRating = user.rating * user.reviewCount + newRating;
    const newCount = user.reviewCount + 1;
    const newAverageRating = totalRating / newCount;
    
    // Update user
    user.rating = newAverageRating;
    user.reviewCount = newCount;
    
    return this.usersRepository.save(user);
  }
}