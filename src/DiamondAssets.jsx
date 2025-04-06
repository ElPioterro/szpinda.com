import { createContext, useContext, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";

const DiamondAssetsContext = createContext();

// This will be called only once and then reused
let hasLogged = false;

export function DiamondAssetsProvider({ children }) {
  // Use useMemo to ensure these are only loaded once
  const model = useMemo(() => {
    return useGLTF("/test1-transformed.glb");
  }, []);

  const texture = useMemo(() => {
    const loadedTexture = useLoader(EXRLoader, "output.exr");

    if (!hasLogged) {
      console.log("load Model&Texture (only once)");
      hasLogged = true;
    }

    return loadedTexture;
  }, []);

  return (
    <DiamondAssetsContext.Provider value={{ model, texture }}>
      {children}
    </DiamondAssetsContext.Provider>
  );
}

export function useDiamondAssets() {
  return useContext(DiamondAssetsContext);
}

// Preload the model to ensure it's available
useGLTF.preload("/test1-transformed.glb");

// Memo Fix: (THANKS :DD)
// https://you.com/search?q=Task%3A+Menu+work.+Create+an+template+for+About+Me+section+and+Portfolio+section.+Outside+%28bottom+right%29+Socials+icon+links.%0A%0ACode%3A%0A%0Aimport+React%2C+%7B+useEffect%2C+useRef%2C+useState+%7D+from+%22react%22%3B%0Aimport+%7B+BrowserRouter+as+Router+%7D+from+%22react-router-dom%22%3B%0Aimport+styled+from+%22styled-components%22%3B%0Aimport+%7B+gsap+%7D+from+%22gsap%22%3B%0Aimport+Scene+from+%22.%2FScene%22%3B%0Aimport+%7B+Logo+%7D+from+%22.%2FLogo%22%3B%0A%0Aexport+const+App+%3D+%28%29+%3D%3E+%7B%0A++const+mainRef+%3D+useRef%28%29%3B%0A++const+menuRef+%3D+useRef%28%29%3B%0A++const+%5BmenuOpen%2C+setMenuOpen%5D+%3D+useState%28false%29%3B%0A%0A++%2F%2F+Close+menu+when+clicking+outside%0A++const+handleClickOutside+%3D+%28event%29+%3D%3E+%7B%0A++++if+%28%0A++++++menuOpen+%26%26%0A++++++%21event.target.closest%28%22%23menu-container%22%29+%26%26%0A++++++%21event.target.closest%28%22%23hamburger-button%22%29%0A++++%29+%7B%0A++++++setMenuOpen%28false%29%3B%0A++++%7D%0A++%7D%3B%0A%0A++useEffect%28%28%29+%3D%3E+%7B%0A++++document.addEventListener%28%22click%22%2C+handleClickOutside%29%3B%0A++++return+%28%29+%3D%3E+document.removeEventListener%28%22click%22%2C+handleClickOutside%29%3B%0A++%7D%2C+%5BmenuOpen%5D%29%3B%0A%0A++%2F%2F+Set+height+dynamically+based+on+window.innerHeight%0A++useEffect%28%28%29+%3D%3E+%7B%0A++++const+updateHeight+%3D+%28%29+%3D%3E+%7B%0A++++++if+%28mainRef.current%29+%7B%0A++++++++mainRef.current.style.height+%3D+%60%24%7Bwindow.innerHeight%7Dpx%60%3B%0A++++++%7D%0A++++%7D%3B%0A%0A++++updateHeight%28%29%3B%0A%0A++++window.addEventListener%28%22resize%22%2C+updateHeight%29%3B%0A++++return+%28%29+%3D%3E+window.removeEventListener%28%22resize%22%2C+updateHeight%29%3B%0A++%7D%2C+%5B%5D%29%3B%0A%0A++%2F%2F+Animate+menu+open%2Fclose%0A++useEffect%28%28%29+%3D%3E+%7B%0A++++if+%28menuOpen%29+%7B%0A++++++gsap.to%28menuRef.current%2C+%7B%0A++++++++y%3A+0%2C%0A++++++++duration%3A+0.5%2C%0A++++++++ease%3A+%22power3.out%22%2C%0A++++++%7D%29%3B%0A++++%7D+else+%7B%0A++++++gsap.to%28menuRef.current%2C+%7B%0A++++++++y%3A+%22100%25%22%2C%0A++++++++duration%3A+0.5%2C%0A++++++++ease%3A+%22power3.in%22%2C%0A++++++%7D%29%3B%0A++++%7D%0A++%7D%2C+%5BmenuOpen%5D%29%3B%0A%0A++return+%28%0A++++%3CRouter%3E%0A++++++%3CMain+ref%3D%7BmainRef%7D%3E%0A++++++++%3Ccanvas+id%3D%22gradient-canvas%22+data-transition-in+%2F%3E%0A++++++++%3CMenu%3E%0A++++++++++%3CLogo%0A++++++++++++width%3D%7B100%7D%0A++++++++++++height%3D%7B100%7D%0A++++++++++++fillColor%3D%7B%22white%22%7D%0A++++++++++++strokeColor%3D%7B%22%23AAA%22%7D%0A++++++++++++strokeWidth%3D%7B1%7D%0A++++++++++%2F%3E%0A++++++++++%3CHamburgerButton%0A++++++++++++id%3D%22hamburger-button%22%0A++++++++++++onClick%3D%7B%28%29+%3D%3E+setMenuOpen%28%21menuOpen%29%7D%0A++++++++++%3E%0A++++++++++++%3Cspan+%2F%3E%0A++++++++++++%3Cspan+%2F%3E%0A++++++++++++%3Cspan+%2F%3E%0A++++++++++%3C%2FHamburgerButton%3E%0A++++++++%3C%2FMenu%3E%0A++++++++%3CDropdownMenu+ref%3D%7BmenuRef%7D+id%3D%22menu-container%22%3E%0A++++++++++%7B%2F*+Menu+content+goes+here+*%2F%7D%0A%0A++++++++++%3CButtonContainer%3E%0A++++++++++++%3CButtonLink+href%3D%22%23link1%22%3EMain+Button+1%3C%2FButtonLink%3E%0A++++++++++++%3CButtonLink+href%3D%22%23link2%22%3EMain+Button+2%3C%2FButtonLink%3E%0A++++++++++%3C%2FButtonContainer%3E%0A++++++++%3C%2FDropdownMenu%3E%0A%0A++++++++%3CSceneContainer%3E%0A++++++++++%3CScene+%2F%3E%0A++++++++%3C%2FSceneContainer%3E%0A++++++%3C%2FMain%3E%0A++++%3C%2FRouter%3E%0A++%29%3B%0A%7D%3B%0A%0A%2F%2F+Styled+Components%0Aconst+Main+%3D+styled.main%60%0A++position%3A+absolute%3B%0A++display%3A+flex%3B%0A++flex-direction%3A+row%3B%0A++width%3A+100vw%3B%0A++overflow%3A+hidden%3B%0A%0A++%40media+only+screen+and+%28max-width%3A+1200px%29+%7B%0A++++flex-direction%3A+column%3B%0A++%7D%0A%60%3B%0A%0Aconst+SceneContainer+%3D+styled.div%60%0A++position%3A+absolute%3B%0A++top%3A+0%3B%0A++left%3A+0%3B%0A++width%3A+100%25%3B%0A++height%3A+100%25%3B%0A++z-index%3A+0%3B%0A%0A++%40media+only+screen+and+%28max-width%3A+1200px%29+%7B%0A++++touch-action%3A+none%3B%0A++%7D%0A%0A++%26%3A%3Aafter+%7B%0A++++content%3A+%22%22%3B%0A++++position%3A+absolute%3B%0A++++top%3A+0%3B%0A++++left%3A+0%3B%0A++++width%3A+100%25%3B%0A++++height%3A+100%25%3B%0A++++mix-blend-mode%3A+overlay%3B%0A++++pointer-events%3A+none%3B%0A++%7D%0A%60%3B%0A%0Aconst+Menu+%3D+styled.div%60%0A++position%3A+absolute%3B%0A++top%3A+1rem%3B%0A++left%3A+0%3B%0A++width%3A+100%25%3B%0A++display%3A+flex%3B%0A++flex-direction%3A+row%3B%0A++justify-content%3A+space-between%3B%0A++padding%3A+4em%3B%0A++z-index%3A+1%3B%0A%0A++%3E+svg+%7B%0A++++width%3A+64px%3B%0A++%7D%0A%0A++%40media+only+screen+and+%28max-width%3A+1200px%29+%7B%0A++++padding%3A+2em+4em%3B%0A++%7D%0A%60%3B%0A%0Aconst+HamburgerButton+%3D+styled.button%60%0A++background%3A+none%3B%0A++border%3A+none%3B%0A++display%3A+flex%3B%0A++flex-direction%3A+column%3B%0A++justify-content%3A+space-between%3B%0A++width%3A+30px%3B%0A++height%3A+24px%3B%0A++cursor%3A+pointer%3B%0A++z-index%3A+2%3B%0A%0A++span+%7B%0A++++display%3A+block%3B%0A++++width%3A+100%25%3B%0A++++height%3A+4px%3B%0A++++background-color%3A+white%3B%0A++++border-radius%3A+2px%3B%0A++++transition%3A+all+0.3s+ease%3B%0A++%7D%0A%0A++%26%3Ahover+span+%7B%0A++++background-color%3A+%23aaa%3B%0A++%7D%0A%60%3B%0A%0Aconst+DropdownMenu+%3D+styled.div%60%0A++position%3A+fixed%3B%0A++bottom%3A+0%3B%0A++left%3A+50%25%3B%0A++transform%3A+translateX%28-50%25%29+translateY%28100%25%29%3B%0A++width%3A+75%25%3B%0A++height%3A+75%25%3B%0A++max-height%3A+75vh%3B%0A++background-color%3A+rgba%280%2C+0%2C+0%2C+0.6%29%3B%0A++backdrop-filter%3A+blur%2815px%29%3B+%2F*+Glossy+effect+*%2F%0A%0A++border-radius%3A+20px+20px+0+0%3B%0A++padding%3A+2rem%3B%0A++display%3A+flex%3B%0A++flex-direction%3A+column%3B%0A++z-index%3A+10%3B%0A++box-shadow%3A+0+-5px+15px+rgba%280%2C+0%2C+0%2C+0.3%29%3B%0A++overflow-y%3A+auto%3B%0A++will-change%3A+transform%3B%0A%60%3B%0A%0Aconst+ButtonLink+%3D+styled.a%60%0A++display%3A+inline-block%3B%0A++width%3A+45%25%3B%0A++text-align%3A+center%3B%0A++padding%3A+2rem+1rem%3B%0A++margin%3A+0+2.5%25%3B%0A++background-color%3A+%23555%3B%0A++color%3A+white%3B%0A++text-decoration%3A+none%3B%0A++font-size%3A+1.2rem%3B%0A++font-weight%3A+bold%3B%0A++border-radius%3A+8px%3B%0A++transition%3A+all+0.3s+ease%3B%0A++box-shadow%3A+0+4px+6px+rgba%280%2C+0%2C+0%2C+0.2%29%3B%0A%0A++%26%3Ahover+%7B%0A++++background-color%3A+%234a7ab3%3B+%2F*+Bluish+accent+color+*%2F%0A++++transform%3A+translateY%28-3px%29%3B%0A++++box-shadow%3A+0+6px+12px+rgba%2850%2C+100%2C+220%2C+0.3%29%3B%0A++%7D%0A%0A++%26%3Aactive+%7B%0A++++transform%3A+translateY%28-1px%29%3B%0A++%7D%0A%60%3B%0Aconst+ButtonContainer+%3D+styled.div%60%0A++display%3A+flex%3B%0A++justify-content%3A+center%3B%0A++width%3A+100%25%3B%0A++margin-top%3A+auto%3B+%2F*+Pushes+the+buttons+toward+the+bottom+*%2F%0A%60%3B%0A&fromSearchBar=true&chatMode=custom&cid=c0_d43283e2-f1f1-42fc-b980-6c7bcf2c7571
