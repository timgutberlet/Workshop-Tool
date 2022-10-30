import React, { CSSProperties } from 'react';
import { ProgressBar, Row, Col } from 'react-bootstrap';

// CSS helper to stack two divs
const stackedDivs: CSSProperties = {
	width: '100%',
	height: '100%',
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	paddingRight: '1.5%',
	paddingLeft: '1.5%',
};

export default function FormProgressBar(props: {
	step: number;
	totalSteps: number;
	sending: boolean;
	finishedSending: boolean;
	label: string;
}) {
	return props.step === 0 || props.finishedSending ? null : (
		<Row style={{ minHeight: '50px' }}>
			<Col xs={12} className="my-2 position-relative">
				<div style={stackedDivs}>
					<ProgressBar
						style={{
							fontWeight: 'bold',
							backgroundColor: '#6E6E6E',
							minHeight: '35px',
							textAlign: 'center',
						}}
						animated={props.sending}
						now={(props.step / props.totalSteps) * 100}
						variant="integra"
					/>
				</div>
				<div
					style={{
						...stackedDivs,
						zIndex: 2,
						textAlign: 'center',
					}}
				>
					<h4 style={{ zIndex: 2 }} className="rounded text-white">
						{props.label}
					</h4>
				</div>
			</Col>
		</Row>
	);
}
