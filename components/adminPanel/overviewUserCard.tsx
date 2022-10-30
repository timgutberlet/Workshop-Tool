import React from 'react';
import { Card, Row, Col, OverlayTrigger } from 'react-bootstrap';
import { faTrash, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Company, Role } from '@prisma/client';
import { prettyPrintDate } from '../../lib/prisma/prettyPrint';
import textToolTip from '../../components/textToolTip';

interface adminPanelCardProps {
	name: string;
	email: string;
	role: string;
	company: Company;
	lastUpdate: Date;
	id: number;
	// eslint-disable-next-line no-unused-vars
	updateUser: (userId: number) => void;
	// eslint-disable-next-line no-unused-vars
	deleteUserHelp: (userId: number) => void;
}

export default function CardAdminPanel({
	name,
	email,
	role,
	company,
	lastUpdate,
	id,
	updateUser,
	deleteUserHelp,
}: adminPanelCardProps) {
	const handleEditUserClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		updateUser(id);
	};
	const handleDeleteUserClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		deleteUserHelp(id);
	};

	return (
		<Col xs="12" md="6" xl="4" className="p-3">
			<Card className="h-100">
				<Card.Body className="p-1">
					<Card.Title>
						<h4 className="text-center">{name}</h4>
					</Card.Title>
					<Card.Text>
						<Row className="m-2">
							<Col xs={5}>Nutzernummer:</Col>
							<Col xs={7}>{id}</Col>
						</Row>
						<Row className="m-2">
							<Col xs={5}>Email:</Col>
							<Col xs={7}>
								<a href={`mailto:${email}`} className="text-link">
									{email}
								</a>
							</Col>
						</Row>
						<Row className="m-2">
							<Col xs={5}>Rolle:</Col>
							<Col xs={7}>
								{role.substring(0, 1) +
									role.substring(1, role.length).toLocaleLowerCase()}
							</Col>
						</Row>
						{role === Role.ADMIN ? null : (
							<>
								<Row className="m-2">
									<Col xs={5}>Firma:</Col>
									<Col xs={7}>
										{company != null ? (
											company.name
										) : (
											<span className="text-danger">unbekannt</span>
										)}
									</Col>
								</Row>
								<Row className="m-2">
									<Col xs={5}>Firmennummer:</Col>
									<Col xs={7}>
										{company != null ? (
											company.id
										) : (
											<span className="text-danger">unbekannt</span>
										)}
									</Col>
								</Row>
							</>
						)}
						<Row className="m-2">
							<Col xs={5}>Letztes Update:</Col>
							<Col xs={7}>
								{lastUpdate != null ? prettyPrintDate(lastUpdate) : 'unbekannt'}
							</Col>
						</Row>
						<Row className="m-2 mt-auto">
							<Col xs={12} className="text-center">
								<button
									className="btn btn-secondary"
									onClick={handleEditUserClicked}
									type="button"
									value={id}
								>
									Bearbeiten&nbsp;
									<FontAwesomeIcon icon={faUserEdit} color="white" />
								</button>
							</Col>
						</Row>
						<Row className="m-2 mt-auto">
							<Col xs={12} className="text-center">
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
										className="btn btn-danger"
										onClick={handleDeleteUserClicked}
										type="button"
										value={id}
									>
										<FontAwesomeIcon icon={faTrash} color="white" />
									</button>
								</OverlayTrigger>
							</Col>
						</Row>
					</Card.Text>
				</Card.Body>
			</Card>
		</Col>
	);
}
