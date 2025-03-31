import React, { useLayoutEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import styled from "styled-components";
import Scene from "./Scene";
import { Logo } from "./Logo";

export const App = () => {
  return (
    <Router>
      <Main>
        <canvas id="gradient-canvas" data-transition-in />
        <Menu>
          <Logo
            width={100}
            height={100}
            fillColor={"white"}
            strokeColor={"#AAA"}
            strokeWidth={1}
          />
          <div>
            <p>
              DIAMOND <br />
              PORTFOLIO
            </p>
            <p>03/23/25</p>
          </div>
        </Menu>
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
  height: 100vh;
  overflow: hidden;

  @media only screen and (max-width: 1200px) {
    flex-direction: column;
  }
`;

const SceneContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;

  /* Prevent scrolling on mobile devices */
  @media only screen and (max-width: 1200px) {
    touch-action: none; /* Disables touch scrolling */
  }

  /* Add a darkening overlay */
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

  > div {
    text-align: right;
    font-size: 1.2rem;
    max-width: 15rem;
    font-weight: bold;
    color: white;
  }

  @media only screen and (max-width: 1200px) {
    padding: 2em 4em;
  }
`;
