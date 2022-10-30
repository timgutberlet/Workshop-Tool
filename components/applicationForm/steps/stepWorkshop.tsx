import { Workshop } from '@prisma/client';
import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { FormElement } from '../signupForm';

import WorkshopTile from '../applicationFormComponents/workshopTile';

// typescript types for this step
export type WorkshopStateType = {
	workshops: FormElement<number[]>;
};

// typescript types for the props
type FormWorkshopProps = {
	initialState: WorkshopStateType;
	// eslint-disable-next-line no-unused-vars
	nextCallback: (state: WorkshopStateType) => void;
	workshops: Workshop[];
};

// validate input field
const validateInputField = (value: any, fieldName: string): string => {
	switch (fieldName) {
		case 'workshops':
			return value.length <= 0 ? 'Bitte mindestens einen Workshop auswählen' : '';
		default:
			console.error(`err unkown field validator: ${fieldName}`);
			return '';
	}
};

// default values
export const defaultWorkshopState: WorkshopStateType = {
	workshops: { value: [], focusLost: false, errorMessage: validateInputField([], 'workshops') },
};

export default function StepWorkshop(props: FormWorkshopProps) {
	// the state variable
	const [workshopState, setWorkshopState] = useState(props.initialState);

	// next button clicked
	const onNext = (e: any) => {
		e.preventDefault();

		// Check if all fields are validated
		if (workshopState.workshops.errorMessage === '') {
			// Go to the next page
			props.nextCallback(workshopState);
		} else {
			// Set all fields to focus lost = true so that the error message get's shown (only on production)
			setWorkshopState((prevState) => ({
				...prevState,
				workshops: {
					...prevState.workshops,
					focusLost: true,
				},
			}));
		}
	};

	// toggle a workshop to be selected
	// handle value change and update local state
	const toggleWorkshopSelected = (id: number) => {
		setWorkshopState((prevState) => ({
			...prevState,
			workshops: {
				...prevState.workshops,
				// does the workshop contains the id
				value: prevState.workshops.value.includes(id)
					? // if yes then remove it
					  [...prevState.workshops.value].filter((item) => item !== id)
					: // otherwise add it
					  [...prevState.workshops.value, id],
				focusLost: true,
				errorMessage: validateInputField(
					prevState.workshops.value.includes(id)
						? // if yes then remove it
						  [...prevState.workshops.value].filter((item) => item !== id)
						: // otherwise add it
						  [...prevState.workshops.value, id],
					'workshops',
				),
			},
		}));
	};

	const getWorkshopCountMessage = () => {
		if (workshopState.workshops.value.length === 0) {
			if (workshopState.workshops.focusLost) {
				return (
					<span className="text-danger">Bitte wähle mindestens einen Workshop aus</span>
				);
			}
			return <span className="text-muted">Keine Workshops ausgewählt</span>;
		}

		if (workshopState.workshops.value.length === 1) {
			return '1 Workshop ausgewählt';
		}

		return `${workshopState.workshops.value.length} Workshops ausgewählt`;
	};

	return (
		<form onSubmit={onNext}>
			{props.workshops.length !== 0 ? (
				<>
					<Row className="justify-content-center">
						{props.workshops.map((workshop: Workshop) => (
							<Col
								key={workshop.id}
								className="text-center my-4"
								xs={12}
								md={6}
								xl={4}
							>
								<WorkshopTile
									workshop={workshop}
									selected={workshopState.workshops.value.includes(workshop.id)}
									onChange={toggleWorkshopSelected}
								/>
							</Col>
						))}
					</Row>
					<Row className="mt-3">
						<Col xs={12} className="text-center">
							<button
								className="btn btn-integra btn-lg text-white fw-bold"
								type="submit"
							>
								Weiter
							</button>
						</Col>
					</Row>
					<Row className="mt-3">
						<Col xs={12} className="text-center">
							{getWorkshopCountMessage()}
						</Col>
					</Row>
				</>
			) : (
				<Row className="justify-content-center">
					Zurzeit sind keine Workshops ausgeschrieben
				</Row>
			)}
		</form>
	);
}
