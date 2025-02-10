import { IsOptional, IsString, IsNumber } from 'class-validator';

export class FindAllUsersDto {
  @IsOptional()
  @IsString()
  sort?: 'firstName' | 'lastName' | 'email' | 'phoneNumber';

  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  skip?: number;
}