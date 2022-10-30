import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/dist/client/router';
import React, { ReactElement, useMemo } from 'react';
import { Row } from 'react-bootstrap';
import { GetStaticProps } from 'next';
import PageWrapper from '../../components/pageWrapper';

const signinPageUrl = '/api/auth/signin';
const errors: {
	[errorKey: string]: { heading: string; message: ReactElement };
} = {
	unknown: {
		heading: 'Unbekannter Fehler',
		message: (
			<>
				<p>
					Bitte versuchen Sie erneut sich anzumelden.
					<br />
					Falls dieser Fehler weiterhin auftritt, wenden Sie sich bitte an den{' '}
					<a href="mailto:support@integra-ev.de">
						<u>Support</u>
					</a>
					.
				</p>
				<a href={signinPageUrl}>
					<button type="button" className="btn btn-primary mt-2">
						Nochmal versuchen
					</button>
				</a>
			</>
		),
	},
	accessdenied: {
		heading: 'Zugriff verweigert',
		message: (
			<>
				<p>Sie haben keine Berechtigung sich anzumelden.</p>
				<a href={signinPageUrl}>
					<button type="button" className="btn btn-primary mt-2">
						Nochmal versuchen
					</button>
				</a>
			</>
		),
	},
	verification: {
		heading: 'Login nicht möglich',
		message: (
			<>
				<p>
					Der verwendete Link ist nicht mehr aktiv.
					<br />
					Er wurde entweder bereits genutzt oder ist abgelaufen.
				</p>
				<a href={signinPageUrl}>
					<button type="button" className="btn btn-primary mt-2">
						Nochmal versuchen
					</button>
				</a>
			</>
		),
	},
};

function Error(props: { pageTitle: string; isSymposium: boolean }): ReactElement {
	const router = useRouter();
	const { error: errorId } = router.query;

	const error = useMemo(() => {
		if (!errorId || Array.isArray(errorId)) {
			return errors.unknown;
		}

		return errors[errorId.toLowerCase()] ?? errors.unknown;
	}, [errorId]);

	return (
		<PageWrapper pageTitle={props.pageTitle} isSymposium={props.isSymposium}>
			<Row>
				<h1 className="text-center">
					{error.heading} <FontAwesomeIcon icon={faTimesCircle} color="red" />
				</h1>
			</Row>
			<Row>
				<p className="text-center">{error.message}</p>
			</Row>
		</PageWrapper>
	);
}

export default Error;

export const getStaticProps: GetStaticProps = async () => {
	return {
		props: {
			pageTitle:
				process.env.SYMPOSIUM === 'true'
					? 'Mannheim Symposium - Workshops Login'
					: 'INTEGRA e.V. - Workshops Login',
			isSymposium: process.env.SYMPOSIUM === 'true',
		},
	};
};
