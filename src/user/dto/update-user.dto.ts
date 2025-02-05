export class UpdateUserDto {
  readonly email?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly phoneNumber?: string;
  password?: string;
  readonly passwordHash?: string;
}
