import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../../lib/prisma/prisma';

export function getAdminMarketing(id: number) {
	return prisma.marketing.findUnique({
		where: {
			id,
		},
	});
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const id = +req.query.id;
	switch (req.method) {
		// fetch one marketing entry
		case 'GET':
			try {
				res.status(200).json(await getAdminMarketing(id));
			} catch (exception) {
				console.error(exception);
				res.status(500).end('Ein Datenbankfehler ist aufgetreten!');
			}
			break;

		// update one marketing entry
		case 'PUT':
			try {
				res.status(200).json(
					await prisma.marketing.update({
						where: {
							id,
						},
						data: {
							updatedAt: new Date(),
							sourceId: req.body.sourceId,
							workshopId: req.body.workshopId,
						},
					}),
				);
			} catch (exception) {
				console.error(exception);
				res.status(500).end('Ein Datenbankfehler ist aufgetreten!');
			}
			break;

		// delete one marketing entry
		case 'DELETE':
			try {
				res.status(200).json(
					await prisma.marketing.delete({
						where: {
							id,
						},
					}),
				);
			} catch (exception) {
				console.error(exception);
				res.status(500).end('Ein Datenbankfehler ist aufgetreten!');
			}
			break;
		default:
			res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
			res.status(405).end(`Method ${req.method} not allowed!`);
	}
};
