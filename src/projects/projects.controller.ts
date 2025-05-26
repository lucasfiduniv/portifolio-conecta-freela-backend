import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.CLIENT, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Request() req,
  ): Promise<Project> {
    return this.projectsService.create(createProjectDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'Return all projects' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Request() req,
  ): Promise<{ items: Project[]; meta: any }> {
    return this.projectsService.findAll(paginationDto, req.user.id, req.user.roles);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiResponse({ status: 200, description: 'Return project by ID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findOne(@Param('id') id: string): Promise<Project> {
    return this.projectsService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.CLIENT, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete project by ID' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async remove(
    @Param('id') id: string,
    @Request() req,
  ): Promise<{ message: string }> {
    await this.projectsService.remove(id, req.user.id, req.user.roles);
    return { message: 'Project deleted successfully' };
  }
}