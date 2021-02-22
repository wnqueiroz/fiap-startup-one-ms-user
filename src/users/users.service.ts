import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { AuthService } from '../auth/auth.service';
import { LoggedUserDTO } from './dto/logged-user.dto';
import { SingInUserDTO } from './dto/signin-user.dto';
import { SingUpUserDTO } from './dto/signup-user.dto';
import { UserDTO } from './dto/user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async signUp(signUpUserDTO: SingUpUserDTO): Promise<UserDTO> {
    const { name, password, passwordConfirmation, email } = signUpUserDTO;

    const userExists = await this.findByEmail(email);

    if (userExists) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'User already exists',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (password !== passwordConfirmation) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'Password and confirmation do not match',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const user = new UserEntity();

    user.email = email;
    user.name = name;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    const createdUser = await this.create(user);

    return new UserDTO({
      ...createdUser,
      access_token: this.authService.generateAccessToken(user),
    });
  }

  async signIn(signInUserDTO: SingInUserDTO): Promise<LoggedUserDTO> {
    const { email, password } = signInUserDTO;

    const user = await this.findByEmail(email);

    if (!user || !user.checkPassword(password)) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'Invalid e-mail or password',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return {
      access_token: this.authService.generateAccessToken(user),
    };
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  findById(id: string): Promise<UserEntity> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }

  findByEmail(email: string): Promise<UserEntity> {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  create(user: UserEntity): Promise<UserEntity> {
    return this.usersRepository.save(user);
  }
}
