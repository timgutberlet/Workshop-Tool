import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

prisma.source.createMany({
	data: [
		{ name: 'Facebook' },
		{ name: 'Instagram' },
		{ name: 'Website' },
		{ name: 'LinkedIn' },
		{ name: 'Unimalender' },
		{ name: 'Flyer' },
		{ name: 'Other' },
	],
});
