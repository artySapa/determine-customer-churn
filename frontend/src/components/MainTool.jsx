import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import ExcelTable from './ExcelTable';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  overflow: auto;
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 80%;
  max-width: 600px;
`;

const DropzoneContainer = styled.div`
  cursor: pointer;
  width: 40%;
  height: 200px;
  border: 2px dashed ${({ isDragActive }) => (isDragActive ? '#4a90e2' : '#bbb')};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  color: #4a90e2;
  font-size: 1.2rem;
  text-align: center;
  position: relative;
  margin-bottom: 20px;
  transition: border-color 0.3s ease;
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
  margin: 10px;
`;

const AnalysisResult = styled.div`
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
`;

const MainTool = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const containerRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    setLoading(true);
    setError('');
    setAnalysis(null);
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
    setAnalysis(null);
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('File uploaded:', result.filename);
        console.log("analysis: >>>>>>>>>", typeof(result.analysis));
        setAnalysis(result.analysis);
        setLoading(false);
        containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
      } else {
        console.error('Failed to upload file');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <DropzoneContainer {...getRootProps()} isdragactive={isDragActive}>
        <input {...getInputProps()} />
        <p>Drop your .xlsx file here, or click to select from your computer</p>
        {loading && <LoadingIndicator>Loading...</LoadingIndicator>}
      </DropzoneContainer>
      <Container ref={containerRef}>
        {file && (
          <FileDetails>
            <FileIcon />
            <span>{file.name}</span>
          </FileDetails>
        )}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {data.length > 0 && !error &&  <ExcelTable data={data} />}
        {file && (
          <SubmitCancel>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </SubmitCancel>
        )}
        {analysis && (
          <>
          <AnalysisResult>
            <h2>Analysis Result</h2>
            <h3>Values:</h3>
            {Object.values(analysis).map((name, index) => {
              return (
              <div key={index}>
                  {name}
              </div>
            );
            })}
            <h3>Keys:</h3>
            {Object.keys(analysis).map((name, index) => {
              return (
              <div key={index}>
                  {name}
              </div>
            );
            })}
          {/* <p>{analysis.values()}</p> */}
            {/* <p>{analysis.feature}</p>
            <p>{analysis.importance}</p> */}
          </AnalysisResult>
          <Button>Save the Results</Button>
          </>
        )}
      </Container>
    </Wrapper>
  );
};

export default MainTool;
