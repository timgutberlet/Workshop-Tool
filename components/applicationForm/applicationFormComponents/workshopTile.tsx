import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { Workshop } from '@prisma/client';
import Image from 'next/image';

import styles from '../../../styles/tile.module.css';

type WorkshopTileProps = {
	workshop: Workshop;
	selected: boolean;
	// eslint-disable-next-line no-unused-vars
	onChange: (id: number) => void;
};

export default function WorkshopTile(props: WorkshopTileProps) {
	const [hoverBorder, setHoverBorder] = useState(false);

	const handleClick = (event: any): void => {
		event.preventDefault();
		props.onChange(props.workshop.id);
	};

	return (
		<div className="hover-overlay shadow-1-strong rounded h-100">
			<Card
				className={styles.workshopCard}
				border={props.selected ? 'dark' : hoverBorder ? 'secondary' : 'light'}
				style={{ borderWidth: '5px' }}
				onMouseEnter={() => setHoverBorder(true)}
				onMouseLeave={() => setHoverBorder(false)}
				onClick={handleClick}
			>
				<Card.Header className="text-center fs-5">
					{new Date(props.workshop.date).toLocaleDateString('de-DE')}
				</Card.Header>
				<div className="m-2 mx-3 d-block">
					<Image
						src={`/api/public/workshops/${props.workshop.id}/image?version=${props.workshop.imageVersion}`}
						alt=""
						layout="responsive"
						width="1600"
						height="1600"
					/>
				</div>
				<Card.Body className="p-2">
					<hr style={{ margin: '0 0 0.4rem 0' }} />
					<Card.Title className="text-center px-3">{props.workshop.name}</Card.Title>
					<Card.Text className="text-center text-muted">
						{props.workshop.description}
					</Card.Text>
				</Card.Body>
			</Card>
		</div>
	);
}
