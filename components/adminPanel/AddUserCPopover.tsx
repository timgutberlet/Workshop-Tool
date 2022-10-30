import React from 'react';
import { Popover } from 'react-bootstrap';

export default function SelectComp() {
	return (
		<Popover id="popover-basic">
			<Popover.Header as="h3">Popover right</Popover.Header>
			<Popover.Body>
				And heres some <strong>amazing</strong> content. Its very engaging. right?
			</Popover.Body>
		</Popover>
	);
}
