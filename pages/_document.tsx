import { Html, Head, Main, NextScript } from 'next/document';

// Next document file
// This only exists to set the lang to de
// If this file causes any larger issues you can safely delete it
export default function Document() {
	return (
		<Html lang="de">
			<Head />
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
