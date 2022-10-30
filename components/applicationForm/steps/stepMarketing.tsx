import React, { MouseEvent, FormEvent, FocusEvent, useState } from 'react';
import { Source } from '@prisma/client';
import { Col, Row } from 'react-bootstrap';
import ApplicationFormButtons from '../applicationFormComponents/applicationFormButtons';
import GdprModal from '../applicationFormComponents/gdprModal';
import { FormElement } from '../signupForm';

// typescript types for this step
export type MarketingStateType = {
	facebook: FormElement<boolean>;
	instagram: FormElement<boolean>;
	website: FormElement<boolean>;
	linkedin: FormElement<boolean>;
	unimalender: FormElement<boolean>;
	flyer: FormElement<boolean>;
	other: FormElement<boolean>;
	gdpr: FormElement<boolean>;
	newsletter: FormElement<boolean>;
};

// typescript types for the props
type FormMarketingProps = {
	initialState: MarketingStateType;
	// eslint-disable-next-line no-unused-vars
	nextCallback: (state: MarketingStateType) => void;
	// eslint-disable-next-line no-unused-vars
	backCallback: (state: MarketingStateType) => void;
	// eslint-disable-next-line react/no-unused-prop-types
	marketingSources: Source[]; // TODO Make Marketing sources depend on DB
};

// validate input field
const validateInputField = (value: boolean, fieldName: keyof MarketingStateType): string => {
	switch (fieldName) {
		case 'gdpr':
			return value ? '' : 'Bitte stimme der Datenschutzerklärung zu.';
		default:
			return '';
	}
};

// default values
export const defaultMarketingState: MarketingStateType = {
	facebook: {
		value: false,
		focusLost: false,
		errorMessage: validateInputField(false, 'facebook'),
	},
	instagram: {
		value: false,
		focusLost: false,
		errorMessage: validateInputField(false, 'instagram'),
	},
	website: { value: false, focusLost: false, errorMessage: validateInputField(false, 'website') },
	linkedin: {
		value: false,
		focusLost: false,
		errorMessage: validateInputField(false, 'linkedin'),
	},
	unimalender: {
		value: false,
		focusLost: false,
		errorMessage: validateInputField(false, 'unimalender'),
	},
	flyer: { value: false, focusLost: false, errorMessage: validateInputField(false, 'flyer') },
	other: { value: false, focusLost: false, errorMessage: validateInputField(false, 'other') },
	gdpr: { value: false, focusLost: false, errorMessage: validateInputField(false, 'gdpr') },
	newsletter: {
		value: false,
		focusLost: false,
		errorMessage: validateInputField(false, 'newsletter'),
	},
};

