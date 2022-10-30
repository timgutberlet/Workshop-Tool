import { Role } from '@prisma/client';
import NextAuth, { User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import ldap from 'ldapjs';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../lib/prisma/prisma';

/*
declare module 'next-auth' {
	// eslint-disable-next-line no-shadow, no-unused-vars
	interface User {
		id: number;
		role: Role;
		name: string;
		email: string;
		companyId: number | null;
	}

	// eslint-disable-next-line no-shadow, no-unused-vars
	interface JWT extends Record<string, unknown> {
		id: number;
		role: Role;
		name: string;
		email: string;
		companyId: number | null;
	}

	// eslint-disable-next-line no-shadow, no-unused-vars
	interface Session {
		user: User;
	}
}
*/

// #region ldap auth

async function ldapAuth(username: string, password: string): Promise<User> {
	let ldapClient: ldap.Client;
	try {
		ldapClient = ldap.createClient({
			url: process.env.LDAP_URI,
			bindDN: process.env.LDAP_BIND_DN,
			bindCredentials: process.env.LDAP_BIND_PW,
		});
	} catch (exception) {
		console.log(exception);
		ldapClient.destroy();
		throw new Error('Connection Failed');
	}

	try {
		// Search for the user with the username
		const userEntry = (await new Promise<ldap.SearchEntryObject>((resolve, reject) => {
			ldapClient.search(
				process.env.LDAP_BASE_DN,
				{
					filter: `(cn=${username})`,
					scope: 'sub',
				},
				(error, response) => {
					let user: ldap.SearchEntryObject;

					if (error) {
						reject(error);
						return;
					}

					response.on('searchEntry', (entry) => {
						user = entry.object;
					});
					response.on('error', (err) => {
						reject(err);
					});
					response.on('end', (result) => {
						if (result?.status !== 0) {
							reject(new Error('ldap search status is not 0, search failed'));
						} else {
							resolve(user);
						}
					});
				},
			);
		})) as ldap.SearchEntryObject & {
			mail: string;
			memberOf: string[];
		};

		// Rebind the user, thereby authenticating
		await new Promise<void>((resolve, reject) =>
			// eslint-disable-next-line no-promise-executor-return
			ldapClient.bind(userEntry.dn, password, (error) => {
				if (error) {
					console.error(error);
					// Auth failed
					reject();
				} else {
					// Auth successful
					resolve();
				}
			}),
		);

		// Authorize user
		const userGroups = userEntry.memberOf.map((groupDn: string) =>
			groupDn.split(',')[0].substr(3),
		);

		let userRole: Role;
		if (userGroups.includes(process.env.LDAP_ADMIN_GROUP)) {
			userRole = Role.ADMIN;
		} else {
			throw new Error('Unauthorized');
		}

		// Search user or create new one
		const user = await prisma.user.upsert({
			where: {
				email: userEntry.mail,
			},
			create: {
				email: userEntry.mail,
				name: `${userEntry.givenName} ${userEntry.sn}`,
				role: userRole,
				companyId: null,
			},
			update: {
				role: userRole,
			},
		});

		console.info({ userLoggedIn: user });

		return user;
	} catch (err) {
		console.error(err);
		ldapClient.destroy();
		throw new Error('Unauthorized');
	} finally {
		// Rebind ldap user
		await new Promise((resolve) =>
			// eslint-disable-next-line no-promise-executor-return
			ldapClient.bind(process.env.LDAP_BIND_DN, process.env.LDAP_BIND_PW, resolve),
		);
	}
}
// #endregion

export default NextAuth({
	// Configure one or more authentication providers
	providers: [
		CredentialsProvider({
			credentials: {
				username: { label: 'Username', type: 'text' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				try {
					return await ldapAuth(credentials.username, credentials.password);
				} catch (err) {
					// Auth failed
				}
				return null;
			},
		}),
	],
	session: {
		strategy: 'jwt',
	},
	jwt: {
		secret: process.env.NEXTAUTH_JWT_SECRET,
	},
	pages: {
		signIn: '../../login', // Displays signin buttons
		signOut: '/auth/signout', // Displays form with sign out button
		error: '/auth/error', // Error code passed in query string as ?error=
	},
	adapter: PrismaAdapter(prisma),
	callbacks: {},
	debug: process.env.NEXTAUTH_DEBUG === 'true',
});
