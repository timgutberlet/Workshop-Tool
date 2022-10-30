import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../../lib/prisma/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	switch (req.method) {
		case 'GET':
			try {
				// TODO Implement Excel Download
				prisma.marketing.findMany();

				res.status(500).end('Not yet implemented!');
			} catch (exception) {
				console.error(exception);
				res.status(500).end('An internal server error has occured!');
			}
			break;
		// Return error code
		default:
			res.setHeader('Allow', ['GET']);
			res.status(405).end(`Method ${req.method} not allowed!`);
	}
};
