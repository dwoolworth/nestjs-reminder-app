import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

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
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;
}
