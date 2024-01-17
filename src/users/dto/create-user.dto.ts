import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    default: 'test@gamil.com',
  })
  email: string | null;
  @ApiProperty({
    default: 'testaccount',
  })
  firstName: string | null;
  @ApiProperty({
    default: '12345',
  })
  lastName: string | null;
  @ApiProperty({
    default: '12345',
  })
  password: string | null;

  @ApiProperty({
    default: null,
    nullable: true,
  })
  OAuthGithubId?: number | null;
}
