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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { GetCurrentUser } from '../auth/auth.annotation';
import { CurrentUserDTO } from '../auth/dto/current-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LoggedUserDTO } from './dto/logged-user.dto';
import { SingInUserDTO } from './dto/signin-user.dto';
import { SingUpUserDTO } from './dto/signup-user.dto';
import { UserDTO } from './dto/user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: UserDTO,
  })
  async signUp(@Body() signUpUserDTO: SingUpUserDTO): Promise<UserDTO> {
    return this.usersService.signUp(signUpUserDTO);
  }

  @Post('signin')
  @HttpCode(200)
  @ApiOperation({ summary: 'Perform user login' })
  @ApiOkResponse({
    description: 'The operation was successfully performed.',
    type: LoggedUserDTO,
  })
  async signIn(@Body() signInUserDTO: SingInUserDTO): Promise<LoggedUserDTO> {
    return this.usersService.signIn(signInUserDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: `Get summary details of the user's token` })
  @ApiOkResponse({
    description: 'The operation was successfully performed.',
    type: CurrentUserDTO,
  })
  getProfile(@GetCurrentUser() user: CurrentUserDTO): CurrentUserDTO {
    return user;
  }
}
