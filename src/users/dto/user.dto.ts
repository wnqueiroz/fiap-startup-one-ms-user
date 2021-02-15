import { Exclude } from 'class-transformer';

export class UserDTO {
  id: string;

  name: string;

  email: string;

  access_token: string;

  @Exclude()
  password: string;

  @Exclude()
  salt: string;

  constructor(partial: Partial<UserDTO>) {
    Object.assign(this, partial);
  }
}
