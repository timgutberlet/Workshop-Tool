import React, { useState } from 'react';
import Link from 'next/link';
import { Col, Row } from 'react-bootstrap';
import { faFacebook, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { config } from '@fortawesome/fontawesome-svg-core';
import CookieConsent from 'react-cookie-consent';
import LicenseModal from './licenseModal';

config.autoAddCss = false;

export default function Footer() {
	const [isLicenseModalVisible, setLicenseModalVisible] = useState(false);

	const showLicenseModal = (e: any) => {
		e.preventDefault();
		setLicenseModalVisible(true);
	};

	return (
		<>
			<CookieConsent
				location="bottom"
				buttonText="Zustimmen"
				cookieName="cookie-consent"
				style={{ background: '#2B373B' }}
				buttonStyle={{ color: '#4e503b', fontSize: '13px', float: 'right' }}
				expires={150}
			>
				Diese Website verwendet Cookies, um die Nutzererfahrung zu verbessern.
			</CookieConsent>

			<LicenseModal
				visible={isLicenseModalVisible}
				handleClose={() => setLicenseModalVisible(false)}
			/>

			<footer className="footer mt-auto py-3 bg-light">
				<div className="container">
					<Row>
						<Col
							xs={12}
							sm={4}
							className="text-muted text-center order-2 order-sm-1  d-flex"
						>
							<Row className="justify-content-center align-self-center text-center w-100">
								<Link href="https://integra-ev.de/impressum/" passHref>
									<a>Impressum</a>
								</Link>
								<Link href="https://integra-ev.de/datenschutz/" passHref>
									<a>Datenschutz</a>
								</Link>
							</Row>
						</Col>
						<Col xs={12} sm={4} className="my-3 my-sm-2 text-center order-1 order-sm-2">
							<Link href="https://www.linkedin.com/company/integra-e-v---studentische-unternehmensberatung/">
								<a className="mx-2">
									<FontAwesomeIcon icon={faLinkedin} size="2x" />
								</a>
							</Link>
							<Link href="https://www.facebook.com/integraev/">
								<a className="mx-2">
									<FontAwesomeIcon icon={faFacebook} size="2x" />
								</a>
							</Link>
							<Link href="https://www.instagram.com/integra_e.v/">
								<a className="mx-2">
									<FontAwesomeIcon icon={faInstagram} size="2x" />
								</a>
							</Link>
						</Col>
						<Col
							xs={12}
							sm={4}
							className="text-muted text-center order-3 order-sm-3 d-flex"
						>
							<Row className="justify-content-center align-self-center text-center w-100">
								<a href="" onClick={showLicenseModal}>
									Lizenzen
								</a>{' '}
								<Link href="/admin-login" passHref>
									<a>Admin Login</a>
								</Link>
							</Row>
						</Col>
					</Row>
				</div>
			</footer>
		</>
	);
}
