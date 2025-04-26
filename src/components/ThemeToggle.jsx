import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  SettingsBrightness as SystemModeIcon
} from '@mui/icons-material';
import { ThemeContext } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { themeMode, toggleTheme } = useContext(ThemeContext);

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light':
        return <LightModeIcon />;
      case 'dark':
        return <DarkModeIcon />;
      default:
        return <SystemModeIcon />;
    }
  };

  const getTooltipText = () => {
    switch (themeMode) {
      case 'light':
        return 'Switch to Dark Mode';
      case 'dark':
        return 'Switch to System Mode';
      default:
        return 'Switch to Light Mode';
    }
  };

  return (
    <Tooltip title={getTooltipText()}>
      <IconButton onClick={toggleTheme} color="inherit">
        {getThemeIcon()}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;