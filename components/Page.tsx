/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/require-default-props */
import { ReactElement, ReactNode, useMemo } from 'react';

interface PageProps {
	children: ReactNode;
	centered?: boolean;
	narrow?: boolean;
}
function Page(props: PageProps): ReactElement {
	const { children, centered = false, narrow = false } = props;

	const innerWidth = useMemo(() => (narrow ? 'max-w-md w-3/4' : 'max-w-3xl w-full'), [narrow]);

	return (
		<div
			className={`flex flex-col items-center min-h-screen ${
				centered ? 'justify-center' : ''
			}`}
		>
			<div className={`flex flex-col px-2 ${innerWidth}`}>{children}</div>
		</div>
	);
}

export default Page;
