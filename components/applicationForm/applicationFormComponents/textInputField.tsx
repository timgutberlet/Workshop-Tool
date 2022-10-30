import React from 'react';
import { FormElement } from '../signupForm';

export default function TextInputField(props: {
	element: FormElement<any>;
	name: string;
	label: string;
	// eslint-disable-next-line no-unused-vars
	onInputChange: (e: any) => void;
	// eslint-disable-next-line no-unused-vars
	onFocusLost: (e: any) => void;
}) {
	return (
		<>
			<label id={`${props.name}Label`} htmlFor={props.name} className="form-label">
				{props.label}
			</label>
			<input
				type="text"
				id={props.name}
				name={props.name}
				className="form-control"
				defaultValue={props.element.value}
				onChange={props.onInputChange}
				onBlur={props.onFocusLost}
				aria-labelledby={`${props.name}Label`}
				aria-errormessage={`${props.name}Error`}
				aria-invalid={props.element.errorMessage !== ''}
			/>
			<div id={`${props.name}Error`} className="text-danger">
				{props.element.focusLost ? props.element.errorMessage : null}
				<span className="d-none d-lg-inline" aria-hidden="true">
					&nbsp;
				</span>
			</div>
		</>
	);
}
