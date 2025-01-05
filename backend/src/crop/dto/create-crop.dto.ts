import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Harvest } from '../../harvest/entities/harvest.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCropDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Harvest ID' })
  @IsNotEmpty()
  @IsNumber()
  harvest: Harvest;
}
