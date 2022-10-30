import React from 'react';
import { GetServerSideProps } from 'next';
import NewUserComp from '../../../components/adminPanel/newUser';
import PageWrapper from '../../../components/pageWrapper';
import { getAdminCompanies } from '../../api/admin/companies';

export default function createUser(props: {
	companiesJSON: string;
	pageTitle: string;
	isSymposium: boolean;
}) {
	return (
		<PageWrapper pageTitle={props.pageTitle} isSymposium={props.isSymposium}>
			<NewUserComp companiesJSON={props.companiesJSON} />
		</PageWrapper>
	);
}

// This is serverside code and will be run (on the server) before the component is created
export const getServerSideProps: GetServerSideProps = async () => {
	return {
		props: {
			// call the imported serverside code
			companiesJSON: JSON.stringify(await getAdminCompanies()),
			pageTitle:
				process.env.SYMPOSIUM === 'true'
					? 'Mannheim Symposium - Benutzer erstellen'
					: 'INTEGRA e.V. - Benutzer erstellen',
			isSymposium: process.env.SYMPOSIUM === 'true',
		},
	};
};
