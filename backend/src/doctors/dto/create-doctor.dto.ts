import { IsString, IsEmail, IsNotEmpty, IsUUID, IsEnum } from 'class-validator';
import { Gender } from '@prisma/client';

export class CreateDoctorDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsEnum(Gender)
    @IsNotEmpty()
    gender: Gender;

    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    specialization: string;

    @IsUUID()
    @IsNotEmpty()
    departmentId: string;
}
