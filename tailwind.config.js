module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: "#13B5E9",
        },
        secondary: {
          main: "#1631BF",
          dark: "#122aa5",
        },
        dark: "#333",
        screen: "#F2F2F2",
        gray1: "#333333",
        gray2: "#4F4F4F",
        gray3: "#828282",
        gray4: "#BDBDBD",
        gray5: "#E0E0E0",
        gray6: "#F2F2F2",
        primaryBlue: "#000733",
        neptuneBlue: "#002B72",
        lightGreen: "#0DE516",
        mainOrange: "#FD9000",
      },
      fontFamily: "Inter",
      fontSize: {
        "6xl.1": ["4rem"],
        "7xl.1": ["4.6875rem"],
        subBase: ".9rem",
      },
      width: {
        30: "7.5rem",
        37.5: "9.375rem",
        50: "12.5rem",
        67.5: "16.875rem",
        65: "16.25rem",
        85: "21.25rem",
      },
      minWidth: {
        12: "3rem",
        24: "6rem",
        50: "12.5rem",
      },
      maxWidth: {
        50: "12.5rem",
        12: "3rem",
      },
      height: {
        45: "11.25rem",
        67.5: "16.875rem",
        27.5: "6.875rem",
      },
      padding: {
        7.5: "1.875rem",
        15: "3.75rem",
        17.5: "4.375rem",
        65: "16.25rem",
      },
      margin: {
        7.5: "1.875rem",
        7.5: "1.875rem",
        15: "3.75rem",
        section: "3.5rem",
        sectionMobile: "1.5rem",
      },
      screens: {
        xs: "320px",
        ms: { max: "481px" },
        small: { max: "767px" },
        tablet: { min: "768px", max: "1024px" },
        mbTab: { max: "1024px" }, // Mobile and Tablets
        desktopAndTablet: { min: "768px" },
        desktop: { min: "1025px" },
        bigScreen: { min: "1900px" },
      },
      boxShadow: {
        bottom: "0px 4px 8px rgba(0, 0, 0, 0.15)",
        "2xl": "0px 4px 6px rgba(0, 0, 0, 0.2)",
        full: "0 0 0 1px #1631BF",
        table: "0 0 0 .5px #828282",
      },
    },
  },
  plugins: [],
};
