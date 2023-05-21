import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    const foundUser = await this.userRepository.findOne({
      where: { username: user.username },
    });
    if (!foundUser) {
      const newUser = this.userRepository.create(user);
      return await this.userRepository.save(newUser);
    } else {
      throw new BadRequestException(
        'A user with that username already exists!',
      );
    }
  }

  async findOne(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (!user) {
      throw new BadRequestException('The User does not exist!');
    }
    return user;
  }
}
