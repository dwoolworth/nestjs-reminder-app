// user.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../constants/roles';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  private sanitizeUser(
    user: UserDocument,
  ): Omit<User, 'passwordHash' | 'refreshToken'> {
    const sanitized = user.toObject();
    delete sanitized.passwordHash;
    delete sanitized.refreshToken;
    return sanitized;
  }

  async onModuleInit() {
    await this.createInitialUser();
  }

  private async createInitialUser() {
    const existingUser = await this.userModel.findOne({
      email: 'happy@example.com',
    });

    if (!existingUser) {
      const passwordHash = await bcrypt.hash('admin', 10);

      const newUser = await this.userModel.create({
        email: 'happy@example.com',
        firstName: 'John',
        lastName: 'Doe',
        roles: [UserRole.ADMIN],
        passwordHash,
        // Add other necessary fields
      });

      console.log(`Initial admin user ${newUser.email} created`);
    } else {
      console.log(`Admin user ${existingUser.email} already exists`);
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<{ _id: string }> {
    const { email, firstName, lastName, phoneNumber, password } = createUserDto;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const createdUser = await this.userModel.create({
      email,
      firstName,
      lastName,
      phoneNumber,
      passwordHash,
    });

    return { _id: createdUser._id.toString() };
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'passwordHash' | 'refreshToken'>> {
    if (updateUserDto.password) {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(
        updateUserDto.password,
        saltRounds,
      );
      updateUserDto = { ...updateUserDto, passwordHash };
      delete updateUserDto.password;
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true, runValidators: true })
      .exec();

    if (!updatedUser) {
      throw new Error(`User with ID "${id}" not found`);
    }

    return this.sanitizeUser(updatedUser);
  }

  async findAll(queryParams: FindAllUsersDto): Promise<{
    users: Omit<User, 'passwordHash' | 'refreshToken'>[];
    total: number;
  }> {
    const { sort, order, search, page = 1, limit = 10 } = queryParams;

    let query = this.userModel.find();

    if (search) {
      query = query.or([
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
      ]);
    }

    if (sort) {
      const sortOrder = order === 'desc' ? -1 : 1;
      query = query.sort({ [sort]: sortOrder });
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      query.skip(skip).limit(limit).exec(),
      this.userModel.countDocuments(query.getFilter()),
    ]);

    return { users: users.map((user) => this.sanitizeUser(user)), total };
  }

  async findOne(
    id: string,
  ): Promise<Omit<User, 'passwordHash' | 'refreshToken'> | null> {
    const user = await this.userModel.findById(id).exec();
    return user ? this.sanitizeUser(user) : null;
  }

  async remove(
    id: string,
  ): Promise<Omit<User, 'passwordHash' | 'refreshToken'> | null> {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    return user ? this.sanitizeUser(user) : null;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async setRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken }).exec();
  }
}
