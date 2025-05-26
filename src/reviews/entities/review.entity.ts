import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Contract } from '../../contracts/entities/contract.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 2, scale: 1 })
  rating: number;

  @Column('text')
  comment: string;

  @ManyToOne(() => User, (user) => user.givenReviews)
  @JoinColumn({ name: 'clientId' })
  client: User;

  @Column()
  clientId: string;

  @ManyToOne(() => User, (user) => user.receivedReviews)
  @JoinColumn({ name: 'freelancerId' })
  freelancer: User;

  @Column()
  freelancerId: string;

  @ManyToOne(() => Contract)
  @JoinColumn({ name: 'contractId' })
  contract: Contract;

  @Column()
  contractId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}