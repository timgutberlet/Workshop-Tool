import React, { useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';

export default function FileUploadButton(props: any) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

	const { text } = props;
	const { controlId } = props;

	const handleUpload = () => {
		inputRef.current?.click();
	};

	const handleDisplayFileDetails = () => {
		// eslint-disable-next-line no-unused-expressions
		inputRef.current?.files && setUploadedFileName(inputRef.current.files[0].name);
	};

	return (
		<Form.Group controlId={controlId}>
			<Form.Label className="mx-3">{text}</Form.Label>
			<input
				ref={inputRef}
				onChange={handleDisplayFileDetails}
				className="d-none"
				type="file"
			/>
			<Button onClick={handleUpload} className="btn btn-secondary">
				{uploadedFileName || 'Change'}
			</Button>
		</Form.Group>
	);
}
