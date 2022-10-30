import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../../lib/prisma/prisma';

export function getAdminUsers(skip: number) {
	return prisma.user.findMany({
		skip,
		take: 100,
	});
}
export function getAdminUsersWithCompany(skip: number) {
	return prisma.user.findMany({
		skip,
		take: 100,
		include: {
			Company: true,
		},
	});
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const skip = typeof req.query.skip === 'undefined' ? 0 : +req.query.skip;
	switch (req.method) {
		case 'GET':
			try {
				res.status(200).json(await getAdminUsers(skip));
			} catch (exception) {
				console.error(exception);
				res.status(500).end('Ein Datenbankfehler ist aufgetreten!');
			}
			break;
		case 'POST':
			try {
				res.status(200).json(
					await prisma.user.create({
						data: {
							role: req.body.role,
							companyId: +req.body.company,
							name: req.body.name,
							email: req.body.email,
							emailVerified: null,
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					}),
				);
			} catch (exception) {
				if (
					exception instanceof PrismaClientKnownRequestError &&
					exception.code === 'P2002' // Prisma code for unique key constraint. See https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
				) {
					console.error(exception);
					res.status(500).end('Diese E-Mail Adresse existiert bereits!');
				} else {
					console.error(exception);
					res.status(500).end('Ein Datenbankfehler ist aufgetreten!');
				}
			}
			break;
		default:
			res.setHeader('Allow', ['GET', 'POST']);
			res.status(405).end(`Method ${req.method} not allowed!`);
	}
};
