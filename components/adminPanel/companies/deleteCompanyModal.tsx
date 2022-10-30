import { Company } from '@prisma/client';
import { CloseButton, Col, Modal, Row, Spinner } from 'react-bootstrap';

interface DeleteCompanyModalProps {
	company: Company;
	isVisible: boolean;
	handleAbort: () => void;
	// eslint-disable-next-line no-unused-vars
	handleDelete: (companyId: number) => void;
	deleteErrorMessage: string;
	updateState: boolean;
}

export default function DeleteCompanyModal(props: DeleteCompanyModalProps) {
	return (
		<Modal
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
			show={props.isVisible}
		>
			<Modal.Header>
				<Modal.Title id="contained-modal-title-vcenter">Firmenpartner löschen</Modal.Title>
				<CloseButton onClick={props.handleAbort} />
			</Modal.Header>
			<Modal.Body>
				<Row className="mb-2">
					<Col xs={12}>
						Möchtest du wirklich die Firma &quot;
						{props.company ? props.company.name : '?'}&quot; löschen?
					</Col>
				</Row>
				{props.deleteErrorMessage === '' ? null : (
					<Row className="justify-content-center">
						<Col xs={12} className="text-center">
							<span className="text-danger">{props.deleteErrorMessage}</span>
						</Col>
					</Row>
				)}
			</Modal.Body>
			<Modal.Footer>
				<button className="btn btn-secondary" onClick={props.handleAbort} type="button">
					Abbrechen
				</button>
				<button
					className="btn btn-danger"
					onClick={() => props.handleDelete(props.company.id)}
					disabled={props.updateState}
					type="button"
				>
					Löschen {props.updateState ? <Spinner animation="border" /> : null}
				</button>
			</Modal.Footer>
		</Modal>
	);
}
