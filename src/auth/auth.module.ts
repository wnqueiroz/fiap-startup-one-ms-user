import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

const modules = [
  PassportModule,
  JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const { jwt } = configService.get('app');

      return {
        privateKey: jwt.privateKey,
        signOptions: {
          expiresIn: jwt.expiresIn,
          algorithm: 'RS256',
        },
      };
    },
  }),
];

const providers = [AuthService, JwtStrategy];

@Global()
@Module({
  imports: [UsersModule, ...modules],
  exports: [...modules, AuthService],
  providers,
})
export class AuthModule {}
