import { Degree, Major, Source, University } from '@prisma/client';

import { GetServerSideProps } from 'next';
import SignupForm from '../components/applicationForm/signupForm';
import PageWrapper from '../components/pageWrapper';

import { getPublicWorkshops } from './api/public/workshops';
import { getAdminMajors } from './api/admin/majors';
import { getAdminDegrees } from './api/admin/degrees';
import { getAdminUniversities } from './api/admin/universities';
import { getAdminSources } from './api/admin/sources';

export default function Home(props: {
	workshops: string;
	degrees: Degree[];
	majors: Major[];
	universities: University[];
	marketingSources: Source[];
	pageTitle: string;
	isSymposium: boolean;
}) {
	return (
		<PageWrapper pageTitle={props.pageTitle} isSymposium={props.isSymposium}>
			<SignupForm
				workshops={JSON.parse(props.workshops)}
				degrees={props.degrees}
				majors={props.majors}
				universities={props.universities}
				marketingSources={props.marketingSources}
			/>
		</PageWrapper>
	);
}

// This is serverside code and will be run (on the server) before the component is created
export const getServerSideProps: GetServerSideProps = async () => {
	return {
		props: {
			workshops: JSON.stringify(await getPublicWorkshops()),
			majors: await getAdminMajors(),
			degrees: await getAdminDegrees(),
			universities: await getAdminUniversities(),
			marketingSources: await getAdminSources(),
			pageTitle:
				process.env.SYMPOSIUM === 'true' ? 'Workshops Bewerbung' : 'INTEGRA e.V. Workshops',
			isSymposium: process.env.SYMPOSIUM === 'true',
		},
	};
};
