import { GetStaticProps } from 'next';
import PageWrapper from '../components/pageWrapper';

export default function Custom404(props: { pageTitle: string; isSymposium: boolean }) {
	// TODO implement stylish 404 page
	return (
		<PageWrapper pageTitle={props.pageTitle} isSymposium={props.isSymposium}>
			<h1>404 - Seite konnte leider nicht gefunden werden! 😢</h1>
		</PageWrapper>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	return {
		props: {
			pageTitle:
				process.env.SYMPOSIUM === 'true'
					? 'Mannheim Symposium - 404 Seite nicht gefunden'
					: 'INTEGRA e.V. - 404 Seite nicht gefunden',
			isSymposium: process.env.SYMPOSIUM === 'true',
		},
	};
};
