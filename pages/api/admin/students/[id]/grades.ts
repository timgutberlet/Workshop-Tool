import { NextApiRequest, NextApiResponse } from 'next';

import fs from 'fs';
import mime from 'mime-types';

import prisma from '../../../../../lib/prisma/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const id = +req.query.id;
	switch (req.method) {
		// fetch one student
		case 'GET':
			try {
				const student = await prisma.student.findUnique({
					where: {
						id,
					},
				});

				// If the file wasn't found
				if (student == null) {
					res.status(404).end('Not found!');
					return;
				}

				const fileSize = fs.statSync(student.torpath).size;
				const mimeType = mime.lookup(student.torpath) as string;

				res.writeHead(200, {
					'Content-Type': mimeType,
					'Content-Length': fileSize,
				});

				const readStream = fs.createReadStream(student.torpath);
				readStream.pipe(res);
			} catch (excpetion) {
				res.status(500).end('An internal server error has occured!');
			}
			break;
		default:
			res.setHeader('Allow', ['GET']);
			res.status(405).end(`Method ${req.method} not allowed!`);
	}
};
