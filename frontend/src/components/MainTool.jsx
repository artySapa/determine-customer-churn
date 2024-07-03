import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import ExcelTable from './ExcelTable';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  width: 100%;
`;

const DropzoneContainer = styled.div`
  cursor: pointer;
  width: 80%;
  max-width: 600px;
  height: 200px;
  border: 2px dashed #4a90e2;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  color: #4a90e2;
  font-size: 1.2rem;
  text-align: center;
  position: relative;
`;

const FileDetails = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const FileIcon = styled(FaFileExcel)`
  font-size: 2rem;
  margin-right: 10px;
  color: #4a90e2;
`;

const LoadingIndicator = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 0.9rem;
  color: #4a90e2;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 20px;
  font-size: 1rem;
`;

const SubmitCancel = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #4a90e2;
  color: white;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #357ebd;
  }
  margin:10px;
`;

const MainTool = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setLoading(true);
    setError('');
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.name.endsWith('.xlsx')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const binaryStr = event.target.result;
          const workbook = XLSX.read(binaryStr, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          setData(jsonData);
          setFile(selectedFile);
          setLoading(false);
        };
        reader.readAsBinaryString(selectedFile);
      } else {
        setLoading(false);
        setError('The format of the file is .xlsx');
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.xlsx',
  });

  const handleCancel = () => {
    setFile(null);
    setData([]);
    setError('');
  };

  const handleSubmit = async () => {
    if (!file) return;
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('File uploaded:', data.filename);
        // Optionally handle success message or further processing
        // You can use data.download_url to access the download link if provided
      } else {
        console.error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  
  
  return (
    <Container>
      <DropzoneContainer {...getRootProps({ isDragActive })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file here...</p>
        ) : (
          <p>Drop your .xlsx file here, or click to select from your computer</p>
        )}
        {loading && <LoadingIndicator>Loading...</LoadingIndicator>}
      </DropzoneContainer>
      {file && (
        <FileDetails>
          <FileIcon />
          <span>{file.name}</span>
        </FileDetails>
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {data.length > 0 && <ExcelTable data={data} />}
      {file && (
        <SubmitCancel>
          <Button onClick={handleCancel}>Cancel</Button>
          {/* Add Submit functionality here */}
          <Button onClick={handleSubmit} >Submit</Button>
        </SubmitCancel>
      )}
    </Container>
  );
};

export default MainTool;
