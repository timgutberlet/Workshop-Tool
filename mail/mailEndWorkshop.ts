export function getMailEndWorkshop() {
	return `
        Dein INTEGRAteam<br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>  
        INTEGRA e.V. Studentische Unternehmensberatung<br/>
        Schloss | 68131 Mannheim<br/>
        www.integra-ev.de<br/>
        <br/>
        Vertretungsberechtigter Vorstand: Julius Ahr, Samuel Spika, Tilo Schütz <br/>
        Registergericht: Mannheim | Registernummer: VR 1984 | Steuernummer: 38107 / 02668<br/>
        <br/>
        +=============================================================+<br/>
        Diese Nachricht und jeder übermittelte Anhang beinhaltet vertrauliche Informationen und ist nur für
        den Adressaten bestimmt. Wenn Sie diese E-Mail irrtümlich erhalten haben, informieren Sie bitte
        unverzüglich den Absender per E-Mail und löschen Sie diese E-Mail von Ihrem Computer. Danke.<br/>
        +=============================================================+<br/>
  `;
}

// Email text body – fallback for email clients that don't render HTML
export function getMailEndWorkshopText() {
	return `INTEGRA e.V. Studentische Unternehmensberatung \n Schloss | 68131 Mannheim \n www.integra-ev.de \n Vertretungsberechtigter Vorstand: Julius Ahr, Samuel Spika, Tilo Schütz \n Registergericht: Mannheim | Registernummer: VR 1984 | Steuernummer: 38107 / 02668 \n +=============================================================+ \n Diese Nachricht und jeder übermittelte Anhang beinhaltet vertrauliche Informationen und ist nur für den Adressaten bestimmt. Wenn Sie diese E-Mail irrtümlich erhalten haben, informieren Sie bitte unverzüglich den Absender per E-Mail und löschen Sie diese E-Mail von Ihrem Computer. Danke. \n +=============================================================+`;
}
