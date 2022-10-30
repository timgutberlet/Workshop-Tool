import { Tooltip } from 'react-bootstrap';

export default function textToolTip(props) {
	const { customToolTipText } = props;
	const renderProps = props;
	delete renderProps.customToolTipText;

	return (
		// eslint-disable-next-line react/jsx-props-no-spreading
		<Tooltip {...renderProps}>{customToolTipText}</Tooltip>
	);
}
