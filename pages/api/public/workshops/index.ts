import { NextApiRequest, NextApiResponse } from 'next';
import { Workshop, WorkshopState } from '@prisma/client';
import prisma from '../../../../lib/prisma/prisma';

export async function getPublicWorkshops(): Promise<Workshop[]> {
	return prisma.workshop.findMany({
		where: {
			state: WorkshopState.APPLICATION,
		},
		orderBy: {
			date: 'asc',
		},
	});
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	switch (req.method) {
		// fetch all workshops with state APPLICATION
		case 'GET':
			try {
				res.status(200).json(await getPublicWorkshops());
			} catch (exception) {
				console.error(exception);
				res.status(500).end('Ein Datenbankfehler ist aufgetreten!');
			}
			break;
		// Return error code
		default:
			res.setHeader('Allow', ['GET']);
			res.status(405).end(`Method ${req.method} not allowed!`);
	}
};
