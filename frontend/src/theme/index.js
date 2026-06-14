import lightTheme from './lightTheme';
import darkTheme from './darkTheme';

/**
 * Returns the MUI theme object based on the given mode.
 * @param {'light' | 'dark'} mode - The theme mode to use.
 * @returns {import('@mui/material/styles').Theme} The MUI theme object.
 */
export const getTheme = (mode) => {
  return mode === 'dark' ? darkTheme : lightTheme;
};

export { lightTheme, darkTheme };
export default getTheme;
