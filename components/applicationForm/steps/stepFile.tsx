import React, { FormEvent, useState, MouseEvent, ChangeEvent } from 'react';
import { Col, Row } from 'react-bootstrap';
import ApplicationFormButtons from '../applicationFormComponents/applicationFormButtons';
import FileInputField from '../applicationFormComponents/fileInputField';
import { FormElement } from '../signupForm';

// typescript types for this step
export type FileStateType = {
	cv: FormElement<File | null>;
	cvUrl: FormElement<string>;
	grades: FormElement<File | null>;
	gradesUrl: FormElement<string>;
};

// validate input field
const validateInputField = (value: File, fieldName: keyof FileStateType): string => {
	switch (fieldName) {
		case 'cv':
			if (value == null) {
				return 'Bitte lade dein Lebenslauf als .pdf hoch (kleiner 2 MB)';
			}
			if (value.size > 5_300_000) {
				return `Die maximal erlaubte Dateigröße ist 5 MB. Deine Datei ist aber ${
					Math.round(value.size / 1048.576) / 1000
				} MB groß!`;
			}
			if (value.type !== 'application/pdf') {
				return 'Nur .pdf Dateien sind erlaubt!';
			}
			return '';
		case 'grades':
			if (value == null) {
				return 'Bitte lade dein Notenauszug als .pdf hoch (kleiner 2 MB)';
			}
			if (value.size > 5_300_000) {
				return `Die maximal erlaubte Dateigröße ist 5 MB. Deine Datei ist aber ${
					Math.round(value.size / 1048.576) / 1000
				} MB groß!`;
			}
			if (value.type !== 'application/pdf') {
				return 'Nur .pdf Dateien sind erlaubt!';
			}
			return '';
		case 'cvUrl':
			// no validation necessary since this is only needed clientside
			return '';
		case 'gradesUrl':
			// no validation necessary since this is only needed clientside
			return '';
		default:
			console.error(`Unknown field validator: ${fieldName}`);
			return '';
	}
};

// default values
export const defaultFileState: FileStateType = {
	cv: { value: null, focusLost: false, errorMessage: validateInputField(null, 'cv') },
	cvUrl: { value: '', focusLost: false, errorMessage: '' }, // no validation necessary
	grades: { value: null, focusLost: false, errorMessage: validateInputField(null, 'grades') },
	gradesUrl: { value: '', focusLost: false, errorMessage: '' }, // no validation necessary
};

// typescript types for the props
type FormFileProps = {
	initialState: FileStateType;
	// eslint-disable-next-line no-unused-vars
	nextCallback: (state: FileStateType) => void;
	// eslint-disable-next-line no-unused-vars
	backCallback: (state: FileStateType) => void;
};

export default function StepFile(props: FormFileProps) {
	// the state variable
	const [fileState, setFileState] = useState(props.initialState);

	// next button clicked
	const onNext = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Check if all fields are validated (the URL fields are dependent on the other 2 fields and are only here for the cosmetic display and not the final submit)
		if (fileState.cv.errorMessage === '' && fileState.grades.errorMessage === '') {
			props.nextCallback(fileState);
		} else {
			// Set all fields to focus lost = true so that the error message get's shown
			setFileState((prevState) => ({
				...prevState,
				cv: {
					...prevState.cv,
					focusLost: true,
				},
				grades: {
					...prevState.grades,
					focusLost: true,
				},
			}));
		}
	};

	// back button clicked
	const onBack = (e: MouseEvent<HTMLButtonElement>): void => {
		e.preventDefault();
		props.backCallback(fileState);
	};

	// handle value change and update local state
	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const newFile = e.target.files[0];

			const name = e.target.name as keyof FileStateType;
			const urlName = `${name}Url`;

			setFileState((prevState) => ({
				...prevState,
				[name]: {
					...prevState[name],
					value: newFile,
					focusLost: true,
					errorMessage: validateInputField(newFile, name),
				},
				[urlName]: {
					...prevState[urlName],
					value: URL.createObjectURL(newFile),
					focusLost: true,
				},
			}));
		}
	};

	return (
		<form onSubmit={onNext}>
			<Row className="g-3 align-items-top">
				<Col xs={12} lg={6} className="mb-3">
					<FileInputField
						element={fileState.cv}
						name="cv"
						label="Lebenslauf*"
						onChange={handleFileChange}
					/>
				</Col>
				<Col xs={12} lg={6} className="mb-3">
					<FileInputField
						element={fileState.grades}
						name="grades"
						label="Notenauszug*"
						onChange={handleFileChange}
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
