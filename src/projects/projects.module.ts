import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectsService } from './projects.service';
import { ProjectRepository } from './infra/ProjectRepository';
import { CreateProjectUseCase } from './usecases/create-project/create-project.usecase';
import { FindOneProjectUseCase } from './usecases/find-one-project/find-one-project.usecase';
import { RemoveProjectUseCase } from './usecases/remove-project/remove-project.usecase';
import { FindAllProjectsUseCase } from './usecases/find-all-projects/find-all-projects.usecase';


@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  providers: [
    ProjectsService,
    ProjectRepository,
    { provide: 'IProjectRepository', useExisting: ProjectRepository },

    CreateProjectUseCase,
    FindAllProjectsUseCase,
    FindOneProjectUseCase,
    RemoveProjectUseCase,
  ],
  exports: [ProjectsService,],
})
export class ProjectsModule { }
