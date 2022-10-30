/* eslint-disable no-unused-vars */
import 'next-auth';

declare module 'next-auth' {
	interface User {
		id: Number;
		role: String;
		companyId: Number;
	}

	interface Session {
		user: User;
	}
}
