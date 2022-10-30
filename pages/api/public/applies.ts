import { NextApiRequest, NextApiResponse } from 'next';
// import { check, validationResult } from 'express-validator';
import { IncomingForm } from 'formidable';
import fs from 'fs';

import { Company, Workshop } from '@prisma/client';
import prisma from '../../../lib/prisma/prisma';
import { sendMailApplicationSent } from '../../../lib/sendMail';

// import initMiddleware from '../../../lib/middleware/initMiddleware';
// import validateMiddleware from '../../../lib/middleware/validateMiddleware';

// This config is needed for the file uploads
export const config = {
	api: {
		bodyParser: false,
	},
};

// Typescript type for the request body
type requestData = {
	fields: {
		// Page 0
		workshops: string;

		// Page - 1
		firstName: string;
		lastName: string;
		email: string;

		// Page - 2
		university: string;
		semester: number;
		degreeName: string;
		majorName: string;
		abiGpa: number;
		gpa: number;

		// Page - 3
		streetAndHouseNumber: string;
		adressLineTwo: string;
		postalCode: string;
		city: string;

		// Page - 4
		cvUrl: string;
		gradesUrl: string;

		// Page - 5
		facebook: boolean;
		instagram: boolean;
		website: boolean;
		linkedin: boolean;
		unimalender: boolean;
		flyer: boolean;
		other: boolean;
		gdpr: boolean;
		newsletter: 'true' | 'false';

		// techincal
		reCaptchaToken: string;
	};
	files: {
		// Page - 3
		cv: any;
		grades: any;
	};
};

/* // TODO renable form validation
const validateRequestBody = initMiddleware(
	validateMiddleware(
		[
			// Page - 0
			check('selectedWorkshops').isArray(),

			// Page - 1
			check('name').isString(),
			check('prename').isString(),
			check('email').isEmail(),
			check('postalCode').isNumeric(),
			check('semester').isInt({ min: 1, max: 100 }),

			// Page - 2
			check('university').isString(),
			check('gpa').isNumeric(),
			check('bachgpa').isNumeric(),
			check('abigpa').isNumeric(),
			check('majorName').isString(),
			check('degreeName').isString(),

			// Page - 3
			// TODO Validate file upload ?

			// Page - 4
			check('facebook').isBoolean(),
			check('instagram').isBoolean(),
			check('website').isBoolean(),
			check('linkedin').isBoolean(),
			check('unimalender').isBoolean(),
			check('flyer').isBoolean(),
			check('anderes').isBoolean(),
			check('policy').isBoolean(),
		],
		validationResult,
	),
); */

