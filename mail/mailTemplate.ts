export function getMailFromTemplate(mailBody: string, mailClosing: string) {
	// Insert invisible space into email address to prevent both the
	// email address and the domain from being turned into a hyperlink by email
	// clients like Outlook and Apple mail, as this is confusing because it seems
	// like they are supposed to click on their email address to sign in.

	// Some simple styling options
	const backgroundColor = '#f9f9f9';
	const textColor = '#444444';
	const mainBackgroundColor = '#ffffff';

	// Uses tables for layout and inline CSS due to email client limitations
	return `
  <body style="background: ${backgroundColor};">
	<table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tr>
		<td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
		  <strong>INTEGRA e.V.</strong>
		</td>
	  </tr>
	</table>
	<table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
	  <tr>
		<td align="left" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        ${mailBody}<br/>
        ${mailClosing}<br/>
		<br/>
		<br/>
        INTEGRA e.V. Studentische Unternehmensberatung<br/>
        Schloss | 68131 Mannheim<br/>
        www.integra-ev.de<br/>
        <br/>
        ${process.env.VORSTAND_HTML}
        <br/>
        <p style="font-size: 12px">
          Diese Nachricht und jeder übermittelte Anhang beinhaltet vertrauliche Informationen und ist nur für
          den Adressaten bestimmt. Wenn Sie diese E-Mail irrtümlich erhalten haben, informieren Sie bitte
          unverzüglich den Absender per E-Mail und löschen Sie diese E-Mail von Ihrem Computer. Danke.<br/>
        </p>
        
		</td>
	  </tr>
	</table>
  </body>
  `;
}

export function getMailFromTemplateText(mailBody: string, mailClosing: string) {
	return `
        ${mailBody}\n
        ${mailClosing}\n
		\n
        INTEGRA e.V. Studentische Unternehmensberatung\n
        Schloss | 68131 Mannheim\n
        www.integra-ev.de\n
		\n
        ${process.env.VORSTAND_STRING}
		\n
        Diese Nachricht und jeder übermittelte Anhang beinhaltet vertrauliche Informationen und ist nur für
        den Adressaten bestimmt. Wenn Sie diese E-Mail irrtümlich erhalten haben, informieren Sie bitte
        unverzüglich den Absender per E-Mail und löschen Sie diese E-Mail von Ihrem Computer. Danke.\n
  `;
}
