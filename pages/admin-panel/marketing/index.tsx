import { faChevronLeft, faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next/types';
import React from 'react';
import { Row, Col, OverlayTrigger, Tooltip as BootstrapTooltip, Form } from 'react-bootstrap';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
} from 'recharts';
import PageWrapper from '../../../components/pageWrapper';
import { getAdminSources } from '../../api/admin/sources';

const marketing = (props) => {
	const router = useRouter();

	// Test Data for Bar Chart
	const marketingTestData = [
		{
			name: 'Page A',
			uv: 4000,
			pv: 2400,
			amt: 2400,
		},
		{
			name: 'Page B',
			uv: 3000,
			pv: 1398,
			amt: 2210,
		},
		{
			name: 'Page C',
			uv: 2000,
			pv: 9800,
			amt: 2290,
		},
		{
			name: 'Page D',
			uv: 2780,
			pv: 3908,
			amt: 2000,
		},
		{
			name: 'Page E',
			uv: 1890,
			pv: 4800,
			amt: 2181,
		},
		{
			name: 'Page F',
			uv: 2390,
			pv: 3800,
			amt: 2500,
		},
		{
			name: 'Page G',
			uv: 3490,
			pv: 4300,
			amt: 2100,
		},
	];

	return (
		<PageWrapper pageTitle={props.pageTitle} isSymposium={props.isSymposium}>
			<Row className="mb-4">
				<Col xs={2}>
					<button
						type="button"
						className="btn btn-invisible"
						onClick={() => {
							router.back();
						}}
					>
						<span>
							<FontAwesomeIcon icon={faChevronLeft} size="1x" />
							<span className="d-none d-md-inline"> Zurück</span>
						</span>
					</button>
				</Col>
				<Col xs={8} className="text-center">
					<h1>Marketing Info</h1>
					<h4 className="text-warning">🛠 Work in Progress 🛠</h4>
				</Col>
				<Col xs={2}>
					<OverlayTrigger
						overlay={
							<BootstrapTooltip>Zip Download aller Bewerbungen</BootstrapTooltip>
						}
					>
						<Link href="/api/admin/marketing/xlsx" passHref>
							<button type="button" className="btn btn-primary">
								<FontAwesomeIcon icon={faDownload} size="1x" /> Download
							</button>
						</Link>
					</OverlayTrigger>
				</Col>
			</Row>
			<Row className="mb-4">
				<Col xs={12} md={6} className="px-4">
					<label htmlFor="filterWorkshop">Filter Workshop</label>
					<Form.Select id="filterWorkshop">
						<option selected value="0">
							Alle auswählen
						</option>
						<option value="1">Workshop A</option>
						<option value="1">Workshop B</option>
						<option value="1">Workshop C</option>
					</Form.Select>
				</Col>
				<Col xs={12} md={6} className="px-4">
					<label htmlFor="filterSource">Filter Quelle</label>
					<Form.Select id="filterSource">
						<option selected value="0">
							Alle auswählen
						</option>
						<option value="1">Quelle A</option>
						<option value="1">Quelle B</option>
						<option value="1">Quelle C</option>
					</Form.Select>
				</Col>
			</Row>
			<Row style={{ minHeight: '400px' }} className="mt-3">
				<Col xs={12} md={6}>
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							width={500}
							height={300}
							data={marketingTestData}
							margin={{
								top: 5,
								right: 30,
								left: 20,
								bottom: 5,
							}}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Bar dataKey="pv" fill="#8884d8" />
							<Bar dataKey="uv" fill="#82ca9d" />
						</BarChart>
					</ResponsiveContainer>
				</Col>
				<Col xs={12} md={6}>
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							width={500}
							height={300}
							data={marketingTestData}
							margin={{
								top: 5,
								right: 30,
								left: 20,
								bottom: 5,
							}}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Bar dataKey="pv" fill="#8884d8" />
							<Bar dataKey="uv" fill="#82ca9d" />
						</BarChart>
					</ResponsiveContainer>
				</Col>
			</Row>
		</PageWrapper>
	);
};

export default marketing;

// This is serverside code and will be run (on the server) before the component is created
export const getServerSideProps: GetServerSideProps = async () => {
	return {
		props: {
			marketingInfo: await getAdminSources(),
			pageTitle:
				process.env.SYMPOSIUM === 'true' ? 'Workshops Bewerbung' : 'INTEGRA e.V. Workshops',
			isSymposium: process.env.SYMPOSIUM === 'true',
		},
	};
};
