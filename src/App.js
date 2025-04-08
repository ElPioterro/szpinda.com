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
  // Device detection for responsive adjustments
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Check on initial load
    checkDevice();

    // Add resize listener
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

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

      gsap.to(".menu-content", {
        opacity: 1,
        display: "block",
        duration: 0.8,
        ease: "power3.out",
        delay: 0.3 /* Slight delay for a natural sequence */,
      });

      // Animate About Me text
      gsap.fromTo(
        ".about-me-text",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", delay: 0.1 }
      );

      // Hamburger to X animation
      gsap.to(topBarRef.current, {
        rotation: 45,
        y: 12,
        duration: 0.4,
        ease: "power2.out",
      });

      gsap.to(middleBarRef.current, {
        opacity: 0,
        duration: 0.3,
      });

      gsap.to(bottomBarRef.current, {
        rotation: -45,
        y: -12,
        duration: 0.4,
        ease: "power2.out",
      });
    } else {
      // Menu closing animation
      gsap.to(menuRef.current, {
        y: "100%",
        duration: 0.5,
        ease: "power3.in",
        delay: 0.1,
      });

      gsap.to(".menu-content", {
        opacity: 0,
        duration: 0.3 /* Quick fade-out */,
        onComplete: () => {
          gsap.set(".menu-content", { display: "none" });
        },
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

  console.log("is mobile?:", isMobile);

  return (
    <Router>
      <Main ref={mainRef}>
        <canvas id="gradient-canvas" data-transition-in />
        <Menu>
          {/* Logo with appropriate fixed sizes */}
          <LogoContainer>
            <Logo
              width={isMobile ? 150 : 200} // Increased from 110/140
              height={isMobile ? 150 : 200} // Increased from 110/140
              fillColor={"white"}
              strokeColor={"#AAA"}
              strokeWidth={1}
            />
          </LogoContainer>
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
            href="https://github.com/ElPioterro"
            target="_blank"
            aria-label="GitHub"
          >
            <FaGithub />
          </SocialIcon>
          {/* <SocialIcon
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
            disabled
          >
            <FaTwitter />
          </SocialIcon> */}
        </SocialIconsContainer>
        <DropdownMenu ref={menuRef} id="menu-container">
          <MenuContent className="menu-content">
            <MenuSection>
              <SectionTitle>
                <FaUser /> About Me
              </SectionTitle>
              <AboutMeContent>
                <ProfileImageWrapper>
                  <ProfileImage src="/picture.webp" alt="Piotr Szpinda" />
                  <ProfileImageOverlay />
                </ProfileImageWrapper>
                <AboutMeText className="about-me-text">
                  <Name>Piotr Szpinda</Name>
                  <Title>Enthusiast Programmer & Student</Title>
                  <TextWrapper>
                    <p>
                      Yo, I’m Piotr! Just a student who’s way too into coding
                      and making random cool stuff. I’m that guy who gets hyped
                      about turning lines of code into art, throwing websites
                      together, and messing with <Highlight>Python</Highlight>
                      and <Highlight>AI</Highlight> when I’ve got a free minute.
                    </p>
                    <p>
                      I’ve got a toolbox that includes
                      <Highlight>Python</Highlight> for my artsy experiments,
                      <Highlight>WordPress</Highlight> for throwing together
                      sites that actually work, <Highlight>React</Highlight> for
                      making things pop and click, and
                      <Highlight>Three.js</Highlight> for when I’m feeling extra
                      fancy with 3D stuff.
                    </p>
                  </TextWrapper>
                </AboutMeText>
              </AboutMeContent>
            </MenuSection>

            <MenuSection>
              <SectionTitle>
                <FaBriefcase /> Portfolio
              </SectionTitle>
              <PortfolioCard>
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
              </PortfolioCard>
            </MenuSection>

            {/* <ButtonContainer>
            <ButtonLink href="#link1">Main Button 1</ButtonLink>
            <ButtonLink href="#link2">Main Button 2</ButtonLink>
          </ButtonContainer> */}
          </MenuContent>
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
    title: "3D Diamond Showcase",
    description: "React Three Fiber, Rapier, PostProcessing",
    image: "/diamond_project_thumbnail.webp",
    link: "https://github.com/ElPioterro/szpinda.com",
  },
  {
    title: "PETSCII",
    description:
      "An art project I’m cooking up — think symbolic pixel mozaik with a modern twist. Coming soon!",
    image: "/CS-thumbnail-uncompressed.webp",
    link: "/",
  },
  {
    title: "Spicetify Extention Theme",
    description:
      "A little something to spice up your Spotify. Still in the works, but it’s gonna be dope!",
    image: "/CS-thumbnail-uncompressed.webp",
    link: "/",
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

// Update the Menu styled component for better logo positioning
const Menu = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 2.5rem 4.5rem; // Increased padding all around
  z-index: 1;

  /* Add shadow to make logo pop against any background */
  & > svg {
    filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.25));
  }

  @media only screen and (max-width: 768px) {
    padding: 1.5rem 1.5rem; // Increased from 1rem all around

    /* Scale down logo on mobile */
    & > svg {
      transform: scale(0.8);
      transform-origin: left center;
    }
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 1.5rem; // Add margin to move away from left edge

  /* Increased dimensions for better visibility */
  width: auto; // Increased from 100px
  height: auto; // Increased from 100px

  @media only screen and (max-width: 768px) {
    width: 110px; // Increased from 80px
    height: 110px; // Increased from 80px
    margin-left: 0.75rem; // Smaller margin on mobile
  }

  /* Optional shadow to make logo pop */
  filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.25));
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
  margin-right: 1.5rem;
  border: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 40px; // Increased from 30px
  height: 32px; // Increased from 24px
  cursor: pointer;
  z-index: 10;
  position: relative;

  @media only screen and (max-width: 768px) {
    margin-right: 0.75rem; // Smaller margin on mobile
  }
`;

const HamburgerBar = styled.span`
  display: block;
  width: 100%;
  height: 5px; // Increased from 4px
  background-color: white;
  border-radius: 0;
  transform-origin: center;
  will-change: transform, opacity;

  &.top,
  &.bottom {
    transform-origin: 50% 50%;
  }

  &:nth-child(2) {
    margin: 6px 0; // Increased from 4px
  }

  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

const DropdownMenu = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) translateY(100%);
  width: 75%;
  height: 75%;
  max-height: 75vh;
  background: rgba(255, 255, 255, 0.05); /* Glassy, translucent background */
  backdrop-filter: blur(10px); /* Blur effect for depth */
  border-radius: 20px 20px 0 0; /* Rounded top corners */
  padding: 2rem;
  display: flex;
  flex-direction: column;
  z-index: 10;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3); /* Subtle, all-around shadow */
  border: 1px solid rgba(255, 255, 255, 0.1); /* Light border */
  overflow-y: auto;
  will-change: transform; /* Optimize animations */

  @media (max-width: 768px) {
    width: 100%; /* Full width on mobile */
    border-radius: 0; /* Remove rounded corners on mobile for full-screen effect */
    padding: 1.5rem; /* Optional: Adjust padding for mobile if desired */
  }
