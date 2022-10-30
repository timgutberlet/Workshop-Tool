import React, { ChangeEvent, FormEvent, FocusEvent, MouseEvent, useState } from 'react';
import { Col, Row } from 'react-bootstrap';

import isNumber from 'is-number';
import { FormElement } from '../signupForm';
import TextInputField from '../applicationFormComponents/textInputField';
import ApplicationFormButtons from '../applicationFormComponents/applicationFormButtons';

// typescript types for this step
export type AddressStateType = {
	streetAndHouseNumber: FormElement<string>;
	adressLineTwo: FormElement<string>;
	postalCode: FormElement<string>;
	city: FormElement<string>;
};

// typescript types for the props
type FormPersonalProps = {
	initialState: AddressStateType;
	// eslint-disable-next-line no-unused-vars
	nextCallback: (state: AddressStateType) => void;
	// eslint-disable-next-line no-unused-vars
	backCallback: (state: AddressStateType) => void;
};

// validate input field
const validateInputField = (value: string, fieldName: keyof AddressStateType): string => {
	switch (fieldName) {
		case 'streetAndHouseNumber':
			return value.trim() === '' ? 'Bitte gib deinen Straße und Hausnummer an' : '';
		case 'adressLineTwo':
			return '';
		case 'postalCode':
			if (value.trim() === '') {
				return 'Bitte gib deine Postleitzahl an';
			}
			if (!isNumber(value)) {
				return 'Bitte gib deine Postleitzahl als Zahl an';
			}
			if (!Number.isInteger(Number(value))) {
				return 'Bitte gib deine Postleitzahl als Zahl an.';
			}
			return '';
		case 'city':
			return value.trim() === '' ? 'Bitte gib deinen Stadt an' : '';
		default:
			return '';
	}
};

// default values
export const defaultAddressState: AddressStateType = {
	streetAndHouseNumber: {
		value: '',
		focusLost: false,
		errorMessage: validateInputField('', 'streetAndHouseNumber'),
	},
	adressLineTwo: {
		value: '',
		focusLost: false,
		errorMessage: validateInputField('', 'adressLineTwo'),
	},
	postalCode: { value: '', focusLost: false, errorMessage: validateInputField('', 'postalCode') },
	city: { value: '', focusLost: false, errorMessage: validateInputField('', 'city') },
};

export default function StepAddress(props: FormPersonalProps) {
	// the state variable
	const [addressState, setPersonalState] = useState(props.initialState);

	// next button clicked
	const onNext = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Check if all fields are validated
		if (
			addressState.streetAndHouseNumber.errorMessage === '' &&
			addressState.adressLineTwo.errorMessage === '' &&
			addressState.postalCode.errorMessage === '' &&
			addressState.city.errorMessage === ''
		) {
			// Go to the next page
			props.nextCallback(addressState);
		} else {
			// Set all fields to focus lost = true so that the error message get's shown
			setPersonalState((prevState) => ({
				...prevState,
				streetAndHouseNumber: {
					...prevState.streetAndHouseNumber,
					focusLost: true,
				},
				adressLineTwo: {
					...prevState.adressLineTwo,
					focusLost: true,
				},
				postalCode: {
					...prevState.postalCode,
					focusLost: true,
				},
				city: {
					...prevState.city,
					focusLost: true,
				},
			}));
		}
	};

	// back button clicked
	const onBack = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		props.backCallback(addressState);
	};

	// handle value change and update local state
	const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const name = e.target.name as keyof AddressStateType;

		setPersonalState((prevState) => ({
			...prevState,
			[name]: {
				...prevState[name],
				value: e.target.value,
				errorMessage: validateInputField(e.target.value, name),
			},
		}));
	};

	// handle focus lost
	const onFocusLost = (e: FocusEvent<HTMLInputElement>) => {
		const name = e.target.name as keyof AddressStateType;

		setPersonalState((prevState) => ({
			...prevState,
			[name]: {
				...prevState[name],
				focusLost: true,
			},
		}));
	};

	return (
		<form onSubmit={onNext}>
			<Row className="g-3 align-items-center">
				<Col xs={12} lg={6} className="mb-3">
					<TextInputField
						element={addressState.streetAndHouseNumber}
						name="streetAndHouseNumber"
						label="Straße und Hausnummer*"
						onInputChange={onInputChange}
						onFocusLost={onFocusLost}
					/>
				</Col>
				<Col xs={12} lg={6} className="mb-3">
					<TextInputField
						element={addressState.adressLineTwo}
						name="adressLineTwo"
						label="Adresszeile 2"
						onInputChange={onInputChange}
						onFocusLost={onFocusLost}
					/>
				</Col>
				<Col xs={12} lg={6} className="mb-3">
					<TextInputField
						element={addressState.postalCode}
						name="postalCode"
						label="Postleitzahl*"
						onInputChange={onInputChange}
						onFocusLost={onFocusLost}
					/>
				</Col>
				<Col xs={12} lg={6} className="mb-3">
					<TextInputField
						element={addressState.city}
						name="city"
						label="Stadt*"
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
