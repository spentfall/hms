import { Gender } from '@prisma/client';
export declare class CreatePatientDto {
    email: string;
    fullName: string;
    dateOfBirth: string;
    gender: Gender;
    phoneNumber: string;
    address: string;
    bloodGroup: string;
    emergencyContact?: string;
}
