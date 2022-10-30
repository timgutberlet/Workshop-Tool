import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

// eslint-disable-next-line import/prefer-default-export
export async function middleware(req) {
	if (!req.url.includes('admin-panel') && !req.url.includes('api/admin')) {
		return NextResponse.next();
	}

	const session = await getToken({ req, secret: process.env.NEXTAUTH_JWT_SECRET });
	if (!session) {
		return new NextResponse('not authorized');
	}

	return NextResponse.next();
}
