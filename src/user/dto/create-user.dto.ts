import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  lastName: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  password: string;

  @ApiProperty({
    example: '1234567890',
    description: 'The phone number of the user',
  })
  phoneNumber: string;

  passwordHash?: string;
}
