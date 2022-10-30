import React from 'react';
import { Button } from 'react-bootstrap';

export default function SelectComp() {
	const [showResults, setShowResults] = React.useState(false);
	const onClick = () => setShowResults(true);

	// TODO fix companyDropdown & include it
	return (
		<div>
			<Button variant="secondary" onClick={onClick}>
				Nutzer zuordnen
			</Button>
			{showResults ? <div /> : <div> </div>}
		</div>
	);
}
