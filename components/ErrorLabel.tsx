/* eslint-disable react/require-default-props */
/* eslint-disable react/react-in-jsx-scope */
import { ReactElement } from 'react';

interface ErrorLabelProps {
	error?: {
		message: string;
	};
}
function ErrorLabel({ error }: ErrorLabelProps): ReactElement | null {
	if (!error) return null;

	return <p className="text-sm font-normal text-red-600">{error.message}</p>;
}

export default ErrorLabel;
