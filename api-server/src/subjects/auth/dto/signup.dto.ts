import { IsNotEmpty, IsEmail, IsString, IsOptional } from 'class-validator';
//import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  //@ApiProperty({ description: '이메일', example: 'test@test.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  //@ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  //@ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  //@ApiProperty()
  @IsOptional() // 없으면 생략
  @IsString()
  image: string;
}
