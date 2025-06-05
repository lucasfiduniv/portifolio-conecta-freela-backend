import { CreateProjectDto } from '@/projects/dto/create-project.dto';
import { Project } from '@/projects/entities/project.entity';
import { IProjectRepository } from '@/projects/ProjectRepository/IProjectRepository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreateProjectUseCase {
    constructor(
        @Inject('IProjectRepository')
        private readonly projectRepository: IProjectRepository,
    ) { }


    execute(dto: CreateProjectDto, clientId: string): Promise<Project> {
        return this.projectRepository.create(dto, clientId);
    }
}
