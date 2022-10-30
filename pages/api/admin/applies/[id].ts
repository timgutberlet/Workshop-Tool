import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../../lib/prisma/prisma';

export function getAdminApply(id: number) {
	return prisma.apply.findUnique({
		where: {
			id,
		},
	});
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const id = +req.query.id;
	switch (req.method) {
		// fetch one apply
		case 'GET':
			try {
				res.status(200).json(await getAdminApply(id));
			} catch (exception) {
				console.error(exception);
				res.status(500).end('Ein Datenbankfehler ist aufgetreten!');
			}
			break;

		// update one apply
		case 'PUT':
			try {
				res.status(200).json(
					await prisma.apply.update({
						where: {
							id,
						},
						data: {
							selected: req.body.selected,
						},
					}),
				);
			} catch (exception) {
				console.error(exception);
				res.status(500).end('Ein Datenbankfehler ist aufgetreten!');
			}
			break;

		// delete one apply
		case 'DELETE':
			try {
				res.status(200).json(
					await prisma.apply.delete({
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
