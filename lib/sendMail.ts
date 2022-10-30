import nodemailer from 'nodemailer';
import { getApplicationSentMail, getApplicationSentMailText } from '../mail/applicationSent';
import { getMailFromTemplate, getMailFromTemplateText } from '../mail/mailTemplate';
import { getAcceptedMailHTML, getAcceptedMailText } from '../mail/accepted';
import { getRejectedEmailHTML, getRejectedEmailText } from '../mail/rejected';

// Connection to Mailserver
const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_SERVER_HOST,
	port: process.env.EMAIL_SERVER_PORT,
	secure: false,
	requireTLS: true,
	auth: {
		user: process.env.EMAIL_SERVER_USER,
		pass: process.env.EMAIL_SERVER_PASSWORD,
	},
	logger: true,
});

// Mail content
const mailClosingText =
	process.env.NEXT_PUBLIC_SYMPOSIUM === 'on' ? 'Dein Symposiumsteam' : 'Dein INTEGRA-Team';
const mailClosingHTML =
	process.env.NEXT_PUBLIC_SYMPOSIUM === 'on'
		? 'Dein Symposiumsteam'
		: 'Dein <font color="#ff8000">INTEGRA</font>-Team';

export async function sendMailApplicationSent(
	userMail: string,
	studentPrename: string,
	workshopCompany: string,
	workshopName: string,
	workshopDeadline: Date,
) {
	// Setting up maildata
	const mailData = {
		from: process.env.EMAIL_FROM,
		to: userMail,
		subject: 'Danke für deine Bewerbung',
		text: getMailFromTemplateText(
			getApplicationSentMailText(
				studentPrename,
				workshopName,
				workshopCompany,
				workshopDeadline,
			),
			mailClosingText,
		),
		html: getMailFromTemplate(
			getApplicationSentMail(studentPrename, workshopName, workshopCompany, workshopDeadline),
			mailClosingHTML,
		),
	};

	// Send mail
	await transporter.sendMail(mailData, function logResult(err) {
		if (err) {
			console.error(err);
		}
	});
}

export async function sendMailReject(
	userMail: string,
	studentPrename: string,
	workshopCompany: string,
	workshopName: string,
) {
	// Setting up maildata for sending later
	const mailData = {
		from: process.env.EMAIL_FROM,
		to: userMail,
		subject: `Bewerbung für den Workshop: ${workshopName}`,
		text: getMailFromTemplateText(
			getRejectedEmailText(studentPrename, workshopName, workshopCompany),
			mailClosingText,
		),
		html: getMailFromTemplate(
			getRejectedEmailHTML(studentPrename, workshopName, workshopCompany),
			mailClosingHTML,
		),
	};

	await transporter.sendMail(mailData, function logResult(err) {
		if (err) {
			console.error(err);
		}
	});
}

export async function sendMailAccept(
	userMail: string,
	studentPrename: string,
	workshopCompany: string,
	workshopName: string,
	workshopDate?: Date,
) {
	const mailData = {
		from: process.env.EMAIL_FROM,
		to: userMail,
		subject: `Zusage zum Workshop ${workshopName}`,
		text: getMailFromTemplateText(
			getAcceptedMailText(studentPrename, workshopName, workshopCompany, workshopDate),
			mailClosingText,
		),
		html: getMailFromTemplate(
			getAcceptedMailHTML(studentPrename, workshopName, workshopCompany, workshopDate),
			mailClosingHTML,
		),
	};

	// Now that the entire mail is prepared, send it
	await transporter.sendMail(mailData, function logResult(err) {
		if (err) {
			console.error(err);
		}
	});
}
