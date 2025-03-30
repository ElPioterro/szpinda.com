import React, { useLayoutEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import styled from "styled-components";
import Scene from "./Scene";
import logo from "./logo.png";
import mainLogo from "./signature(1)-final.svg"; // Adjust path to your SVG file
import { Logo } from "./Logo";

export const App = () => {
  // useLayoutEffect(() => {
  //   const gradient = new Gradient();
  //   gradient.initGradient("#gradient-canvas");
  // }, []);

  return (
    <Router>
      <Main>
        <canvas id="gradient-canvas" data-transition-in />
        {/* <Navbar /> */}
        <Menu>
          {/* <img src={logo} width="80px" height="80px" alt="logo"></img> */}
          {/* <div style={{ textAlign: "left" }}>
            <p>
              ABOUT <br />
              PORTFOLIO
            </p>
            <p>LINKS</p>
          </div> */}
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
        {/* <ContentContainer>
          <Content>
            <p>MODUS OPERANDI</p>
            <h2>The Invocation—</h2>
            <h1>Behold the sign and power of this pentacle</h1>
            <h3>Magic Science</h3>
          </Content>
        </ContentContainer> */}
        <SceneContainer>
          {/* SVG Overlay */}
          {/* <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none", // Disables interaction with SVG
              zIndex: 1, // Places SVG above the canvas
              mixBlendMode: "difference", // Inverts colors of text behind it
            }}
          >
            <img src={mainLogo} height="350px" alt="signature" />
          </div> */}
          {/* Canvas */}
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

  /* Add a darkening overlay */
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // background: rgba(
    //   0,
    //   0,
    //   0,
    //   0.3
    // );
    mix-blend-mode: overlay;
    pointer-events: none; /* Ensures it doesn’t block interactions */
  }
`;

const Menu = styled.div`
  position: absolute;
  // top: 60px; /* Below navbar */
  top: 1rem; /* Below navbar */
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 4em;
  z-index: 1;
  // align-items: center;

  > svg {
    width: 64px;
  }

  > div {
    text-align: right;
    // font-size: 0.8rem;
    font-size: 1.2rem;
    // width: 100px;
    // max-width: 10rem;
    // max-width: 20rem;
    max-width: 15rem;
    font-weight: bold;
    color: white;
  }

  @media only screen and (max-width: 1200px) {
    padding: 2em 4em;
  }
`;

const ContentContainer = styled.div`
  position: absolute;

  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  margin-top: 14em;
  z-index: 1;

  @media only screen and (max-width: 1200px) {
    margin-top: 0;
  }
`;

const Content = styled.div`
  position: absolute;

  flex: 1;
  padding-left: 4em;
  color: white;

  h2 {
    color: #f7057e;
    font-size: 4rem;
    margin-top: 1.2em;
    padding: 0;
    line-height: 0;
    margin-bottom: 1.2em;
    white-space: nowrap;
  }

  h3 {
    float: right;
    text-align: right;
    width: 100px;
    font-size: 0.8rem;
  }

  h1 {
    font-size: 3.3rem;
    line-height: 3.8rem;
  }

  p {
    font-size: 0.8rem;
    width: 200px;
  }

  @media only screen and (max-width: 1200px) {
    padding-right: 2em;
    padding-left: 2em;
    h1 {
      font-size: 2.3rem;
      line-height: 2.8rem;
    }
    h2 {
      font-size: 2.3rem;
      line-height: 2.3rem;
      margin-bottom: 0.8rem;
    }
  }
`;
