import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProposalsService } from './proposals.service';
import { Proposal } from './entities/proposal.entity';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalStatusDto } from './dto/update-proposal-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';

@ApiTags('proposals')
@Controller('proposals')
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.FREELANCER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new proposal' })
  @ApiResponse({ status: 201, description: 'Proposal created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body() createProposalDto: CreateProposalDto,
    @Request() req,
  ): Promise<Proposal> {
    return this.proposalsService.create(createProposalDto, req.user.id);
  }

  @Get('project/:projectId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all proposals for a project' })
  @ApiResponse({ status: 200, description: 'Return all proposals for a project' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findAllForProject(
    @Param('projectId') projectId: string,
    @Request() req,
  ): Promise<Proposal[]> {
    return this.proposalsService.findAll(projectId, req.user.id, req.user.roles);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get proposal by ID' })
  @ApiResponse({ status: 200, description: 'Return proposal by ID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Proposal not found' })
  async findOne(@Param('id') id: string): Promise<Proposal> {
    return this.proposalsService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.CLIENT, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update proposal status' })
  @ApiResponse({ status: 200, description: 'Proposal status updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Proposal not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateProposalStatusDto,
    @Request() req,
  ): Promise<Proposal> {
    return this.proposalsService.updateStatus(id, updateStatusDto, req.user.id, req.user.roles);
  }
}