import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Member } from '../../members/entities/member.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Member)
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column()
  company: string;

  @Column('text', { array: true })
  certificates: string[];

  @Column()
  age: number;

  @Column()
  seekPeriod: string;

  @Column()
  tip: string;
}
