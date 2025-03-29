import type {Config} from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}'
    ],
    theme: {
        extend: {
            colors: {
                primary: '#005F73',
                secondary: '#FFC300',
                text_one: '#333333',
                text_two: '#4D4D4D',
                text_three: '#666666',
                text_four: '#999999',
                white: '#ffffff',
                border_gray: '#e6e6e6',
                'tab-bar': {
                    'bg-primary-color': 'var(--neutral-50)',
                    default: '#7e919a',
                    active: '#005F73'
                }
            },
            typography: {
                heading_large_bold: {
                    css: {
                        fontSize: '32px',
                        lineHeight: '120%',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 700,
                        fontStyle: 'normal'
                    }
                },
                heading_large_semibold: {
                    css: {
                        fontSize: '32px',
                        lineHeight: '120%',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 600,
                        fontStyle: 'normal'
                    }
                },
                heading_medium_bold: {
                    css: {
                        fontSize: '24px',
                        lineHeight: '120%',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 700,
                        fontStyle: 'normal'
                    }
                },
                heading_medium_semibold: {
                    css: {
                        fontSize: '24px',
                        lineHeight: '120%',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 600,
                        fontStyle: 'normal'
                    }
                },
                heading_medium_medium: {
                    css: {
                        fontSize: '24px',
                        lineHeight: '120%',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 500,
                        fontStyle: 'normal'
                    }
                },
                heading_medium_regular: {
                    css: {
                        fontSize: '24px',
                        lineHeight: '120%',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 400,
                        fontStyle: 'normal'
                    }
                },
                heading_medium_light: {
                    css: {
                        fontSize: '24px',
                        lineHeight: '120%',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 300,
                        fontStyle: 'normal'
                    }
                },
                heading_small_bold: {
                    css: {
                        fontSize: '20px',
                        lineHeight: '140%',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 700,
                        fontStyle: 'normal'
                    }
                },
                heading_small_semibold: {
                    css: {
                        fontSize: '20px',
                        lineHeight: '140%',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 600,
                        fontStyle: 'normal'
                    }
                },
                heading_small_medium: {
                    css: {
                        fontSize: '20px',
                        lineHeight: '140%',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 500,
                        fontStyle: 'normal'
                    }
                },
                heading_small_regular: {
                    css: {
                        fontSize: '20px',
                        lineHeight: '140%',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 400,
                        fontStyle: 'normal'
                    }
                },
                heading_small_light: {
                    css: {
                        fontSize: '20px',
                        lineHeight: '140%',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 300,
                        fontStyle: 'normal'
                    }
                },
                body_large_bold: {
                    css: {
                        fontSize: '16px',
                        lineHeight: '160%',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 700,
                        fontStyle: 'normal'
                    }
                },
                body_large_semibold: {
                    css: {
                        fontSize: '16px',
                        lineHeight: '160%',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 600,
                        fontStyle: 'normal'
                    }
                },
                body_large_medium: {
                    css: {
                        fontSize: '16px',
                        lineHeight: '160%',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 500,
                        fontStyle: 'normal'
                    }
                },
                body_large_regular: {
                    css: {
                        fontSize: '16px',
                        lineHeight: '160%',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 400,
                        fontStyle: 'normal'
                    }
                },
                body_large_light: {
                    css: {
                        fontSize: '16px',
                        lineHeight: '160%',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 300,
                        fontStyle: 'normal'
                    }
                },
                body_medium_bold: {
                    css: {
                        fontSize: '14px',
                        lineHeight: '160%',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 700,
                        fontStyle: 'normal'
                    }
                },
                body_medium_semibold: {
                    css: {
                        fontSize: '14px',
                        lineHeight: '160%',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 600,
                        fontStyle: 'normal'
                    }
                },
                body_medium_medium: {
                    css: {
                        fontSize: '14px',
                        lineHeight: '160%',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 500,
                        fontStyle: 'normal'
                    }
                },
                body_medium_regular: {
                    css: {
                        fontSize: '14px',
                        lineHeight: '160%',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 400,
                        fontStyle: 'normal'
                    }
                },
                body_medium_light: {
                    css: {
                        fontSize: '14px',
                        lineHeight: '160%',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 300,
                        fontStyle: 'normal'
                    }
                },
                body_small_bold: {
                    css: {
                        fontSize: '12px',
                        lineHeight: '160%',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 700,
                        fontStyle: 'normal'
                    }
                },
                body_small_semibold: {
                    css: {
                        fontSize: '12px',
                        lineHeight: '160%',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 600,
                        fontStyle: 'normal'
                    }
                },
                body_small_medium: {
                    css: {
                        fontSize: '12px',
                        lineHeight: '160%',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 500,
                        fontStyle: 'normal'
                    }
                },
                body_small_regular: {
                    css: {
                        fontSize: '12px',
                        lineHeight: '160%',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 400,
                        fontStyle: 'normal'
                    }
                },
                body_small_light: {
                    css: {
                        fontSize: '12px',
                        lineHeight: '160%',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 300,
                        fontStyle: 'normal'
                    }
                }
            },
            borderRadius: {},

            screens: {
                xs: {max: '767px'}, //only for mob styles
                md: '768px', //min 768
                lg: '1188px' //min 1188
            }
        },
        boxShadow: {}
    },
    plugins: [
        require('@tailwindcss/typography')({
            className: 'typo'
        }),
        function ({addBase}: {addBase: any}) {
            addBase({
                ':root': {
                    '--blue-100': '#cce4ff',
                    '--blue-200': '#99caff',
                    '--blue-300': '#66afff',
                    '--blue-400': '#3395ff',
                    '--blue-500': '#007aff',
                    '--blue-600': '#0062cc',
                    '--blue-700': '#004999',
                    '--blue-800': '#003166',
                    '--blue-900': '#001833',
                    '--green-100': '#abe9b8',
                    '--green-200': '#80de94',
                    '--green-300': '#56d371',
                    '--green-400': '#2cc84d',
                    '--green-500': '#23a03e',
                    '--green-600': '#1a782e',
                    '--green-700': '#12501f',
                    '--green-800': '#09280f',
                    '--green-900': '#041408',
                    '--neutral-50': '#fafafa',
                    '--neutral-100': '#f5f5f5',
                    '--neutral-150': '#e5e5e5',
                    '--neutral-200': '#d4d4d4',
                    '--neutral-300': '#a3a3a3',
                    '--neutral-400': '#737373',
                    '--neutral-500': '#525252',
                    '--neutral-600': '#404040',
                    '--neutral-700': '#262626',
                    '--neutral-800': '#171717',
                    '--neutral-900': '#0a0a0a',
                    '--red-100': '#ffd8d6',
                    '--red-200': '#ffb0ac',
                    '--red-300': '#ff8983',
                    '--red-400': '#ff6159',
                    '--red-500': '#ff3a30',
                    '--red-600': '#cd2e26',
                    '--red-700': '#9c231d',
                    '--red-800': '#6a1713',
                    '--red-900': '#390c0a',
                    '--yellow-100': '#fff5cc',
                    '--yellow-200': '#ffeb99',
                    '--yellow-300': '#ffe067',
                    '--yellow-400': '#ffd634',
                    '--yellow-500': '#ffcc01',
                    '--yellow-600': '#cca301',
                    '--yellow-700': '#997a01',
                    '--yellow-800': '#665200',
                    '--yellow-900': '#332900'
                }
            });
        },
        function ({addUtilities}: {addUtilities: any}) {
            const newUtilities = {
                '.grid-sizes': {
                    width: '1320px',
                    padding: '0 24px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                },
                '.grid-sizes-swiper': {
                    width: '1188px',
                    padding: '0 24px',
                    margin: 'auto'
                },
                '@media (min-width: 768px) and (max-width: 1187px)': {
                    '.grid-sizes': {
                        width: '768px',
                        padding: '0 24px'
                    },
                    '.grid-sizes-swiper': {
                        width: '768px',
                        padding: '0 0 0 24px'
                    }
                },

                '@media (max-width: 767px)': {
                    '.grid-sizes': {
                        maxWidth: '550px',
                        width: '100%;',
                        padding: '0 16px'
                    },
                    '.grid-sizes-swiper': {
                        maxWidth: '550px',
                        width: '100%;',
                        padding: '0 0 0 16px'
                    }
                },

                /*HOVER EFFECT*/
                '.hover-state-300': {
                    transition: 'all 0.3s ease-out'
                },

                '.hover-state-500': {
                    transition: 'all 0.5s ease-out'
                },

                /*GRADIENTS*/
                '.live-gradient': {
                    background:
                        'linear-gradient(90deg, rgba(120, 120, 128, 0.40) 0%, rgba(120, 120, 128, 0.00) 50%, rgba(120, 120, 128, 0.40) 100%)'
                }
            };
            addUtilities(newUtilities, ['responsive', 'hover']);
        }
    ]
};
export default config;
