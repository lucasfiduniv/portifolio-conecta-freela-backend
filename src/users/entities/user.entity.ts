import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '../enums/role.enum';
import { Project } from '../../projects/entities/project.entity';
import { Proposal } from '../../proposals/entities/proposal.entity';
import { Review } from '../../reviews/entities/review.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.CLIENT],
  })
  roles: Role[];

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @OneToMany(() => Project, (project) => project.client)
  clientProjects: Project[];

  @OneToMany(() => Proposal, (proposal) => proposal.freelancer)
  proposals: Proposal[];

  @OneToMany(() => Review, (review) => review.client)
  givenReviews: Review[];

  @OneToMany(() => Review, (review) => review.freelancer)
  receivedReviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}