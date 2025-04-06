import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import styled from "styled-components";
import { gsap } from "gsap";
import Scene from "./Scene";
import { Logo } from "./Logo";
import {
  FaUser,
  FaBriefcase,
  FaGithub,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

export const App = () => {
  const mainRef = useRef();
  const menuRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  // References for the hamburger menu spans
  const topBarRef = useRef();
  const middleBarRef = useRef();
  const bottomBarRef = useRef();

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

    updateHeight();

    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // Animate menu open/close and hamburger transformation
  useEffect(() => {
    if (menuOpen) {
      // Menu opening animation
      gsap.to(menuRef.current, {
        y: 0,
        duration: 0.5,
        ease: "power3.out",
      });

      // Hamburger to X animation
      gsap.to(topBarRef.current, {
        rotation: 45,
        y: 9,
        duration: 0.4,
        ease: "power2.out",
      });

      gsap.to(middleBarRef.current, {
        opacity: 0,
        duration: 0.3,
      });

      gsap.to(bottomBarRef.current, {
        rotation: -45,
        y: -9,
        duration: 0.4,
        ease: "power2.out",
      });
    } else {
      // Menu closing animation
      gsap.to(menuRef.current, {
        y: "100%",
        duration: 0.5,
        ease: "power3.in",
      });

      // X to hamburger animation
      gsap.to(topBarRef.current, {
        rotation: 0,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      });

      gsap.to(middleBarRef.current, {
        opacity: 1,
        duration: 0.4,
      });

      gsap.to(bottomBarRef.current, {
        rotation: 0,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, [menuOpen]);

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
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <HamburgerBar ref={topBarRef} className="top" />
            <HamburgerBar ref={middleBarRef} className="middle" />
            <HamburgerBar ref={bottomBarRef} className="bottom" />
          </HamburgerButton>
        </Menu>
        {/* Social Media Icons on Main Page */}
        <SocialIconsContainer>
          <SocialIcon
            href="https://github.com/yourusername"
            target="_blank"
            aria-label="GitHub"
          >
            <FaGithub />
          </SocialIcon>
          <SocialIcon
            href="https://linkedin.com/in/yourusername"
            target="_blank"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </SocialIcon>
          <SocialIcon
            href="https://twitter.com/yourusername"
            target="_blank"
            aria-label="Twitter"
          >
            <FaTwitter />
          </SocialIcon>
        </SocialIconsContainer>
        <DropdownMenu ref={menuRef} id="menu-container">
          <MenuSection>
            <SectionTitle>
              <FaUser /> About Me
            </SectionTitle>
            <AboutMeContent>
              <ProfileImage src="/path-to-your-image.jpg" alt="Your Name" />
              <AboutMeText>
                <h2>Your Name</h2>
                <h3>Your Title/Role</h3>
                <p>
                  A brief introduction about yourself. Describe your expertise,
                  experience, and what drives you as a developer. This section
                  helps visitors quickly understand who you are and what you do.
                </p>
                <p>
                  You can mention your key skills, professional philosophy, or
                  career highlights here.
                </p>
              </AboutMeText>
            </AboutMeContent>
          </MenuSection>

          <MenuSection>
            <SectionTitle>
              <FaBriefcase /> Portfolio
            </SectionTitle>
            <PortfolioGrid>
              {portfolioItems.map((item, index) => (
                <PortfolioItem key={index} href={item.link}>
                  <PortfolioImage src={item.image} alt={item.title} />
                  <PortfolioOverlay>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <span>View Project →</span>
                  </PortfolioOverlay>
                </PortfolioItem>
              ))}
            </PortfolioGrid>
          </MenuSection>

          <ButtonContainer>
            <ButtonLink href="#link1">Main Button 1</ButtonLink>
            <ButtonLink href="#link2">Main Button 2</ButtonLink>
          </ButtonContainer>
        </DropdownMenu>

        <SceneContainer>
          <Scene />
        </SceneContainer>
      </Main>
    </Router>
  );
};

// Add this before your App component
const portfolioItems = [
  {
    title: "Project 1",
    description: "A short description of your project",
    image: "/path-to-project1-image.jpg",
    link: "https://project1.com",
  },
  {
    title: "Project 2",
    description: "A short description of your project",
    image: "/path-to-project2-image.jpg",
    link: "https://project2.com",
  },
  {
    title: "Project 3",
    description: "A short description of your project",
    image: "/path-to-project3-image.jpg",
    link: "https://project3.com",
  },
  // Add more projects as needed
];

// Styled Components
const Main = styled.main`
  position: absolute;
  display: flex;
  flex-direction: row;
  width: 100vw;
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

// const HamburgerButton = styled.button`
//   background: none;
//   border: none;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   width: 30px;
//   height: 24px;
//   cursor: pointer;
//   z-index: 2;

//   span {
//     display: block;
//     width: 100%;
//     height: 4px;
//     background-color: white;
//     border-radius: 2px;
//     transition: all 0.3s ease;
//   }

//   &:hover span {
//     background-color: #aaa;
//   }
// `;

// Update hamburger button styling for the animation
const HamburgerButton = styled.button`
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 24px;
  cursor: pointer;
  z-index: 10;
  position: relative;
`;

const HamburgerBar = styled.span`
  display: block;
  width: 100%;
  height: 4px;
  background-color: white;
  border-radius: 2px;
  transform-origin: center;
  will-change: transform, opacity;

  &.top,
  &.bottom {
    transform-origin: 50% 50%;
  }

  &:nth-child(2) {
    margin: 4px 0;
  }
`;

const DropdownMenu = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) translateY(100%);
  width: 75%;
  height: 75%;
  max-height: 75vh;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(15px); /* Glossy effect */

  border-radius: 20px 20px 0 0;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  z-index: 10;
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  will-change: transform;
`;

// const DropdownMenu = styled.div`
//   position: fixed;
//   bottom: 0;
//   left: 50%;
//   transform: translateX(-50%) translateY(100%);
//   width: 75%;
//   height: 75%;
//   max-height: 75vh;
//   background-color: rgba(0, 0, 0, 0.6);
//   backdrop-filter: blur(15px);
//   border-radius: 20px 20px 0 0;
//   padding: 2rem;
//   display: flex;
//   flex-direction: column;
//   z-index: 10;
//   box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.3);
//   overflow-y: auto;
//   will-change: transform;
//   position: relative; /* Add this to support absolute positioning of social icons */
// `;

const ButtonLink = styled.a`
  display: inline-block;
  width: 45%;
  text-align: center;
  padding: 2rem 1rem;
  margin: 0 2.5%;
  background-color: #555;
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #4a7ab3; /* Bluish accent color */
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(50, 100, 220, 0.3);
  }

  &:active {
    transform: translateY(-1px);
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: auto; /* Pushes the buttons toward the bottom */
`;

const MenuSection = styled.section`
  margin-bottom: 2rem;
  width: 100%;
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  color: white;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);

  svg {
    font-size: 1.2rem;
  }
`;

const AboutMeContent = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.3);
`;

const AboutMeText = styled.div`
  color: white;

  h2 {
    margin-top: 0;
    font-size: 1.8rem;
  }

  h3 {
    margin-top: 0.5rem;
    font-size: 1.2rem;
    color: #4a7ab3;
    font-weight: normal;
  }

  p {
    line-height: 1.6;
    margin: 1rem 0;
  }
`;

const PortfolioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  width: 100%;
`;

const PortfolioItem = styled.a`
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  height: 200px;
  text-decoration: none;

  &:hover {
    img {
      transform: scale(1.05);
    }

    div {
      opacity: 1;
    }
  }
`;

const PortfolioImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const PortfolioOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  text-align: center;

  h3 {
    margin: 0 0 0.5rem;
    font-size: 1.2rem;
  }

  p {
    font-size: 0.9rem;
    margin: 0 0 1rem;
  }

  span {
    color: #4a7ab3;
    font-weight: bold;
  }
`;

const SocialLinks = styled.div`
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  gap: 0.75rem;
`;

const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 1.4rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #4a7ab3;
    transform: translateY(-3px) scale(1.1);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(-1px);
  }
`;

// Social Media Icons Container
const SocialIconsContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 5;
`;
