// WelcomePage.jsx
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

const Description = styled.div`
  max-width: 800px;
  text-align: center;
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 30px;
`;

const ExcelFormat = styled.div`
  max-width: 800px;
  text-align: left;
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 30px;
`;

const Link = styled.a`
  text-decoration: none;
  background-color: #4a90e2;
  color: white;
  padding: 10px 20px;
  font-size: 1.2rem;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #357ebd;
  }
`;

const WelcomePage = () => (
  <Container>
    <Title>Customers Churn Detection</Title>
    <Description>
      Welcome to Customers Churn Detection system! Our platform helps businesses analyze customer
      data to predict churn and take proactive measures to retain customers.
    </Description>
    <Description>
      To get started, upload an Excel file containing customer data formatted as specified below.
    </Description>
    <ExcelFormat>
      <h2>Excel File Format Requirements:</h2>
      <ul>
        <li><strong>Customer ID:</strong> Unique identifier for each customer</li>
        <li><strong>Age:</strong> Customer's age (numeric)</li>
        <li><strong>Gender:</strong> Customer's gender (categorical: Male/Female)</li>
        <li><strong>Date of Birth:</strong> Customer's date of birth (date format)</li>
        <li><strong>Date of Subscription:</strong> Date when customer subscribed (date format)</li>
        {/* Add more columns as needed for churn prediction */}
      </ul>
    </ExcelFormat>
    <Link href="/login">Let's get started</Link>
  </Container>
);

export default WelcomePage;
