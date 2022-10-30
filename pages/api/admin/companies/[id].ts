import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../../lib/prisma/prisma';

export function getAdminCompany(id: number) {
	return prisma.company.findUnique({
		where: {
			id,
		},
	});
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const id = +req.query.id;
	switch (req.method) {
		case 'GET':
			try {
				res.status(200).json(await getAdminCompany(id));
			} catch (exception) {
				console.error(exception);
				res.status(500).end('Ein Datenbankfehler ist aufgetreten!');
			}
			break;
		case 'PUT':
			try {
				res.status(200).json(
					await prisma.company.update({
						where: {
							id,
						},
						data: {
							name: req.body.name,
							updatedAt: new Date(),
						},
					}),
				);
			} catch (exception) {
				console.error(exception);
				res.status(500).end('Ein Datenbankfehler ist aufgetreten!');
			}
			break;
		case 'DELETE':
			try {
				res.status(200).json(
					await prisma.company.delete({
						where: {
							id,
						},
					}),
				);
			} catch (exception) {
				if (
					exception instanceof PrismaClientKnownRequestError &&
					exception.code === 'P2003' // Prisma code for Foreign key constraint. See https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
				) {
					// Handle foregin key constraint errors
					res.status(500).end(
						'Kann nicht gelöscht werden, da es noch zugeordnete Benutzer und/oder Workshops gibt!',
					);
				} else {
					// Handle any other error
					res.status(500).end('Ein Datenbankfehler ist aufgetreten!');
				}
			}
			break;
		default:
			res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
			res.status(405).end(`Method ${req.method} not allowed!`);
	}
};
