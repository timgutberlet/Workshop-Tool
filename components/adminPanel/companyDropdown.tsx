import { Form } from 'react-bootstrap';
import { Company } from '@prisma/client';

// Use selected="-1" to disable the selected option
export default function CompanyDropdown(props: { companies: Array<Company>; selected: number }) {
	return (
		<Form.Group controlId="Company">
			<Form.Label>Company*</Form.Label>
			<Form.Control
				as="select"
				defaultValue={
					props.selected < 0 ||
					props.companies.findIndex((x: Company) => {
						return x.id === props.selected;
					}) === -1
						? ''
						: props.selected
				}
				name="company"
			>
				{props.companies.map((comp: Company) => (
					<option key={comp.id} value={comp.id}>
						{comp.name}
					</option>
				))}
				<option hidden value="">
					Bitte auswählen
				</option>
			</Form.Control>
		</Form.Group>
	);
}
