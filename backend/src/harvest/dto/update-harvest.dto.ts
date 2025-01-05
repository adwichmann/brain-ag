import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateHarvestDto } from './create-harvest.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateHarvestDto extends PartialType(CreateHarvestDto) {
  id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  active: boolean;
}
