import { User } from '@prisma/client';

export default function OverviewCompanyGetUserTr({ users, companyId }) {
	function OverviewCompanyGetUsers() {
		let tableElements = [];
		if (users) {
			// eslint-disable-next-line array-callback-return
			tableElements = users.map((user: User) => {
				if (user.companyId === companyId) {
					return <tr>{user.name}</tr>;
				}
			});
		}

		return tableElements;
	}

	return <> {OverviewCompanyGetUsers()} </>;
}
