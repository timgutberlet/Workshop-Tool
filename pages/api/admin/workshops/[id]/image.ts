import { NextApiRequest, NextApiResponse } from 'next';

import fs from 'fs';
import mime from 'mime-types';
import { IncomingForm } from 'formidable';
import sharp from 'sharp';
import prisma from '../../../../../lib/prisma/prisma';

// This config is needed for the file uploads
export const config = {
	api: {
		bodyParser: false,
	},
};

type requestData = {
	fields: {};
	files: { workshopImage: any };
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const id = +req.query.id;
	switch (req.method) {
		// fetch one workshop image
		case 'GET':
			try {
				const workshop = await prisma.workshop.findUnique({
					where: {
						id,
					},
				});

				// If the image wasn't found
				if (workshop == null) {
					res.status(404).end('Not found!');
					return;
				}

				const imageSize = fs.statSync(workshop.imagePath).size;
				const mimeType = mime.lookup(workshop.imagePath) as string;

				res.writeHead(200, {
					'Content-Type': mimeType,
					'Content-Length': imageSize,
				});

				const readStream = fs.createReadStream(workshop.imagePath);
				readStream.pipe(res);
			} catch (exception) {
				console.error(exception);
				res.status(500).end('Ein interner Serverfehler ist aufgetreten!');
			}
			break;
		case 'PUT':
			try {
				// Delete old image
				const workshopData = await prisma.workshop.findUnique({
					select: {
						imagePath: true,
						imageVersion: true,
					},
					where: {
						id,
					},
				});

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

				// If no image was received send error message
				// eslint-disable-next-line eqeqeq
				if (data.files.workshopImage == 'null') {
					res.status(400).send('Fehler: Kein Bild empfangen!');
					return;
				}

				// read files from the temporary paths and save them to file
				const baseDir = `./uploads/workshops/${id}/`;
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
						id,
					},
					data: {
						imagePath,
						imageVersion: workshopData.imageVersion + 1, // increment image version
					},
				});

				// Delete old file if it still exists (it should exist)
				if (fs.existsSync(workshopData.imagePath)) {
					fs.unlinkSync(workshopData.imagePath);
				}

				res.status(200).end('ok');
			} catch (exception) {
				console.error(exception);
				res.status(500).end('Ein interner Serverfehler ist aufgetreten!');
			}
			break;
		default:
			res.setHeader('Allow', ['GET', 'PUT']);
			res.status(405).end(`Method ${req.method} not allowed!`);
	}
};
