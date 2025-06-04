import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Role } from '../users/enums/role.enum';
import { CreateProjectUseCase } from './usecases/create-project/create-project.usecase';
import { FindOneProjectUseCase } from './usecases/find-one-project/find-one-project.usecase';
import { RemoveProjectUseCase } from './usecases/remove-project/remove-project.usecase';
import { FindAllProjectsUseCase } from './usecases/find-all-projects/find-all-projects.usecase';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly createProject: CreateProjectUseCase,
    private readonly findAllProjects: FindAllProjectsUseCase,
    private readonly findOneProject: FindOneProjectUseCase,
    private readonly removeProject: RemoveProjectUseCase,
  ) { }

  create(dto: CreateProjectDto, clientId: string) {
    return this.createProject.execute(dto, clientId);
  }

  findAll(pagination: PaginationDto, userId?: string, roles?: Role[]) {
    return this.findAllProjects.execute(pagination, userId, roles);
  }

  findOne(id: string) {
    return this.findOneProject.execute(id);
  }

  remove(id: string, userId: string, roles: Role[]) {
    return this.removeProject.execute(id, userId, roles);
  }
}
