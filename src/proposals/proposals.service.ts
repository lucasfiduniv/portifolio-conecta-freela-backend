import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proposal } from './entities/proposal.entity';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalStatusDto } from './dto/update-proposal-status.dto';
import { ProjectsService } from '../projects/projects.service';
import { ProposalStatus } from './enums/proposal-status.enum';
import { QueueService } from '../queue/queue.service';
import { Role } from '../users/enums/role.enum';

@Injectable()
export class ProposalsService {
  constructor(
    @InjectRepository(Proposal)
    private proposalsRepository: Repository<Proposal>,
    private projectsService: ProjectsService,
    private queueService: QueueService,
  ) {}

  async create(createProposalDto: CreateProposalDto, freelancerId: string): Promise<Proposal> {
    const { projectId } = createProposalDto;
    
    // Check if project exists
    const project = await this.projectsService.findOne(projectId);
    
    // Check if freelancer already submitted a proposal
    const existingProposal = await this.proposalsRepository.findOne({
      where: {
        projectId,
        freelancerId,
      },
    });
    
    if (existingProposal) {
      throw new ConflictException('You have already submitted a proposal for this project');
    }
    
    // Create proposal
    const proposal = this.proposalsRepository.create({
      ...createProposalDto,
      freelancerId,
    });
    
    const savedProposal = await this.proposalsRepository.save(proposal);
    
    // Add client and project info to notification
    await this.queueService.addNotification({
      to: project.client.email,
      subject: 'New proposal received',
      template: 'new-proposal',
      context: {
        clientName: project.client.name,
        projectTitle: project.title,
        freelancerId,
      },
    });
    
    return savedProposal;
  }

  async findAll(projectId: string, userId: string, roles: Role[]): Promise<Proposal[]> {
    // First check if project exists
    const project = await this.projectsService.findOne(projectId);
    
    // If user is not the project owner or an admin, and not the freelancer who made proposals
    if (project.clientId !== userId && !roles.includes(Role.ADMIN) && !roles.includes(Role.FREELANCER)) {
      throw new ForbiddenException('You do not have permission to view these proposals');
    }
    
    let query = this.proposalsRepository.createQueryBuilder('proposal')
      .leftJoinAndSelect('proposal.freelancer', 'freelancer')
      .where('proposal.projectId = :projectId', { projectId });
    
    // If user is a freelancer, only show their own proposals
    if (roles.includes(Role.FREELANCER) && !roles.includes(Role.ADMIN) && project.clientId !== userId) {
      query = query.andWhere('proposal.freelancerId = :userId', { userId });
    }
    
    return query.getMany();
  }

  async findOne(id: string): Promise<Proposal> {
    const proposal = await this.proposalsRepository.findOne({
      where: { id },
      relations: ['freelancer', 'project', 'project.client'],
    });
    
    if (!proposal) {
      throw new NotFoundException(`Proposal with ID ${id} not found`);
    }
    
    return proposal;
  }

  async updateStatus(id: string, updateStatusDto: UpdateProposalStatusDto, userId: string, roles: Role[]): Promise<Proposal> {
    const proposal = await this.findOne(id);
    
    // Check if user is the project owner or an admin
    if (proposal.project.clientId !== userId && !roles.includes(Role.ADMIN)) {
      throw new ForbiddenException('You do not have permission to update this proposal');
    }
    
    // Update status
    proposal.status = updateStatusDto.status;
    
    // If accepting the proposal, reject all other proposals
    if (updateStatusDto.status === ProposalStatus.ACCEPTED) {
      await this.proposalsRepository.update(
        { 
          projectId: proposal.projectId, 
          id: Not(Equal(id)),
          status: ProposalStatus.PENDING,
        },
        { status: ProposalStatus.REJECTED },
      );
      
      // Notify freelancer about accepted proposal
      await this.queueService.addNotification({
        to: proposal.freelancer.email,
        subject: 'Your proposal was accepted',
        template: 'proposal-accepted',
        context: {
          freelancerName: proposal.freelancer.name,
          projectTitle: proposal.project.title,
        },
      });
    }
    
    return this.proposalsRepository.save(proposal);
  }
}