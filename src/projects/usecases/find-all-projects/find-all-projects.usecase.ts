import { PaginationDto } from '@/common/dto/pagination.dto';
import { Project } from '@/projects/entities/project.entity';
import { IProjectRepository } from '@/projects/ProjectRepository/IProjectRepository';
import { Role } from '@/users/enums/role.enum';
import { Inject, Injectable } from '@nestjs/common';
@Injectable()
export class FindAllProjectsUseCase {
    constructor(
        @Inject('IProjectRepository')
        private readonly projectRepository: IProjectRepository,
    ) { }
    async execute(
        pagination: PaginationDto,
        userId?: string,
        roles?: Role[],
    ): Promise<{ items: Project[]; meta: any }> {
        return this.projectRepository.findAll(pagination, userId, roles);
    }
}
