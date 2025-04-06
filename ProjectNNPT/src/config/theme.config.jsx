// Theme configuration
export const theme = {
    colors: {
        primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
            contrastText: '#ffffff'
        },
        secondary: {
            main: '#9c27b0',
            light: '#ba68c8',
            dark: '#7b1fa2',
            contrastText: '#ffffff'
        },
        error: {
            main: '#d32f2f',
            light: '#ef5350',
            dark: '#c62828',
            contrastText: '#ffffff'
        },
        warning: {
            main: '#ed6c02',
            light: '#ff9800',
            dark: '#e65100',
            contrastText: '#ffffff'
        },
        info: {
            main: '#0288d1',
            light: '#03a9f4',
            dark: '#01579b',
            contrastText: '#ffffff'
        },
        success: {
            main: '#2e7d32',
            light: '#4caf50',
            dark: '#1b5e20',
            contrastText: '#ffffff'
        },
        grey: {
            50: '#fafafa',
            100: '#f5f5f5',
            200: '#eeeeee',
            300: '#e0e0e0',
            400: '#bdbdbd',
            500: '#9e9e9e',
            600: '#757575',
            700: '#616161',
            800: '#424242',
            900: '#212121'
        },
        background: {
            default: '#ffffff',
            paper: '#ffffff'
        },
        text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.6)',
            disabled: 'rgba(0, 0, 0, 0.38)'
        }
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: 14,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
        h1: {
            fontSize: '2.5rem',
            fontWeight: 500,
            lineHeight: 1.2
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 500,
            lineHeight: 1.2
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 500,
            lineHeight: 1.2
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 500,
            lineHeight: 1.2
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
            lineHeight: 1.2
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
            lineHeight: 1.2
        }
    },
    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem'
    },
    breakpoints: {
        xs: '0px',
        sm: '600px',
        md: '900px',
        lg: '1200px',
        xl: '1536px'
    },
    borderRadius: {
        small: '4px',
        medium: '8px',
        large: '12px',
        round: '50%'
    },
    shadows: {
        small: '0 2px 4px rgba(0,0,0,0.1)',
        medium: '0 4px 8px rgba(0,0,0,0.1)',
        large: '0 8px 16px rgba(0,0,0,0.1)'
    }
}; 