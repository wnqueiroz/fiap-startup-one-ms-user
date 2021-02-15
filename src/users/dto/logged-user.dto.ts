import { ApiProperty } from '@nestjs/swagger';

export class LoggedUserDTO {
  @ApiProperty()
  access_token: string;
}
