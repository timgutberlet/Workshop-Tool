import React from 'react';
import { GetServerSideProps } from 'next';
import NewWorkshop from '../../../components/adminPanel/newWorkshop';
import PageWrapper from '../../../components/pageWrapper';
import { getAdminCompanies } from '../../api/admin/companies';

export default function CreateWorkshop(props: {
	companiesJSON: string;
	pageTitle: string;
	isSymposium: boolean;
}) {
	return (
		<PageWrapper pageTitle={props.pageTitle} isSymposium={props.isSymposium}>
			<NewWorkshop companiesJSON={props.companiesJSON} />
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
					? 'Mannheim Symposium - Workshop Erstellen'
					: 'INTEGRA e.V. - Workshop Erstellen',
			isSymposium: process.env.SYMPOSIUM === 'true',
		},
	};
};
