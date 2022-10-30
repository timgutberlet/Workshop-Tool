import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../../lib/prisma/prisma';

// Warning: This function is publicly available because it is exposed by getServerSideProps
export function getAdminMajors() {
	return prisma.major.findMany();
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	switch (req.method) {
		case 'GET':
			try {
				res.status(200).json(await getAdminMajors());
			} catch (exception) {
				console.error(exception);
				res.status(500).end('Ein Datenbankfehler ist aufgetreten!');
			}
			break;
		default:
			res.setHeader('Allow', ['GET']);
			res.status(405).end(`Method ${req.method} not allowed!`);
	}
};
