import { IProjectRepository } from '@/projects/ProjectRepository/IProjectRepository';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { FindOneProjectUseCase } from '../find-one-project/find-one-project.usecase';
import { Role } from '@/users/enums/role.enum';


@Injectable()
export class RemoveProjectUseCase {
    constructor(
        private readonly projectRepo: IProjectRepository,
        private readonly findOne: FindOneProjectUseCase,
    ) { }

    async execute(id: string, userId: string, roles: Role[]): Promise<void> {
        const project = await this.findOne.execute(id);

        if (project.clientId !== userId && !roles.includes(Role.ADMIN)) {
            throw new ForbiddenException('You do not have permission to delete this project');
        }

        await this.projectRepo.remove(project);
    }
}
