"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const adminEmail = 'isaacabragesh@gmail.com';
    const adminPassword = 'abc123ABC';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    console.log('Seeding data...');
    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            password: hashedPassword,
            role: client_1.Role.ADMIN,
            mustChangePassword: false,
        },
    });
    const depts = ['Cardiology', 'Neurology', 'Pediatrics', 'General Medicine'];
    const departmentObjects = await Promise.all(depts.map(name => prisma.department.upsert({
        where: { name },
        update: {},
        create: { name }
    })));
    const doctorPassword = await bcrypt.hash('doctor123', 10);
    const doctorUser = await prisma.user.upsert({
        where: { email: 'doctor@hospital.com' },
        update: {},
        create: {
            email: 'doctor@hospital.com',
            password: doctorPassword,
            role: client_1.Role.DOCTOR,
            mustChangePassword: false,
        },
    });
    const doctorProfile = await prisma.doctorProfile.upsert({
        where: { userId: doctorUser.id },
        update: {},
        create: {
            userId: doctorUser.id,
            fullName: 'Dr. Gregory House',
            specialization: 'Diagnostic Medicine',
            phoneNumber: '+251911223344',
            gender: client_1.Gender.MALE,
            departmentId: departmentObjects[3].id,
        },
    });
    const patientPassword = await bcrypt.hash('patient123', 10);
    const patientUser = await prisma.user.upsert({
        where: { email: 'patient@example.com' },
        update: {},
        create: {
            email: 'patient@example.com',
            password: patientPassword,
            role: client_1.Role.PATIENT,
            mustChangePassword: false,
        },
    });
    const patientProfile = await prisma.patientProfile.upsert({
        where: { userId: patientUser.id },
        update: {},
        create: {
            userId: patientUser.id,
            fullName: 'Alex Johnson',
            phoneNumber: '+251922334455',
            gender: client_1.Gender.MALE,
            bloodGroup: 'O+',
        },
    });
    const vitalsData = [
        { type: client_1.VitalType.BLOOD_PRESSURE, value: '120/80', unit: 'mmHg' },
        { type: client_1.VitalType.HEART_RATE, value: '72', unit: 'bpm' },
        { type: client_1.VitalType.BLOOD_GLUCOSE, value: '95', unit: 'mg/dL' },
    ];
    for (const v of vitalsData) {
        await prisma.healthVital.create({
            data: {
                ...v,
                patientId: patientProfile.id,
            }
        });
    }
    const medsData = [
        { name: 'Lisinopril', dosage: '10mg', frequency: 'Morning', status: client_1.MedicationStatus.ACTIVE },
        { name: 'Metformin', dosage: '500mg', frequency: 'After Lunch', status: client_1.MedicationStatus.ACTIVE },
        { name: 'Atorvastatin', dosage: '20mg', frequency: 'Evening', status: client_1.MedicationStatus.ACTIVE },
    ];
    for (const m of medsData) {
        await prisma.medication.create({
            data: {
                ...m,
                patientId: patientProfile.id,
                startDate: new Date(),
            }
        });
    }
    await prisma.appointment.create({
        data: {
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            description: 'Routine Checkup',
            status: client_1.AppointmentStatus.COMPLETED,
            doctorId: doctorProfile.id,
            patientId: patientProfile.id,
            fee: 150.00,
        }
    });
    await prisma.appointment.create({
        data: {
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            description: 'Follow-up Consultation',
            status: client_1.AppointmentStatus.CONFIRMED,
            doctorId: doctorProfile.id,
            patientId: patientProfile.id,
            fee: 150.00,
        }
    });
    console.log('Seed completed successfully');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map