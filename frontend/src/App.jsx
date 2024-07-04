import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import AnalysisView from './pages/AnalysisView';
import UserView from './pages/UserView';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/profile" element={<UserView />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<AnalysisView />} />
      </Routes>
    </Router>
  );
};

export default App;
