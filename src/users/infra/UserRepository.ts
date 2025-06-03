import { Inject } from "@nestjs/common";
import { User } from "../entities/user.entity";
import { IUserRepository } from "../UserRepository/IUserRepository";
import { Repository } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";

export class UserRepository implements IUserRepository {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) { }
    async findOneByEmail(email: string): Promise<User> {
        return await this.usersRepository.findOne({ where: { email } });
    }
    async findById(id: string): Promise<User | null> {
        return await this.usersRepository.findOne({ where: { id } });
    }
    async createUser(dto: CreateUserDto): Promise<User> {
        const user = this.usersRepository.create(dto);
        return await this.usersRepository.save(user);
    }

    async save(user: User): Promise<User> {
        return await this.usersRepository.save(user);
    }
    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findOne(email: string): Promise<User> {
        return this.usersRepository.findOne({ where: { email } });
    }

}