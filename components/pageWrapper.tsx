import React from 'react';

import { Col } from 'react-bootstrap';
import { config } from '@fortawesome/fontawesome-svg-core';

import Footer from './footer';
import Header from './header';

config.autoAddCss = false;

export default function PageWrapper(props: {
	children: any;
	pageTitle: string;
	isSymposium: boolean;
}) {
	return (
		<div className="d-flex flex-column h-100 w-100">
			<Header pageTitle={props.pageTitle} isSymposium={props.isSymposium} />
			<main className="flex-shrink-0" style={{ marginTop: '6.9rem' }}>
				<div className="container my-2">
					<div className="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 border shadow-lg">
						<Col xs={12} className="p-3">
							{props.children}
						</Col>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
