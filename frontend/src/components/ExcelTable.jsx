import React from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
  width: 80%;
  max-width: 800px;
  max-height: 500px;  // Limit the height to ensure vertical scrolling
  margin-top: 20px;
  overflow: auto;  // Enable both horizontal and vertical scrolling
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th, td {
    padding: 10px;
    border: 1px solid #ddd;
  }

  th {
    background-color: #4a90e2;
    color: white;
  }
`;

const ExcelTable = ({ data }) => {
  if (!data || data.length === 0) return null;

  const headers = Object.keys(data[0]);

  return (
    <TableContainer>
      <StyledTable>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header) => (
                <td key={header}>{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default ExcelTable;
