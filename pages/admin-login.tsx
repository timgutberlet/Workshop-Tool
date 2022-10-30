import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import { Button, Form, Card, Col, Row, Image } from 'react-bootstrap';
import { GetStaticProps } from 'next';
import PageWrapper from '../components/pageWrapper';

export default function adminLogin(props: { pageTitle: string; isSymposium: boolean }) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = (event) => {
		event.preventDefault();
		signIn('credentials', {
			redirect: true,
			callbackUrl: '/admin-panel',
			username,
			password,
		});
	};

	const handleUsernameChange = (event) => {
		setUsername(event.target.value);
	};

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};

	return (
		<PageWrapper pageTitle={props.pageTitle} isSymposium={props.isSymposium}>
			<Row className="justify-content-center">
				<Col xs="auto">
					<h1>Login Workshop-Tool</h1>
				</Col>
			</Row>
			<Row className="justify-content-center mt-5">
				<Col sm={12} md={10} lg={6}>
					<Card style={{ padding: '1em' }}>
						<Form method="post" onSubmit={handleSubmit}>
							<Form.Group>
								<Form.Label>Username</Form.Label>
								<Form.Control
									type="text"
									id="username"
									name="username"
									placeholder="Username eingeben"
									onChange={handleUsernameChange}
								/>
							</Form.Group>
							<Form.Group style={{ marginTop: '1em' }}>
								<Form.Label>Password</Form.Label>
								<Form.Control
									type="password"
									id="password"
									name="password"
									placeholder="Password eingeben"
									onChange={handlePasswordChange}
								/>
							</Form.Group>
							<Row style={{ marginTop: '1em' }}>
								<Col>
									<Button variant="primary" type="submit">
										Login
									</Button>
								</Col>
								<Col className="text-md-end my-auto">
									<Image src="/logo.png" alt="" width="100%" fluid />
								</Col>
							</Row>
						</Form>
					</Card>
				</Col>
			</Row>
		</PageWrapper>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	return {
		props: {
			pageTitle:
				process.env.SYMPOSIUM === 'true'
					? 'Mannheim Symposium - Admin Login'
					: 'INTEGRA e.V. - Workshops Admin Login',
			isSymposium: process.env.SYMPOSIUM === 'true',
		},
	};
};
