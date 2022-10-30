import React, { useEffect, useRef } from 'react';
import { FormElement } from '../signupForm';
import MyPDFViewer from './myPdfView';

export default function FileInputField(props: {
	element: FormElement<File>;
	name: string;
	label: string;
	onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
	// Refrence to the input element
	const fileInputRef = useRef<HTMLInputElement>();

	// This is an ugly workaround to the issue that you can't set the value of <input type="file" /> tags.
	// We are abusing the DataTransferAPI to to generate a FileList Object (which has no exposed constructor).
	// This FileList Object then can be set as a value of the input tag.
	const forceSetValueOfFileInput = (newFile: File) => {
		const dataTransfer = new DataTransfer();
		dataTransfer.items.add(newFile);
		fileInputRef.current.files = dataTransfer.files;
	};

	// Hook to trigger the forceSetValueOfFileInput method if a file is passed with the props
	useEffect(() => {
		if (props.element.value != null) {
			forceSetValueOfFileInput(props.element.value);
		}
	});

	return (
		<>
			<label id={`${props.name}Label`} htmlFor={props.name} className="form-label">
				{props.label}
			</label>
			<input
				type="file"
				id={props.name}
				name={props.name}
				className="form-control"
				onChange={props.onChange}
				aria-labelledby={`${props.name}Label`}
				aria-errormessage={`${props.name}Error`}
				aria-invalid={props.element.focusLost && props.element.errorMessage !== ''}
				ref={fileInputRef}
			/>
			<div id={`${props.name}Error`} className="text-danger">
				{props.element.focusLost ? props.element.errorMessage : null}
				<span className="d-none d-lg-inline" aria-hidden="true">
					&nbsp;
				</span>
			</div>
			{props.element.errorMessage !== '' ? null : <MyPDFViewer file={props.element.value} />}
		</>
	);
}
