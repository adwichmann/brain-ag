import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { User } from '../../user/entities/user.entity';

export class CreateFarmDto {
  @IsString()
  @MinLength(5, { message: 'Name must have at least 5 characters.' })
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsDecimal()
  total_area: number;

  @IsDecimal()
  arable_area: number;

  @IsDecimal()
  vegetation_area: number;

  @IsNotEmpty()
  @IsNumber()
  user: User;
}
