import { PaginationDto } from '@/common/dto/pagination.dto';
import { Project } from '@/projects/entities/project.entity';
import { IProjectRepository } from '@/projects/ProjectRepository/IProjectRepository';
import { Role } from '@/users/enums/role.enum';
import { Injectable } from '@nestjs/common';
@Injectable()
export class FindAllProjectsUseCase {
    constructor(private readonly projectRepo: IProjectRepository) { }

    async execute(
        pagination: PaginationDto,
        userId?: string,
        roles?: Role[],
    ): Promise<{ items: Project[]; meta: any }> {
        return this.projectRepo.findAll(pagination, userId, roles);
    }
}
