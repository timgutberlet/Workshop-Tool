import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faSearch, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { signOut } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import CardDashboard from '../../components/adminPanel/cardDashboard';
import PageWrapper from '../../components/pageWrapper';
import prisma from '../../lib/prisma/prisma';

export default function Headtest(props: {
	unpublishedWorkshopsCount: number;
	pageTitle: string;
	isSymposium: boolean;
}) {
	const onLogoutClicked = () => {
		signOut({ redirect: true, callbackUrl: '/' });
	};

	return (
		<PageWrapper pageTitle={props.pageTitle} isSymposium={props.isSymposium}>
			<Row className="justify-content-center">
				<Col xs="auto">
					<h1>Admin Dashboard</h1>
				</Col>
			</Row>
			<Row className="mt-2">
				<Col className="mt-4" xs="12" md="6">
					<CardDashboard
						title="Workshops"
						listTexts={['Workshop Übersicht', 'Workshop hinzufügen']}
						listLinks={['/admin-panel/workshops', '/admin-panel/workshops/create']}
						listIcons={[
							<FontAwesomeIcon icon={faSearch} size="2x" />,
							<FontAwesomeIcon
								icon={faPlusCircle}
								size="2x"
								className="text-integra"
							/>,
						]}
						unpublishedWorkshops={props.unpublishedWorkshopsCount}
					/>
				</Col>
				<Col className="mt-4" xs="12" md="6">
					<CardDashboard
						title="Unternehmen"
						listTexts={['Unternehmen verwalten']}
						listLinks={['/admin-panel/companies']}
						listIcons={[<FontAwesomeIcon icon={faSearch} size="2x" />]}
						unpublishedWorkshops={0}
					/>
				</Col>
				<Col className="mt-4" xs="12" md="6">
					<CardDashboard
						title="Benutzer"
						listTexts={['Benutzer Übersicht', 'Benutzer hinzufügen']}
						listLinks={['/admin-panel/users', '/admin-panel/users/create']}
						listIcons={[
							<FontAwesomeIcon icon={faSearch} size="2x" />,
							<FontAwesomeIcon icon={faPlusCircle} size="2x" />,
						]}
						unpublishedWorkshops={0}
					/>
				</Col>
				<Col className="mt-4" xs="12" md="6">
					<CardDashboard
						title="Marketing"
						listTexts={['Marketing Statistik']}
						listLinks={['/admin-panel/marketing']}
						listIcons={[<FontAwesomeIcon icon={faSearch} size="2x" />]}
						unpublishedWorkshops={0}
					/>
				</Col>
			</Row>
			<Row className="mt-4">
				<Col xs={12} className="text-center">
					<button
						type="button"
						className="btn btn-xs btn-primary"
						onClick={onLogoutClicked}
					>
						Abmelden <FontAwesomeIcon icon={faSignOut} size="1x" />
					</button>
				</Col>
			</Row>
		</PageWrapper>
	);
}

export const getServerSideProps: GetServerSideProps = async () => {
	const result = await prisma.workshop.count({
		where: {
			state: 'UNPUBLISHED',
		},
	});
	return {
		props: {
			unpublishedWorkshopsCount: result,
			pageTitle:
				process.env.SYMPOSIUM === 'true'
					? 'Mannheim Symposium - Admin Panel'
					: 'INTEGRA e.V. - Admin Panel',
			isSymposium: process.env.SYMPOSIUM === 'true',
		},
	};
};
