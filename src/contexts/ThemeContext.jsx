import { createContext, useState, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';

export const ColorModeContext = createContext({ toggleColorMode: () => { } });

export const useColorMode = () => {
    const [mode, setMode] = useState('light');

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    ...(mode === 'light'
                        ? {
                            // palette values for light mode
                            primary: {
                                main: '#ffcd1c',
                                light: '#ffde6b',
                                dark: '#c79c00',
                            },
                            secondary: {
                                main: '#0d47a1',
                                light: '#5472d3',
                                dark: '#002171',
                            },
                            background: {
                                default: '#f7f9fc',
                                paper: '#ffffff',
                            },
                        }
                        : {
                            // palette values for dark mode
                            primary: {
                                main: '#ffcd1c',
                                light: '#ffde6b',
                                dark: '#c79c00',
                            },
                            secondary: {
                                main: '#5472d3',
                                light: '#88a1ff',
                                dark: '#1246a1',
                            },
                            background: {
                                default: '#212121',
                                paper: '#333333',
                            },
                        }),
                },
            }),
        [mode],
    );

    return [theme, colorMode];
};
