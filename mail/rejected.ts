export function getRejectedEmailHTML(
	studentPrename: string,
	workshopName: string,
	workshopCompany: string,
) {
	// Uses tables for layout and inline CSS due to email client limitations
	return `
        Hallo ${studentPrename},
        <br/>
        <br/>
        vielen Dank für Dein Interesse am Workshop
        <b> ${workshopName} </b> des Unternehmens <b>${workshopCompany}</b>.
        Leider müssen wir Dir mitteilen, dass wir für Dich keine Einladung zum Workshop erhalten haben. Diese Entscheidung obliegt dabei alleine dem teilnehmenden Unternehmen und wir haben darauf keinen Einfluss. <br/>
        <br/>
        Wir wünschen Dir alles Gute für Dein weiteres Studium, und freuen uns, wenn Du Dich nochmal auf einen von <font color="#ff8000">INTEGRA</font> organisierten Workshop bewirbst! <br/>
        <br/>
        Beste Grüße <br/>
     
  `;
}

// Email text body – fallback for email clients that don't render HTML
export function getRejectedEmailText(
	studentPrename: string,
	workshopName: string,
	workshopCompany: string,
) {
	return `Hallo ${studentPrename}, \n
	vielen Dank für Dein Interesse am Workshop ${workshopName} des Unternehmens ${workshopCompany}.
	Leider müssen wir Dir mitteilen, dass wir für Dich keine Einladung zum Workshop erhalten haben. Diese Entscheidung obliegt dabei alleine den teilnehmenden Unternehmen und wir haben darauf keinen Einfluss. \n
	Wir wünschen Dir alles Gute für Dein weiteres Studium, und freuen uns, wenn Du Dich nochmal auf einen von <font color="#ff8000">INTEGRA e.V.</font> organisierten Workshop bewirbst! \n
	Beste Grüße \n`;
}
