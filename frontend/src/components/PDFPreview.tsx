import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'; 

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PDFPreviewProps {
  file: any;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ file }) => {
  return (
    <div style={{ width: '100%', height: 'auto' }}>
      <Document file={file}>
        <Page pageNumber={1} width={200} />
      </Document>
    </div>
  );
};

export default PDFPreview;
