import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../../lib/prisma/prisma';

// Warning: This function is publicly available because it is exposed by getServerSideProps
export function getAdminUniversities() {
	return prisma.university.findMany({
		orderBy: {
			id: 'asc',
		},
	});
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	switch (req.method) {
		case 'GET':
			try {
				res.status(200).json(await getAdminUniversities());
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
