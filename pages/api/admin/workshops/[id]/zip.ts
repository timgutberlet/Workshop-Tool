import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../../../lib/prisma/prisma';

import zipAndSend from '../../../../../lib/zip/zip';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const workshopId = +req.query.id;
	switch (req.method) {
		case 'GET':
			try {
				// Get the applications of a workshop
				const applications = await prisma.apply.findMany({
					where: {
						workshopId,
					},
					include: {
						student_id: true,
						workshop_id: {
							select: {
								name: true,
							},
						},
					},
				});

				zipAndSend(res, applications);
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
