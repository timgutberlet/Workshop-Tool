import { NextApiRequest, NextApiResponse } from 'next';
import { WorkshopState } from '@prisma/client';
import fs from 'fs';
import mime from 'mime-types';
import prisma from '../../../../../lib/prisma/prisma';

export async function getPublicWorkshopImage(id: number): Promise<string | null> {
	const workshop = await prisma.workshop.findFirst({
		where: {
			id,
			state: WorkshopState.APPLICATION,
		},
	});

	// If the image wasn't found or if the workshop isn't in the application phase yet
	if (workshop == null || workshop.state !== WorkshopState.APPLICATION) {
		return null;
	}

	// Read file to base64 and return it
	return fs.readFileSync(workshop.imagePath, { encoding: 'base64url' });
}

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
					select: {
						id: true,
						state: true,
						imagePath: true,
					},
				});

				// If the image wasn't found or if the workshop isn't in the application phase yet
				if (
					workshop == null ||
					workshop.state !== WorkshopState.APPLICATION ||
					!fs.existsSync(workshop.imagePath)
				) {
					res.status(404).end('Not found!');
					return;
				}

				const imageSize = fs.statSync(workshop.imagePath).size;
				const mimeType = mime.lookup(workshop.imagePath) as string; // this should return .webp in most cases

				res.writeHead(200, {
					'Content-Type': mimeType,
					'Content-Length': imageSize,
				});

				const readStream = fs.createReadStream(workshop.imagePath);
				readStream.pipe(res);
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
