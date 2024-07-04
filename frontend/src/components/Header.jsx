import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
// Define a global style for applying Nunito font to the entire app
const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Nunito', sans-serif;
    font-optical-sizing: auto;
  }
`;

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
  // const [loggedin, setloggedin] = useState(false); ADD WHEN USER AUTHENTICATION
  const {isAuthenticated, logout} = useContext(AuthContext);
  return (
    <>
      <GlobalStyle /> {/* Apply Nunito font globally */}
      <Nav>
        <NavLink to="/" className="nunito-header-link">Main Page</NavLink>
        {isAuthenticated ?
        <>
        <NavLink to="/profile" className="nunito-header-link">Profile</NavLink>
        <NavLink onClick={logout} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>
            Logout
          </NavLink>
        </>
        :
        <NavLink to="/login" className="nunito-header-link">Log In</NavLink>
        }
      </Nav>
    </>
  );
};

export default Header;
