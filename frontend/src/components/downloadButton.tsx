import React from 'react';

interface DownloadButtonProps {
  url: string;
  fileName: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ url, fileName}) => {
  const handleDownload = () => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      })
      .catch((error) => console.error('Error downloading file:', error));
  };

  return (
    <button onClick={handleDownload}>{"Download"}</button>
  );
};

export default DownloadButton;
