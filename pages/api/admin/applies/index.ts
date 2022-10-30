import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../../lib/prisma/prisma';

export function getAdminApplies(skip: number) {
	return prisma.apply.findMany({
		skip,
		take: 100,
	});
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const skip = typeof req.query.skip === 'undefined' ? 0 : +req.query.skip;
	switch (req.method) {
		case 'GET':
			try {
				res.status(200).json(await getAdminApplies(skip));
			} catch (exception) {
				console.error(exception);
				res.status(500).end('Ein Datenbankfehler ist aufgetreten!');
			}
			break;
		case 'POST':
			try {
				res.status(200).json(
					await prisma.apply.create({
						data: {
							selected: req.body.selecter,
							studentId: req.body.studentId,
							workshopId: req.body.workshopId,
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
