import React from 'react';
import MainTool from '../components/MainTool';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
  background-color: #f0f0f0;
`;

const AnalysisView = () => {
  return (
    <Wrapper>
      <div> /* Placeholder for other components */
        
      </div>
      <MainTool />
    </Wrapper>
  );
};

export default AnalysisView;
