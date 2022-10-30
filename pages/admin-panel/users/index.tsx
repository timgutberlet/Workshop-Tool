import React from 'react';
import { Company, User } from '@prisma/client';
import { GetServerSideProps } from 'next';
import UserManagement from '../../../components/adminPanel/UserManagement';
import { getAdminUsersWithCompany } from '../../api/admin/users';
import { getAdminCompanies } from '../../api/admin/companies';
import PageWrapper from '../../../components/pageWrapper';

export default function Home(props: {
	usersJSON: string;
	companiesJSON: string;
	pageTitle: string;
	isSymposium: boolean;
}) {
	const companies: Array<Company> = JSON.parse(props.companiesJSON);
	const users: Array<
		User & {
			Company: Company;
		}
	> = JSON.parse(props.usersJSON);

	return (
		<PageWrapper pageTitle={props.pageTitle} isSymposium={props.isSymposium}>
			<UserManagement userArr={users} companies={companies} />
		</PageWrapper>
	);
}

export const getServerSideProps: GetServerSideProps = async () => {
	return {
		props: {
			// call the imported serverside code
			usersJSON: JSON.stringify(await getAdminUsersWithCompany(0)),
			companiesJSON: JSON.stringify(await getAdminCompanies()),
			pageTitle:
				process.env.SYMPOSIUM === 'true'
					? 'Mannheim Symposium - Benutzer verwalten'
					: 'INTEGRA e.V. - Benutzer verwalten',
			isSymposium: process.env.SYMPOSIUM === 'true',
		},
	};
};
