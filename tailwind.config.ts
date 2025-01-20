import type {Config} from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/shared-library/dist/**/*.{js,ts,jsx,tsx}', // Include shared components
        '../shared-library/src/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        spacing: {
            0: '0px',
            1: '2px',
            2: '4px',
            3: '6px',
            4: '8px',
            5: '12px',
            6: '16px',
            7: '20px',
            8: '24px',
            9: '32px',
            10: '40px',
            11: '48px',
            12: '56px',
            13: '72px',
            14: '80px'
        },
        extend: {
            colors: {
                brand: {
                    brand: 'var(--green-500)',
                    brand_alt: 'var(--green-500)'
                },
                system_bg: {
                    primary: 'var(--neutral-100)',
                    secondary: 'var(--neutral-900)',
                    tertiary: 'var(--neutral-800)'
                },
                bg: {
                    primary: 'var(--neutral-50)',
                    primary_subtle: 'var(--neutral-400)',
                    secondary: 'var(--neutral-800)',
                    tertiary: 'var(--neutral-900)',
                    success: 'var(--green-100)',
                    success_alt: 'var(--green-400)',
                    error: 'var(--red-100)',
                    error_alt: 'var(--red-400)',
                    warning: 'var(--yellow-100)',
                    warning_alt: 'var(--yellow-400)',
                    info: 'var(--blue-100)',
                    info_alt: 'var(--blue-400)',
                    disabled: 'var(--blue-400)',
                    onbrand: 'var(--green-500)'
                },
                border: {
                    primary: 'var(--neutral-200)',
                    secondary: 'var(--neutral-400)',
                    white: 'var(--neutral-50)',
                    success: 'var(--green-400)',
                    error: 'var(--red-400)',
                    warning: 'var(--yellow-400)',
                    info: 'var(--blue-400)',
                    disabled: 'var(--neutral-300)'
                },
                text: {
                    primary: 'var(--neutral-900)',
                    secondary: 'var(--neutral-600)',
                    tertiary: 'var(--neutral-400)',
                    quaternary: 'var(--neutral-200)',
                    white: 'var(--neutral-50)',
                    success: 'var(--green-400)',
                    error: 'var(--red-400)',
                    warning: 'var(--yellow-600)',
                    info: 'var(--blue-400)',
                    disabled: 'var(--neutral-300)',
                    primary_alt: 'var(--neutral-700)',
                    onbrand: 'var(--green-500)'
                },
                opacity: {
                    'dark-5': '#0000000d',
                    'dark-10': '#0000001a',
                    'dark-15': '#00000026',
                    'dark-20': '#00000033',
                    'dark-30': '#0000004d',
                    'dark-40': '#00000066',
                    'dark-50': '#00000080',
                    'dark-60': '#00000099',
                    'dark-80': '#000000cc',
                    'dark-90': '#000000e5',
                    'dark-95': '#000000f2',
                    'light-5': '#ffffff0d',
                    'light-10': '#ffffff1a',
                    'light-15': '#ffffff26',
                    'light-20': '#ffffff33',
                    'light-30': '#ffffff4d',
                    'light-40': '#ffffff66',
                    'light-50': '#ffffff80',
                    'light-60': '#ffffff99',
                    'light-70': '#ffffffb2',
                    'light-80': '#ffffffcc',
                    'light-90': '#ffffffe5',
                    'light-95': '#fffffff2'
                },
                button: {
                    'primary-bg-color': 'var(--neutral-700)',
                    'primary-bg-color_hover': 'var(--neutral-800)',
                    'primary-bg-color_pressed': 'var(--neutral-900)',
                    'primary-bg-color_disabled': 'var(--neutral-150)',
                    'brand-bg-color': 'var(--green-500)',
                    'brand-bg-color_hover': 'var(--green-600)',
                    'brand-bg-color_pressed': 'var(--green-800)',
                    'subtle-bg-color': 'var(--neutral-150)',
                    'ghost-bg-color': 'var(--neutral-150)',
                    'subtle-bg-color_hover': 'var(--neutral-200)',
                    'subtle-bg-color_pressed': 'var(--neutral-300)',
                    'secondary-bg-color': 'var(--neutral-700)',
                    'secondary-bg-color_hover': 'var(--neutral-800)',
                    'tertiary-bg-color': 'var(--neutral-100)',
                    'tertiary-bg-color_hover': 'var(--neutral-200)',
                    'disabled-bg-color': 'var(--neutral-300)',
                    'live-radio-bg-color': 'var(--green-500)'
                },
                'date-picker': {
                    'primary-bg-color': 'var(--blue-500)',
                    'secondary-bg-color': 'var(--neutral-150)',
                    'secondary-bg-color_hover': 'var(--blue-200)',
                    'tertiary-bg-color': 'var(--neutral-50)',
                    'tertiary-bg-color_hover': 'var(--blue-100)',
                    'primary-text': 'var(--neutral-900)',
                    'primary-text_disabled': 'var(--neutral-300)',
                    'secondary-text': 'var(--neutral-50)',
                    'tertiary-text': 'var(--neutral-400)'
                },
                form: {
                    'border-default': 'var(--neutral-200)',
                    'border-active': 'var(--green-500)',
                    'border-disable': 'var(--neutral-300)',
                    'primary-bg-active': 'var(--green-500)',
                    'primary-bg-disabled': 'var(--neutral-300)',
                    'text-default': 'var(--neutral-900)',
                    'text-active': 'var(--green-500)',
                    'dropdown-bg-primary-alt': 'var(--neutral-700)',
                    'dropdown-bg-secondary-alt': '#313131'
                },
                'live-button': {
                    'primary-bg-color': 'var(--neutral-50)',
                    'secondary-bg-color': 'var(--green-600)',
                    'tertiary-bg-color': 'var(--neutral-800)'
                },
                'radio-button': {
                    'bg-color': 'var(--green-800)',
                    active: 'var(--green-300)',
                    disabled: 'var(--neutral-300)'
                },
                'segment-control': {
                    'bg-primary-color': 'var(--neutral-700)',
                    'bg-secondary-color': 'var(--green-700)'
                },
                link: {
                    default: 'var(--blue-400)',
                    hover: 'var(--blue-600)',
                    pressed: 'var(--blue-800)',
                    focused: 'var(--blue-400)'
                },
                navbar: {
                    'bg-color': 'var(--neutral-900)',
                    'text-default-color': 'var(--neutral-50)',
                    'text-hover-color': 'var(--green-300)'
                },
                tab: {
                    default: 'var(--neutral-900)',
                    active: 'var(--green-500)',
                    disabled: 'var(--neutral-300)'
                },
                'chip-filter': {
                    'bg-default': 'var(--neutral-100)',
                    'bg-pressed': 'var(--neutral-200)',
                    'bg-active': 'var(--green-500)',
                    'border-default': '#0000001a'
                },
                'page-controls': {
                    default: 'var(--neutral-300)',
                    active: 'var(--green-400)'
                },
                sheet: {
                    'bg-color': 'var(--neutral-150)',
                    'list-item_bg-default': 'var(--neutral-50)',
                    'list-item_bg-active': 'var(--green-100)',
                    'list-item_text-default': 'var(--neutral-900)',
                    'list-item_text-active': 'var(--green-800)'
                },
                'tab-bar': {
                    'bg-primary-color': 'var(--neutral-50)',
                    default: 'var(--neutral-300)',
                    active: 'var(--green-500)'
                },
                badge: {
                    'bg-color': 'var(--green-500)'
                },
                ribbon: {
                    'bg-primary-color': 'var(--green-500)',
                    'bg-secondary-color': 'var(--green-600)'
                }
            },
            typography: {
                display: {
                    css: {
                        fontSize: '56px',
                        lineHeight: '62px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 700,
                        fontStyle: 'normal'
                    }
                },
                heading_xlr: {
                    css: {
                        fontSize: '42px',
                        lineHeight: '48px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 400,
                        fontStyle: 'normal'
                    }
                },
                heading_xls: {
                    css: {
                        fontSize: '42px',
                        lineHeight: '48px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 600,
                        fontStyle: 'normal'
                    }
                },
                heading_xlb: {
                    css: {
                        fontSize: '42px',
                        lineHeight: '48px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 700,
                        fontStyle: 'normal'
                    }
                },
                heading_lr: {
                    css: {
                        fontSize: '32px',
                        lineHeight: '40px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 400,
                        fontStyle: 'normal'
                    }
                },
                heading_ls: {
                    css: {
                        fontSize: '32px',
                        lineHeight: '40px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 600,
                        fontStyle: 'normal'
                    }
                },
                heading_lb: {
                    css: {
                        fontSize: '32px',
                        lineHeight: '40px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 700,
                        fontStyle: 'normal'
                    }
                },
                heading_mr: {
                    css: {
                        fontSize: '24px',
                        lineHeight: '30px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 400,
                        fontStyle: 'normal'
                    }
                },
                heading_ms: {
                    css: {
                        fontSize: '24px',
                        lineHeight: '30px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 600,
                        fontStyle: 'normal'
                    }
                },
                heading_mb: {
                    css: {
                        fontSize: '24px',
                        lineHeight: '30px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 700,
                        fontStyle: 'normal'
                    }
                },
                heading_sr: {
                    css: {
                        fontSize: '20px',
                        lineHeight: '26px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 400,
                        fontStyle: 'normal'
                    }
                },
                heading_ss: {
                    css: {
                        fontSize: '20px',
                        lineHeight: '26px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 600,
                        fontStyle: 'normal'
                    }
                },
                heading_sb: {
                    css: {
                        fontSize: '20px',
                        lineHeight: '26px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 700,
                        fontStyle: 'normal'
                    }
                },
                heading_xsr: {
                    css: {
                        fontSize: '18px',
                        lineHeight: '22px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 400,
                        fontStyle: 'normal'
                    }
                },
                heading_xss: {
                    css: {
                        fontSize: '18px',
                        lineHeight: '22px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 600,
                        fontStyle: 'normal'
                    }
                },
                heading_xsb: {
                    css: {
                        fontSize: '18px',
                        lineHeight: '22px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 700,
                        fontStyle: 'normal'
                    }
                },
                body_lr: {
                    css: {
                        fontSize: '22px',
                        lineHeight: '34px',
                        fontFamily: 'var(--font-inter)',
                        fontWeight: 400,
                        fontStyle: 'normal'
                    }
                },
                body_ls: {
                    css: {
                        fontSize: '22px',
                        lineHeight: '34px',
                        fontFamily: 'var(--font-inter)',
                        fontWeight: 600,
                        fontStyle: 'normal'
                    }
                },
                body_lsi: {
                    css: {
                        fontSize: '22px',
                        lineHeight: '34px',
                        fontFamily: 'var(--font-inter)',
                        fontWeight: 600,
                        fontStyle: 'italic'
                    }
                },
                body_lb: {
                    css: {
                        fontSize: '22px',
                        lineHeight: '34px',
                        fontFamily: 'var(--font-inter)',
                        fontWeight: 700,
                        fontStyle: 'normal'
                    }
                },
                body_mr: {
                    css: {
                        fontSize: '18px',
                        lineHeight: '28px',
                        fontFamily: 'var(--font-inter)',
                        fontWeight: 400,
                        fontStyle: 'normal'
                    }
                },
                body_ms: {
                    css: {
                        fontSize: '18px',
                        lineHeight: '28px',
                        fontFamily: 'var(--font-inter)',
                        fontWeight: 600,
                        fontStyle: 'normal'
                    }
                },
                body_mb: {
                    css: {
                        fontSize: '18px',
                        lineHeight: '28px',
                        fontFamily: 'var(--font-inter)',
                        fontWeight: 700,
                        fontStyle: 'normal'
                    }
                },
                body_sr: {
                    css: {
                        fontSize: '16px',
                        lineHeight: '22px',
                        fontFamily: 'var(--font-inter)',
                        fontWeight: 400,
                        fontStyle: 'normal'
                    }
                },
                body_ss: {
                    css: {
                        fontSize: '16px',
                        lineHeight: '22px',
                        fontFamily: 'var(--font-inter)',
                        fontWeight: 600,
                        fontStyle: 'normal'
                    }
                },
                body_sb: {
                    css: {
                        fontSize: '16px',
                        lineHeight: '22px',
                        fontFamily: 'var(--font-inter)',
                        fontWeight: 700,
                        fontStyle: 'normal'
                    }
                },
                body_xsr: {
                    css: {
                        fontSize: '13px',
                        lineHeight: '17px',
                        fontFamily: 'var(--font-inter)',
                        fontWeight: 400,
                        fontStyle: 'normal'
                    }
                },
                body_xss: {
                    css: {
                        fontSize: '13px',
                        lineHeight: '17px',
                        fontFamily: 'var(--font-inter)',
                        fontWeight: 600,
                        fontStyle: 'normal'
                    }
                },
                body_xsb: {
                    css: {
                        fontSize: '13px',
                        lineHeight: '17px',
                        fontFamily: 'var(--font-inter)',
                        fontWeight: 700,
                        fontStyle: 'normal'
                    }
                },
                body_2xsr: {
                    css: {
                        fontSize: '10px',
                        lineHeight: '14px',
                        fontFamily: 'var(--font-inter)',
                        fontWeight: 400,
                        fontStyle: 'normal'
                    }
                },
                body_2xss: {
                    css: {
                        fontSize: '10px',
                        lineHeight: '14px',
                        fontFamily: 'var(--font-inter)',
                        fontWeight: 600,
                        fontStyle: 'normal'
                    }
                },
                body_2xsb: {
                    css: {
                        fontSize: '10px',
                        lineHeight: '14px',
                        fontFamily: 'var(--font-inter)',
                        fontWeight: 700,
                        fontStyle: 'normal'
                    }
                },
                label_lr: {
                    css: {
                        fontSize: '18px',
                        lineHeight: '20px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 400,
                        fontStyle: 'normal'
                    }
                },
                label_ls: {
                    css: {
                        fontSize: '18px',
                        lineHeight: '20px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 600,
                        fontStyle: 'normal'
                    }
                },
                label_lb: {
                    css: {
                        fontSize: '18px',
                        lineHeight: '20px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 700,
                        fontStyle: 'normal'
                    }
                },
                label_mr: {
                    css: {
                        fontSize: '16px',
                        lineHeight: '18px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 400,
                        fontStyle: 'normal'
                    }
                },
                label_ms: {
                    css: {
                        fontSize: '16px',
                        lineHeight: '18px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 600,
                        fontStyle: 'normal'
                    }
                },
                label_mb: {
                    css: {
                        fontSize: '16px',
                        lineHeight: '18px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 700,
                        fontStyle: 'normal'
                    }
                },
                label_sr: {
                    css: {
                        fontSize: '14px',
                        lineHeight: '16px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 400,
                        fontStyle: 'normal'
                    }
                },
                label_ss: {
                    css: {
                        fontSize: '14px',
                        lineHeight: '16px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 600,
                        fontStyle: 'normal'
                    }
                },
                label_sb: {
                    css: {
                        fontSize: '14px',
                        lineHeight: '16px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 700,
                        fontStyle: 'normal'
                    }
                },
                label_xsr: {
                    css: {
                        fontSize: '12px',
                        lineHeight: '13px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 400,
                        fontStyle: 'normal'
                    }
                },
                label_xss: {
                    css: {
                        fontSize: '12px',
                        lineHeight: '13px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 600,
                        fontStyle: 'normal'
                    }
                },
                label_xsb: {
                    css: {
                        fontSize: '12px',
                        lineHeight: '13px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 700,
                        fontStyle: 'normal'
                    }
                },
                label_2xsr: {
                    css: {
                        fontSize: '10px',
                        lineHeight: '11px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 400,
                        fontStyle: 'normal'
                    }
                },
                label_2xss: {
                    css: {
                        fontSize: '10px',
                        lineHeight: '11px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 600,
                        fontStyle: 'normal'
                    }
                },
                label_2xsb: {
                    css: {
                        fontSize: '10px',
                        lineHeight: '11px',
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 700,
                        fontStyle: 'normal'
                    }
                }
            },
            borderRadius: {
                0: '0px',
                sm: '4px',
                md: '6px',
                lg: '8px',
                xl: '12px',
                '2xl': '16px',
                full: '360px'
            },

            screens: {
                xs: {max: '767px'}, //only for mob styles
                md: '768px', //min 768
                lg: '1188px' //min 1188
            }
        },
        boxShadow: {
            small: '0px 1px 1px 0px rgba(0, 0, 0, 0.02), 0px 2px 4px 0px rgba(0, 0, 0, 0.04)',
            medium: '0px 1px 4px 0px rgba(0, 0, 0, 0.04), 0px 4px 10px 0px rgba(0, 0, 0, 0.08)',
            large: '0px 2px 20px 0px rgba(0, 0, 0, 0.04), 0px 8px 32px 0px rgba(0, 0, 0, 0.08)',
            xlarge: '0px 8px 20px 0px rgba(0, 0, 0, 0.06), 0px 24px 60px 0px rgba(0, 0, 0, 0.12)',
            'odds-button': '0px 2px 0px 0px #B1ACBE',

            '5': '-10px 4px 7px -5px rgba(0, 0, 0, 0.09)', //shedow only on the left
            '6': '10px 0px 7px -5px rgba(0, 0, 0, 0.09)',
            '7': '10px 4px 10px 0px rgba(0, 0, 0, 0.1)'
        }
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
                    width: '1188px',
                    padding: '0 24px',
                    margin: 'auto'
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
