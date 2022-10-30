import React, { FormEvent } from 'react';
import { Row, Col, Modal, Button, CloseButton, Form, Spinner } from 'react-bootstrap';
import { Company, User } from '.prisma/client';
import CompanyDropdown from './companyDropdown';

interface UserEditModalProps {
	companyArr: Array<Company>;
	editUser: User;
	id: number;
	handleAbort: () => void;
	// eslint-disable-next-line no-unused-vars
	handleSave: (e: FormEvent<HTMLFormElement>) => void;
	updateErrorMessage: string;
	updateState: boolean;
}

export default function UserEditModal({
	companyArr,
	editUser,
	id,
	handleAbort,
	handleSave,
	updateErrorMessage,
	updateState,
}: UserEditModalProps) {
	return (
		<Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={id !== -1}>
			<form onSubmit={handleSave}>
				<Modal.Header>
					<Modal.Title id="contained-modal-title-vcenter">
						Nutzer Bearbeiten: &quot;{id === -1 ? '' : editUser.name}&quot;
					</Modal.Title>
					<CloseButton onClick={handleAbort} />
				</Modal.Header>
				<Modal.Body>
					{updateErrorMessage === '' ? null : (
						<Row className="justify-content-center">
							<Col xs="12" className="text-center">
								<span className="text-danger">{updateErrorMessage}</span>
							</Col>
						</Row>
					)}
					<Row>
						<Col xs="12" className="my-2">
							<Form.Group controlId="role">
								<Form.Label>Rolle</Form.Label>
								<Form.Control
									as="select"
									name="role"
									defaultValue={id === -1 ? '' : editUser.role}
								>
									<option value="select" hidden>
										Bitte Auswählen
									</option>
									<option value="ADMIN">Admin</option>
									<option value="PARTNER">Partner</option>
								</Form.Control>
							</Form.Group>
						</Col>
						<Col xs="12" className="my-2">
							<Form.Group controlId="company">
								<CompanyDropdown
									companies={companyArr}
									selected={id === -1 ? -1 : editUser.companyId}
								/>
							</Form.Group>
						</Col>
						<Col xs="12" className="my-2">
							<Form.Group controlId="Name">
								<Form.Label>Name</Form.Label>
								<Form.Control
									placeholder="Name Eingeben"
									name="name"
									defaultValue={id === -1 ? '' : editUser.name}
								/>
							</Form.Group>
						</Col>
						<Col xs="12" className="my-2">
							<Form.Group controlId="Email">
								<Form.Label>Email</Form.Label>
								<Form.Control
									placeholder="max.mustermann@gmail.com"
									name="email"
									defaultValue={id === -1 ? '' : editUser.email}
								/>
							</Form.Group>
						</Col>
					</Row>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={handleAbort}>Abbrechen</Button>
					<Button type="submit" disabled={updateState}>
						Speichern {updateState ? <Spinner animation="border" /> : null}
					</Button>
				</Modal.Footer>
			</form>
		</Modal>
	);
}
