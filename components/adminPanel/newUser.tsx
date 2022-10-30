import { Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import CompanyDropdown from './companyDropdown';

export default function newUser({ companiesJSON }) {
	const router = useRouter();

	// Status & Error state for the form
	const [submitStatus, setSubmitStatus] = useState('idle');
	const defaultSubmitErrorMsg: string = null;
	const [submitErrorMsg, setSubmitErrorMsg] = useState(defaultSubmitErrorMsg);

	// Is the company drop down shown
	const defaultCompanyDropDownVisible: boolean = false;
	const [companyDropDownVisible, setCompanyDropDownVisible] = useState(
		defaultCompanyDropDownVisible,
	);

	const handleSubmit = async (event) => {
		// Prevent the default behaviour of this component, so that the form doesn't redirect the user.
		event.preventDefault();

		// update state to disable the buttons, display loading icon and clear err msg
		setSubmitStatus('sending');
		setSubmitErrorMsg(null);

		// send the request
		const result = await fetch('/api/admin/users/', {
			// Use the method POST
			method: 'POST',
			// Specify that the content will be in JSON
			headers: {
				'content-type': 'application/json',
			},
			// The body of the request, as JSON
			body: JSON.stringify({
				// Note that event.target refers to our form element
				role: event.target.role.value,
				company: event.target.company.value, // this field is ignored by the backend if role equals admin
				name: event.target.name.value,
				email: event.target.email.value,
			}),
		});

		if (result.status === 200) {
			router.push('/admin-panel/users');
		} else {
			// Show error message & set status
			setSubmitStatus('error');
			setSubmitErrorMsg(`${result.statusText} (${result.status}): ${await result.text()}`);
		}
	};

	const handleRoleDropdownChange = (event) => {
		// only show company dropdown if partner is selected
		setCompanyDropDownVisible(event.target.value === 'PARTNER');
	};

	return (
		<>
			<Row className="justify-content-center">
				<Col xs={2}>
					<button
						type="button"
						className="btn btn-invisible"
						onClick={() => router.back()}
					>
						<FontAwesomeIcon icon={faChevronLeft} size="1x" className="text-integra" />
						&nbsp;Zurück
					</button>
				</Col>
				<Col xs={8} className="text-center">
					<h1>Neuen Nutzer hinzufügen</h1>
				</Col>
				<Col xs={2} />
			</Row>
			<Row className="justify-content-center mt-5">
				<Card style={{ padding: '1em' }}>
					<Form onSubmit={handleSubmit}>
						<Row>
							<Form.Group controlId="role">
								<Form.Label>Rolle</Form.Label>
								<Form.Control
									as="select"
									name="Role"
									onChange={handleRoleDropdownChange}
								>
									<option>Auswählen</option>
									<option value="ADMIN">Admin</option>
									<option value="PARTNER">Partner</option>
								</Form.Control>
							</Form.Group>
							<Form.Group
								controlId="Company"
								style={{
									marginTop: '1em',
									display: companyDropDownVisible ? 'block' : 'none',
								}}
							>
								<CompanyDropdown
									companies={JSON.parse(companiesJSON)}
									selected={-1}
								/>
							</Form.Group>
							<Form.Group controlId="Name" style={{ marginTop: '1em' }}>
								<Form.Label>Name</Form.Label>
								<Form.Control placeholder="Name eingeben" name="name" />
							</Form.Group>
						</Row>
						<Row style={{ marginTop: '1em' }}>
							<Form.Group controlId="Email">
								<Form.Label>Email</Form.Label>
								<Form.Control placeholder="max.mustermann@gmail.com" name="email" />
							</Form.Group>
						</Row>
						<Row className="mt-1">
							{submitErrorMsg == null ||
							submitErrorMsg === '' ||
							submitStatus !== 'error' ? null : (
								<Row className="justify-content-center">
									<Col xs={12} className="text-center">
										<span className="text-danger">{submitErrorMsg}</span>
									</Col>
								</Row>
							)}
						</Row>

						<Row className="mt-5">
							<Col xs={6} className="text-center">
								<button
									className="btn btn-secondary"
									type="button"
									disabled={submitStatus === 'sending'}
									onClick={() =>
										submitStatus !== 'sending' ? router.back() : null
									}
								>
									Abbrechen
								</button>
							</Col>
							<Col xs={6} className="text-center">
								<button
									className="btn btn-primary"
									type="submit"
									disabled={submitStatus === 'sending'}
								>
									Erstellen{' '}
									{submitStatus === 'sending' ? (
										<Spinner animation="border" />
									) : null}
								</button>
							</Col>
						</Row>
					</Form>
				</Card>
			</Row>
		</>
	);
}
