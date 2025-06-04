import { CreateProjectDto } from '@/projects/dto/create-project.dto';
import { Project } from '@/projects/entities/project.entity';
import { IProjectRepository } from '@/projects/ProjectRepository/IProjectRepository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateProjectUseCase {
    constructor(private readonly projectRepo: IProjectRepository) { }

    execute(dto: CreateProjectDto, clientId: string): Promise<Project> {
        return this.projectRepo.create(dto, clientId);
    }
}
