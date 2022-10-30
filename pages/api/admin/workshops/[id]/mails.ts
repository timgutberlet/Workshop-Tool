import { NextApiRequest, NextApiResponse } from 'next';

import { WorkshopState } from '@prisma/client';
import prisma from '../../../../../lib/prisma/prisma';

import { sendMailAccept, sendMailReject } from '../../../../../lib/sendMail';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const reqId = +req.query.id;
	switch (req.method) {
		// send mails
		case 'POST':
			try {
				const workshopWithStudents = await prisma.workshop.findUnique({
					where: {
						id: reqId,
					},
					include: {
						Apply: {
							include: {
								student_id: true,
							},
						},
						company: true,
					},
				});

				if (workshopWithStudents.state !== WorkshopState.SELECTION) {
					res.status(500).end(
						'Workshop is not in the selection phase, this request can only be accpeted if the workshop is in that phase.',
					);
					return;
				}

				let failedMails = 0;

				workshopWithStudents.Apply.forEach(async (application) => {
					try {
						if (application.selected) {
							await sendMailAccept(
								application.student_id.email,
								application.student_id.prename,
								workshopWithStudents.company.name,
								workshopWithStudents.name,
								workshopWithStudents.date,
							);
						} else {
							await sendMailReject(
								application.student_id.email,
								application.student_id.prename,
								workshopWithStudents.company.name,
								workshopWithStudents.name,
							);
						}
					} catch (exception1) {
						console.error(`err sending mail at applyid=${application.id}`);
						failedMails += 1;
						console.error(exception1);
					}
				});

				// success
				if (failedMails === 0) {
					// Set Workshop state to done after sending mails without any errors
					await prisma.workshop.update({
						where: { id: reqId },
						data: { state: WorkshopState.DONE },
					});
					res.status(200).end('ok');
					return;
				}

				// Error message
				res.status(500).end(
					`Bei ${failedMails} von ${workshopWithStudents.Apply.length} Bewerbungen sind Fehler aufgetreten!`,
				);
				return;
			} catch (exception) {
				console.error(exception);
				res.status(500).end('Ein unbkannter Fehler ist aufgetreten!');
			}
			break;
		// Return error code
		default:
			res.setHeader('Allow', ['POST']);
			res.status(405).end(`Method ${req.method} not allowed!`);
	}
};
