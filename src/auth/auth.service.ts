import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/user.entity';

import { JwtPayloadDTO } from './dto/jwt-payload.dto';
import { CurrentUserDTO } from './dto/current-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  generateAccessToken(user: UserEntity): string {
    const payload: JwtPayloadDTO = {
      name: user.name,
      email: user.email,
      sub: user.id,
    };

    return this.jwtService.sign(payload);
  }

  async validate(payload: JwtPayloadDTO): Promise<CurrentUserDTO> {
    const id = payload.sub;

    const user = await this.usersService.findById(id);

    if (!user) throw new UnauthorizedException('User not exists');

    const { name, email } = user;

    return { name, email, id };
  }
}
