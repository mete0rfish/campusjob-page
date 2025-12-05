import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum MemberRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity()
export class Member {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: MemberRole, default: MemberRole.USER })
  role: MemberRole;
}
