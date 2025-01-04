import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(5, { message: 'Name must have at least 5 characters.' })
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(11, { message: 'Code must have at least 11 characters.' })
  @MaxLength(14, { message: 'Code must have maximum 14 characters.' })
  code: string;
}
