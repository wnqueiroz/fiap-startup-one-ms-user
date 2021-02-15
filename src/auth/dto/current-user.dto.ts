import { ApiProperty } from '@nestjs/swagger';

export class CurrentUserDTO {
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
}
