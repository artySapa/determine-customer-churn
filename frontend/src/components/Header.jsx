import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Nav = styled.nav`
  background-color: #00008B;
  padding: 10px;
  color: white;
  display: flex;
  justify-content: flex-end;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  &:hover {
    opacity: 0.8;
  }
  margin-right: 30px;
`;

const Header = () => {
  const [loggedin, setLoggedIn] = useState(true);
  return (
    <Nav>
      <NavLink to="/">Main Page</NavLink>
      {loggedin &&
      <NavLink to="/profile">Profile</NavLink>
      }
      {!loggedin && 
      <NavLink to="/login">Log In</NavLink>
      }
      {/* Add more links as needed */}
    </Nav>
  );
};

export default Header;
