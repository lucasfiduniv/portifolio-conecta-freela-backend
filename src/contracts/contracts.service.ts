import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from './entities/contract.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractStatusDto } from './dto/update-contract-status.dto';
import { ProposalsService } from '../proposals/proposals.service';
import { ProposalStatus } from '../proposals/enums/proposal-status.enum';
import { QueueService } from '../queue/queue.service';
import { Role } from '../users/enums/role.enum';
import { ContractStatus } from './enums/contract-status.enum';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>,
    private proposalsService: ProposalsService,
    private queueService: QueueService,
  ) {}

  async create(createContractDto: CreateContractDto, userId: string): Promise<Contract> {
    const { proposalId } = createContractDto;
    
    // Get proposal with related entities
    const proposal = await this.proposalsService.findOne(proposalId);
    
    // Check if user is the project owner
    if (proposal.project.clientId !== userId) {
      throw new ForbiddenException('Only the project owner can create a contract');
    }
    
    // Check if proposal is accepted
    if (proposal.status !== ProposalStatus.ACCEPTED) {
      throw new ConflictException('Cannot create contract for a proposal that is not accepted');
    }
    
    // Check if contract already exists
    const existingContract = await this.contractsRepository.findOne({
      where: { proposalId },
    });
    
    if (existingContract) {
      throw new ConflictException('Contract already exists for this proposal');
    }
    
    // Calculate delivery date
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + proposal.deliveryTime);
    
    // Create contract
    const contract = this.contractsRepository.create({
      proposalId,
      clientId: proposal.project.clientId,
      freelancerId: proposal.freelancerId,
      price: proposal.price,
      deliveryDate,
    });
    
    const savedContract = await this.contractsRepository.save(contract);
    
    // Send notification emails
    await this.queueService.addNotification({
      to: proposal.project.client.email,
      subject: 'Contract created',
      template: 'contract-created-client',
      context: {
        clientName: proposal.project.client.name,
        projectTitle: proposal.project.title,
        freelancerName: proposal.freelancer.name,
        deliveryDate,
        price: proposal.price,
      },
    });
    
    await this.queueService.addNotification({
      to: proposal.freelancer.email,
      subject: 'Contract created',
      template: 'contract-created-freelancer',
      context: {
        freelancerName: proposal.freelancer.name,
        projectTitle: proposal.project.title,
        clientName: proposal.project.client.name,
        deliveryDate,
        price: proposal.price,
      },
    });
    
    return savedContract;
  }

  async findAll(userId: string, roles: Role[]): Promise<Contract[]> {
    let query = this.contractsRepository.createQueryBuilder('contract')
      .leftJoinAndSelect('contract.client', 'client')
      .leftJoinAndSelect('contract.freelancer', 'freelancer')
      .leftJoinAndSelect('contract.proposal', 'proposal')
      .leftJoinAndSelect('proposal.project', 'project');
    
    // Filter based on user role
    if (roles.includes(Role.CLIENT) && !roles.includes(Role.ADMIN)) {
      query = query.where('contract.clientId = :userId', { userId });
    } else if (roles.includes(Role.FREELANCER) && !roles.includes(Role.ADMIN)) {
      query = query.where('contract.freelancerId = :userId', { userId });
    }
    
    return query.getMany();
  }

  async findOne(id: string): Promise<Contract> {
    const contract = await this.contractsRepository.findOne({
      where: { id },
      relations: ['client', 'freelancer', 'proposal', 'proposal.project'],
    });
    
    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }
    
    return contract;
  }

  async updateStatus(id: string, updateStatusDto: UpdateContractStatusDto, userId: string, roles: Role[]): Promise<Contract> {
    const contract = await this.findOne(id);
    
    // Check permissions
    const isClient = contract.clientId === userId;
    const isFreelancer = contract.freelancerId === userId;
    const isAdmin = roles.includes(Role.ADMIN);
    
    if (!isClient && !isFreelancer && !isAdmin) {
      throw new ForbiddenException('You do not have permission to update this contract');
    }
    
    // Only client can mark as completed
    if (updateStatusDto.status === ContractStatus.COMPLETED && !isClient && !isAdmin) {
      throw new ForbiddenException('Only the client can mark a contract as completed');
    }
    
    // Update status
    contract.status = updateStatusDto.status;
    
    // If completed, send notification
    if (updateStatusDto.status === ContractStatus.COMPLETED) {
      await this.queueService.addNotification({
        to: contract.freelancer.email,
        subject: 'Contract completed',
        template: 'contract-completed',
        context: {
          freelancerName: contract.freelancer.name,
          projectTitle: contract.proposal.project.title,
        },
      });
    }
    
    return this.contractsRepository.save(contract);
  }
}