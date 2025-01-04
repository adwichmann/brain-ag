import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Harvest } from '../../harvest/entities/harvest.entity';

@Entity()
export class Crop {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Harvest, (harvest) => harvest.crops)
  harvest: Harvest;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  created_on: Date;

  @UpdateDateColumn()
  updated_on: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_on: Date;
}
