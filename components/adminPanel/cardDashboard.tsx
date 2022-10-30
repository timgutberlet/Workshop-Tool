import React from 'react';
import { Card, Row, Col, OverlayTrigger, Popover } from 'react-bootstrap';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface cardDashboardProps {
	title: string;
	listTexts: Array<string>;
	listLinks: Array<string>;
	// eslint-disable-next-line no-undef
	listIcons: Array<JSX.Element>;
	unpublishedWorkshops: Number;
}

export default function CardDashboard({
	title,
	listTexts,
	listLinks,
	listIcons,
	unpublishedWorkshops,
}: cardDashboardProps) {
	const popover = (
		<Popover
			id="popover-basic"
			style={{
				maxHeight: '75px',
			}}
		>
			<Popover.Body>
				{unpublishedWorkshops === 1 && (
					<p className="text-center">
						Es muss <strong>{unpublishedWorkshops}</strong> Workshop freigegeben werden!
					</p>
				)}
				{unpublishedWorkshops > 1 && (
					<p className="text-center">
						Es müssen <strong>{unpublishedWorkshops}</strong> Workshops freigegeben
						werden!
					</p>
				)}
			</Popover.Body>
		</Popover>
	);

	return (
		<Card>
			<Card.Header className="border-integra">
				<Row className="justify-content-center align-self-center">
					<Col xs="auto">
						<Card.Title>
							<h4>{title}</h4>
						</Card.Title>
					</Col>
				</Row>
			</Card.Header>
			<Card.Body>
				<Row>
					<Col xs="3" className="text-center justify-content-center align-self-center">
						{listIcons[0]}
					</Col>
					<Col xs="6" className="justify-content-center align-self-center">
						<Link href={listLinks[0]} passHref>
							<a>
								<b>{listTexts[0]}</b>
							</a>
						</Link>
					</Col>
					{unpublishedWorkshops > 0 && (
						<Col xs="3" className="justify-content-center align-self-center">
							<OverlayTrigger
								placement="bottom"
								delay={{ show: 250, hide: 400 }}
								overlay={popover}
							>
								<a href={listLinks[1]}>
									<FontAwesomeIcon
										icon={faExclamationTriangle}
										transform="grow-3"
										color="red"
									/>
								</a>
							</OverlayTrigger>
						</Col>
					)}
				</Row>
				{listLinks.length > 1 && (
					<Row className="mt-3">
						<Col
							xs="3"
							className="text-center justify-content-center align-self-center"
						>
							{listIcons[1]}
						</Col>
						<Col xs="9" className="justify-content-center align-self-center">
							<Link href={listLinks[1]} passHref>
								<a>
									<b>{listTexts[1]}</b>
								</a>
							</Link>
						</Col>
					</Row>
				)}
				{listLinks.length > 2 && (
					<Row className="mt-3">
						<Col
							xs="3"
							className="text-center justify-content-center align-self-center"
						>
							{listIcons[2]}
						</Col>
						<Col xs="9" className="justify-content-center align-self-center">
							<Link href={listLinks[2]} passHref>
								<a>
									<b>{listTexts[2]}</b>
								</a>
							</Link>
						</Col>
					</Row>
				)}
			</Card.Body>
		</Card>
	);
}
