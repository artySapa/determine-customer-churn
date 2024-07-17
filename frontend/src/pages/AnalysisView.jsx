import React from 'react';
import MainTool from '../components/MainTool';
import styled from 'styled-components';
import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';
import WelcomePage from "../components/WelcomePage";

const Wrapper = styled.div`

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
  background-color: #f0f0f0;
`;
const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
`;

const AnalysisView = () => {
    const {isAuthenticated, logout} = useContext(AuthContext);
  return (
    <Wrapper>
        {/* {isAuthenticated ?
        <>
        <Title>Customers Leave Reasons</Title>
      <MainTool />
      </>
      :
      <WelcomePage/>
        } */}
        <Title>Customers Leave Reasons</Title>
        <MainTool />
    </Wrapper>
  );
};

export default AnalysisView;
