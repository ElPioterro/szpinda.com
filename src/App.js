import React, { useEffect, useRef, useState } from "react"; // Added useState for menu toggle
import { BrowserRouter as Router } from "react-router-dom";
import styled from "styled-components";
import Scene from "./Scene";
import { Logo } from "./Logo";

export const App = () => {
  const mainRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false); // State to track menu visibility

  // Close menu when clicking outside
  const handleClickOutside = (event) => {
    if (
      menuOpen &&
      !event.target.closest("#menu-container") &&
      !event.target.closest("#hamburger-button")
    ) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  // Set height dynamically based on window.innerHeight
  useEffect(() => {
    const updateHeight = () => {
      if (mainRef.current) {
        mainRef.current.style.height = `${window.innerHeight}px`;
      }
    };

    // Set initial height
    updateHeight();

    // Update height on resize (e.g., when address bar collapses)
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <Router>
      <Main ref={mainRef}>
        <canvas id="gradient-canvas" data-transition-in />
        <Menu>
          <Logo
            width={100}
            height={100}
            fillColor={"white"}
            strokeColor={"#AAA"}
            strokeWidth={1}
          />
          <HamburgerButton
            id="hamburger-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
            <span />
          </HamburgerButton>
        </Menu>
        {menuOpen && (
          <DropdownMenu id="menu-container">
            <ButtonLink href="#link1">Main Button 1</ButtonLink>
            <ButtonLink href="#link2">Main Button 2</ButtonLink>
          </DropdownMenu>
        )}
        <SceneContainer>
          <Scene />
        </SceneContainer>
      </Main>
    </Router>
  );
};

// Styled Components
const Main = styled.main`
  position: absolute;
  display: flex;
  flex-direction: row;
  width: 100vw;
  overflow: hidden; /* Prevent scrolling */

  @media only screen and (max-width: 1200px) {
    flex-direction: column;
  }
`;

const SceneContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; /* Matches Main's dynamic height */
  z-index: 0;

  /* Prevent scrolling on mobile devices */
  @media only screen and (max-width: 1200px) {
    touch-action: none;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    mix-blend-mode: overlay;
    pointer-events: none;
  }
`;

const Menu = styled.div`
  position: absolute;
  top: 1rem;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 4em;
  z-index: 1;

  > svg {
    width: 64px;
  }

  @media only screen and (max-width: 1200px) {
    padding: 2em 4em;
  }
`;

const HamburgerButton = styled.button`
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 24px;
  cursor: pointer;
  z-index: 2;

  span {
    display: block;
    width: 100%;
    height: 4px;
    background-color: white;
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  &:hover span {
    background-color: #aaa;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 5rem; /* Adjust based on your design */
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 400px;
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  z-index: 1;
  padding: 2rem;
  border-radius: 20px 20px 0 0; /* Rounded top-left and top-right corners */
  box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const ButtonLink = styled.a`
  display: block;
  width: 100%;
  text-align: center;
  padding: 1rem 2rem;
  background-color: #333;
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #555;
  }
`;
