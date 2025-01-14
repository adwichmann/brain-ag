import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Harvest } from '../../harvest/entities/harvest.entity';
import { User } from '../../user/entities/user.entity';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity()
export class Farm {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiHideProperty()
  @ManyToOne(() => User, (user) => user.farms)
  user: User;

  @ApiHideProperty()
  @OneToMany(() => Harvest, (harvest) => harvest.farm, {
    orphanedRowAction: 'delete',
  })
  harvests: Harvest[];

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 100 })
  state: string;

  @Column('decimal', {
    precision: 12,
    scale: 2,
    nullable: true,
    default: 0,
  })
  total_area: number;

  @Column('decimal', {
    precision: 12,
    scale: 2,
    nullable: true,
    default: 0,
  })
  arable_area: number;

  @Column('decimal', {
    precision: 12,
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
