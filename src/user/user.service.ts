// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto): Promise<{_id: string }> {
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

    return { _id: createdUser._id.toString() }; // Return the first (and only) created user
  }
  async update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<User, 'passwordHash'> | null> {
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
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    if (updatedUser) {
      const { passwordHash, ...userWithoutPasswordHash } = updatedUser.toObject();
      return userWithoutPasswordHash;
    }
    return null;
  }
  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }
  async findOne(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }
  async remove(id: string): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    const { passwordHash, ...userWithoutPasswordHash } = user.toObject();
    return userWithoutPasswordHash;
  }
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }
  async setRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken }).exec();
  }
}
