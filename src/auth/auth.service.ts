import { Injectable } from '@nestjs/common';
import { UsersService } from '../user/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  // async validateUser(email: string, password: string): Promise<any> {
  //   const user: User = await this.usersService.findOne(email);
  //   const valid_password = await compare(password, user.password);
  //
  //   if (user && valid_password) {
  //     return {
  //       id: user.id,
  //       name: user.name,
  //       role: user.role,
  //     };
  //   }
  //   return null;
  // }
}
