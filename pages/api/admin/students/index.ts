import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../../lib/prisma/prisma';

export function getAdminStudents(skip: number) {
	return prisma.student.findMany({
		skip,
		take: 100,
	});
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const skip = typeof req.query.skip === 'undefined' ? 0 : +req.query.skip;
	switch (req.method) {
		case 'GET':
			try {
				res.status(200).json(await getAdminStudents(skip));
			} catch (exception) {
				console.error(exception);
				res.status(500).end('Ein Datenbankfehler ist aufgetreten!');
			}
			break;
		case 'POST':
			try {
				res.status(200).json(
					await prisma.student.create({
						data: {
							name: req.body.name,
							prename: req.body.prename,
							email: req.body.email,
							semester: req.body.semester,
							university: req.body.university,
							gpa: req.body.gpa,
							abigpa: req.body.abigpa,
							cvpath: req.body.cvpath,
							torpath: req.body.torpath,
							majorName: req.body.majorName,
							degreeName: req.body.degreeName,
							captchaScore: 2.0,
						},
					}),
				);
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
