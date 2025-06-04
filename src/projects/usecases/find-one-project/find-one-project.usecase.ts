import { IProjectRepository } from '@/projects/ProjectRepository/IProjectRepository';
import { Injectable, NotFoundException } from '@nestjs/common';
@Injectable()
export class FindOneProjectUseCase {
    constructor(private readonly projectRepo: IProjectRepository) { }

    async execute(id: string) {
        const project = await this.projectRepo.findOne(id);
        if (!project) {
            throw new NotFoundException(`Project with ID ${id} not found`);
        }
        return project;
    }
}
