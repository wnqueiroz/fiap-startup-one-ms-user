import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserDTO {
  @ApiProperty({
    example: '3f0a66e5-3886-4f22-9cb1-41c921e62e20',
  })
  id: string;

  @ApiProperty({
    example: 'William Queiroz',
  })
  name: string;

  @ApiProperty({
    example: 'lorem@ipsum.com',
  })
  email: string;

  @ApiProperty()
  access_token: string;

  @Exclude()
  password: string;

  @Exclude()
  salt: string;

  @ApiProperty({
    example: '2021-02-12T19:16:03.971Z',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2021-02-12T19:16:03.971Z',
  })
  updatedAt: Date;

  constructor(partial: Partial<UserDTO>) {
    Object.assign(this, partial);
  }
}
