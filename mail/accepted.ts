export function getAcceptedMailHTML(
	studentPrename: string,
	workshopName: string,
	workshopCompany: string,
	workshopDate: Date,
) {
	// Send mail for Symposium, if Symposium mode is active
	if (process.env.NEXT_PUBLIC_SYMPOSIUM === 'on') {
		return `Hallo ${studentPrename},
		<br/>
		<br/>
		wir freuen uns dich hiermit herzlich zum Workshop <b> ${workshopName} </b> des Unternehmens <b>${workshopCompany}</b> im Rahmen des Symposiums ${new Date(
			workshopDate,
		).getUTCFullYear()} einzuladen!
		<br/>
		<b><u>Wann?</u></b><br/>
		${workshopDate.toLocaleDateString()} 12:30 bis 21Uhr <br/>
		<b><u>Wo?</u></b><br/>
		<br/>
		Leonardo Royal Hotel<br/>
		Augustaanlage 4<br/>
		68165 Mannheim, Deutschland<br/>
		<br/>
		Bitte finde Dich etwa <b>20 Minuten vor Beginn</b> des Workshops im Foyer des Hotels ein. Der Dresscode ist <b>Business</b>.<br/>
		<br/>
		Solltest Du wider Erwarten doch nicht an einem Workshop teilnehmen können, so gib uns bitte schnellstmöglich Bescheid!
		<br/>
		Da wir die Workshopevaluation per QR Code durchführen werden, lade Dir bitte eine entsprechende Scanner App herunter.
		<br/>
		Bei weiteren Fragen kannst Du Dich gerne unter <a href="mailto:info@integra-ev.de">info@integra-ev.de</a> melden!<br/>
		<br/>
		Beste Grüße <br/>`;
	}
	// Or send shorter mail for regular workshops
	return `
		Hallo ${studentPrename},
		<br/>
		<br/>
		wir freuen uns Dich hiermit herzlich zum Workshop <b> ${workshopName} </b> des Unternehmens <b>${workshopCompany}</b> am ${workshopDate.toLocaleDateString()} einzuladen!
		<br/>
		Bei weiteren Fragen kannst du Dich gerne unter <a href="mailto:info@integra-ev.de">info@integra-ev.de</a> melden!<br/>
		<br/>
		Beste Grüße <br/>`;
}
// Email text body – fallback for email clients that don't render HTML
export function getAcceptedMailText(
	studentPrename: string,
	workshopName: string,
	workshopCompany: string,
	workshopDate: Date,
) {
	// Send mail for Symposium, if Symposium mode is active
	if (process.env.NEXT_PUBLIC_SYMPOSIUM === 'on') {
		return `Hallo ${studentPrename}, \n
		Wir freuen uns Dich hiermit herzlich zum Workshop ${workshopName} des Unternehmens ${workshopCompany} im Rahmen des Symposiums ${new Date(
			workshopDate,
		).getUTCFullYear()} einzuladen! \n
		Wann? \n
		${workshopDate.toLocaleDateString()} 12:30 bis 21Uhr \n
		Wo?\n
		Leonardo Royal Hotel \n
		Augustaanlage 4\n
		68165 Mannheim, Deutschland\n
		\n
		Bitte finde Dich etwa 20 Minuten vor Beginn des Workshops im Foyer des Hotels ein. Der Dresscode ist Business.\n
		\n
		Solltest Du wider Erwarten doch nicht an einem Workshop teilnehmen können, so gib uns bitte schnellstmöglich Bescheid!\n
		Da wir die Workshopevaluation per QR Code durchführen werden, lade Dir bitte eine entsprechende Scanner App herunter.\n
		Bei weiteren Fragen kannst du Dich gerne unter info@symposium-mannheim.de melden!\n
		\n
		Beste Grüße \n`;
	}
	// Or send shorter mail for regular workshops
	return `
		Hallo ${studentPrename},
		\n
		\n
		Wir freuen uns Dich hiermit herzlich zum Workshop ${workshopName} des Unternehmens ${workshopCompany} einzuladen! \n
		Bei weiteren Fragen kannst du Dich gerne unter info@symposium-mannheim.de melden!\n
		Beste Grüße \n`;
}
