import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';

import { FormElement } from '../signupForm';
import TextInputField from '../applicationFormComponents/textInputField';
import ApplicationFormButtons from '../applicationFormComponents/applicationFormButtons';

import isEmail from '../../../lib/validators/isEmail';

// typescript types for this step
export type PersonalStateType = {
	firstName: FormElement<string>;
	lastName: FormElement<string>;
	email: FormElement<string>;
};

// typescript types for the props
type FormPersonalProps = {
	initialState: PersonalStateType;
	// eslint-disable-next-line no-unused-vars
	nextCallback: (state: PersonalStateType) => void;
	// eslint-disable-next-line no-unused-vars
	backCallback: (state: PersonalStateType) => void;
};

// validate input field
const validateInputField = (value: any, fieldName: string): string => {
	switch (fieldName) {
		case 'firstName':
			return value.trim() === '' ? 'Bitte gib deinen Vornamen an' : '';
		case 'lastName':
			return value.trim() === '' ? 'Bitte gib deinen Nachnamen an' : '';
		case 'email':
			if (value.trim() === '') {
				return 'Bitte gib deine E-Mail Adresse an';
			}
			if (!isEmail(value)) {
				return 'Bitte gib eine gültige E-Mail Adresse an';
			}
			return '';
		default:
			return '';
	}
};

// default values
export const defaultPersonalState: PersonalStateType = {
	firstName: { value: '', focusLost: false, errorMessage: validateInputField('', 'firstName') },
	lastName: { value: '', focusLost: false, errorMessage: validateInputField('', 'lastName') },
	email: { value: '', focusLost: false, errorMessage: validateInputField('', 'email') },
};

export default function StepPersonal(props: FormPersonalProps) {
	// the state variable
	const [personalState, setPersonalState] = useState(props.initialState);

	// next button clicked
	const onNext = (e: any) => {
		e.preventDefault();

		// Check if all fields are validated
		if (
			personalState.firstName.errorMessage === '' &&
			personalState.lastName.errorMessage === '' &&
			personalState.email.errorMessage === ''
		) {
			// Go to the next page
			props.nextCallback(personalState);
		} else {
			// Set all fields to focus lost = true so that the error message get's shown
			setPersonalState((prevState) => ({
				...prevState,
				firstName: {
					...prevState.firstName,
					focusLost: true,
				},
				lastName: {
					...prevState.lastName,
					focusLost: true,
				},
				email: {
					...prevState.email,
					focusLost: true,
				},
			}));
		}
	};

	// back button clicked
	const onBack = (e: any) => {
		e.preventDefault();
		props.backCallback(personalState);
	};

	// handle value change and update local state
	const onInputChange = (e: any) => {
		setPersonalState((prevState) => ({
			...prevState,
			[e.target.name]: {
				// @ts-ignore
				...prevState[e.target.name],
				value: e.target.value,
				errorMessage: validateInputField(e.target.value, e.target.name),
			},
		}));
	};

	// handle focus lost
	const onFocusLost = (e: any) => {
		setPersonalState((prevState) => ({
			...prevState,
			[e.target.name]: {
				// @ts-ignore
				...prevState[e.target.name],
				focusLost: true,
			},
		}));
	};

	return (
		<form onSubmit={onNext}>
			<Row className="g-3 align-items-center">
				<Col xs={12} lg={6} className="mb-3">
					<TextInputField
						element={personalState.firstName}
						name="firstName"
						label="Vorname*"
						onInputChange={onInputChange}
						onFocusLost={onFocusLost}
					/>
				</Col>
				<Col xs={12} lg={6} className="mb-3">
					<TextInputField
						element={personalState.lastName}
						name="lastName"
						label="Nachname*"
						onInputChange={onInputChange}
						onFocusLost={onFocusLost}
					/>
				</Col>
				<Col xs={12} lg={6} className="mb-3">
					<TextInputField
						element={personalState.email}
						name="email"
						label="E-Mail*"
						onInputChange={onInputChange}
						onFocusLost={onFocusLost}
					/>
				</Col>
			</Row>
			<Row>
				<Col xs={12}>
					<ApplicationFormButtons onBack={onBack} />
				</Col>
			</Row>
		</form>
	);
}
