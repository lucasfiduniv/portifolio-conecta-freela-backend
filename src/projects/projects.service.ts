import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Role } from '../users/enums/role.enum';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, clientId: string): Promise<Project> {
    const project = this.projectsRepository.create({
      ...createProjectDto,
      clientId,
    });
    
    return this.projectsRepository.save(project);
  }

  async findAll(paginationDto: PaginationDto, userId?: string, roles?: Role[]): Promise<{ items: Project[]; meta: any }> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;
    
    let query = this.projectsRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.client', 'client')
      .skip(skip)
      .take(limit)
      .orderBy('project.createdAt', 'DESC');
    
    // If user is a client, only show their own projects
    if (roles?.includes(Role.CLIENT) && !roles?.includes(Role.ADMIN)) {
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

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({ 
      where: { id },
      relations: ['client', 'proposals', 'proposals.freelancer'],
    });
    
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    
    return project;
  }

  async remove(id: string, userId: string, roles: Role[]): Promise<void> {
    const project = await this.findOne(id);
    
    // Check if user is the project owner or an admin
    if (project.clientId !== userId && !roles.includes(Role.ADMIN)) {
      throw new ForbiddenException('You do not have permission to delete this project');
    }
    
    await this.projectsRepository.remove(project);
  }
}