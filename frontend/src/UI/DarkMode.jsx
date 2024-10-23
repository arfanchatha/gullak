import { useEffect, useRef, useState } from "react";
import { GrSystem } from "react-icons/gr";
import { HiOutlineSun } from "react-icons/hi";
import { HiOutlineMoon } from "react-icons/hi2";
import { LuSunMoon } from "react-icons/lu";
import { TbSunHigh } from "react-icons/tb";
import { useLocalStorageState } from "../hooks/useLocalStorage";

function DarkMode() {
  //   const [selectMode, setSelectedMode] = useState("system");
  const [isOpen, setIsOpen] = useState(false);
  const initialState = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const key = "isDarkMode";
  const [isDarkMode, setIsDarkMode] = useLocalStorageState(initialState, key);

  function hanldeIcon() {
    const newDarkModeState = !isDarkMode;

    setIsDarkMode((dark) => !dark);
    localStorage.setItem(key, JSON.stringify(newDarkModeState));
  }
  useEffect(
    function () {
      const bodyElement = document.querySelector("body");

      const newTheme = isDarkMode ? "dark" : "light";

      bodyElement.setAttribute("data-bs-theme", `${newTheme}`);
    },
    [isDarkMode]
  );

  //   const list = [
  //     { icon: <GrSystem size={20} />, label: "System" },
  //     { icon: <TbSunHigh size={20} />, label: "Light" },
  //     { icon: <LuSunMoon size={20} />, label: "Dark" },
  //   ];
  //   const handleIconButton = (event) => {
  //     event.stopPropagation();
  //     setIsOpen((open) => !open);
  //   };

  return (
    // <>
    //   <button
    //     className="text-cyan p-3 border-2 rounded-md hover:bg-slate-400"
    //     onClick={handleIconButton}
    //   >
    //     <GrSystem size={20} />
    //   </button>
    //   {isOpen && (
    //     <div id="system" className={`fixed z-50 top-20 right-48 `}>
    //       <div className="flex flex-col bg-gray-100 rounded-lg border shadow">
    //         {list.map((item, index) => (
    //           <div key={index} className="group ">
    //             <a className="flex space-x-2 group-hover:bg-gray-200 px-5 py-3 group-hover:cursor-pointer">
    //               {item.icon}
    //               <span>{item.label}</span>
    //             </a>
    //             {index < list.length - 1 && <div className="mx-5 border"></div>}{" "}
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   )}
    // </>
    <button
      className="text-cyan p-3 border-2 rounded-md hover:bg-slate-200"
      onClick={hanldeIcon}
    >
      {isDarkMode ? <HiOutlineSun /> : <HiOutlineMoon />}
    </button>
  );
}

export default DarkMode;
