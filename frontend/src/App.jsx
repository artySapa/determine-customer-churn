import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainTool from './components/MainTool';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';
import Header from './components/Header';
import { AuthProvider } from './contexts/AuthContext';
import AnalysisView from './pages/AnalysisView';
import UserView from './pages/UserView';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<AnalysisView />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<UserView />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
