/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#127661',
          50: '#E6F4F1',
          100: '#CCE9E3',
          200: '#99D3C7',
          300: '#66BDAB',
          400: '#33A78F',
          500: '#055E4C',
          600: '#044E3F',
          700: '#033D31',
          800: '#022B23',
          900: '#011A15'
        },
        secondary: {
          DEFAULT: '#404041',
          50: '#F5F5F5',
          100: '#EBEBEB',
          200: '#D6D6D7',
          300: '#C2C2C3',
          400: '#ADADAE',
          500: '#404041',
          600: '#333334',
          700: '#262627',
          800: '#1A1A1A',
          900: '#0D0D0D'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'Inter', 'system-ui', 'sans-serif']
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.900'),
            maxWidth: 'none',
            'h1, h2, h3, h4, h5, h6': {
              color: theme('colors.gray.900'),
              fontWeight: theme('fontWeight.bold'),
              marginTop: '1.5em',
              marginBottom: '0.5em'
            },
            a: {
              color: theme('colors.primary.600'),
              textDecoration: 'underline',
              '&:hover': {
                color: theme('colors.primary.500')
              }
            },
            strong: {
              color: theme('colors.gray.900'),
              fontWeight: theme('fontWeight.bold')
            },
            ol: {
              counterReset: 'list-counter',
              marginTop: '1.25em',
              marginBottom: '1.25em'
            },
            ul: {
              marginTop: '1.25em',
              marginBottom: '1.25em'
            },
            li: {
              marginTop: '0.5em',
              marginBottom: '0.5em'
            },
            img: {
              borderRadius: theme('borderRadius.lg'),
              marginTop: '2em',
              marginBottom: '2em'
            },
            figure: {
              marginTop: '2em',
              marginBottom: '2em'
            },
            figcaption: {
              color: theme('colors.gray.600'),
              fontSize: '0.875em',
              marginTop: '0.5em',
              textAlign: 'center'
            },
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            },
            code: {
              color: theme('colors.gray.900'),
              backgroundColor: theme('colors.gray.100'),
              paddingLeft: '0.25em',
              paddingRight: '0.25em',
              paddingTop: '0.125em',
              paddingBottom: '0.125em',
              borderRadius: '0.25em',
              fontWeight: '400'
            },
            pre: {
              backgroundColor: theme('colors.gray.800'),
              color: theme('colors.gray.100'),
              fontSize: '0.875em',
              lineHeight: '1.7142857',
              marginTop: '1.7142857em',
              marginBottom: '1.7142857em',
              borderRadius: '0.375em',
              paddingTop: '0.8571429em',
              paddingRight: '1.1428571em',
              paddingBottom: '0.8571429em',
              paddingLeft: '1.1428571em'
            },
            'pre code': {
              backgroundColor: 'transparent',
              borderWidth: '0',
              borderRadius: '0',
              padding: '0',
              color: 'inherit',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              lineHeight: 'inherit'
            },
            blockquote: {
              fontWeight: '500',
              fontStyle: 'italic',
              color: theme('colors.gray.900'),
              borderLeftWidth: '0.25rem',
              borderLeftColor: theme('colors.gray.200'),
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
              marginTop: '1.6em',
              marginBottom: '1.6em',
              paddingLeft: '1em'
            },
            table: {
              width: '100%',
              marginTop: '2em',
              marginBottom: '2em',
              fontSize: '0.875em',
              lineHeight: '1.7142857'
            },
            thead: {
              color: theme('colors.gray.900'),
              fontWeight: '600',
              borderBottomWidth: '2px',
              borderBottomColor: theme('colors.gray.200')
            },
            'thead th': {
              verticalAlign: 'bottom',
              paddingRight: '0.5714286em',
              paddingBottom: '0.5714286em',
              paddingLeft: '0.5714286em'
            },
            'tbody tr': {
              borderBottomWidth: '1px',
              borderBottomColor: theme('colors.gray.200')
            },
            'tbody td': {
              verticalAlign: 'top',
              paddingTop: '0.5714286em',
              paddingRight: '0.5714286em',
              paddingBottom: '0.5714286em',
              paddingLeft: '0.5714286em'
            }
          }
        }
      })
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};