import { NextApiRequest, NextApiResponse } from 'next';

import fs from 'fs';

import prisma from '../../../../lib/prisma/prisma';

export function getAdminStudent(id: number) {
	return prisma.student.findUnique({
		where: {
			id,
		},
	});
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const id = +req.query.id;
	switch (req.method) {
		// fetch one student
		case 'GET':
			try {
				res.status(200).json(await getAdminStudent(id));
			} catch (exception) {
				console.error(exception);
				res.status(500).end('Ein Datenbankfehler ist aufgetreten!');
			}
			break;

		// update one student
		case 'PUT':
			try {
				res.status(200).json(
					await prisma.student.update({
						where: {
							id,
						},
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
						},
					}),
				);
			} catch (exception) {
				console.error(exception);
				res.status(500).end('Ein Datenbankfehler ist aufgetreten!');
			}
			break;

		// delete one student
		case 'DELETE':
			try {
				const resultStudent = await prisma.student.delete({
					where: {
						id,
					},
				});

				// If the cv file exists
				if (resultStudent.cvpath != null && resultStudent.cvpath !== '') {
					// Delete cv
					fs.unlinkSync(resultStudent.cvpath);

					// Delete cv folder
					fs.unlinkSync(`./uploads/students/${resultStudent.id}/cv`);
				}

				// If the grades file exists
				if (resultStudent.torpath != null && resultStudent.torpath !== '') {
					// Delete grades
					fs.unlinkSync(resultStudent.torpath);

					// Delete grades folder
					fs.unlinkSync(`./uploads/students/${resultStudent.id}/grades`);
				}

				// Delete student folder
				fs.unlinkSync(`./uploads/students/${resultStudent.id}`);

				res.status(200).json(resultStudent);
			} catch (exception) {
				console.error(exception);
				res.status(500).end('An internal server error has occured!');
			}
			break;
		default:
			res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
			res.status(405).end(`Method ${req.method} not allowed!`);
	}
};
