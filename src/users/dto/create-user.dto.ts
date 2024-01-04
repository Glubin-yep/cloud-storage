import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    default: 'test@gamil.com',
  })
  email: string;
  @ApiProperty({
    default: 'testaccount',
  })
  firstName: string;
  @ApiProperty({
    default: '12345',
  })
  lastName: string;
  @ApiProperty({
    default: '12345',
  })
  password: string;
}