const validateCaptcha = async (token: string) => {
	// TODO move this to .env
	const secretKey = '6LeyQ3YcAAAAAKYRhehOPDVSR8Mo8dkXALpHczJT';

	try {
		const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
			method: 'POST',
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded', // This API Endpoint only accepts URL Encoded
			},
			body: `secret=${secretKey}&response=${token}`,
		});
		const jsonResponse = await response.json();

		if (jsonResponse.success !== true) {
			// err on google side
			return -1.0;
		}
		// return the score 0.0 - 1.0
		return jsonResponse.score;
	} catch (exception) {
		console.error(exception);
	}
	// unkown err
	return -2.0;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
	switch (req.method) {
		// Create an apply entry and a student entry
		case 'POST':
			// Parse form with a Promise wrapper
			const data: requestData = await new Promise((resolve, reject) => {
				const form = new IncomingForm();

				form.parse(req, (err, fields, files) => {
					if (err) {
						return reject(err);
					}

					const result = { fields, files };
					console.info({
						info: 'Received Request with the following data: ',
						data: result,
					});

					// @ts-ignore
					resolve(result);
				});
			});

			// TODO Validate Workshop
			/*
			await validateRequestBody(req, res);
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({ errors: errors.array() });
			}
			*/

			// Calculate captcha score
			const captchaScore = await validateCaptcha(data.fields.reCaptchaToken);

			try {
				// Create the student
				const resultStudent = await prisma.student.create({
					select: {
						id: true,
					},
					data: {
						name: data.fields.lastName,
						prename: data.fields.firstName,
						email: data.fields.email,
						semester: +data.fields.semester,
						university: data.fields.university,
						gpa: +data.fields.gpa,
						abigpa: +data.fields.abiGpa,
						cvpath: '',
						torpath: '',
						captchaScore,
						degreeName: data.fields.degreeName,
						majorName: data.fields.majorName,
						streetAndHouseNumber: data.fields.streetAndHouseNumber,
						adressLineTwo: data.fields.adressLineTwo,
						postalCode: data.fields.postalCode,
						city: data.fields.city,
						acceptedNewsletter: data.fields.newsletter === 'true',
					},
				});

				// create output directories
				const baseDir = `./uploads/students/${resultStudent.id}/`;
				const gradesDir = `${baseDir}grades/`;
				if (!fs.existsSync(gradesDir)) {
					fs.mkdirSync(gradesDir, { recursive: true });
				}
				const cvDir = `${baseDir}cv/`;
				if (!fs.existsSync(cvDir)) {
					fs.mkdirSync(cvDir, { recursive: true });
				}

				// read files from the temporary paths and save them to file
				const { grades, cv } = data.files;
				const fileGradesPath = `${gradesDir}${grades.name}`;
				const fileCvPath = `${cvDir}${cv.name}`;
				fs.writeFileSync(fileGradesPath, fs.readFileSync(grades.path));
				fs.writeFileSync(fileCvPath, fs.readFileSync(cv.path));

				// update student with the new file paths
				await prisma.student.update({
					where: {
						id: resultStudent.id,
					},
					data: {
						cvpath: fileCvPath,
						torpath: fileGradesPath,
					},
				});

				// Create the application data array
				const applyData = data.fields.workshops.split(',').map((x) => {
					return {
						selected: false,
						studentId: resultStudent.id,
						workshopId: +x,
					};
				});

				// Create the applications
				await prisma.apply.createMany({
					data: applyData,
				});

				// TODO Optimize this if we add custom marketing sources
				const marketingSources = [
					'facebook',
					'instagram',
					'website',
					'linkedin',
					'unimalender',
					'flyer',
					'other',
				];

				// Create the marketing informations
				await applyData
					.map((x) => x.workshopId)
					.forEach(async (workshopId) => {
						// eslint-disable-next-line no-restricted-syntax
						await marketingSources.forEach(async (marketingSource) => {
							if (
								data.fields[marketingSource] === 'true' ||
								data.fields[marketingSource] === true
							) {
								await prisma.marketing.create({
									data: {
										source: {
											connect: {
												name: marketingSource,
											},
										},
										Workshop: {
											connect: {
												id: workshopId,
											},
										},
										createdAt: new Date(),
										updatedAt: new Date(),
									},
								});
							}
						});
					});

				// Create Array of workshop ids which are selected
				const selectedWorkshopIds = Array.from(
					data.fields.workshops.replaceAll('[', '').replaceAll(']', '').split(','),
					Number,
				);

				// Get Workshop entry from db for each selected workshop
				const selectedWorkshopsPromise: Array<Promise<Workshop & { company: Company }>> =
					selectedWorkshopIds.map((selectedWorkshopId) =>
						prisma.workshop.findUnique({
							where: {
								id: selectedWorkshopId,
							},
							include: {
								company: true,
							},
						}),
					);

				// Wait unit all workshops are fetched
				const selectedWorkshops: Array<Workshop & { company: Company }> = await Promise.all(
					selectedWorkshopsPromise,
				);

				// Send mails for each selected workshop
				selectedWorkshops.forEach((selectedWorkshop) =>
					sendMailApplicationSent(
						data.fields.email,
						data.fields.firstName,
						selectedWorkshop.company.name,
						selectedWorkshop.name,
						selectedWorkshop.deadline,
					),
				);

				res.status(200).end('ok');
			} catch (exception) {
				console.error(exception);
				res.status(500).end('Ein Datenbankfehler ist aufgetreten!');
			}
			break;
		// Return error code
		default:
			res.setHeader('Allow', ['POST']);
			res.status(405).end(`Method ${req.method} not allowed!`);
	}
};
