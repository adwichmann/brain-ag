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
import { Crop } from '../../crop/entities/crop.entity';
import { Farm } from '../../farm/entities/farm.entity';

@Entity()
export class Harvest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'char', length: 4 })
  year: string;

  @ManyToOne(() => Farm, (farm) => farm.harvests)
  farm: Farm;

  @OneToMany(() => Crop, (crop) => crop.harvest)
  crops: Crop[];

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  created_on: Date;

  @UpdateDateColumn()
  updated_on: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_on: Date;
}
