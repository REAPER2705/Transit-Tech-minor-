export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: "#004ac6",
        "on-primary": "#ffffff",
        "primary-container": "#2563eb",
        "on-primary-container": "#eeefff",
        "primary-fixed": "#dbe1ff",
        "on-primary-fixed": "#00174b",
        "primary-fixed-dim": "#b4c5ff",
        "on-primary-fixed-variant": "#003ea8",

        // Secondary Colors
        secondary: "#4b41e1",
        "on-secondary": "#ffffff",
        "secondary-container": "#645efb",
        "on-secondary-container": "#fffbff",
        "secondary-fixed": "#e2dfff",
        "on-secondary-fixed": "#0f0069",
        "secondary-fixed-dim": "#c3c0ff",
        "on-secondary-fixed-variant": "#3323cc",

        // Tertiary Colors
        tertiary: "#006242",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#007d55",
        "on-tertiary-container": "#bdffdb",
        "tertiary-fixed": "#6ffbbe",
        "on-tertiary-fixed": "#002113",
        "tertiary-fixed-dim": "#4edea3",
        "on-tertiary-fixed-variant": "#005236",

        // Surface Colors
        surface: "#faf8ff",
        "on-surface": "#131b2e",
        "surface-dim": "#d2d9f4",
        "surface-bright": "#faf8ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f3ff",
        "surface-container": "#eaedff",
        "surface-container-high": "#e2e7ff",
        "surface-container-highest": "#dae2fd",
        "surface-variant": "#dae2fd",
        "on-surface-variant": "#434655",
        "surface-tint": "#0053db",

        // Error Colors
        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",

        // Outline Colors
        outline: "#737686",
        "outline-variant": "#c3c6d7",

        // Inverse Colors
        "inverse-surface": "#283044",
        "inverse-on-surface": "#eef0ff",
        "inverse-primary": "#b4c5ff",

        // Background (same as surface)
        background: "#faf8ff",
        "on-background": "#131b2e",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        "margin-tablet": "1.5rem",
        "space-xs": "0.25rem",
        margin: "1rem",
        "space-xl": "2.5rem",
        "space-sm": "0.5rem",
        "gutter-desktop": "1.5rem",
        "space-lg": "1.5rem",
        "space-md": "1rem",
        "margin-desktop": "2.5rem",
        gutter: "1.25rem",
      },
      fontFamily: {
        "headline-md": ["Plus Jakarta Sans"],
        "label-sm": ["Plus Jakarta Sans"],
        "display-lg-mobile": ["Plus Jakarta Sans"],
        "label-md": ["Plus Jakarta Sans"],
        "headline-lg": ["Plus Jakarta Sans"],
        "headline-xl": ["Plus Jakarta Sans"],
        "telemetry-metric": ["Plus Jakarta Sans"],
        "headline-xl-mobile": ["Plus Jakarta Sans"],
        "body-md": ["Plus Jakarta Sans"],
        "body-sm": ["Plus Jakarta Sans"],
        "body-lg": ["Plus Jakarta Sans"],
        "display-lg": ["Plus Jakarta Sans"],
        "label-lg": ["Plus Jakarta Sans"],
      },
      fontSize: {
        "headline-md": [
          "1.25rem",
          {
            lineHeight: "1.75rem",
            letterSpacing: "-0.01em",
            fontWeight: "600",
          },
        ],
        "label-sm": [
          "0.6875rem",
          {
            lineHeight: "0.875rem",
            letterSpacing: "0.06em",
            fontWeight: "700",
          },
        ],
        "display-lg-mobile": [
          "2.25rem",
          {
            lineHeight: "2.75rem",
            letterSpacing: "-0.02em",
            fontWeight: "800",
          },
        ],
        "label-md": [
          "0.75rem",
          {
            lineHeight: "1rem",
            letterSpacing: "0.04em",
            fontWeight: "600",
          },
        ],
        "headline-lg": [
          "1.75rem",
          {
            lineHeight: "2.25rem",
            letterSpacing: "-0.015em",
            fontWeight: "600",
          },
        ],
        "headline-xl": [
          "2.25rem",
          {
            lineHeight: "2.75rem",
            letterSpacing: "-0.02em",
            fontWeight: "700",
          },
        ],
        "telemetry-metric": [
          "1.5rem",
          {
            lineHeight: "1.75rem",
            letterSpacing: "-0.02em",
            fontWeight: "700",
          },
        ],
        "headline-xl-mobile": [
          "1.75rem",
          {
            lineHeight: "2.25rem",
            letterSpacing: "-0.015em",
            fontWeight: "700",
          },
        ],
        "body-md": [
          "0.9375rem",
          {
            lineHeight: "1.5rem",
            fontWeight: "400",
          },
        ],
        "body-sm": [
          "0.8125rem",
          {
            lineHeight: "1.25rem",
            fontWeight: "400",
          },
        ],
        "body-lg": [
          "1.125rem",
          {
            lineHeight: "1.75rem",
            fontWeight: "400",
          },
        ],
        "display-lg": [
          "3.5rem",
          {
            lineHeight: "4rem",
            letterSpacing: "-0.025em",
            fontWeight: "800",
          },
        ],
        "label-lg": [
          "0.875rem",
          {
            lineHeight: "1.25rem",
            letterSpacing: "0.01em",
            fontWeight: "600",
          },
        ],
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