`;

const MenuContent = styled.div`
  opacity: 0; /* Start hidden for fade-in animation */
`;
const PortfolioCard = styled.div`
  background: rgba(255, 255, 255, 0.05); /* Matching glassy background */
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Subtle shadow */
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

// const ProfileImage = styled.img`
//   width: 150px;
//   height: 150px;
//   border-radius: 50%;
//   object-fit: cover;
//   border: 3px solid rgba(255, 255, 255, 0.3);
// `;

// const AboutMeText = styled.div`
//   color: white;

//   h2 {
//     margin-top: 0;
//     font-size: 1.8rem;
//   }

//   h3 {
//     margin-top: 0.5rem;
//     font-size: 1.2rem;
//     color: #4a7ab3;
//     font-weight: normal;
//   }

//   p {
//     line-height: 1.6;
//     margin: 1rem 0;
//   }
// `;

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

const Highlight = styled.span`
  color: #8ab4f8; /* Lighter blue */
  font-weight: 600;
  background: rgba(138, 180, 248, 0.2); /* Adjusted to match the new color */
  padding: 2px 6px;
  border-radius: 4px;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(138, 180, 248, 0.4); /* Slightly darker on hover */
  }
`;

const ProfileImageWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const ProfileImage = styled.img`
  width: 180px; /* Slightly larger for impact */
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(74, 122, 179, 0.5); /* Bluish border to match theme */
  transition: transform 0.3s ease;

  ${ProfileImageWrapper}:hover & {
    transform: scale(1.05); /* Subtle zoom on hover */
  }

  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
  }
`;

const ProfileImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 70%
  );
  pointer-events: none; /* Allows clicks to pass through */
`;

const AboutMeText = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Name = styled.h2`
  margin: 0;
  font-size: 2.2rem;
  font-weight: 700;
  background: linear-gradient(90deg, #ffffff, #4a7ab3); /* Gradient text */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const Title = styled.h3`
  margin: 0.5rem 0 1rem;
  font-size: 1.3rem;
  font-weight: 400;
  /* color: #4a7ab3; */
  color: #8ab4f8; /* Updated to lighter blue */
  letter-spacing: 1px;
  text-transform: uppercase;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const TextWrapper = styled.div`
  background: rgba(0, 0, 0, 0.3); /* Slightly darker background for text */
  padding: 1rem;
  border-radius: 10px;
  border-left: 4px solid #4a7ab3; /* Accent border on the left */
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.2);

  p {
    line-height: 1.6;
    margin: 0.5rem 0;
    font-size: 1rem;
    opacity: 0.9;

    @media (max-width: 768px) {
      font-size: 0.95rem;
    }
  }
`;
