import { IProjectRepository } from '@/projects/ProjectRepository/IProjectRepository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
@Injectable()
export class FindOneProjectUseCase {
    constructor(
        @Inject('IProjectRepository')
        private readonly projectRepository: IProjectRepository,
    ) { }

    async execute(id: string) {
        const project = await this.projectRepository.findOne(id);
        if (!project) {
            throw new NotFoundException(`Project with ID ${id} not found`);
        }
        return project;
    }
}
