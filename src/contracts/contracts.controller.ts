import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ContractsService } from './contracts.service';
import { Contract } from './entities/contract.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractStatusDto } from './dto/update-contract-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';

@ApiTags('contracts')
@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.CLIENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new contract' })
  @ApiResponse({ status: 201, description: 'Contract created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body() createContractDto: CreateContractDto,
    @Request() req,
  ): Promise<Contract> {
    return this.contractsService.create(createContractDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all contracts' })
  @ApiResponse({ status: 200, description: 'Return all contracts' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Request() req): Promise<Contract[]> {
    return this.contractsService.findAll(req.user.id, req.user.roles);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get contract by ID' })
  @ApiResponse({ status: 200, description: 'Return contract by ID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Contract not found' })
  async findOne(@Param('id') id: string): Promise<Contract> {
    return this.contractsService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update contract status' })
  @ApiResponse({ status: 200, description: 'Contract status updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Contract not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateContractStatusDto,
    @Request() req,
  ): Promise<Contract> {
    return this.contractsService.updateStatus(id, updateStatusDto, req.user.id, req.user.roles);
  }
}