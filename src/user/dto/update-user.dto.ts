import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'The email of the user',
  })
  @IsOptional()
  @IsString()
  readonly email?: string;

  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @ApiProperty({
    example: '1234567890',
    description: 'The phone number of the user',
  })
  @IsOptional()
  @IsString()
  readonly phoneNumber?: string;

  @ApiProperty({
    example: 'password123',
    description: 'The new password of the user',
  })
  @IsOptional()
  @IsString()
  password?: string;

  readonly passwordHash?: string;
}
