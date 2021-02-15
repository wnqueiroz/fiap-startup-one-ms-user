import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SingUpUserDTO {
  @ApiProperty({
    example: 'William Queiroz',
  })
  @IsNotEmpty({
    message: 'Informe o nome do usuário',
  })
  name: string;

  @IsNotEmpty({
    message: 'Informe o endereço de email',
  })
  @IsEmail(
    {},
    {
      message: 'Informe um endereço de email válido',
    },
  )
  @ApiProperty({
    example: 'lorem@ipsum.com',
  })
  email: string;

  @IsNotEmpty({
    message: 'Informe a senha',
  })
  @MinLength(6, {
    message: 'A senha deve ter no mínimo 6 caracteres',
  })
  @ApiProperty({
    example: '123456',
  })
  password: string;

  @IsNotEmpty({
    message: 'Informe a confirmação de senha',
  })
  @MinLength(6, {
    message: 'A confirmação de senha deve ter no mínimo 6 caracteres',
  })
  @ApiProperty({
    example: '123456',
  })
  passwordConfirmation: string;
}
