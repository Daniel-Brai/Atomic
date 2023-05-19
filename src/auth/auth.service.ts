import { Injectable } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { verifyPassword } from '../utils/argon2';
import { User } from '../user/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user: User = await this.usersService.findOne(username);
    const valid_password = verifyPassword(user.password, password);

    if (user && valid_password) {
      return {
        id: user.id,
        username: user.username,
      };
    }
    return null;
  }
}
