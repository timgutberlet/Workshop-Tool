import { NextApiRequest, NextApiResponse } from 'next';

import { Role } from '@prisma/client';
import prisma from '../../../../lib/prisma/prisma';

export function getAdminUser(id: number) {
	return prisma.user.findUnique({
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
				res.status(200).json(await getAdminUser(id));
			} catch (exception) {
				console.error(exception);
				res.status(500).end('Ein Datenbankfehler ist aufgetreten!');
			}
			break;
		case 'PUT':
			try {
				const reqData: any = JSON.parse(req.body);
				const result = await prisma.user.update({
					where: {
						id,
					},
					data: {
						role: reqData.role === 'ADMIN' ? Role.ADMIN : Role.PARTNER,
						companyId: reqData.role === 'ADMIN' ? null : +reqData.company,
						name: reqData.name,
						email: reqData.email,
						updatedAt: new Date(),
					},
				});
				res.status(200).json(result);
			} catch (exception) {
				console.error(exception);
				res.status(500).end('Ein Datenbankfehler ist aufgetreten!');
			}

			break;
		case 'DELETE':
			try {
				res.status(200).json(
					await prisma.user.delete({
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
