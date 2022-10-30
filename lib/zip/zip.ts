/* eslint-disable camelcase */
import { NextApiResponse } from 'next';
import AdmZip from 'adm-zip';
import ExcelJS from 'exceljs';
import { Apply, Student } from '@prisma/client';

export default async function zipAndSend(
	res: NextApiResponse,
	applications: (Apply & {
		student_id: Student;
		workshop_id: {
			name: string;
		};
	})[],
): Promise<void> {
	try {
		// If no applications were found return error message
		if (applications == null || applications.length <= 0) {
			res.status(404).end('Not found!');
			return;
		}

		// create archive
		const zip = new AdmZip();

		// create workbook and sheet
		const workbook = new ExcelJS.Workbook();
		workbook.creator = 'INTEGRA e.V.';
		workbook.created = new Date();
		workbook.modified = new Date();
		const worksheet = workbook.addWorksheet('Bewerbende');
		worksheet.state = 'visible';
		const rows = []; // Array where all relevant student info is stored

		// add a folder with the cv and grades for each student
		applications.forEach((application) => {
			const student = application.student_id;
			const studentIdWithLeadingZeroes = `${student.id}`.padStart(3, '0'); // student id but left padded with '0'
			zip.addLocalFolder(
				`./uploads/students/${student.id}/`,
				`${studentIdWithLeadingZeroes}_${student.prename}_${student.name}`,
			);
			// store student info in the rows array
			rows.push([
				student.id,
				student.prename,
				student.name,
				student.email,
				student.semester,
				student.university,
				student.gpa,
				student.abigpa,
				student.majorName,
				student.degreeName,
				student.streetAndHouseNumber,
				student.adressLineTwo,
				student.postalCode,
				student.city,
				application.selected ? 'Ja' : 'Nein',
			]);
		});

		// Insert the table into the worksheet
		worksheet.addTable({
			name: 'Tabelle_Bewerbende',
			ref: 'A1',
			headerRow: true,
			totalsRow: false,
			style: {
				theme: 'TableStyleLight14',
				showRowStripes: true,
			},
			columns: [
				{ name: '#', filterButton: true },
				{ name: 'Vorname', filterButton: true },
				{ name: 'Name', filterButton: true },
				{ name: 'E-Mail', filterButton: true },
				{ name: 'Semester', filterButton: true },
				{ name: 'Universität', filterButton: true },
				{ name: 'Notendurchschnitt', filterButton: true },
				{ name: 'Abiturschnitt', filterButton: true },
				{ name: 'Studiengang', filterButton: true },
				{ name: 'Abschluss', filterButton: true },
				{ name: 'Adresszeile 1', filterButton: true },
				{ name: 'Adresszeile 2', filterButton: true },
				{ name: 'Postleitzahl', filterButton: true },
				{ name: 'Stadt', filterButton: true },
				{ name: 'Ausgewählt', filterButton: true },
			],
			rows,
		});

		// We need to use any here because TS says this isn't a real buffer but it is a real buffer...
		const excelBuffer: any = await workbook.xlsx.writeBuffer();
		zip.addFile('Bewerbende.xlsx', excelBuffer, '');

		// set headers to zip download
		res.setHeader('Content-Type', 'application/zip');

		// set the filename for the zip archive
		const zipFileName = `Bewerbungen_Workshop_${applications[0].workshop_id.name}.zip`;
		res.setHeader('Content-Disposition', `attachment; filename="${zipFileName}"`);

		// send the zip buffer
		res.status(200).send(zip.toBuffer());
	} catch (exception) {
		console.error(exception);
		res.status(500).end('An internal server error has occured!');
	}
}
