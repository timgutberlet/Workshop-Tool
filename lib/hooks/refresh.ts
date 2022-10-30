import { useRouter } from 'next/dist/client/router';

export default function useRefresh() {
	const router = useRouter();
	return () => {
		router.replace(router.asPath);
	};
}
