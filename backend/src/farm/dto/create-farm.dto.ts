import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { User } from '../../user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFarmDto {
  @ApiProperty()
  @IsString()
  @MinLength(5, { message: 'Name must have at least 5 characters.' })
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsDecimal()
  total_area: number;

  @ApiProperty()
  @IsDecimal()
  arable_area: number;

  @ApiProperty()
  @IsDecimal()
  vegetation_area: number;

  @ApiProperty({ description: 'User ID' })
  @IsNotEmpty()
  @IsNumber()
  user: User;
}
