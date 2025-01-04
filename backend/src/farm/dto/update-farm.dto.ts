import { PartialType } from '@nestjs/swagger';
import { CreateFarmDto } from './create-farm.dto';
import { IsArray, IsOptional } from 'class-validator';
import { Harvest } from '../../harvest/entities/harvest.entity';
import { Crop } from '../../crop/entities/crop.entity';

export class UpdateFarmDto extends PartialType(CreateFarmDto) {
  id: number;
  active: boolean;

  @IsArray()
  @IsOptional()
  harversts: Harvest[];

  @IsArray()
  @IsOptional()
  crops: Crop[];
}
