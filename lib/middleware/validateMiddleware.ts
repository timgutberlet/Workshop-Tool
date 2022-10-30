import { NextApiRequest, NextApiResponse } from 'next';

export default function validateMiddleware(validations, validationResult) {
	// eslint-disable-next-line consistent-return
	return async (req: NextApiRequest, res: NextApiResponse, next) => {
		await Promise.all(validations.map((validation) => validation.run(req)));

		const errors = validationResult(req);
		if (errors.isEmpty()) {
			return next();
		}

		res.status(422).json({ errors: errors.array() });
	};
}