export default function StepMarketing(props: FormMarketingProps) {
	// the state variable
	const [marketingState, setMarketingState] = useState(props.initialState);

	// is the gdpr modal visible
	const [showModal, setShowModal] = useState(false);

	// next button clicked
	const onNext = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Check if all fields are validated
		if (
			marketingState.facebook.errorMessage === '' &&
			marketingState.instagram.errorMessage === '' &&
			marketingState.website.errorMessage === '' &&
			marketingState.linkedin.errorMessage === '' &&
			marketingState.unimalender.errorMessage === '' &&
			marketingState.flyer.errorMessage === '' &&
			marketingState.other.errorMessage === '' &&
			marketingState.gdpr.errorMessage === ''
		) {
			// Go to the next page
			props.nextCallback(marketingState);
		} else {
			// Set all fields to focus lost = true so that the error message get's shown
			setMarketingState((prevState) => ({
				...prevState,
				facebook: {
					...prevState.facebook,
					focusLost: true,
				},
				instagram: {
					...prevState.instagram,
					focusLost: true,
				},
				website: {
					...prevState.website,
					focusLost: true,
				},
				linkedin: {
					...prevState.linkedin,
					focusLost: true,
				},
				unimalender: {
					...prevState.unimalender,
					focusLost: true,
				},
				flyer: {
					...prevState.flyer,
					focusLost: true,
				},
				other: {
					...prevState.other,
					focusLost: true,
				},
				gdpr: {
					...prevState.gdpr,
					focusLost: true,
				},
				newsletter: {
					...prevState.newsletter,
					focusLost: true,
				},
			}));
		}
	};

	// back button clicked
	const onBack = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		props.backCallback(marketingState);
	};

	// handle value change and update local state
	const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const name = e.target.name as keyof MarketingStateType;

		if (e.target.type === 'checkbox') {
			setMarketingState((prevState) => ({
				...prevState,
				[e.target.name]: {
					value: e.target.checked,
					errorMessage: validateInputField(e.target.checked, name),
					focusLost: true, // Checkbox automatically loose focus if they are changed
				},
			}));
		} else {
			console.error(`unexpected input type ${e.target.type}`);
		}
	};

	// handle focus lost
	const onFocusLost = (e: FocusEvent<HTMLInputElement>) => {
		const name = e.target.name as keyof MarketingStateType;
		setMarketingState((prevState) => ({
			...prevState,
			[name]: {
				...prevState[name],
				focusLost: true,
			},
		}));
	};

	// Set the gdpr modal to visible
	const handleShowGdprModal = (e: MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		setShowModal(true);
	};

	// Handle modal close. If accept is true then gdpr gets set to accepted
	const handleModalClose = (accept: boolean) => {
		if (accept) {
			setMarketingState((prevState) => ({
				...prevState,
				gdpr: {
					focusLost: true,
					value: true,
					errorMessage: validateInputField(true, 'gdpr'),
				},
			}));
		}
		setShowModal(false);
	};

	// Marketing options
	const marketingOptions = [
		{
			name: 'facebook',
			label: 'Facebook',
		},
		{
			name: 'instagram',
			label: 'Instagram',
		},
		{
			name: 'website',
			label: 'Website',
		},
		{
			name: 'linkedin',
			label: 'LinkedIn',
		},
		{
			name: 'unimalender',
			label: 'Unimalender',
		},
		{
			name: 'flyer',
			label: 'Flyer',
		},
		{
			name: 'other',
			label: 'Anderes',
		},
	];

	return (
		<form onSubmit={onNext}>
			<Row>
				<Col xs={12} lg={6}>
					<div className="form-label">
						Wie bist Du auf die Workshops aufmerksam geworden?
					</div>
					<div className="form-check form-check-inline">
						{marketingOptions.map(({ name, label }) => (
							<div className="form-check" key={name}>
								<input
									id={name}
									name={name}
									checked={marketingState[name].value}
									type="checkbox"
									className="form-check-input"
									aria-labelledby={`${name}Label`}
									onChange={onInputChange}
									onBlur={onFocusLost}
								/>
								<label
									id={`${name}Label`}
									htmlFor={name}
									className="form-check-label"
								>
									{label}
								</label>
							</div>
						))}
					</div>
				</Col>
				<Col xs={12} lg={6} className="mb-3">
					<div className="form-label">Datenschutzerklärung und Newsletter</div>
					<div className="form-check form-check-inline">
						<div className="form-check">
							<input
								id="newsletter"
								name="newsletter"
								checked={marketingState.newsletter.value}
								type="checkbox"
								className="form-check-input"
								onChange={onInputChange}
								onBlur={onFocusLost}
								aria-labelledby="newsletterLabel"
							/>
							<label
								id="newsletterLabel"
								htmlFor="newsletter"
								className="form-check-label"
							>
								Newsletter bei neuen Workshops erhalten
							</label>
						</div>
					</div>
					<div className="form-check form-check-inline">
						<div className="form-check">
							<input
								id="gdpr"
								name="gdpr"
								checked={marketingState.gdpr.value}
								type="checkbox"
								className="form-check-input"
								onChange={onInputChange}
								onBlur={onFocusLost}
								aria-labelledby="gdprLabel"
								aria-errormessage="gdprError"
								aria-invalid={marketingState.gdpr.errorMessage !== ''}
							/>
							<label id="gdprLabel" htmlFor="gdpr" className="form-check-label">
								Ich stimme der{' '}
								<a href="" className="link-primary" onClick={handleShowGdprModal}>
									Datenschutzerklärung
								</a>{' '}
								zu *
							</label>
						</div>
					</div>
					<div id="gdprError" className="text-danger">
						{marketingState.gdpr.focusLost ? marketingState.gdpr.errorMessage : null}
						<span className="d-none d-lg-inline" aria-hidden="true">
							&nbsp;
						</span>
					</div>
				</Col>
			</Row>
			<Row>
				<Col xs={12}>
					<ApplicationFormButtons onBack={onBack} isLastStep />
				</Col>
			</Row>
			<GdprModal visible={showModal} handleClose={handleModalClose} />
		</form>
	);
}
