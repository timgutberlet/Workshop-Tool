import React, { FormEvent, useState } from 'react';
import { Col, Modal, Row, Spinner } from 'react-bootstrap';
import { User, Company } from '.prisma/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import OverviewUserCard from './overviewUserCard';
import UserEditModal from './UserEditModal';

interface OverviewUserCardDivProps {
	userArr: Array<
		User & {
			Company: Company;
		}
	>;
	companies: Array<Company>;
}

export default function CardAdminPanel({ userArr, companies }: OverviewUserCardDivProps) {
	// Router to move to other page
	const router = useRouter();

	// Id of the user currently getting edited
	const [editUserId, setEditUserId] = useState(-1);

	// Move to modal
	// Is this page currently waiting on a request?
	const [updateState, setUpdateState] = useState(false);

	// Move to modal component
	// error message after sending the update request
	const [updateErrorMessage, setUpdateErrorMessage] = useState('');

	const updateUser = (userId: number) => {
		setEditUserId(userId);
	};

	// Delete Workshop
	// default values for the states
	// states for the deletion of a workshop
	const [deleteUserID, setDeleteUserID] = useState(-1);
	const deleteUser = userArr.find((x: User) => {
		return x.id === deleteUserID;
	});
	const [updateDeleteErrorMessage, setUpdateDeleteErrorMessage] = useState('');

	const [updateDeleteState, setUpdateDeleteState] = useState(false);
	const deleteUserHelp = (userID: number) => {
		setDeleteUserID(userID);
	};
	// deletes the selcted workshop
	const deleteUserFunction = async (userId: number) => {
		setUpdateDeleteState(true);
		setUpdateDeleteErrorMessage('');

		const result = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });

		setUpdateDeleteState(false);

		if (result.status === 200) {
			setDeleteUserID(-1); // close delete popup
			router.push(router.asPath, router.asPath, { scroll: false }); // update the page without scrolling to the top
		} else {
			setUpdateDeleteErrorMessage(
				`Ein Fehler ist Aufgetreten: ${result.status} ${
					result.statusText
				} ${await result.text()}`,
			);
		}
	};
	const getCards = (argUsers: Array<User & { Company: Company }>) => {
		return argUsers
			? argUsers.map((user) => (
					<OverviewUserCard
						key={user.email}
						name={user.name}
						email={user.email}
						role={user.role}
						company={user.Company}
						lastUpdate={new Date(user.updatedAt)}
						id={user.id}
						updateUser={updateUser}
						deleteUserHelp={deleteUserHelp}
					/>
			  ))
			: [];
	};

	const handleAbort = () => {
		setEditUserId(-1);
	};

	// Also to modal
	const handleSave = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// @ts-ignore
		const formData = new FormData(e.target);
		setUpdateState(true);
		setUpdateErrorMessage('');

		const result = await fetch(`/api/admin/users/${editUserId}`, {
			method: 'PUT',
			body: JSON.stringify({
				role: formData.get('role') === 'ADMIN' ? 'ADMIN' : 'PARTNER',
				company: formData.get('company'),
				name: formData.get('name'),
				email: formData.get('email'),
			}),
		});

		setUpdateState(false);

		if (result.status === 200) {
			setEditUserId(-1); // Close the edit menu
			router.push(router.asPath, router.asPath, { scroll: false }); // update the page without scrolling to the top
		} else {
			// Show error message
			setUpdateErrorMessage(
				`Ein Fehler ist Aufgetreten: ${result.status} ${
					result.statusText
				} ${await result.text()}`,
			);
		}
	};

	const editUser = userArr.find((x: User) => {
		return x.id === editUserId;
	});

	return (
		<>
			<Row className="d-flex mb-2 mt-1">
				<Col xs={2} className="">
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
					<h2>Benutzer</h2>
				</Col>
				<Col xs={2} className="float-end text-end">
					<Link href="/admin-panel/users/create" passHref>
						<button className="btn btn-primary" type="button">
							<span>
								<FontAwesomeIcon
									icon={faPlusCircle}
									size="1x"
									className="text-integra"
								/>
								<span className="d-none d-md-inline"> Neu</span>
							</span>
						</button>
					</Link>
				</Col>
			</Row>

			<Row>{getCards(userArr)}</Row>
			<UserEditModal
				companyArr={companies}
				editUser={editUser}
				id={editUserId}
				handleAbort={handleAbort}
				handleSave={handleSave}
				updateErrorMessage={updateErrorMessage}
				updateState={updateState}
			/>
			<Modal show={deleteUserID !== -1}>
				<Modal.Header>
					<Modal.Title>Nutzer Löschen</Modal.Title>
					<button
						type="button"
						className="btn-close"
						aria-label="hide"
						disabled={updateDeleteState}
						onClick={() => setDeleteUserID(-1)}
					/>
				</Modal.Header>
				<Modal.Body>
					<p>
						{deleteUserID === -1 ? (
							<span className="text-danger">nicht gefunden</span>
						) : (
							<>
								Bist du dir sicher, dass du den User{' '}
								<span className="fw-bold">{deleteUser.name}</span> löschen möchtest?
							</>
						)}
					</p>
					<span className="text-danger">{updateDeleteErrorMessage}</span>
				</Modal.Body>
				<Modal.Footer>
					<button
						type="button"
						className="btn btn-secondary"
						onClick={() => setDeleteUserID(-1)}
						disabled={updateDeleteState}
					>
						Abbrechen
					</button>
					<button
						type="button"
						className="btn btn-danger"
						onClick={() => deleteUserFunction(deleteUser.id)}
						disabled={updateDeleteState}
					>
						Löschen {updateDeleteState ? <Spinner animation="border" /> : null}
					</button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
