import React, { FormEvent } from 'react';
import { Company } from '@prisma/client';
import { CloseButton, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';

interface EditCompanyModalProps {
	company: Company;
	isCreate: boolean;
	isVisible: boolean;
	handleAbort: () => void;
	// eslint-disable-next-line no-unused-vars
	handleSave: (e: FormEvent<HTMLFormElement>, isCreate: boolean) => void;
	updateErrorMessage: string;
	updateState: boolean;
}

export default function EditCompanyModal(props: EditCompanyModalProps) {
	return (
		<Modal
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
			show={props.isVisible}
		>
			<Form onSubmit={(e: FormEvent<HTMLFormElement>) => props.handleSave(e, props.isCreate)}>
				<Modal.Header>
					<Modal.Title id="contained-modal-title-vcenter">
						{props.isCreate
							? 'Neuen Firmenpartner hinzufügen'
							: 'Firmenpartner bearbeiten'}
					</Modal.Title>
					<CloseButton onClick={props.handleAbort} />
				</Modal.Header>
				<Modal.Body>
					<Row>
						<Col xs={12}>
							<Form.Group controlId="Name">
								<Form.Label>Name</Form.Label>
								<Form.Control
									placeholder="Name eingeben"
									name="name"
									defaultValue={
										props.isCreate || props.company == null
											? ''
											: props.company.name
									}
								/>
							</Form.Group>
						</Col>
					</Row>
					{props.updateErrorMessage === '' ? null : (
						<Row className="justify-content-center">
							<Col xs={12} className="text-center">
								<span className="text-danger">{props.updateErrorMessage}</span>
							</Col>
						</Row>
					)}
				</Modal.Body>
				<Modal.Footer>
					<button className="btn btn-secondary" onClick={props.handleAbort} type="button">
						Abbrechen
					</button>
					<button className="btn btn-primary" type="submit" disabled={props.updateState}>
						Speichern {props.updateState ? <Spinner animation="border" /> : null}
					</button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
}
