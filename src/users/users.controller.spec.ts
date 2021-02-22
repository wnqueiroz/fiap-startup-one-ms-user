import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthService } from '../auth/auth.service';
import { CurrentUserDTO } from '../auth/dto/current-user.dto';
import { LoggedUserDTO } from './dto/logged-user.dto';
import { SingInUserDTO } from './dto/signin-user.dto';
import { SingUpUserDTO } from './dto/signup-user.dto';
import { UserDTO } from './dto/user.dto';
import { UserEntity } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const loggedUserDto = new LoggedUserDTO();
  const signInUserDto = new SingInUserDTO();
  const signUpUserDto = new SingUpUserDTO();
  const userDto = new UserDTO({
    access_token: 'foo',
  });
  const currentUserDto = new CurrentUserDTO();

  const mockAuthService = {};

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
      ],
      controllers: [UsersController],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    usersController = moduleRef.get<UsersController>(UsersController);
  });

  describe('signUp', () => {
    it('should register a new user', async () => {
      jest
        .spyOn(usersService, 'signUp')
        .mockImplementation(async () => userDto);

      expect(await usersController.signUp(signUpUserDto)).toStrictEqual(
        userDto,
      );
    });
  });

  describe('signIn', () => {
    it('should perform the login to the user', async () => {
      jest
        .spyOn(usersService, 'signIn')
        .mockImplementation(async () => loggedUserDto);

      expect(await usersController.signIn(signInUserDto)).toStrictEqual(
        loggedUserDto,
      );
    });
  });

  describe('getProfile', () => {
    it(`should return the summary details of the user's token`, () => {
      expect(usersController.getProfile(currentUserDto)).toStrictEqual(
        currentUserDto,
      );
    });
  });
});
