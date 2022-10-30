/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import { Apply, Student, Workshop, WorkshopState } from '.prisma/client';
import {
	faDownload,
	faChevronLeft,
	faCheck,
	faTimes,
	faTrash,
	faCircleQuestion,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Col, Row, Table, OverlayTrigger, Tooltip, Modal, Spinner } from 'react-bootstrap';
import Head from 'next/head';
import PageWrapper from '../../../components/pageWrapper';
import prisma from '../../../lib/prisma/prisma';

export default function WorkshopDetail(props: {
	workshopJSON: string;
	pageTitle: string;
	isSymposium: boolean;
}) {
	const router = useRouter();

	// if the workshop couldn't be found redirect to 404 page
	if (props.workshopJSON == null) {
		router.push('/404');
	}

	// parse the JSON data
	const workshop: Workshop & { Apply: (Apply & { student_id: Student })[] } = JSON.parse(
		props.workshopJSON,
	);

	// Default values for the states
	const defaultApply: Apply & { student_id: Student } = null;
	const defaultErrorMessage: string = null;

	// state for the delete popup
	const [deleteApply, setDeleteApply] = useState(defaultApply); // deletion candidate, null if none present
	const [isDeleteSending, setDeleteSending] = useState(false);
	const [deleteErorrMessage, setDeleteErrorMessage] = useState(defaultErrorMessage);

	// state for the mail
	const [isEmailPopupVisible, setEmailPopupVisible] = useState(false); // is the email popup visible
	const [isMailSending, setMailSending] = useState(false); // is the request currently sending
	const [mailErrorMessage, setMailErrorMessage] = useState(defaultErrorMessage); // initially null, contains error message

	// handle sending out mails to applicants
	const handleEmailSending = async () => {
		setMailSending(true);
		setMailErrorMessage(null);

		const result = await fetch(`/api/admin/workshops/${workshop.id}/mails`, {
			method: 'POST',
		});

		setMailSending(false);

		if (result.status === 200) {
			router.push(router.asPath, router.asPath, { scroll: false }); // update the page without scrolling to the top
		} else {
			setMailErrorMessage(
				`Ein Fehler ist Aufgetreten: ${result.status} ${
					result.statusText
				} ${await result.text()}`,
			);
		}
	};

	// Handle download button clicked. Downloads the cv and the grades file
	const handleDownloadButtonClicked = (studentId: number) => {
		window.open(`/api/admin/students/${studentId}/cv`, '_blank');
		window.open(`/api/admin/students/${studentId}/grades`, '_blank');
	};

	// Handle the deletion of an application (confirmation needs to happen before this)
	const handleDelete = async (applyId: number) => {
		setDeleteSending(true);
		setDeleteErrorMessage(null); // clear erorr message

		const result = await fetch(`/api/admin/applies/${applyId}`, { method: 'DELETE' });

		setDeleteSending(false);

		if (result.status === 200) {
			setDeleteApply(null); // close delete popup
			router.push(router.asPath, router.asPath, { scroll: false }); // update the page without scrolling to the top
		} else {
			setDeleteErrorMessage(
				`Ein Fehler ist Aufgetreten: ${result.status} ${
					result.statusText
				} ${await result.text()}`,
			);
		}
	};

	const [isEditRequestSending, setEditRequestSending] = useState(false);
	const [editErrorMessage, setEditErrorMessage] = useState(defaultErrorMessage);

	// Handle accepting or denying an applicaiton of a user
	const handleEditClicked = async (applyId: number, selected: boolean) => {
		if (isEditRequestSending) {
			return;
		}
		setEditRequestSending(true);
		setEditErrorMessage(null);

		const result = await fetch(`/api/admin/applies/${applyId}`, {
			method: 'PUT',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				selected,
			}),
		});

		setEditRequestSending(false);

		if (result.status === 200) {
			setEmailPopupVisible(false);
			router.push(router.asPath, router.asPath, { scroll: false }); // update the page without scrolling to the top
		} else {
			setEditErrorMessage(
				`Ein Fehler ist Aufgetreten: ${result.status} ${
					result.statusText
				} ${await result.text()}`,
			);
		}
	};

	return (
		<PageWrapper pageTitle={props.pageTitle} isSymposium={props.isSymposium}>
			<Row className="mb-4">
				<Col xs={2}>
					<button
						type="button"
						className="btn btn-invisible"
						onClick={() => {
							router.back();
						}}
					>
						<span>
							<FontAwesomeIcon icon={faChevronLeft} size="1x" />
							<span className="d-none d-md-inline"> Zurück</span>
						</span>
					</button>
				</Col>
				<Col xs={8} className="text-center">
					<h1>Bewerbende</h1>
					<h4>»{workshop.name}«</h4>
				</Col>
				<Col xs={2}>
					<OverlayTrigger overlay={<Tooltip>Zip Download aller Bewerbungen</Tooltip>}>
						<Link href={`/api/admin/workshops/${workshop.id}/zip`} passHref>
							<button type="button" className="btn btn-primary">
								<FontAwesomeIcon icon={faDownload} size="1x" /> Download
							</button>
						</Link>
					</OverlayTrigger>
				</Col>
			</Row>
			<Row className="display-flex align-items-center justify-content-center">
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>E-Mail</th>
							<th>Universität</th>
							<th>Abschluss</th>
							<th>Semester</th>
							<th className="text-nowrap">
								Captcha&nbsp;
								<OverlayTrigger
									overlay={
										<Tooltip>
											Captcha Score von 0.0 bis 1.0, wobei 1 der beste Score
											ist. Negative Werte stehen für Fehler.
										</Tooltip>
									}
								>
									<span className="d-inline-block">
										<FontAwesomeIcon
											className="fa-regular"
											icon={faCircleQuestion}
											size="1x"
										/>
									</span>
								</OverlayTrigger>
							</th>
							<th>Angenommen</th>
							<th>Optionen</th>
						</tr>
					</thead>
					<tbody>
						{workshop.Apply.map((apply) => (
							<tr key={apply.student_id.id}>
								<td>{apply.student_id.id}</td>
								<td>
									{apply.student_id.name}, {apply.student_id.prename}
								</td>
								<td>
									<a href={`mailto:${apply.student_id.email}`}>
										{apply.student_id.email}
									</a>
								</td>
								<td>{apply.student_id.university}</td>
								<td>{apply.student_id.majorName}</td>
								<td>
									{apply.student_id.semester} {apply.student_id.degreeName}
								</td>
								<td>{apply.student_id.captchaScore}</td>
								<td>{apply.selected ? 'Ja' : 'Nein'}</td>
								<td>
									<div className="btn-group" role="group">
										<OverlayTrigger
											overlay={
												<Tooltip>
													Bewerbung{' '}
													{!apply.selected ? 'annehmen' : 'ablehnen'}
												</Tooltip>
											}
										>
											<button
												type="button"
												className="btn btn-primary"
												onClick={() =>
													handleEditClicked(apply.id, !apply.selected)
												}
											>
												{apply.selected ? (
													<FontAwesomeIcon
														fixedWidth
														icon={faTimes}
														size="1x"
													/>
												) : (
													<FontAwesomeIcon
														fixedWidth
														icon={faCheck}
														size="1x"
													/>
												)}
											</button>
										</OverlayTrigger>
										<OverlayTrigger
											overlay={<Tooltip>Bewerbung Downloaden</Tooltip>}
										>
											<button
												type="button"
												className="btn btn-secondary mx-0"
												onClick={() =>
													handleDownloadButtonClicked(apply.student_id.id)
												}
											>
												<FontAwesomeIcon
													fixedWidth
													icon={faDownload}
													size="1x"
												/>
											</button>
										</OverlayTrigger>
										<OverlayTrigger
											overlay={<Tooltip>Bewerbung Löschen</Tooltip>}
										>
											<button
												type="button"
												className="btn btn-danger"
												onClick={() => setDeleteApply(apply)}
											>
												<FontAwesomeIcon
													fixedWidth
													icon={faTrash}
													size="1x"
												/>
											</button>
										</OverlayTrigger>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</Row>
			<Row>
				<Col xs={12} className="text-center">
					<button
						type="button"
						className="btn btn-primary"
						disabled={workshop.state !== WorkshopState.SELECTION}
						onClick={() => setEmailPopupVisible(true)}
					>
						Zu/Absage E-Mails versenden
					</button>
				</Col>
			</Row>
			{workshop.state === WorkshopState.SELECTION ? null : (
				<Row>
					<Col xs={12} className="text-center text-muted">
						Absage E-Mails können nicht versendet werden, da
						{workshop.state === WorkshopState.DONE
							? ' der Workshop bereits abgeschlossen ist.'
							: ' die Auswahlphase noch nicht begnommen hat.'}
					</Col>
				</Row>
			)}

			<Modal show={isEmailPopupVisible}>
				<Modal.Header>
					<Modal.Title>E-Mail Versand</Modal.Title>
					<button
						type="button"
						className="btn-close"
						aria-label="hide"
						disabled={isMailSending}
						onClick={() => setEmailPopupVisible(false)}
					/>
				</Modal.Header>
				<Modal.Body>
					<p>Bist du dir sicher, dass du die Zu/Absage E-Mails verschicken möchtest?</p>
					{mailErrorMessage == null ? null : (
						<span className="text-danger">{mailErrorMessage}</span>
					)}
				</Modal.Body>
				<Modal.Footer>
					<button
						type="button"
						className="btn btn-secondary"
						disabled={isMailSending}
						onClick={() => setEmailPopupVisible(false)}
					>
						Abbrechen
					</button>
					<button
						type="button"
						disabled={isMailSending}
						className="btn btn-danger"
						onClick={handleEmailSending}
					>
						Senden {isMailSending ? <Spinner animation="border" /> : null}
					</button>
				</Modal.Footer>
			</Modal>

			<Modal show={deleteApply != null}>
				<Modal.Header>
					<Modal.Title>Bewerbung Löschen</Modal.Title>
					<button
						type="button"
						className="btn-close"
						aria-label="hide"
						disabled={isDeleteSending}
						onClick={() => setDeleteApply(null)}
					/>
				</Modal.Header>
				<Modal.Body>
					<p>
						Bist du dir sicher, dass du die Bewerbung von{' '}
						{deleteApply == null ? (
							<span className="text-danger">nicht gefunden</span>
						) : (
							<span className="fw-bold">{deleteApply.student_id.email}</span>
						)}{' '}
						löschen möchtest?
					</p>
					{deleteErorrMessage == null ? null : (
						<span className="text-danger">{deleteErorrMessage}</span>
					)}
				</Modal.Body>
				<Modal.Footer>
					<button
						type="button"
						className="btn btn-secondary"
						onClick={() => setDeleteApply(null)}
						disabled={isDeleteSending}
					>
						Abbrechen
					</button>
					<button
						type="button"
						className="btn btn-danger"
						onClick={() => handleDelete(deleteApply.id)}
						disabled={isDeleteSending}
					>
						Löschen {isDeleteSending ? <Spinner animation="border" /> : null}
					</button>
				</Modal.Footer>
			</Modal>

			<Modal show={editErrorMessage != null}>
				<Modal.Header>
					<Modal.Title>Fehler beim Bearbeiten</Modal.Title>
					<button
						type="button"
						className="btn-close"
						aria-label="hide"
						disabled={isDeleteSending}
						onClick={() => setEditErrorMessage(null)}
					/>
				</Modal.Header>
				<Modal.Body>
					<p className="text-danger">{editErrorMessage}</p>
				</Modal.Body>
				<Modal.Footer>
					<button
						type="button"
						className="btn btn-primary"
						onClick={() => setEditErrorMessage(null)}
					>
						Ok
					</button>
				</Modal.Footer>
			</Modal>
		</PageWrapper>
	);
}

// Serverside helper code. Returns either the workshop json string or null if the worksohpId doesn't exist
const getWorkshopServerSide = async (workshopId: string): Promise<Workshop | null> => {
	try {
		const workshopWithApplicants = await prisma.workshop.findUnique({
			where: {
				id: +workshopId,
			},
			include: {
				Apply: {
					include: {
						student_id: true,
					},
				},
			},
		});

		return workshopWithApplicants;
	} catch (exception) {
		console.error(exception);
		return null;
	}
};

export const getServerSideProps: GetServerSideProps = async (
	context: GetServerSidePropsContext,
) => {
	const workshopId = context.query.workshopId as string;
	const workshop = await getWorkshopServerSide(workshopId);

	return {
		props: {
			workshopJSON: JSON.stringify(workshop),
			pageTitle:
				(process.env.SYMPOSIUM === 'true' ? 'Mannheim Symposium' : 'INTEGRA e.V.') +
				(workshop == null ? ' - Unbekannter Workshop' : ` - Workshop ${workshop.name}`),
			isSymposium: process.env.SYMPOSIUM === 'true',
		},
	};
};
