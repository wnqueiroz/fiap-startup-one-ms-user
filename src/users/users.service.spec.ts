import { HttpException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AuthService } from '../auth/auth.service';
import { SingInUserDTO } from './dto/signin-user.dto';
import { SingUpUserDTO } from './dto/signup-user.dto';
import { UserDTO } from './dto/user.dto';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';

jest.mock('bcrypt');

describe('UsersService', () => {
  let usersService: UsersService;

  const accessToken = 'Lorem ipsum dolor sit amet.';

  const mockAuthService = {
    generateAccessToken: jest.fn(() => accessToken),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

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
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
  });

  describe('signUp', () => {
    it('should NOT register a new user if the user already exists', async () => {
      const userEntity = new UserEntity();

      const signUpUserDto = new SingUpUserDTO();

      signUpUserDto.email = 'lorem@ipsum.com.br';

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(userEntity);

      await expect(usersService.signUp(signUpUserDto)).rejects.toBeInstanceOf(
        HttpException,
      );
      expect(usersService.findByEmail).toBeCalledWith(signUpUserDto.email);
    });

    it('should NOT register a new user if the password and confirmation password do not match', async () => {
      const signUpUserDto = new SingUpUserDTO();

      signUpUserDto.email = 'lorem@ipsum.com.br';
      signUpUserDto.password = 'foo';
      signUpUserDto.passwordConfirmation = 'bar';

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      await expect(usersService.signUp(signUpUserDto)).rejects.toBeInstanceOf(
        HttpException,
      );
      expect(usersService.findByEmail).toBeCalledWith(signUpUserDto.email);
    });

    it('should register a new user', async () => {
      const signUpUserDto = new SingUpUserDTO();

      signUpUserDto.email = 'lorem@ipsum.com.br';
      signUpUserDto.password = 'foo';
      signUpUserDto.passwordConfirmation = 'foo';

      const userEntity = new UserEntity();

      userEntity.name = 'William Queiroz';
      userEntity.email = signUpUserDto.email;
      userEntity.password = signUpUserDto.password;

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(usersService, 'create').mockResolvedValue(userEntity);

      expect(await usersService.signUp(signUpUserDto)).toStrictEqual(
        new UserDTO({
          ...userEntity,
          access_token: accessToken,
        }),
      );
      expect(usersService.findByEmail).toBeCalledWith(signUpUserDto.email);
    });
  });

  describe('signIn', () => {
    it('should NOT sign in the user if the user NOT exists', async () => {
      const singInUserDto = new SingInUserDTO();

      singInUserDto.email = 'lorem@ipsum.com.br';

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      await expect(usersService.signIn(singInUserDto)).rejects.toBeInstanceOf(
        HttpException,
      );
      expect(usersService.findByEmail).toBeCalledWith(singInUserDto.email);
    });

    it('should NOT sign in the user if the password is invalid', async () => {
      const userEntity = new UserEntity();

      userEntity.checkPassword = jest.fn().mockReturnValue(false);

      const singInUserDto = new SingInUserDTO();

      singInUserDto.email = 'lorem@ipsum.com.br';
      singInUserDto.password = 'foo';

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(userEntity);

      await expect(usersService.signIn(singInUserDto)).rejects.toBeInstanceOf(
        HttpException,
      );
      expect(usersService.findByEmail).toBeCalledWith(singInUserDto.email);
      expect(userEntity.checkPassword).toBeCalledWith(singInUserDto.password);
    });

    it('should perform the sign in for the user', async () => {
      const userEntity = new UserEntity();

      userEntity.checkPassword = jest.fn().mockReturnValue(true);

      const singInUserDto = new SingInUserDTO();

      singInUserDto.email = 'lorem@ipsum.com.br';
      singInUserDto.password = 'foo';

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(userEntity);

      expect(await usersService.signIn(singInUserDto)).toStrictEqual({
        access_token: accessToken,
      });
      expect(usersService.findByEmail).toBeCalledWith(singInUserDto.email);
      expect(userEntity.checkPassword).toBeCalledWith(singInUserDto.password);
    });
  });

  describe('findById', () => {
    it('should return the user by ID', async () => {
      const id = 'Lorem ipsum dolor sit amet.';

      const user = { id };

      mockUserRepository.findOne.mockResolvedValue(user);

      expect(await usersService.findById(id)).toEqual(user);
      expect(mockUserRepository.findOne).toBeCalledWith({
        where: {
          id,
        },
      });
    });
  });

  describe('findByEmail', () => {
    it('should return the user by ID', async () => {
      const id = 'Lorem ipsum dolor sit amet.';
      const email = 'lorem@ipsum.com.br';

      const user = { id, email };

      mockUserRepository.findOne.mockResolvedValue(user);

      expect(await usersService.findByEmail(email)).toEqual(user);
      expect(mockUserRepository.findOne).toBeCalledWith({
        where: {
          email,
        },
      });
    });
  });

  describe('create', () => {
    it('should create a new user on database', async () => {
      const userEntity = new UserEntity();

      mockUserRepository.save.mockResolvedValue(null);

      expect(await usersService.create(userEntity)).toEqual(null);
      expect(mockUserRepository.save).toBeCalledWith(userEntity);
    });
  });
});
