import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class DecimalColumnTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

@Entity()
export class Farm {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.farms)
  user: User;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 100 })
  state: string;

  @Column('decimal', {
    precision: 4,
    scale: 2,
    nullable: true,
    default: 0,
  })
  total_area: number;

  @Column('decimal', {
    precision: 4,
    scale: 2,
    nullable: true,
    default: 0,
  })
  arable_area: number;

  @Column('decimal', {
    precision: 4,
    scale: 2,
    nullable: true,
    default: 0,
  })
  vegetation_area: number;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  created_on: Date;

  @UpdateDateColumn()
  updated_on: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_on: Date;
}
