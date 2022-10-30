import React, { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/dist/client/router';
import Datetime from 'react-datetime';
// import de from 'date-fns'; // TODO fix locale

import CompanyDropdown from './companyDropdown';

export default function newWorkshop(props: { companiesJSON: string }) {
	// Router to move to other page
	const router = useRouter();

	// The selected image
	const [selectedImage, setSelectedImage] = useState(null);

	// The selected image url to be shown as a preview
	const [selectedImageURL, setSelectedImageURL] = useState('');

	// Is the form currently sending
	const [isSendingRequest, setSendingRequest] = useState(false);

	// If there was an error message during the request it will be stored in this state
	const [requestErrorMessage, setRequestErrorMessage] = useState('');

	// special field for the datetimepicker since we are using a libary
	const [workshopDeadline, setWorkshopDeadline] = useState(new Date()); // deadline date & time

	// special field for the datetimepicker since we are using a libary
	const [workshopDate, setWorkshopDate] = useState(new Date()); // eventDate & event time

	const handleSubmit = async (e) => {
		// Prevent the default behaviour of this component, so that the form doesn't redirect the user.
		e.preventDefault();

		setSendingRequest(true);
		setRequestErrorMessage('');

		// The request body
		const body = new FormData();

		// append fields
		body.append('companyId', e.target.company.value);
		body.append('name', e.target.titel.value);
		body.append('deadline', workshopDeadline.toISOString());
		body.append('event', workshopDate.toISOString());
		body.append('seats', e.target.seats.value);
		body.append('description', e.target.description.value);
		body.append('workshopImage', selectedImage);

		const response = await fetch('/api/admin/workshops', {
			// Use the method POST
			method: 'POST',
			// Specify that the content will be in JSON
			/* headers: {
				'content-type': 'application/json',
			}, */
			// The body of the request, as JSON
			body,
		});

		setSendingRequest(false);
		if (response.status === 200) {
			router.push('/admin-panel/workshops');
		} else {
			setRequestErrorMessage(
				`${response.statusText} (${response.status}): ${await response.text()}`,
			);
		}
	};

	const onFileChange = (e) => {
		const file = e.target.files[0];
		const url = URL.createObjectURL(file);
		setSelectedImage(file);
		setSelectedImageURL(url);
	};

	// Go back to previous page (this is necessary here since both the admin dashboard and the plus button on the workshop übersicht page link to this page)
	const handleBack = () => {
		if (!isSendingRequest) {
			router.back();
		}
	};

	const handleWorkshopDateChange = (changedDate) => {
		setWorkshopDate(changedDate);
	};

	const handleDeadlineDateChange = (changedDate) => {
		setWorkshopDeadline(changedDate);
	};

	return (
		<>
			<Row className="justify-content-center">
				<Col xs={2}>
					<button
						type="button"
						className="btn btn-invisible"
						onClick={() => handleBack()}
					>
						{' '}
						<FontAwesomeIcon icon={faChevronLeft} size="1x" className="text-integra" />
						&nbsp;Zurück
					</button>
				</Col>
				<Col xs={8} className="text-center">
					<h1>Workshop erstellen</h1>
				</Col>
				<Col xs={2} />
			</Row>
			{isSendingRequest ? (
				<Row>
					<Col xs={12} className="d-flex justify-content-center">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img src="/icons/loading.gif" alt="Loading Icon" />
					</Col>
				</Row>
			) : (
				<>
					{requestErrorMessage === '' ? undefined : (
						<Row className="my-2">
							<Col xs={12} className="text-center text-danger fw-bold">
								Leider konnte kein Workshop erstellt werden:
								<br />
								{requestErrorMessage}
							</Col>
						</Row>
					)}
					<Form onSubmit={handleSubmit}>
						<Row className="mt-3">
							<Col xs={12}>
								<Form.Label>Titel*</Form.Label>
								<Form.Control
									type="text"
									placeholder="Name des Workshops"
									name="titel"
								/>
							</Col>
						</Row>
						<Row className="mt-3">
							<Col xs={12}>
								<Form.Group controlId="company">
									<CompanyDropdown
										companies={JSON.parse(props.companiesJSON)}
										selected={-1}
									/>
								</Form.Group>
							</Col>
						</Row>
						<Row className="mt-3">
							<Col xs={12}>
								<Form.Label>Beschreibung</Form.Label>
								<Form.Control as="textarea" rows={2} name="description" />
							</Col>
						</Row>
						<Row className="mt-3">
							<Col xs={12}>
								<Form.Label>Anzahl Plätze*</Form.Label>
								<Form.Control placeholder="verfügbare Plätze" name="seats" />
							</Col>
						</Row>
						<Row className="mt-3">
							<Col xs={12}>
								<Form.Label>Bewerbungsfrist</Form.Label>
							</Col>
						</Row>
						<Row className="mt-3">
							<Datetime
								onChange={handleDeadlineDateChange}
								initialValue={workshopDeadline}
								locale="de" // TODO fix locale
							/>
						</Row>
						<Row className="mt-3">
							<Col xs={12}>
								<Form.Label>Workshop Datum</Form.Label>
							</Col>
						</Row>
						<Row className="mt-3">
							<Datetime
								onChange={handleWorkshopDateChange}
								initialValue={workshopDate}
								locale="de" // TODO fix locale
							/>
						</Row>
						<Row className="mt-3">
							<Col xs={12}>
								<label htmlFor="formFile" className="form-label">
									Workshop Bild (bitte 1:1 Seitenverhältnis verwenden)*
								</label>
								<input
									id="formFile"
									className="form-control"
									type="file"
									onChange={onFileChange}
								/>
							</Col>
						</Row>
						{selectedImageURL === '' ? undefined : (
							<Row className="mt-3">
								<Col xs={12} className="d-flex justify-content-center">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={selectedImageURL}
										alt=""
										className="border shadow"
										style={{ maxHeight: '10rem' }}
									/>
								</Col>
							</Row>
						)}
						<Row className="mt-3">
							<label htmlFor="formFile" className="form-label">
								* Pflichtfeld
							</label>
						</Row>
						<Row className="mt-5">
							<Col xs={6} className="text-center">
								<button
									className="btn btn-secondary"
									type="button"
									onClick={() => handleBack()}
								>
									Abbrechen
								</button>
							</Col>
							<Col xs={6} className="text-center">
								<button
									className="btn btn-primary"
									type="submit"
									disabled={selectedImageURL === ''}
								>
									Erstellen
								</button>
							</Col>
						</Row>
					</Form>
				</>
			)}
		</>
	);
}
