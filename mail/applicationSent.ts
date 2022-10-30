export function getApplicationSentMail(
	studentPrename: string,
	workshopName: string,
	workshopCompany: string,
	workshopDeadline: Date,
) {
	// Uses tables for layout and inline CSS due to email client limitations
	return `
        Hallo ${studentPrename}, <br/>
        <br/>
        vielen Dank für Deine Bewerbung bei dem von <font color="#ff8000">INTEGRA e.V.</font> veranstalteten Workshop. <br/>
        Du hast Dich für den Workshop "${workshopName}" der Firma ${workshopCompany} beworben.
        Wir werden Deine Bewerbung an ${workshopCompany} weiterleiten. Um alles weitere wird sich das Unternehmen kümmern.
        <br/>
        Du kannst Dich bis zum ${workshopDeadline.toLocaleDateString()} mit einer Mail an <a href="mailto:kooperationen@integra-ev.de">kooperationen@integra-ev.de</a> verbindlich wieder abmelden.<br/>
        <br/>
        <br/>
        Alle aktuellen News und Informationen findest Du auf:<br/>
        <a href="https://www.integra-ev.de">unserer Website</a>, <a href="https://www.instagram.com/integra_e.v/">Instagram</a> und auf <a href="https://www.linkedin.com/company/integra-e-v---studentische-unternehmensberatung/">LinkedIn</a>.<br/>
        <br/>
        Für Anmerkungen und Fragen bezüglich Deiner Bewerbung stehen wir Dir gerne unter <a href="mailto:info@integra-ev.de">info@integra-ev.de</a> zur Verfügung. Außerdem findest Du bereits viele Antworten in den FAQs auf unserer Homepage.
        <br/>
        Wir wünschen Dir viel Erfolg bei Deiner Bewerbung.
        <br/><br/>
        Viele Grüße aus Mannheim<br/>
          `;
}

// Email text body – fallback for email clients that don't render HTML
export function getApplicationSentMailText(
	studentPrename: string,
	workshopName: string,
	workshopCompany: string,
	workshopDeadline: Date,
) {
	return `
  Hallo${studentPrename}, \n
  vielen Dank für Deine Bewerbung bei dem von INTEGRA veranstalteten Workshop. \n
  Du hast Dich für den Workshop ${workshopName} der Firma${workshopCompany} beworben. 
  Wir werden Deine Bewerbung an${workshopCompany} weiterleiten. Um alles weitere wird sich das Unternehmen kümmern. \n  
  Du kannst Dich bis zum ${workshopDeadline.toLocaleDateString} mit einer Mail an kooperationen@integra-ev.de verbindlich wieder abmelden.\n
  Alle aktuellen News und Informationen findest Du auf: https://www.integra-ev.de, https://www.instagram.com/integra_e.v/ und auf https://www.linkedin.com/company/integra-e-v---studentische-unternehmensberatung/ \n 
  Für Anmerkungen und Fragen bezüglich Deiner Bewerbung stehen wir Dir gerne unter info@integra-ev.de zur Verfügung. \n 
  Außerdem findest Du bereits viele Antworten in den FAQs auf unserer Homepage. \n 
  Wir wünschen Dir viel Erfolg bei Deiner Bewerbung. \n 
  `;
}
