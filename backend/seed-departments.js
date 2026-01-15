const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const departments = [
        'Cardiology',
        'Neurology',
        'Pediatrics',
        'Oncology',
        'Orthopedics',
        'Dermatology',
        'Emergency Medicine',
        'Radiology'
    ];

    console.log('Seeding departments...');

    for (const name of departments) {
        await prisma.department.upsert({
            where: { name },
            update: {},
            create: { name },
        });
        console.log(`- ${name}`);
    }

    console.log('Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
