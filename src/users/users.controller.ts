import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { UserDTO } from './dto/user.dto';
import { LoggedUserDTO } from './dto/logged-user.dto';
import { SingInUserDTO } from './dto/signin-user.dto';
import { SingUpUserDTO } from './dto/signup-user.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetCurrentUser } from '../auth/auth.annotation';
import { CurrentUserDTO } from '../auth/dto/current-user.dto';

import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@GetCurrentUser() user: CurrentUserDTO): CurrentUserDTO {
    return user;
  }

  @Post('signin')
  @HttpCode(200)
  async signIn(@Body() signInUserDTO: SingInUserDTO): Promise<LoggedUserDTO> {
    return this.usersService.signIn(signInUserDTO);
  }

  @Post('signup')
  @UseInterceptors(ClassSerializerInterceptor)
  async signUp(@Body() signUpUserDTO: SingUpUserDTO): Promise<UserDTO> {
    return this.usersService.signUp(signUpUserDTO);
  }
}
