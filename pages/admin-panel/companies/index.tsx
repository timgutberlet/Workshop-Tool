import React, { FormEvent, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Company, User } from '@prisma/client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import Link from 'next/link';
import { GetServerSideProps } from 'next';
import useRefresh from '../../../lib/hooks/refresh';

import { getAdminUsers } from '../../api/admin/users';
import { getAdminCompanies } from '../../api/admin/companies';

import PageWrapper from '../../../components/pageWrapper';

import DeleteCompanyModal from '../../../components/adminPanel/companies/deleteCompanyModal';
import OverviewCompanyCard from '../../../components/adminPanel/companies/overviewCompanyCard';
import EditCompanyModal from '../../../components/adminPanel/companies/editCompanyModal';

export default function Companies(props: {
	companiesJSON: string;
	pageTitle: string;
	isSymposium: boolean;
}) {
	// Id of the company currently getting edited
	const [editId, setEditId] = useState(-2); // -1 is used for add and -2 is used for not shown

	// TODO Move to modal
	// Is this page currently waiting on a request?
	const [waitingForRequest, setWaitingForRequest] = useState(false);

	// TODO Move to modal component
	// error message after sending the last request
	const [requestErrorMessage, setRequestErrorMessage] = useState('');

	// is the delete confirmation popup visible
	const [deleteId, setDeleteId] = useState(-1); // -1 is not visible

	// Call this to refresh the data after it has been changed
	const refreshCallback = useRefresh();

	const companies: Array<Company & { users: User[] }> = JSON.parse(props.companiesJSON);

	// Show edit popup
	const editCompanyClicked = (companyId: number) => {
		setEditId(companyId);
	};

	// Show create popup
	const createCompanyClicked = () => {
		setEditId(-1);
	};

	// Close edit popup
	const handleEditAbort = () => {
		setEditId(-2);
		setRequestErrorMessage('');
	};

	// Show delete popup
	const handleDeleteClicked = (companyId: number) => {
		setDeleteId(companyId);
	};

	const handleDeleteAbort = () => {
		setDeleteId(-1);
		setRequestErrorMessage('');
	};

	const handleDelete = async (companyId: number) => {
		// @ts-ignore
		setWaitingForRequest(true);
		setRequestErrorMessage('');

		const result = await fetch(`/api/admin/companies/${companyId}`, {
			method: 'DELETE',
		});

		setWaitingForRequest(false);

		if (result.status === 200) {
			setDeleteId(-1); // Close the menu
			refreshCallback(); // Refresh the site
		} else {
			// Show error message
			setRequestErrorMessage(
				`${result.statusText} (${result.status}): ${await result.text()}`,
			);
		}
	};

	const handleSave = async (e: FormEvent<HTMLFormElement>, isCreate: boolean) => {
		e.preventDefault();

		// @ts-ignore
		const formData = new FormData(e.target);
		setWaitingForRequest(true);
		setRequestErrorMessage('');

		const result = await (isCreate
			? fetch(`/api/admin/companies`, {
					method: 'POST',
					headers: new Headers({ 'content-type': 'application/json' }),
					body: JSON.stringify({
						name: formData.get('name'),
					}),
			  })
			: fetch(`/api/admin/companies/${editId}`, {
					method: 'PUT',
					headers: new Headers({ 'content-type': 'application/json' }),
					body: JSON.stringify({
						name: formData.get('name'),
					}),
			  }));

		setWaitingForRequest(false);

		if (result.status === 200) {
			setEditId(-2); // Close the menu
			refreshCallback(); // Refresh the site
		} else {
			// Show error message
			setRequestErrorMessage(
				`Ein Fehler ist Aufgetreten: ${result.status} ${
					result.statusText
				} ${await result.text()}`,
			);
		}
	};

	return (
		<PageWrapper pageTitle={props.pageTitle} isSymposium={props.isSymposium}>
			<Row className="d-flex mb-2 mt-1">
				<Col xs={2} className="">
					<Link href="/admin-panel" passHref>
						<button type="button" className="btn btn-invisible">
							<span>
								<FontAwesomeIcon
									icon={faChevronLeft}
									size="1x"
									className="text-integra"
								/>
								<span className="d-none d-md-inline"> Zurück</span>
							</span>
						</button>
					</Link>
				</Col>
				<Col xs={8} className="text-center">
					<h2>Unternehmen</h2>
				</Col>
				<Col xs={2} className="float-end text-end">
					<button
						className="btn btn-invisible"
						type="button"
						onClick={createCompanyClicked}
					>
						<span>
							<FontAwesomeIcon
								icon={faPlusCircle}
								size="1x"
								className="text-integra"
							/>
							<span className="d-none d-md-inline"> Neu</span>
						</span>
					</button>
				</Col>
			</Row>
			<Row className="justify-content-center mt-2">
				{companies.map((company) => (
					<OverviewCompanyCard
						key={company.id}
						company={company}
						editCallback={editCompanyClicked}
						deleteCallback={handleDeleteClicked}
					/>
				))}
			</Row>
			<EditCompanyModal
				company={editId >= 0 ? companies.find((company) => company.id === editId) : null}
				isCreate={editId === -1}
				isVisible={editId !== -2}
				handleAbort={handleEditAbort}
				handleSave={handleSave}
				updateErrorMessage={requestErrorMessage}
				updateState={waitingForRequest}
			/>
			<DeleteCompanyModal
				company={
					deleteId !== 0 ? companies.find((company) => company.id === deleteId) : null
				}
				isVisible={deleteId !== -1}
				handleAbort={handleDeleteAbort}
				handleDelete={handleDelete}
				deleteErrorMessage={requestErrorMessage}
				updateState={waitingForRequest}
			/>
		</PageWrapper>
	);
}

export const getServerSideProps: GetServerSideProps = async () => {
	return {
		props: {
			usersJSON: JSON.stringify(await getAdminUsers(0)),
			companiesJSON: JSON.stringify(await getAdminCompanies()),
			pageTitle:
				process.env.SYMPOSIUM === 'true'
					? 'Mannheim Symposium - Firmen verwalten'
					: 'Integra e.V. - Firmen verwalten',
			isSymposium: process.env.SYMPOSIUM === 'true',
		},
	};
};
