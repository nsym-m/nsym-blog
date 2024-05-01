"use client";

import type { FC } from "react";
import { useTheme } from "next-themes";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import System from '@mui/icons-material/SystemUpdateAlt';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: FC<ThemeToggleProps> = (props) => {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex flex-row space-x-1">
      <button
        onClick={() => {
          setTheme("light");
        }}
        className="py-1 px-2 border-2 rounded-md"
      >
        <LightModeIcon />
      </button>
      <button
        onClick={() => {
          setTheme("dark");
        }}
        className="py-1 px-2 border-2 rounded-md"
      >
        <DarkModeIcon />
      </button>
      <button
        onClick={() => {
          setTheme("system");
        }}
        className="py-1 px-2 border-2 rounded-md"
      >
        <System />
      </button>
    </div>
  );
};
