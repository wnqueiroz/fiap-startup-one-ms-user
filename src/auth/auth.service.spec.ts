import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { UserEntity } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CurrentUserDTO } from './dto/current-user.dto';

describe('AuthService', () => {
  let authService: AuthService;

  const mockJwtService = {
    sign: jest.fn(),
  };
  const mockUsersService = {
    findById: jest.fn(),
  };

  const accessToken = 'Lorem ipsum dolor sit amet.';

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('generateAccessToken', () => {
    it('should generate the access token with the user data', () => {
      const userEntity = new UserEntity();

      userEntity.name = 'William Queiroz';
      userEntity.email = 'lorem@ipsum.com';
      userEntity.id = 'Lorem ipsum dolor sit amet.';

      const payload = {
        name: userEntity.name,
        email: userEntity.email,
        sub: userEntity.id,
      };

      mockJwtService.sign.mockReturnValue(accessToken);

      expect(authService.generateAccessToken(userEntity)).toEqual(accessToken);
      expect(mockJwtService.sign).toBeCalledWith(payload);
    });
  });

  describe('validate', () => {
    it('should throw an exception when the JWT payload user does not exist', async () => {
      const payload = {
        name: 'William Queiroz',
        email: 'lorem@ipsum.com',
        sub: 'Lorem ipsum dolor sit amet.',
      };

      mockUsersService.findById.mockResolvedValue(null);

      await expect(authService.validate(payload)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
      expect(mockUsersService.findById).toBeCalledWith(payload.sub);
    });

    it('should return the user data based on JWT payload', async () => {
      const email = 'lorem@ipsum.com';
      const id = 'Lorem ipsum dolor sit amet.';
      const name = 'William Queiroz';

      const payload = {
        name,
        email,
        sub: id,
      };

      const currentUser: CurrentUserDTO = {
        email,
        name,
        id,
      };

      mockUsersService.findById.mockResolvedValue(currentUser);

      expect(await authService.validate(payload)).toEqual(currentUser);
      expect(mockUsersService.findById).toBeCalledWith(payload.sub);
    });
  });
});
