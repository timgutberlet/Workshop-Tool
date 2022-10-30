import { Button, Form } from 'react-bootstrap';

export default function detailUserComp() {
	return (
		<Form action="/detailUser">
			<Button variant="primary" type="submit" style={{ marginTop: '2%' }}>
				Nutzer hinzufügen
			</Button>
		</Form>
	);
}
