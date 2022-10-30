/* eslint-disable react/require-default-props */
import React, { MouseEvent } from 'react';
import { Col, Row } from 'react-bootstrap';

type ApplicationFormButtonsProps = {
	// eslint-disable-next-line no-unused-vars
	onBack?: (e: MouseEvent<HTMLButtonElement>) => void;
	isLastStep?: boolean;
};

export default function ApplicationFormButtons(props: ApplicationFormButtonsProps) {
	return (
		<Row className="mt-xs-1">
			{props.onBack === undefined ? null : (
				<Col xs={6} className="justify-content-center d-flex">
					<button
						className="btn btn-secondary fw-bold btn-lg"
						type="button"
						onClick={props.onBack}
					>
						Zurück
					</button>
				</Col>
			)}
			<Col xs={props.onBack === undefined ? 12 : 6} className="justify-content-center d-flex">
				<button className="btn text-white fw-bold btn-lg btn-integra" type="submit">
					{props.isLastStep ? 'Absenden' : 'Weiter'}
				</button>
			</Col>
		</Row>
	);
}
