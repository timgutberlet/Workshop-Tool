export function getLoginEmailHtml(url: string, email: string) {
	// Insert invisible space into email address to prevent both the
	// email address and the domain from being turned into a hyperlink by email
	// clients like Outlook and Apple mail, as this is confusing because it seems
	// like they are supposed to click on their email address to sign in.
	const escapedEmail = `${email.replace(/\./g, '&#8203;.')}`;

	// Some simple styling options
	const backgroundColor = '#f9f9f9';
	const textColor = '#444444';
	const mainBackgroundColor = '#ffffff';
	const buttonBackgroundColor = '#ff8000';
	const buttonBorderColor = '#ff8000';
	const buttonTextColor = '#ffffff';

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
		<td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
		  Jetzt als <strong>${escapedEmail}</strong> anmelden
		</td>
	  </tr>
	  <tr>
		<td align="center" style="padding: 20px 0;">
		  <table border="0" cellspacing="0" cellpadding="0">
			<tr>
			  <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; text-decoration: none;border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Anmelden</a></td>
			</tr>
		  </table>
		</td>
	  </tr>
	</table>
  </body>
  `;
}

// Email text body – fallback for email clients that don't render HTML
export function getLoginEmailText(url: string) {
	return `Jetzt bei INTEGRA e.V. anmelden\n${url}\n\n`;
}
