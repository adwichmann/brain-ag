import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateHarvestDto } from './create-harvest.dto';
import { IsArray, IsBoolean, IsOptional } from 'class-validator';
import { Crop } from '../../crop/entities/crop.entity';

export class UpdateHarvestDto extends PartialType(CreateHarvestDto) {
  id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  active: boolean;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Array of crops ID' })
  crops: Crop[];
}
