import { ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Proposal } from '../../entities/proposal.entity';
import { ProjectsService } from '../../../projects/projects.service';
import { Role } from '../../../users/enums/role.enum';

export class FindAllProposalsUseCase {
    constructor(
        private proposalsRepository: Repository<Proposal>,
        private projectsService: ProjectsService,
    ) { }

    async execute(projectId: string, userId: string, roles: Role[]): Promise<Proposal[]> {
        const project = await this.projectsService.findOne(projectId);

        if (project.clientId !== userId && !roles.includes(Role.ADMIN) && !roles.includes(Role.FREELANCER)) {
            throw new ForbiddenException('You do not have permission to view these proposals');
        }

        let query = this.proposalsRepository.createQueryBuilder('proposal')
            .leftJoinAndSelect('proposal.freelancer', 'freelancer')
            .where('proposal.projectId = :projectId', { projectId });

        if (roles.includes(Role.FREELANCER) && !roles.includes(Role.ADMIN) && project.clientId !== userId) {
            query = query.andWhere('proposal.freelancerId = :userId', { userId });
        }

        return query.getMany();
    }
}
