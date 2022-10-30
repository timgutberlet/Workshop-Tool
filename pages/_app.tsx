/* eslint-disable react/jsx-props-no-spreading */
import { SessionProvider } from 'next-auth/react';
import { config } from '@fortawesome/fontawesome-svg-core';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.css';

// Datepicker css
import 'react-datetime/css/react-datetime.css';

// Custom css
import '../styles/globals.css';

// fontawesome css
import '@fortawesome/fontawesome-svg-core/styles.css';
import { useRouter } from 'next/router';

// fix for fontawesome icons
config.autoAddCss = false;

// App component
function App({ Component, pageProps: { session, ...pageProps } }) {
	const router = useRouter();

	useEffect(() => {
		const handleRouteChange = (url) => {
			ReactGA.set({ page: url });
			ReactGA.send({ hitType: 'pageview', page: url });
		};
		ReactGA.initialize('G-5HBP851PTB');
		ReactGA.set({ page: router.pathname });
		ReactGA.send({ hitType: 'pageview', page: router.pathname });
		router.events.on('routeChangeComplete', handleRouteChange);
		return () => {
			router.events.off('routeChangeComplete', handleRouteChange);
		};
	}, []);

	return (
		<SessionProvider session={session}>
			<Component {...pageProps} />
		</SessionProvider>
	);
}

export default App;
