import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';

import { CreateProjectDto } from '../dto/create-project.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Role } from '../../users/enums/role.enum';
import { IProjectRepository } from '../ProjectRepository/IProjectRepository';

@Injectable()
export class ProjectRepository implements IProjectRepository {
    constructor(
        @InjectRepository(Project)
        private readonly repository: Repository<Project>,
    ) { }

    async create(dto: CreateProjectDto, clientId: string): Promise<Project> {
        const project = this.repository.create({ ...dto, clientId });
        return this.repository.save(project);
    }

    async findAll(pagination: PaginationDto, userId?: string, roles?: Role[]) {
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;

        let query = this.repository.createQueryBuilder('project')
            .leftJoinAndSelect('project.client', 'client')
            .skip(skip)
            .take(limit)
            .orderBy('project.createdAt', 'DESC');

        if (roles?.includes(Role.CLIENT) && !roles.includes(Role.ADMIN)) {
            query = query.where('project.clientId = :userId', { userId });
        }

        const [items, total] = await query.getManyAndCount();

        return {
            items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string): Promise<Project | null> {
        return this.repository.findOne({
            where: { id },
            relations: ['client', 'proposals', 'proposals.freelancer'],
        });
    }

    async remove(project: Project): Promise<void> {
        await this.repository.remove(project);
    }
}
