import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateCropDto } from './create-crop.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateCropDto extends PartialType(CreateCropDto) {
  id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  active: boolean;
}
