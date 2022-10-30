import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../../lib/prisma/prisma';

export function getAdminCompanies() {
	return prisma.company.findMany({
		include: {
			users: true,
		},
	});
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	switch (req.method) {
		case 'GET':
			try {
				res.status(200).json(await getAdminCompanies());
			} catch (exception) {
				console.error(exception);
				res.status(500).end('Ein Datenbankfehler ist aufgetreten!');
			}
			break;
		case 'POST':
			try {
				const createdAtDate = new Date();
				res.status(200).json(
					await prisma.company.create({
						data: {
							name: req.body.name,
							createdAt: createdAtDate,
							updatedAt: createdAtDate,
						},
					}),
				);
			} catch (exception) {
				console.error(exception);
				res.status(500).end('Ein Datenbankfehler ist aufgetreten!');
			}
			break;
		default:
			res.setHeader('Allow', ['GET', 'POST']);
			res.status(405).end(`Method ${req.method} not allowed!`);
	}
};
