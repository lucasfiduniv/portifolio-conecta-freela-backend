import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "../entities/user.entity";

export interface IUserRepository {
    createUser(dto: CreateUserDto): Promise<User>
    findOneByEmail(email: string): Promise<User>
    save(user: User): Promise<User>;
    findById(id: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    findOneByEmail(email: string): Promise<User | null>;

}
