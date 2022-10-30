import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Document, Page, pdfjs } from 'react-pdf';

// using ES6 modules
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// import '../../../node_modules/react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type MyPDFViewerProps = {
	file: File;
};

export default function MyPDFViewer(props: MyPDFViewerProps) {
	const [totalPages, setTotalPages] = useState(null);
	const [pageNumber, setPageNumber] = useState(1);
	const [loadStatus, setLoadStatus] = useState(0); // '0'->loading, '1'->ok, '-1'->err

	const nextPage = () => {
		if (pageNumber < totalPages) {
			setPageNumber((prev) => prev + 1);
		}
	};

	const prevPage = () => {
		if (pageNumber > 1) {
			setPageNumber((prev) => prev - 1);
		}
	};

	const onDocumentLoadSuccess = ({ numPages }) => {
		setTotalPages(numPages);
		setLoadStatus(1);
	};

	// used to hide the text
	const textRenderer = () => {
		return null;
	};

	return (
		<div aria-hidden="true" className="d-none d-lg-inline">
			{loadStatus !== 1 ? null : (
				<Row className="mb-2 d-flex justify-content-center">
					<Col xs={4} className="d-flex justify-content-center">
						<Button
							variant="secondary"
							onClick={prevPage}
							size="sm"
							active={pageNumber > 1}
						>
							<FontAwesomeIcon
								style={{ width: '10px', height: '10px' }}
								icon={faChevronLeft}
							/>
						</Button>
					</Col>
					<Col xs={4} className="d-flex justify-content-center">
						Seite {pageNumber}/{totalPages}
					</Col>
					<Col xs={4} className="d-flex justify-content-center">
						<Button
							variant="secondary"
							onClick={nextPage}
							size="sm"
							active={pageNumber < totalPages}
						>
							<FontAwesomeIcon
								style={{ width: '10px', height: '10px' }}
								icon={faChevronRight}
							/>
						</Button>
					</Col>
				</Row>
			)}
			<Row>
				<Document
					file={props.file}
					renderMode="canvas"
					onLoadSuccess={onDocumentLoadSuccess}
					onLoadError={() => setLoadStatus(-1)}
					noData="Dein Browser unterstützt keine PDF vorschau"
				>
					<Page
						pageNumber={pageNumber}
						customTextRenderer={textRenderer}
						error="Diese Seite kann leider nicht angezeigt werden!"
					/>
				</Document>
			</Row>
		</div>
	);
}
