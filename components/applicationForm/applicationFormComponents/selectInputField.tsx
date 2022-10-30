/* eslint-disable react/button-has-type */
import React from 'react';
import Creatable from 'react-select/creatable';

import { FormElement } from '../signupForm';

export default function SelectInputField(props: {
	element: FormElement<any>;
	name: string;
	label: string;
	options: Array<{ label: string; value: string }>;
	// eslint-disable-next-line no-unused-vars
	onInputChange: (e: any) => void;
	// eslint-disable-next-line no-unused-vars
	onFocusLost: (e: any) => void;
}) {
	const handleFocusLost = () => {
		props.onFocusLost({ target: { name: props.name } });
	};

	const handleChange = (changeEvent: { label: string; value: string }): void => {
		props.onInputChange({ target: { name: props.name, value: changeEvent.value } });
	};

	return (
		<>
			<label id={`${props.name}Label`} htmlFor={props.name} className="form-label">
				{props.label}
			</label>
			<Creatable
				id={props.name}
				name={props.name}
				options={props.options}
				onChange={handleChange}
				onBlur={handleFocusLost}
				defaultInputValue={props.element.value}
				placeholder="Bitte Auswählen"
				noOptionsMessage={() => `Nicht gefunden, bitte selbst eingeben`}
				createOptionPosition="last"
				formatCreateLabel={(inputValue) => inputValue}
				aria-labelledby={`${props.name}Label`}
				aria-errormessage={`${props.name}Error`}
				aria-invalid={props.element.errorMessage !== ''}
			/>
			<div id={`${props.name}Error`} className="text-danger">
				{props.element.focusLost ? props.element.errorMessage : null}
				{/* This is here so that on desktop the error Message doesn't cause a layout shift. This is a solution that is a bit hacky. Might change in the future. */}
				<span className="d-none d-lg-inline" aria-hidden="true">
					&nbsp;
				</span>
			</div>
		</>
	);
}
