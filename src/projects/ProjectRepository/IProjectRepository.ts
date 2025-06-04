import { Project } from '../entities/project.entity';
import { CreateProjectDto } from '../dto/create-project.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

export interface IProjectRepository {
    create(data: CreateProjectDto, clientId: string): Promise<Project>;
    findAll(pagination: PaginationDto, userId?: string, roles?: string[]): Promise<{ items: Project[]; meta: any }>;
    findOne(id: string): Promise<Project | null>;
    remove(project: Project): Promise<void>;
}
