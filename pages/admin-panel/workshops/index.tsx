import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faChevronLeft,
	faPlusCircle,
	faTrash,
	faEdit,
	faEye,
	faUser,
	faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import React, { FormEvent, useState } from 'react';
import {
	Button,
	CloseButton,
	Col,
	Collapse,
	Form,
	Modal,
	OverlayTrigger,
	Row,
	Spinner,
	Table,
} from 'react-bootstrap';
import { Workshop } from '@prisma/client';
import { useRouter } from 'next/router';
import Datetime from 'react-datetime';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import PageWrapper from '../../../components/pageWrapper';
import { getAdminWorkshopsWithCount } from '../../api/admin/workshops';
import { prettyPrintWorkshopDate, prettyPrintWorkshopState } from '../../../lib/prisma/prettyPrint';
import textToolTip from '../../../components/textToolTip';
import CompanyDropdown from '../../../components/adminPanel/companyDropdown';
import { getAdminCompanies } from '../../api/admin/companies';

export default function WorkshopOverview(props: {
	workshopsJSON: string;
	companiesJSON: string;
	pageTitle: string;
	isSymposium: boolean;
}) {
	const router = useRouter();

	const workshops: Array<Workshop & { _count: { Apply: number } }> = JSON.parse(
		props.workshopsJSON,
	);

	const [open, setOpen] = useState(false); // are the old workshops visible (this gets overridden if there are no workshops with state done)

	// default values for the states
	const defaultErrorMessage: string = null;
	const defaultSelectedWorkshop: Workshop = null;

	// states for the deletion of a workshop
	const [deleteSelectedWorkshop, setDeleteSelectedWorkshop] = useState(defaultSelectedWorkshop);
	const [deleteReqErrorMessage, setDeleteReqErrorMessage] = useState(defaultErrorMessage);
	const [deleteReqSending, setDeleteReqSending] = useState(false);

	// deletes the selcted workshop
	const deleteWorkshop = async (workshopId: number) => {
		setDeleteReqSending(true);
		setDeleteReqErrorMessage(null);

		const result = await fetch(`/api/admin/workshops/${workshopId}`, { method: 'DELETE' });

		setDeleteReqSending(false);

		if (result.status === 200) {
			setDeleteSelectedWorkshop(null); // close delete popup
			router.push(router.asPath, router.asPath, { scroll: false }); // update the page without scrolling to the top
		} else {
			setDeleteReqErrorMessage(
				`Ein Fehler ist Aufgetreten: ${result.status} ${
					result.statusText
				} ${await result.text()}`,
			);
		}
	};
	// Consts for Edit Image
	const [editImageID, setEditImageID] = useState(-1);
	const handleImageAbort = () => {
		setEditImageID(-1);
	};
	const editImage = workshops.find((x: Workshop) => {
		return x.id === editImageID;
	});
	const [updateImageErrorMessage, setUpdateImageErrorMessage] = useState('');

	const [updateImageState, setUpdateImageState] = useState(false);

	const [selectedImage, setSelectedImage] = useState(null);

	const [selectedImageURL, setSelectedImageURL] = useState('');

	const [imageIndex, setImageIndex] = useState(0);

	const onImageEdit = (workshop: Workshop) => {
		setSelectedImageURL(`/api/admin/workshops/${workshop.id}/image?index=${imageIndex}`);
		setEditImageID(workshop.id);
	};

	const onFileChange = (e) => {
		const file = e.target.files[0];
		const url = URL.createObjectURL(file);

		setSelectedImage(file);
		setSelectedImageURL(url);
	};

	const handleImageSave = async () => {
		const body = new FormData();
		body.append('workshopImage', selectedImage);
		// @ts-ignore
		setUpdateImageState(true);
		setUpdateImageErrorMessage('');
		const result = await fetch(`/api/admin/workshops/${editImageID}/image`, {
			method: 'PUT',
			body,
		});

		setUpdateImageState(false);
		setImageIndex((oldIndex) => oldIndex + 1);

		if (result.status === 200) {
			router.push(router.asPath, router.asPath, { scroll: false }); // update the page without scrolling to the top
			setEditImageID(-1); // Close the edit menu
			setSelectedImage(null);
			setSelectedImageURL('');
		} else {
			// Show error message
			setUpdateImageErrorMessage(
				`Ein Fehler ist Aufgetreten: ${result.status} ${
					result.statusText
				} ${await result.text()}`,
			);
		}
	};
	// End of Image Edit

	// Consts for Edit Workshop
	const [editWorkshopID, setEditWorkshopID] = useState(-1);
	const handleAbort = () => {
		setEditWorkshopID(-1);
	};
	const editWorkshop = workshops.find((x: Workshop) => {
		return x.id === editWorkshopID;
	});
	const [updateErrorMessage, setUpdateErrorMessage] = useState('');

	const [updateState, setUpdateState] = useState(false);

	const [workshopDeadline, setWorkshopDeadline] = useState(new Date()); // deadline date & time
	// special field for the datetimepicker since we are using a libary
	const [workshopDate, setWorkshopDate] = useState(new Date()); // eventDate & event time

	const onWorkshopEdit = (workshop: Workshop) => {
		setWorkshopDeadline(new Date(workshop.deadline));
		setWorkshopDate(new Date(workshop.date));
		setEditWorkshopID(workshop.id);
	};
	const handleWorkshopDateChange = (changedDate) => {
		setWorkshopDate(changedDate);
	};

	const handleDeadlineDateChange = (changedDate) => {
		setWorkshopDeadline(changedDate);
	};

	const handleSave = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// @ts-ignore
		const formData = new FormData(e.target);
		setUpdateState(true);
		setUpdateErrorMessage('');
		const result = await fetch(`/api/admin/workshops/${editWorkshopID}`, {
			method: 'PUT',
			headers: new Headers({ 'content-type': 'application/json' }),
			body: JSON.stringify({
				companyID: formData.get('company'),
				name: formData.get('titel'),
				deadline: workshopDeadline.toISOString(),
				state: formData.get('state'),
				year: '0',
				date: workshopDate.toISOString(),
				seats: formData.get('seats'),
				description: formData.get('description'),
			}),
		});

		setUpdateState(false);

		if (result.status === 200) {
			setEditWorkshopID(-1); // Close the edit menu
			router.push(router.pathname, router.pathname, { scroll: false }); // update the page without scrolling to the top
		} else {
			// Show error message
			setUpdateErrorMessage(
				`Ein Fehler ist Aufgetreten: ${result.status} ${
					result.statusText
				} ${await result.text()}`,
			);
		}
	};

	const getWorkshopTableRow = (workshop: Workshop & { _count: { Apply: number } }) => {
		return (
			<tr key={workshop.id}>
				<td>{workshop.id}</td>
				<td>{prettyPrintWorkshopDate(workshop)}</td>
				<td>{prettyPrintWorkshopState(workshop.state)}</td>
				<td>
					<Link href={`/admin-panel/workshops/${workshop.id}`} passHref>
						{workshop.name}
					</Link>
				</td>
				{/* eslint-disable-next-line no-underscore-dangle */}
				<td>{workshop._count.Apply}</td>
				<td className="text-center">
					<div className="btn-group" role="group">
						<OverlayTrigger
							placement="top"
							overlay={(renderProps) => {
								return textToolTip({
									...renderProps,
									customToolTipText: 'Bewerbende',
								});
							}}
						>
							<button
								type="button"
								className="btn btn-primary"
								onClick={() => router.push(`/admin-panel/workshops/${workshop.id}`)}
							>
								<FontAwesomeIcon icon={faUser} size="1x" />
							</button>
						</OverlayTrigger>
						<OverlayTrigger
							placement="top"
							overlay={(renderProps) => {
								return textToolTip({
									...renderProps,
									customToolTipText: 'Bearbeiten',
								});
							}}
						>
							<button
								type="button"
								className="btn btn-secondary"
								onClick={() => onWorkshopEdit(workshop)}
							>
								<FontAwesomeIcon icon={faEdit} size="1x" />
							</button>
						</OverlayTrigger>
						<OverlayTrigger
							placement="top"
							overlay={(renderProps) => {
								return textToolTip({
									...renderProps,
									customToolTipText: 'Bild Ändern',
								});
							}}
						>
							<button
								type="button"
								className="btn btn-success"
								onClick={() => onImageEdit(workshop)}
							>
								<FontAwesomeIcon icon={faImage} size="1x" />
							</button>
						</OverlayTrigger>
						<OverlayTrigger
							placement="top"
							overlay={(renderProps) => {
								return textToolTip({
									...renderProps,
									customToolTipText: 'Löschen',
								});
							}}
						>
							<button
								type="button"
								className="btn btn-danger"
								onClick={() => setDeleteSelectedWorkshop(workshop)}
							>
								<FontAwesomeIcon icon={faTrash} size="1x" />
							</button>
						</OverlayTrigger>
					</div>
				</td>
			</tr>
		);
	};

	return (
		<PageWrapper pageTitle={props.pageTitle} isSymposium={props.isSymposium}>
			<Row className="justify-content-center">
				<Col xs={2}>
					<Link href="/admin-panel" passHref>
						<button type="button" className="btn btn-invisible">
							<span>
								<FontAwesomeIcon icon={faChevronLeft} size="1x" />
								<span className="d-none d-md-inline"> Zurück</span>
							</span>
						</button>
					</Link>
				</Col>
				<Col xs={8} className="text-center">
					<h1>Workshop Übersicht</h1>
				</Col>
				<Col xs={2} className="float-end text-end">
					<Link href="/admin-panel/workshops/create" passHref>
						<button className="btn btn-invisible" type="button">
							<span>
								<FontAwesomeIcon icon={faPlusCircle} size="1x" />
								<span className="d-none d-md-inline"> Neu</span>
							</span>
						</button>
					</Link>
				</Col>
			</Row>
			<Row className="mt-2 my">
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Id</th>
							<th>Datum</th>
							<th>Status</th>
							<th>Titel</th>
							<th>Bewerbende</th>
							<th> </th>
						</tr>
					</thead>
					<tbody>
						{workshops
							.filter((workshop) => workshop.state !== 'DONE') // Filter out completed workshops
							.map((workshop) => getWorkshopTableRow(workshop))}
					</tbody>
				</Table>
			</Row>
			{!workshops.some((workshop) => workshop.state === 'DONE') ? null : ( // only show old workshops table and button if they are any old workshops
				<>
					<Row className="mt-2">
						<Col xs="12" className="text-center">
							<Button
								variant="secondary"
								type="submit"
								onClick={() => setOpen(!open)}
								aria-expanded={open}
							>
								{open ? (
									<FontAwesomeIcon icon={faEye} size="1x" />
								) : (
									<FontAwesomeIcon icon={faEyeSlash} size="1x" />
								)}{' '}
								Alte Workshops anzeigen
							</Button>
						</Col>
					</Row>
					<Row className="mt-4">
						<Collapse in={open}>
							<Table striped bordered hover>
								<thead>
									<tr>
										<th>Id</th>
										<th>Datum</th>
										<th>Status</th>
										<th>Titel</th>
										<th>Bewerbende</th>
										<th> </th>
									</tr>
								</thead>
								<tbody>
									{workshops
										.filter((workshop) => workshop.state === 'DONE') // Filter only completed workshops
										.map((workshop) => getWorkshopTableRow(workshop))}
								</tbody>
							</Table>
						</Collapse>
					</Row>
				</>
			)}
			<Modal
				size="lg"
				aria-labelledby="contained-modal-title-vcenter"
				centered
				show={editWorkshopID !== -1}
			>
				<form onSubmit={handleSave}>
					<Modal.Header>
						<Modal.Title id="contained-modal-title-vcenter">
							Workshop Bearbeiten: &quot;
							{editWorkshopID === -1 ? '' : editWorkshop.name}&quot;
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
						<Row className="mt-3">
							<Col xs={12}>
								<Form.Label>Titel</Form.Label>
								<Form.Control
									type="text"
									defaultValue={editWorkshopID === -1 ? '' : editWorkshop.name}
									name="titel"
								/>
							</Col>
						</Row>
						<Row className="mt-3">
							<Col xs={12}>
								<Form.Group controlId="company">
									<CompanyDropdown
										companies={JSON.parse(props.companiesJSON)}
										selected={
											editWorkshopID === -1 ? -1 : editWorkshop.companyId
										}
									/>
								</Form.Group>
							</Col>
						</Row>
						<Row className="mt-3">
							<Col xs={12}>
								<Form.Group controlId="state">
									<Form.Label>Status</Form.Label>
									<Form.Control
										as="select"
										name="state"
										defaultValue={
											editWorkshopID === -1 ? '' : editWorkshop.state
										}
									>
										<option value="select" hidden>
											Bitte Auswählen
										</option>
										<option value="UNPUBLISHED">UNPUBLISHED</option>
										<option value="APPLICATION">APPLICATION</option>
										<option value="SELECTION">SELECTION</option>
										<option value="DONE">DONE</option>
									</Form.Control>
								</Form.Group>
							</Col>
						</Row>
						<Row className="mt-3">
							<Col xs={12}>
								<Form.Label>Beschreibung</Form.Label>
								<Form.Control
									as="textarea"
									rows={2}
									name="description"
									defaultValue={
										editWorkshopID === -1 ? '' : editWorkshop.description
									}
								/>
							</Col>
						</Row>
						<Row className="mt-3">
							<Col xs={12}>
								<Form.Label>Anzahl Plätze</Form.Label>
								<Form.Control
									name="seats"
									defaultValue={editWorkshopID === -1 ? '' : editWorkshop.seats}
								/>
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
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={handleAbort}>Abbrechen</Button>
						<Button type="submit" disabled={updateState}>
							Speichern {updateState ? <Spinner animation="border" /> : null}
						</Button>
					</Modal.Footer>
				</form>
			</Modal>
			<Modal show={deleteSelectedWorkshop != null}>
				<Modal.Header>
					<Modal.Title>Workshop Löschen</Modal.Title>
					<button
						type="button"
						className="btn-close"
						aria-label="hide"
						disabled={deleteReqSending}
						onClick={() => setDeleteSelectedWorkshop(null)}
					/>
				</Modal.Header>
				<Modal.Body>
					<p>
						{deleteSelectedWorkshop == null ? (
							<span className="text-danger">nicht gefunden</span>
						) : (
							<>
								Bist du dir sicher, dass du den Workshop{' '}
								<span className="fw-bold">{deleteSelectedWorkshop.name}</span> am{' '}
								<span className="fw-bold">
									{prettyPrintWorkshopDate(deleteSelectedWorkshop)}
								</span>{' '}
								löschen möchtest?
							</>
						)}
					</p>
					<span className="text-danger">{deleteReqErrorMessage}</span>
				</Modal.Body>
				<Modal.Footer>
					<button
						type="button"
						className="btn btn-secondary"
						onClick={() => setDeleteSelectedWorkshop(null)}
						disabled={deleteReqSending}
					>
						Abbrechen
					</button>
					<button
						type="button"
						className="btn btn-danger"
						onClick={() => deleteWorkshop(deleteSelectedWorkshop.id)}
						disabled={deleteReqSending}
					>
						Löschen {deleteReqSending ? <Spinner animation="border" /> : null}
					</button>
				</Modal.Footer>
			</Modal>
			<Modal
				size="lg"
				aria-labelledby="contained-modal-title-vcenter"
				centered
				show={editImageID !== -1}
			>
				<form onSubmit={handleImageSave}>
					<Modal.Header>
						<Modal.Title id="contained-modal-title-vcenter">
							Workshop Bild Bearbeiten: &quot;
							{editImageID === -1 ? '' : editImage.name}&quot;
						</Modal.Title>
						<CloseButton onClick={handleImageAbort} />
					</Modal.Header>
					<Modal.Body>
						{updateImageErrorMessage === '' ? null : (
							<Row className="justify-content-center">
								<Col xs="12" className="text-center">
									<span className="text-danger">{updateImageErrorMessage}</span>
								</Col>
							</Row>
						)}
						<Row className="mt-3">
							<Col xs={12}>
								<label htmlFor="formFile" className="form-label">
									Workshop Bild (bitte 1:1 Seitenverhältnis verwenden)
								</label>
								<input
									id="formFile"
									className="form-control"
									type="file"
									onChange={onFileChange}
								/>
							</Col>
						</Row>
						{selectedImageURL === '' ? null : (
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
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={handleImageAbort}>Abbrechen</Button>
						<Button type="submit" disabled={updateImageState}>
							Speichern {updateImageState ? <Spinner animation="border" /> : null}
						</Button>
					</Modal.Footer>
				</form>
			</Modal>
		</PageWrapper>
	);
}

export async function getServerSideProps() {
	return {
		props: {
			workshopsJSON: JSON.stringify(await getAdminWorkshopsWithCount(0)), // TODO Pagination isn't implemented yet so only the last 100 workshops will show up!!!
			companiesJSON: JSON.stringify(await getAdminCompanies()),
			pageTitle:
				process.env.SYMPOSIUM === 'true'
					? 'Mannheim Symposium - Workshop Übersicht'
					: 'Integra e.V. - Workshop Übersicht',
			isSymposium: process.env.SYMPOSIUM === 'true',
		},
	};
}
