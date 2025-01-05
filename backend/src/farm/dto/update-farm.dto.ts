import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateFarmDto } from './create-farm.dto';
import { IsArray, IsBoolean, IsOptional } from 'class-validator';
import { Harvest } from '../../harvest/entities/harvest.entity';
import { Crop } from '../../crop/entities/crop.entity';

export class UpdateFarmDto extends PartialType(CreateFarmDto) {
  id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  active: boolean;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Array of harversts ID' })
  harversts: Harvest[];

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Array of crops ID' })
  crops: Crop[];
}
