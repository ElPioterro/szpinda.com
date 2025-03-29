import React from "react";
import { Link } from "react-router-dom";
import logo from "./logo.png"; // Replace with the actual path to your logo image
import styled from "styled-components";

const Navbar = () => {
  return (
    <Nav>
      <Logo>
        <Link to="/">
          <img src={logo} alt="logo"></img>
        </Link>
      </Logo>
      <NavLinks>
        <li>
          <StyledLink to="/">Home</StyledLink>
        </li>
        <li>
          <StyledLink to="/about">About</StyledLink>
        </li>
        <li>
          <StyledLink to="/services">Services</StyledLink>
        </li>
        <li>
          <StyledLink to="/contact">Contact</StyledLink>
        </li>
      </NavLinks>
    </Nav>
  );
};

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 1rem 2rem;
  z-index: 2;
`;

const Logo = styled.div`
  img {
    height: 5em;
  }
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  margin-left: 1.5rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export default Navbar;
