import React, { useState } from 'react';
import isNumber from 'is-number';
import { Degree, Major, University } from '@prisma/client';

import { Col, Row } from 'react-bootstrap';
import { FormElement } from '../signupForm';
import ApplicationFormButtons from '../applicationFormComponents/applicationFormButtons';
import TextInputField from '../applicationFormComponents/textInputField';
import SelectInputField from '../applicationFormComponents/selectInputField';

// typescript types for this step
export type UniversityStateType = {
	university: FormElement<string>;
	semester: FormElement<string>;
	degreeName: FormElement<string>;
	majorName: FormElement<string>;
	abiGpa: FormElement<string>;
	gpa: FormElement<string>;
};

// validate input field
const validateInputField = (value: any, fieldName: string): string => {
	switch (fieldName) {
		case 'university':
			return value.trim() === '' || value === 'Bitte auswählen'
				? 'Bitte gib deinen Universität an'
				: '';
		case 'semester':
			if (value.trim() === '') {
				return 'Bitte gib dein Semester an';
			}
			if (!isNumber(value)) {
				return 'Bitte gib dein Semester als Zahl an';
			}
			if (!Number.isInteger(Number(value))) {
				return 'Bitte gib dein Semester als Ganzzahl an.';
			}
			if (value <= 0 || value >= 100) {
				return 'Ungültiges Semester! Nur Semester 0 bis 100 sind erlaubt!';
			}
			return '';
		case 'degreeName':
			return value.trim() === '' || value === 'Bitte auswählen'
				? 'Bitte gib deinen Abschluss an'
				: '';
		case 'majorName':
			return value.trim() === '' || value === 'Bitte auswählen'
				? 'Bitte gib deinen Studiengang an'
				: '';
		case 'abiGpa':
			if (value.trim() === '' || value === 'Bitte auswählen') {
				return 'Bitte gib deine Abiturnote an';
			}
			if (!isNumber(value)) {
				return `Bitte gib deine Abiturnote im Format "X.X" an (bspw. 2.3)`;
			}
			if (value < 0.7 || value > 6) {
				return 'Der Abiturdurschnitt muss zwischen 0.7 bis 6.0 sein!';
			}
			return '';

		case 'gpa':
			if (value.trim() === '' || value === 'Bitte auswählen') {
				return 'Bitte gib deinen aktuellen Notendurchschnitt an';
			}
			if (!isNumber(value)) {
				return `Bitte gib deinen aktuellen Notendurchschnitt im Format "X.X" an (bspw. 2.3)`;
			}
			if (value < 0.7 || value > 6) {
				return 'Der Notendurchschnitt muss zwischen 0.7 bis 6.0 sein!';
			}
			return '';
		default:
			return '';
	}
};

// default values
export const defaultUniversityState: UniversityStateType = {
	university: { value: '', focusLost: false, errorMessage: validateInputField('', 'university') },
	semester: { value: '', focusLost: false, errorMessage: validateInputField('', 'semester') },
	degreeName: { value: '', focusLost: false, errorMessage: validateInputField('', 'degreeName') },
	majorName: { value: '', focusLost: false, errorMessage: validateInputField('', 'majorName') },
	abiGpa: { value: '', focusLost: false, errorMessage: validateInputField('', 'abiGpa') },
	gpa: { value: '', focusLost: false, errorMessage: validateInputField('', 'gpa') },
};

export default function StepUniversity(props: {
	initialState: UniversityStateType;
	// eslint-disable-next-line no-unused-vars
	nextCallback: (state: UniversityStateType) => void;
	// eslint-disable-next-line no-unused-vars
	backCallback: (state: UniversityStateType) => void;
	degrees: Degree[];
	majors: Major[];
	universities: University[];
}) {
	// the state variable
	const [universityState, setUniversityState] = useState(props.initialState);

	// next button clicked
	const onNext = (e: any) => {
		e.preventDefault();

		// Check if all fields are validated
		if (
			universityState.university.errorMessage === '' &&
			universityState.semester.errorMessage === '' &&
			universityState.degreeName.errorMessage === '' &&
			universityState.majorName.errorMessage === '' &&
			universityState.abiGpa.errorMessage === '' &&
			universityState.gpa.errorMessage === ''
		) {
			// Go to the next page
			props.nextCallback(universityState);
		} else {
			// Set all fields to focus lost = true so that the error message get's shown
			setUniversityState((prevState) => ({
				...prevState,
				university: {
					...prevState.university,
					focusLost: true,
				},
				semester: {
					...prevState.semester,
					focusLost: true,
				},
				degreeName: {
					...prevState.degreeName,
					focusLost: true,
				},
				majorName: {
					...prevState.majorName,
					focusLost: true,
				},
				abiGpa: {
					...prevState.abiGpa,
					focusLost: true,
				},
				gpa: {
					...prevState.gpa,
					focusLost: true,
				},
			}));
		}
	};

	// back button clicked
	const onBack = (e: any) => {
		e.preventDefault();
		props.backCallback(universityState);
	};

	// handle value change and update local state
	const onInputChange = (e: any) => {
		setUniversityState((prevState) => ({
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
		setUniversityState((prevState) => ({
			...prevState,
			[e.target.name]: {
				...prevState[e.target.name],
				focusLost: true,
			},
		}));
	};

	return (
		<form onSubmit={onNext}>
			<Row className="g-3 align-items-center">
				<Col xs={12} lg={6} className="mb-0 mb-lg-1">
					<SelectInputField
						element={universityState.university}
						name="university"
						label="Universität*"
						options={props.universities.map((universities: University) => ({
							label: universities.name,
							value: universities.name,
						}))}
						onInputChange={onInputChange}
						onFocusLost={onFocusLost}
					/>
				</Col>
				<Col xs={12} lg={6} className="mb-0 mb-lg-1">
					<TextInputField
						element={universityState.semester}
						name="semester"
						label="Semester*"
						onInputChange={onInputChange}
						onFocusLost={onFocusLost}
					/>
				</Col>
				<Col xs={12} lg={6} className="mb-0 mb-lg-1">
					<SelectInputField
						element={universityState.degreeName}
						name="degreeName"
						label="Abschluss*"
						options={props.degrees.map((degrees) => ({
							label: degrees.name,
							value: degrees.name,
						}))}
						onInputChange={onInputChange}
						onFocusLost={onFocusLost}
					/>
				</Col>
				<Col xs={12} lg={6} className="mb-0 mb-lg-1">
					<SelectInputField
						element={universityState.majorName}
						name="majorName"
						label="Studiengang*"
						options={props.majors.map((major) => ({
							label: major.name,
							value: major.name,
						}))}
						onInputChange={onInputChange}
						onFocusLost={onFocusLost}
					/>
				</Col>
				<Col xs={12} lg={6} className="mb-0 mb-lg-1">
					<TextInputField
						element={universityState.abiGpa}
						name="abiGpa"
						label="Abitur Note*"
						onInputChange={onInputChange}
						onFocusLost={onFocusLost}
					/>
				</Col>
				<Col xs={12} lg={6} className="mb-0 mb-lg-1">
					<TextInputField
						element={universityState.gpa}
						name="gpa"
						label="Aktueller Notendurchschnitt*"
						onInputChange={onInputChange}
						onFocusLost={onFocusLost}
					/>
				</Col>
			</Row>
			<Row>
				<Col xs={12} style={{ marginTop: 15 }}>
					<ApplicationFormButtons onBack={onBack} />
				</Col>
			</Row>
		</form>
	);
}
