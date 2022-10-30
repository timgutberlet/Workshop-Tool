import { NextApiRequest, NextApiResponse } from 'next';

import fs from 'fs';
import prisma from '../../../../lib/prisma/prisma';

export function getAdminWorkshop(id: number) {
	return prisma.workshop.findUnique({
		where: {
			id,
		},
	});
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const id = +req.query.id;
	switch (req.method) {
		// fetch one workshops
		case 'GET':
			try {
				res.status(200).json(await getAdminWorkshop(id));
			} catch (exception) {
				console.error(exception);
				res.status(500).end('Ein Datenbankfehler ist aufgetreten!');
			}
			break;

		// update one workshop
		case 'PUT':
			try {
				console.timeLog(req.body);
				const workshopResult = await prisma.workshop.update({
					where: {
						id,
					},
					data: {
						companyId: req.body.companyId,
						name: req.body.name,
						deadline: req.body.deadline,
						state: req.body.state,
						year: +req.body.year,
						date: new Date(req.body.date),
						seats: +req.body.seats,
						description: req.body.description,
						updatedAt: new Date(),
					},
				});

				res.status(200).json(workshopResult);
			} catch (exception) {
				console.error(exception);
				res.status(500).end('Ein Datenbankfehler ist aufgetreten!');
			}
			break;
		// Return error code

		// delete one workshop
		case 'DELETE':
			try {
				const workshopResult = await prisma.workshop.delete({
					where: {
						id,
					},
				});

				// If the image exist
				if (workshopResult.imagePath != null && workshopResult.imagePath !== '') {
					// Delete image
					fs.unlinkSync(workshopResult.imagePath);

					// Delete image folder
					fs.unlinkSync(`./uploads/workshops/${workshopResult.id}`);
				}

				res.status(200).json(workshopResult);
			} catch (exception) {
				console.error(exception);
				res.status(500).end('Ein Datenbankfehler ist aufgetreten!');
			}
			break;
		// Return error code
		default:
			res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
			res.status(405).end(`Method ${req.method} not allowed!`);
	}
};
