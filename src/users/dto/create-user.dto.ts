import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({
        default: 'test@gamil.com'
    })
    email:string;
    @ApiProperty({
        default: 'testaccount'
    })
    fullName: string;
    @ApiProperty({
        default: '12345'
    })
    password: string;
}
