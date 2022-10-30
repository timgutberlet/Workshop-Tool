import React from 'react';
import Link from 'next/link';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { config } from '@fortawesome/fontawesome-svg-core';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Logo from '../public/icons/logo.webp';
import SymposiumLogo from '../public/icons/logo_symposium.webp';

config.autoAddCss = false;

const getLogo = (isSymposium: boolean) => {
	if (isSymposium) {
		// eslint-disable-next-line @next/next/no-img-element
		return <img src={SymposiumLogo.src} alt="" style={{ width: '15rem' }} />;
	}
	// eslint-disable-next-line @next/next/no-img-element
	return <img src={Logo.src} alt="" style={{ width: '15rem' }} />;
};

export default function Header(props: { pageTitle: string; isSymposium: boolean }) {
	const { data: session } = useSession();

	return (
		<header>
			<Head>
				<title key="title">{props.pageTitle}</title>
			</Head>
			<nav className="navbar fixed-top bg-light">
				<div className="container-fluid">
					<Link href="/" passHref>
						<a className="navbar-brand" href="#">
							{getLogo(props.isSymposium)}
						</a>
					</Link>
					<div className="">
						<div className="navbar-nav me-auto" />
						<div className="d-flex">
							{session ? (
								<Link href="/admin-panel" passHref>
									<a className="btn btn-invisible">
										<span>
											<span className="link-primary">
												<span className="d-none d-sm-inline">
													Herzlich Willkommen,{' '}
												</span>
												{session.user.name}
											</span>
											&nbsp;
											<FontAwesomeIcon
												icon={faUser}
												size="1x"
												style={{
													maxWidth: '15px',
													maxHeight: '15px',
													verticalAlign: '-5%',
												}}
											/>
										</span>
									</a>
								</Link>
							) : null}
						</div>
					</div>
				</div>
			</nav>
		</header>
	);
}
