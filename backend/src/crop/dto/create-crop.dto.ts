import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Harvest } from '../../harvest/entities/harvest.entity';

export class CreateCropDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  harvest: Harvest;
}
