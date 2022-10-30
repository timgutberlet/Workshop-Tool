import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { User, Company } from '@prisma/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function OverviewCompanyCard(props: {
	company: Company & { users: User[] };
	// eslint-disable-next-line no-unused-vars
	editCallback: (companyId: number) => void;
	// eslint-disable-next-line no-unused-vars
	deleteCallback: (companyId: number) => void;
}) {
	return (
		<Col xs="12" md="6" xl="4">
			<Card key={props.company.id} className="my-2 p-3">
				<Row className="justify-content-center">
					<Col xs={12}>
						<Row className="mb-2">
							{/* unsure about this text center designwise... */}
							<Col className="text-center" xs={8}>
								<h5>{props.company.name}</h5>
							</Col>
							<Col className="text-end" xs={4}>
								<span>
									<button
										className="btn btn-xs btn-invsible"
										type="button"
										onClick={() => props.deleteCallback(props.company.id)}
									>
										<FontAwesomeIcon icon={faTrash} size="1x" />
									</button>
									<button
										className="btn btn-xs btn-invsible"
										type="button"
										onClick={() => props.editCallback(props.company.id)}
									>
										<FontAwesomeIcon icon={faEdit} size="1x" />
									</button>
								</span>
							</Col>
						</Row>
						<Row className="my-2 ms-1">
							<Col xs={5}>Firmennummer:</Col>
							<Col xs={7}>{props.company.id}</Col>
						</Row>
						<Row className="my-2 ms-1">
							<Col xs={12}>Liste der Benutzer:</Col>
						</Row>
						<ul className="list-group ms-1 me-2">
							{props.company.users != null && props.company.users.length !== 0 ? (
								props.company.users.map((user) => (
									<li className="list-group-item" key={user.id}>
										{user.name} <span className="fw-lighter">({user.id})</span>
									</li>
								))
							) : (
								<li className="list-group-item fw-light">
									Keine Benutzer gefunden
								</li>
							)}
						</ul>
					</Col>
				</Row>
			</Card>
		</Col>
	);
}
