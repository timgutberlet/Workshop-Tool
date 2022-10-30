import React from 'react';
import { Button, Modal } from 'react-bootstrap';

export default function GdprModal(props: {
	visible: boolean;
	// eslint-disable-next-line no-unused-vars
	handleClose: (accepted: boolean) => void;
}) {
	return (
		<Modal show={props.visible} size="lg" scrollable>
			<Modal.Header>
				<Modal.Title>
					<h3>Datenschutzerklärung zur Workshop-Bewerbung</h3>
				</Modal.Title>
				{/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
				<button
					type="button"
					className="btn-close"
					aria-label="hide"
					onClick={() => props.handleClose(false)}
				/>
			</Modal.Header>
			<Modal.Body>
				<p>
					Vielen Dank für Dein Interesse an diesem Workshop.{' '}
					<em>Der Schutz Deiner persönlichen Daten ist uns sehr wichtig.</em> Daher
					informieren wir Dich nachfolgend über die Erhebung, Verarbeitung und Nutzung
					Deiner Daten im Rahmen der Online-Bewerbung, gemäß den einschlägigen
					Datenschutzvorschriften.
				</p>
				<h4>Datenerhebung</h4>
				<p>
					Im Zuge Deiner Bewerbung werden von uns die nachfolgend aufgezählten
					persönlichen Bewerbungsdaten von Dir erhoben und verarbeitet:
					<ul>
						<li>Name, Vorname</li>
						<li>Adresse</li>
						<li>Telefonnummer</li>
						<li>E-Mail</li>
						<li>Studienspezifische Informationen</li>
						<li>
							eventuelle Bewerbungsunterlagen (Bewerbungsschreiben, Lebenslauf,
							Zeugnisse, Zertifikate u.ä.)
						</li>
					</ul>
				</p>
				<h4>Zweck der Datenerfassung / Weitergabe</h4>
				<p>
					Die Erhebung und Verarbeitung Deiner persönlichen Bewerbungsdaten erfolgt
					ausschließlich zweckgebunden für die Zuweisung von Plätzen innerhalb des
					Workshops. Auf deine Daten hat grundsätzlich nur die für das konkrete
					Bewerbungsverfahren zuständige Stelle von INTEGRA sowie das den Workshop
					veranstaltende Unternehmen Zugriff. Eine darüber hinausgehende Nutzung oder
					Weitergabe Deiner Bewerbungsdaten an Dritte erfolgt nicht.
				</p>
				<h4>Aufbewahrungsdauer der Bewerbungsdaten</h4>
				<p>
					Eine Löschung Deiner persönlichen Bewerbungsdaten erfolgt grundsätzlich nach
					Abschluss des Bewerbungsverfahrens und Zuteilung der Teilnehmerplätze. Dies gilt
					nicht, sofern gesetzliche Bestimmungen einer Löschung entgegenstehen, die
					weitere Speicherung zum Zwecke der Beweisführung erforderlich ist oder Du einer
					längeren Speicherung ausdrücklich zugestimmt hast.
				</p>
				<h4>Datensicherheit</h4>
				<p>
					Um die im Rahmen Deiner Bewerbung erhobenen Daten vor Manipulationen und
					unberechtigten Zugriffen zu schützen haben wir diverse technische und
					organisatorische Vorkehrungen getroffen. Insbesondere erfolgt die Übertragung
					Deiner Bewerbung verschlüsselt gemäß dem aktuell anerkannten Stand der Technik.
				</p>
				<h4>Auskunftsrecht</h4>
				<p>
					Solltest Du Fragen zur Erhebung, Verarbeitung oder Nutzung Deiner
					personenbezogenen Daten haben, oder in Fällen von Auskünften, Berichtigung oder
					Löschung von Daten, sowie Widerruf erteilter Einwilligungen, wende Dich bitte an
					unsere Datenschutzkoordinatorin:
					<br />
					Julia Karlinski
					<br />
					Datenschutzkoordinatorin – INTEGRA e.V.
					<br />
					Email{' '}
					<a href="mailto:julia.karlinski@integra-ev.de?subject=DSGVO%20Anfrage%20Workshoptool">
						julia.karlinski@integra-ev.de
					</a>
					<br />
				</p>
				<h4>Allgemeine Datenschutzhinweise</h4>
				<p>
					Bitte beachte auch unsere allgemeinen Datenschutzhinweise für weitere
					Informationen im Hinblick auf die Nutzung unseres Webauftrittes.
				</p>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={() => props.handleClose(false)}>
					Schließen
				</Button>
				<Button variant="primary" onClick={() => props.handleClose(true)}>
					Zustimmen
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
