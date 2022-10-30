import { Workshop, WorkshopState } from '@prisma/client';

const dateTimeFormatter = new Intl.DateTimeFormat('de-DE'); // Change locale if necessary or leave empty for browser locale

export function prettyPrintDate(date: Date) {
	return dateTimeFormatter.format(date);
}

export function prettyPrintWorkshopDate(workshop: Workshop) {
	return prettyPrintDate(new Date(workshop.date));
}

export function prettyPrintWorkshopState(state: WorkshopState) {
	switch (state) {
		case WorkshopState.APPLICATION:
			return 'Bewerbungsphase';
		case WorkshopState.DONE:
			return 'Abgeschlossen';
		case WorkshopState.SELECTION:
			return 'Auswahlphase';
		case WorkshopState.UNPUBLISHED:
			return 'Unveröffentlicht';
		default:
			return state;
	}
}
