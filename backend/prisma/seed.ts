import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // ================= CURRENCY =================

    const currencies = [
        { code: 'RUB', name: 'Российский рубль', symbol: '₽' },
        { code: 'USD', name: 'Доллар США', symbol: '$' },
        { code: 'KZT', name: 'Казахстанский тенге', symbol: '₸' },
    ]

    for (const c of currencies) {
        await prisma.currency.upsert({
            where: { code: c.code },
            update: {},
            create: c,
        })
    }

    console.log('Seeds completed ✅')
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect()
    })
