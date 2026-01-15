import { PrismaClient, Role, Gender, VitalType, MedicationStatus, AppointmentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'isaacabragesh@gmail.com';
    const adminPassword = 'abc123ABC';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    console.log('Seeding data...');

    // 1. Admin
    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            password: hashedPassword,
            role: Role.ADMIN,
            mustChangePassword: false,
        },
    });

    // 2. Departments
    const depts = ['Cardiology', 'Neurology', 'Pediatrics', 'General Medicine'];
    const departmentObjects = await Promise.all(
        depts.map(name => prisma.department.upsert({
            where: { name },
            update: {},
            create: { name }
        }))
    );

    // 3. Doctor
    const doctorPassword = await bcrypt.hash('doctor123', 10);
    const doctorUser = await prisma.user.upsert({
        where: { email: 'doctor@hospital.com' },
        update: {},
        create: {
            email: 'doctor@hospital.com',
            password: doctorPassword,
            role: Role.DOCTOR,
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
            gender: Gender.MALE,
            departmentId: departmentObjects[3].id,
        },
    });

    // 4. Patient
    const patientPassword = await bcrypt.hash('patient123', 10);
    const patientUser = await prisma.user.upsert({
        where: { email: 'patient@example.com' },
        update: {},
        create: {
            email: 'patient@example.com',
            password: patientPassword,
            role: Role.PATIENT,
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
            gender: Gender.MALE,
            bloodGroup: 'O+',
        },
    });

    // 5. Health Vitals
    const vitalsData = [
        { type: VitalType.BLOOD_PRESSURE, value: '120/80', unit: 'mmHg' },
        { type: VitalType.HEART_RATE, value: '72', unit: 'bpm' },
        { type: VitalType.BLOOD_GLUCOSE, value: '95', unit: 'mg/dL' },
    ];

    for (const v of vitalsData) {
        await prisma.healthVital.create({
            data: {
                ...v,
                patientId: patientProfile.id,
            }
        });
    }

    // 6. Medications
    const medsData = [
        { name: 'Lisinopril', dosage: '10mg', frequency: 'Morning', status: MedicationStatus.ACTIVE },
        { name: 'Metformin', dosage: '500mg', frequency: 'After Lunch', status: MedicationStatus.ACTIVE },
        { name: 'Atorvastatin', dosage: '20mg', frequency: 'Evening', status: MedicationStatus.ACTIVE },
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

    // 7. Appointments
    // Past
    await prisma.appointment.create({
        data: {
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            description: 'Routine Checkup',
            status: AppointmentStatus.COMPLETED,
            doctorId: doctorProfile.id,
            patientId: patientProfile.id,
            fee: 150.00,
        }
    });

    // Future
    await prisma.appointment.create({
        data: {
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days later
            description: 'Follow-up Consultation',
            status: AppointmentStatus.CONFIRMED,
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
