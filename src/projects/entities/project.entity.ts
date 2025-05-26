import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Proposal } from '../../proposals/entities/proposal.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  budget: number;

  @Column()
  deadline: Date;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.clientProjects)
  @JoinColumn({ name: 'clientId' })
  client: User;

  @Column()
  clientId: string;

  @OneToMany(() => Proposal, (proposal) => proposal.project)
  proposals: Proposal[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}