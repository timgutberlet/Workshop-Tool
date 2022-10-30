import { User } from '@prisma/client';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function OverviewCompanyGetUserTr({ users, companyId }) {
	function OverviewGetWorkshops() {
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

	return <> {OverviewGetWorkshops()} </>;
}
