import { Gender } from '@prisma/client';
export declare class CreateDoctorDto {
    email: string;
    fullName: string;
    gender: Gender;
    phoneNumber: string;
    specialization: string;
    departmentId: string;
}
