import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'User email address (must be unique)'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'password123',
        description: 'User password (minimum 6 characters)',
        minLength: 6
    })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({
        example: 'John Doe',
        description: 'Full name of the patient'
    })
    @IsString()
    @IsNotEmpty()
    fullName: string;
}
