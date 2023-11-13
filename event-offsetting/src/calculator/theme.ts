import {
    ComponentStyleConfig,
    StyleFunctionProps,
    defineStyleConfig,
    extendTheme,
    withDefaultColorScheme,
    withDefaultVariant
} from '@chakra-ui/react';

import { Noto_Sans, Playfair_Display } from 'next/font/google';

const notoSans = Noto_Sans({
    weight: ['200', '300', '400', '500', '600', '800'],
    subsets: ['latin']
});

const playfairDisplay = Playfair_Display({
    weight: ['500', '600', '800'],
    subsets: ['latin']
});

const brandColors = {
    teal: {
        50: '#EBF9FA',
        60: '#E5FDFE',
        100: '#C7EFF0',
        200: '#A2E5E6',
        300: '#7EDBDD',
        400: '#5AD0D3',
        500: '#34bfc2',
        600: '#2B9EA1',
        700: '#207779',
        800: '#164F50',
        900: '#0B2828'
    },
    white: '#ffffff',
    black: '#0f0f0f',
    darkBlue: '#2a324b',
    green: '#C1D7C7',
    lightGreen: '#F0FAF4',
    yellow: '#F3D65F',
    orange: '#D0533F',
    peach: '#FDA880',
    pink: '#F5C0EE',
    blue: '#8DB0C3',
    beige: '#F5EFE5',
    blush: '#FFEEE7',
    cream: '#FFFEFC',
    gray: {
        50: '#F7FAFC',
        100: '#EDF2F7',
        200: '#E2E8F0',
        300: '#CBD5E0',
        400: '#A0AEC0',
        500: '#718096',
        600: '#525252',
        700: '#2E2E2E',
        800: '#1A202C',
        900: '#171923'
    }
};

const colors = {
    primary: brandColors.yellow,
    brand: brandColors,
    text: {
        gray: '#111',
        white: brandColors.white
    },
    gray: brandColors.gray
};

const fonts = {
    body: notoSans.style.fontFamily,
    heading: playfairDisplay.style.fontFamily
};

const Button: ComponentStyleConfig = {
    baseStyle: {
        borderRadius: '60px',
        lineHeight: '1.5',
        fontWeight: '500',
        padding: '0.75rem 1.25rem'
    },
    variants: {
        primary: {
            color: 'white',
            bgColor: 'brand.black',
            _hover: {
                bgColor: '#696868',
                _disabled: {
                    bgColor: '#918B8B'
                }
            },
            _disabled: {
                bgColor: '#918B8B'
            }
        },
        secondary: {
            color: 'brand.black',
            bgColor: 'white',
            borderColor: 'brand.black',
            border: '1px solid',
            _hover: {
                bgColor: 'brand.black',
                color: 'white',
                _disabled: {
                    color: '#918B8B',
                    borderColor: '#918B8B'
                }
            },
            _disabled: {
                color: '#918B8B',
                borderColor: '#918B8B'
            }
        },
        destructive: {
            color: 'white',
            bgColor: 'red',
            _hover: {
                bgColor: 'red.200'
            },
            _disabled: {
                bgColor: '#918B8B'
            }
        },
        transparent: {
            color: 'text.gray',
            bgColor: 'none',
            _hover: {
                bgColor: 'none',
                _disabled: {
                    bgColor: 'none'
                }
            }
        }
    }
};

const Link: ComponentStyleConfig = {
    baseStyle: {
        color: 'brand.orange'
    },
    variants: {
        menu: {
            _hover: {
                textDecoration: 'none'
            },
            color: 'default',
            fontWeight: 'normal'
        },
        muted: {
            color: 'gray.500',
            textDecoration: 'underline'
        }
    }
};

const Spinner: ComponentStyleConfig = defineStyleConfig({
    defaultProps: {
        size: 'lg',
        variant: 'cnaught'
    },
    variants: {
        cnaught: {
            color: 'brand.orange',
            borderWidth: '3px',
            borderBottomColor: 'orange.100',
            borderLeftColor: 'orange.100'
        }
    }
});

// workaround for https://github.com/vercel/next.js/issues/53088
// without this, chakra-react-select breaks on edge SSR
const Input: ComponentStyleConfig = {
    defaultProps: {
        size: 'md',
        variant: 'outline'
    },
    sizes: {
        md: {
            field: {
                height: 10,
                h: 10
            }
        }
    }
};

const components = { Button, Link, Spinner, Input };

export const cnaughtTheme = extendTheme(
    {
        colors,
        fonts,
        components,
        semanticTokens: {
            sizes: {
                cardTitle: 'md'
            },
            fontSizes: {
                random: '5px'
            }
        },
        styles: {
            global: (props: StyleFunctionProps) => ({
                body: {
                    color: '#111',
                    bgColor: 'rgba(253, 246, 232, 1)',
                    h: 'full'
                },
                'th[data-is-numeric=true]': {
                    textAlign: 'right'
                },
                'tbody > tr:last-child > td': {
                    border: 'none'
                },
                // see https://github.com/chakra-ui/chakra-ui/issues/3173
                '.chakra-popover__popper.chakra-popover__popper,  .chakra-menu__menu-button.chakra-menu__menu-button + span + div, .chakra-menu__menu-button + [style*="--popper-transform-origin"]':
                    {
                        margin: '0'
                    }
            })
        }
    },
    withDefaultColorScheme({ colorScheme: 'green' }),
    withDefaultColorScheme({
        colorScheme: 'gray',
        components: ['Button', 'Badge']
    }),
    withDefaultVariant({
        variant: 'secondary',
        components: ['Button']
    })
);

export const cnaughtStyles = {
    colors,
    fonts
};
