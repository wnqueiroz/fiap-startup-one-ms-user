import { Injectable } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import appConfig from '../config/app.config';
import { AuthService } from './auth.service';
import { CurrentUserDTO } from './dto/current-user.dto';
import { JwtPayloadDTO } from './dto/jwt-payload.dto';

ConfigModule.forRoot({
  load: [appConfig],
});

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig().jwt.publicKey,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: JwtPayloadDTO): Promise<CurrentUserDTO> {
    return this.authService.validate(payload);
  }
}
