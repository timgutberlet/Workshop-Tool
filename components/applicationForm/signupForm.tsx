import React, { useState } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import JSX from 'react-dom';
import ReactGA from 'react-ga4';

import { Degree, Major, Source, University, Workshop } from '@prisma/client';

import { Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { EventAttributes } from 'ics';
import StepPersonal, { defaultPersonalState, PersonalStateType } from './steps/stepPersonal';
import StepUniversity, {
	defaultUniversityState,
	UniversityStateType,
} from './steps/stepUniversity';
import StepWorkshop, { defaultWorkshopState, WorkshopStateType } from './steps/stepWorkshop';
import StepFile, { defaultFileState, FileStateType } from './steps/stepFile';
import StepMarketing, { defaultMarketingState, MarketingStateType } from './steps/stepMarketing';

import LoadingIcon from '../../public/icons/loading.gif';
import ErrorIcon from '../../public/icons/error.webp';
import SuccessIcon from '../../public/icons/okay.webp';
import FormProgressBar from './applicationFormComponents/formProgressBar';
import StepAddress, { AddressStateType, defaultAddressState } from './steps/stepAddress';

const ics = require('ics');

// A form element field
export type FormElement<T> = {
	value: T; // Value of the element
	focusLost: boolean; // Has the focus been lost
	errorMessage: string; // Error message for this element
};

// The complete FormStates type
export type FormState = {
	currentStep: number;
	sendingForm: boolean;
	sendingFormSuccess: boolean;
	sendingFormErrorMessage: string;
	stepWorkshop: WorkshopStateType;
	stepPersonal: PersonalStateType;
	stepAddress: AddressStateType;
	stepUniversity: UniversityStateType;
	stepFile: FileStateType;
	stepMarketing: MarketingStateType;
};

// The steps of the form (readonly). This needs to be named EXACTLY as the entry in defaultFormState
export const formSteps: readonly string[] = Object.freeze([
	'stepWorkshop',
	'stepPersonal',
	'stepAddress',
	'stepUniversity',
	'stepFile',
	'stepMarketing',
]);

// Labels that get displayed in the progress bar
export const formStepLabels: readonly string[] = Object.freeze([
	'Workshops Auswählen',
	'Persönliche Daten',
	'Adress Angaben',
	'Universität Angaben',
	'Lebenslauf Upload',
	'Weitere Angaben',
]);

// Total number of form steps
const totalFormStepsNumber: number = formSteps.length;

// Full form default state. This uses the imports of the steps.
const defaultFormState: FormState = {
	currentStep: 0, // Tip: Use this for debugging a specific step
	sendingForm: false,
	sendingFormSuccess: false,
	sendingFormErrorMessage: '',
	stepWorkshop: defaultWorkshopState,
	stepPersonal: defaultPersonalState,
	stepAddress: defaultAddressState,
	stepUniversity: defaultUniversityState,
	stepFile: defaultFileState,
	stepMarketing: defaultMarketingState,
};

// Downloads the passed string as ICS file
const downloadIcsFile = (fileName: string, content: string) => {
	const element = document.createElement('a');
	element.setAttribute('href', `data:text/calendar;charset=utf-8,${encodeURIComponent(content)}`);
	element.setAttribute('download', `${fileName}.ics`);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
};

// Creates the event attributes for a given workshop - used for ics calendar download
const createWorkshopEvent = (workshop: Workshop): EventAttributes => {
	const startDate = new Date(workshop.date);
	return {
		start: [
			startDate.getFullYear(),
			startDate.getMonth(),
			startDate.getDay(),
			startDate.getHours(),
			startDate.getMinutes(),
		],
		duration: { hours: 1 },
		title: `Blocker Workshop "${workshop.name}"`,
		description: `Blocker für den Workshop "${workshop.name}"\nWorkshop Beschreibung:\n${workshop.description}`,
		busyStatus: 'BUSY',
	};
};

export default function SignupForm(props: {
	workshops: Workshop[];
	degrees: Degree[];
	majors: Major[];
	universities: University[];
	marketingSources: Source[];
}) {
	// the global state of this form
	const [formState, setFormState] = useState(defaultFormState);

	// send a request to the server to submit the form
	const submitForm = async () => {
		ReactGA.event({
			category: 'User',
			action: 'submit clicked',
			value: formState.currentStep,
		});

		// The request body
		const body = new FormData();

		// collect all form elements and values
		formSteps.forEach((formStep) => {
			// foreach step in the form
			// @ts-ignore
			Object.keys(formState[formStep]).forEach((formElement) => {
				// @ts-ignore
				body.append(formElement, formState[formStep][formElement].value);
			});
		});

		// Re Captcha
		// @ts-ignore
		const captchaToken = await window.grecaptcha
			.execute('6LeyQ3YcAAAAABl9Yvh3dDx9kHHZ83fliyCjzPyG', {
				action: 'submit',
			})
			.then((myToken) => {
				return myToken;
			});
		body.append('reCaptchaToken', captchaToken);

		// Send the POST request
		const result = await fetch('/api/public/applies', {
			method: 'POST',
			body,
		});

		// Update state with either an error message or the sucess flag
		if (result.status === 200) {
			ReactGA.event({
				category: 'User',
				action: 'submit sucsess',
			});

			setFormState((prevState) => ({
				...prevState,
				sendingForm: false,
				sendingFormSuccess: true,
				sendingFormErrorMessage: '',
			}));
		} else {
			const errorMessage = `${result.status} ${result.statusText} ${await result.text()}`;
			setFormState((prevState) => ({
				...prevState,
				sendingForm: false,
				sendingFormSuccess: false,
				sendingFormErrorMessage: errorMessage,
			}));

			ReactGA.event({
				category: 'User',
				action: 'submit failed',
				value: result.status,
			});
		}
	};

	// Handle the user clicking on the next button and transferring the state of the step to the global state.
	const handleNext = (state: any) => {
		ReactGA.event({
			category: 'User',
			action: 'next clicked',
			value: formState.currentStep,
		});

		if (formState.currentStep + 1 === totalFormStepsNumber) {
			// handle next if this is the last step of the form
			setFormState((prevState) => ({
				...prevState,
				[formSteps[prevState.currentStep]]: state,
				currentStep: prevState.currentStep + 1,
				// updating the sending form here isn't currently needed but I added it anyways if we want to implement a try to send again feature in the future.
				sendingForm: false,
				sendingFormSuccess: false,
				sendingFormErrorMessage: '',
			}));
		} else {
			// handle next if this is NOT the last step of the form
			setFormState((prevState) => ({
				...prevState,
				[formSteps[prevState.currentStep]]: state,
				currentStep: prevState.currentStep + 1,
			}));
		}
	};

	// Handle the user clicking on the back button and transferring the state of the step to the global state
	const handleBack = (state: any): void => {
		ReactGA.event({
			category: 'User',
			action: 'back clicked',
			value: formState.currentStep,
		});

		// Check if this is the first step
		if (formState.currentStep <= 0) {
			return;
		}

		// Move to previous step and save the loacal state changes in global state
		setFormState((prevState) => ({
			...prevState,
			currentStep: prevState.currentStep - 1,
			[formSteps[prevState.currentStep]]: state,
		}));
	};

	// Download for the ics calendar file
	const downloadIcsBtnClicked = () => {
		ReactGA.event({
			category: 'User',
			action: 'download ics',
			value: formState.currentStep,
		});

		const selectedWorkshops = props.workshops.filter((workshop) =>
			formState.stepWorkshop.workshops.value.includes(workshop.id),
		);

		const events: Array<EventAttributes> = selectedWorkshops.map((workshop) =>
			createWorkshopEvent(workshop),
		);

		ics.createEvents(events, (error, value) => {
			if (!error) {
				downloadIcsFile('Workshop Termin', value);
			} else {
				// eslint-disable-next-line no-alert
				alert('Termin konnte leider nicht erstellt werden');
			}
		});
	};

	// Responsible for showing the submit status error/loading/sucess and calling the submit method if it hasn't been called already
	const getSubmitInfo = (): JSX.Element => {
		// If there is an error message display it
		if (formState.sendingFormErrorMessage !== '') {
			return (
				<>
					<Row>
						<Col xs={12}>
							<h2>Entschuldigung. Leider ist ein Fehler aufgetreten.</h2>
							<p>
								Bitte kontaktiere unseren Support.
								<br />
								Fehlermeldung: &quot;{formState.sendingFormErrorMessage}&quot;
							</p>
						</Col>
					</Row>
					<Row>
						<Col xs={12} className="d-flex justify-content-center">
							<Image alt="Error" src={ErrorIcon} />
						</Col>
					</Row>
				</>
			);
		}

		// If the form has been successfully sent return a success message
		if (formState.sendingFormSuccess) {
			return (
				<>
					<Row>
						<Col xs={12} xl={10}>
							<h2>Danke für deine Bewerbung. Wir freuen uns auf dich! </h2>
						</Col>
						<Col xs={12} xl={2}>
							<button
								type="button"
								className="btn btn-primary text-right"
								onClick={downloadIcsBtnClicked}
							>
								Termin Download <FontAwesomeIcon icon={faCalendarDays} />
							</button>
						</Col>
					</Row>
					<Row>
						<Col xs={12} className="d-flex justify-content-center">
							<Image alt="Success" src={SuccessIcon} />
						</Col>
					</Row>
				</>
			);
		}

		// If the form is not already sending send a request
		if (!formState.sendingForm) {
			submitForm();
		}

		// Return the loading icon
		return (
			<Row>
				<Col xs={12} className="d-flex justify-content-center">
					<Image alt="Loading" src={LoadingIcon} />
				</Col>
			</Row>
		);
	};

	// Returns the form steps and the forms final submit step
	const getFormStep = (step: number): JSX.Element => {
		switch (step) {
			case 0:
				return (
					<StepWorkshop
						initialState={formState.stepWorkshop}
						nextCallback={handleNext}
						workshops={props.workshops}
					/>
				);
			case 1:
				return (
					<StepPersonal
						initialState={formState.stepPersonal}
						nextCallback={handleNext}
						backCallback={handleBack}
					/>
				);
			case 2:
				return (
					<StepAddress
						initialState={formState.stepAddress}
						nextCallback={handleNext}
						backCallback={handleBack}
					/>
				);
			case 3:
				return (
					<StepUniversity
						initialState={formState.stepUniversity}
						nextCallback={handleNext}
						backCallback={handleBack}
						degrees={props.degrees}
						majors={props.majors}
						universities={props.universities}
					/>
				);
			case 4:
				return (
					<StepFile
						initialState={formState.stepFile}
						nextCallback={handleNext}
						backCallback={handleBack}
					/>
				);
			case 5:
				return (
					<StepMarketing
						initialState={formState.stepMarketing}
						nextCallback={handleNext}
						backCallback={handleBack}
						marketingSources={props.marketingSources}
					/>
				);
			case 6:
				return getSubmitInfo();
			default:
				return (
					<span>Entschuldigung. Leider ist ein Fehler aufgetreten! Fehler: F-{step}</span>
				);
		}
	};

	return (
		<>
			<Script src="https://www.google.com/recaptcha/api.js?render=6LeyQ3YcAAAAABl9Yvh3dDx9kHHZ83fliyCjzPyG&hl=de" />
			<FormProgressBar
				finishedSending={
					formState.sendingFormSuccess || formState.sendingFormErrorMessage !== ''
				}
				label={formStepLabels[formState.currentStep]}
				sending={formState.sendingForm}
				step={formState.currentStep}
				totalSteps={totalFormStepsNumber}
			/>
			<Row>
				<Col xs={12}>{getFormStep(formState.currentStep)}</Col>
			</Row>
		</>
	);
}
