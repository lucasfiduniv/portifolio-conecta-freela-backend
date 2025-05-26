import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Proposal } from '../../proposals/entities/proposal.entity';
import { ContractStatus } from '../enums/contract-status.enum';

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.ACTIVE,
  })
  status: ContractStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  deliveryDate: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'clientId' })
  client: User;

  @Column()
  clientId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'freelancerId' })
  freelancer: User;

  @Column()
  freelancerId: string;

  @OneToOne(() => Proposal)
  @JoinColumn({ name: 'proposalId' })
  proposal: Proposal;

  @Column()
  proposalId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}