import { IncomingForm } from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';

import { WorkshopState } from '@prisma/client';
import fs from 'fs';
import sharp from 'sharp';

import prisma from '../../../../lib/prisma/prisma';

export function getAdminWorkshops(skip: number) {
	return prisma.workshop.findMany({
		skip, // skip x entries
		take: 100, // take 100 entries
		orderBy: {
			id: 'desc',
		},
	});
}

export function getAdminWorkshopsWithCount(skip: number) {
	return prisma.workshop.findMany({
		skip, // skip x entries
		take: 100, // take 100 entries
		orderBy: {
			id: 'desc',
		},
		// include number of applications
		include: {
			_count: {
				select: {
					Apply: true,
				},
			},
		},
	});
}

// This config is needed for the file uploads
export const config = {
	api: {
		bodyParser: false,
	},
};

// The request data type
type requestData = {
	fields: {
		companyId: number;
		name: string;
		deadline: string; // ISO Time string required
		event: string; // ISO Time string required
		seats: number;
		description: string;
	};
	files: {
		workshopImage: any;
	};
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const skip = typeof req.query.skip === 'undefined' ? 0 : +req.query.skip;

	switch (req.method) {
		// fetch all workshops
		case 'GET':
			try {
				res.status(200).json(await getAdminWorkshops(skip));
			} catch (exception) {
				console.error(exception);
				res.status(500).end('Ein Datenbankfehler ist aufgetreten!');
			}
			break;

		// create new workshop
		case 'POST':
			try {
				// Parse form with a Promise wrapper
				const data: requestData = await new Promise((resolve, reject) => {
					const form = new IncomingForm();

					form.parse(req, (err, fields, files) => {
						if (err) {
							return reject(err);
						}

						const result = { fields, files };

						// @ts-ignore
						resolve(result);
					});
				});

				const workshopResult = await prisma.workshop.create({
					data: {
						name: data.fields.name,
						deadline: new Date(data.fields.deadline),
						state: WorkshopState.UNPUBLISHED,
						year: 0, // TODO REMOVE YEAR FIELD FROM THE DB
						date: new Date(data.fields.event),
						seats: +data.fields.seats,
						description: data.fields.description,
						imagePath: '',
						company: {
							connect: { id: +data.fields.companyId },
						},
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				});

				// create output directories
				const baseDir = `./uploads/workshops/${workshopResult.id}/`;
				if (!fs.existsSync(baseDir)) {
					fs.mkdirSync(baseDir, { recursive: true });
				}

				// read files from the temporary paths and save them to file
				const imagePath = `${baseDir}${data.files.workshopImage.name}.webp`;

				// convert file to webp
				const webpData = await sharp(fs.readFileSync(data.files.workshopImage.path))
					.webp({ lossless: false })
					.toBuffer();

				// write file
				fs.writeFileSync(imagePath, webpData);

				// update workshop with the new file paths
				await prisma.workshop.update({
					where: {
						id: workshopResult.id,
					},
					data: {
						imagePath,
					},
				});

				res.status(200).json(workshopResult);
			} catch (error) {
				if (error.message === 'Input buffer contains unsupported image format') {
					res.status(500).end('Das Bildformat wird nicht unterstützt!');
				}
				console.error(error);
				res.status(500).end('Ein Datenbankfehler ist aufgetreten!');
			}
			break;
		// Return error code

		default:
			res.setHeader('Allow', ['GET', 'POST']);
			res.status(405).end(`Method ${req.method} not allowed!`);
	}
};
