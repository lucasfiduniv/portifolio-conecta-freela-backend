import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { Contract } from '../../contracts/entities/contract.entity';
import { ProposalStatus } from '../enums/proposal-status.enum';

@Entity('proposals')
export class Proposal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  deliveryTime: number;

  @Column('text')
  coverLetter: string;

  @Column({
    type: 'enum',
    enum: ProposalStatus,
    default: ProposalStatus.PENDING,
  })
  status: ProposalStatus;

  @ManyToOne(() => User, (user) => user.proposals)
  @JoinColumn({ name: 'freelancerId' })
  freelancer: User;

  @Column()
  freelancerId: string;

  @ManyToOne(() => Project, (project) => project.proposals)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column()
  projectId: string;

  @OneToOne(() => Contract, (contract) => contract.proposal)
  contract: Contract;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}