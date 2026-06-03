
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-dim":"#101415","on-tertiary-fixed":"#001f25","tertiary":"#2fd9f4",
        "on-surface-variant":"#c6c6cd","on-error-container":"#ffdad6",
        "surface-container-highest":"#323537","outline":"#909097","background":"#101415",
        "surface-container":"#1d2022","inverse-primary":"#565e74","primary-fixed-dim":"#bec6e0",
        "surface-container-high":"#272a2c","inverse-on-surface":"#2d3133",
        "on-primary-container":"#798098","secondary-fixed-dim":"#f9bd22",
        "primary-container":"#0f172a","tertiary-container":"#001b20","surface-tint":"#bec6e0",
        "on-tertiary":"#00363e","on-tertiary-container":"#008ea1","on-primary-fixed":"#131b2e",
        "on-tertiary-fixed-variant":"#004e5a","on-surface":"#e0e3e5",
        "surface-container-low":"#191c1e","surface-container-lowest":"#0b0f10",
        "primary":"#bec6e0","tertiary-fixed-dim":"#2fd9f4","outline-variant":"#45464d",
        "surface":"#101415","inverse-surface":"#e0e3e5","surface-variant":"#323537",
        "on-secondary-fixed-variant":"#5c4300","error":"#ffb4ab","tertiary-fixed":"#a2eeff",
        "primary-fixed":"#dae2fd","surface-bright":"#363a3b","on-secondary-container":"#5a4100",
        "on-primary-fixed-variant":"#3f465c","on-primary":"#283044","on-background":"#e0e3e5",
        "secondary-container":"#e3aa00","on-error":"#690005","on-secondary-fixed":"#261a00",
        "secondary-fixed":"#ffdf9f","secondary":"#ffc640","error-container":"#93000a",
        "on-secondary":"#402d00"
      },
      borderRadius:{DEFAULT:"0.125rem",lg:"0.25rem",xl:"0.5rem",full:"0.75rem"},
      spacing:{unit:"8px","container-max":"1280px","margin-mobile":"16px","margin-desktop":"64px",gutter:"24px"},
      fontFamily:{
        "body-lg":["Inter"],"headline-xl":["Montserrat"],"headline-lg-mobile":["Montserrat"],
        "code-sm":["JetBrains Mono"],"headline-md":["Montserrat"],"headline-lg":["Montserrat"],
        "label-caps":["JetBrains Mono"],"body-md":["Inter"]
      },
      fontSize:{
        "body-lg":["18px",{lineHeight:"1.6",fontWeight:"400"}],
        "headline-xl":["48px",{lineHeight:"1.1",letterSpacing:"-0.02em",fontWeight:"800"}],
        "headline-lg-mobile":["28px",{lineHeight:"1.2",fontWeight:"700"}],
        "code-sm":["14px",{lineHeight:"1.4",fontWeight:"400"}],
        "headline-md":["24px",{lineHeight:"1.3",fontWeight:"600"}],
        "headline-lg":["32px",{lineHeight:"1.2",letterSpacing:"-0.01em",fontWeight:"700"}],
        "label-caps":["12px",{lineHeight:"1.0",letterSpacing:"0.1em",fontWeight:"700"}],
        "body-md":["16px",{lineHeight:"1.5",fontWeight:"400"}]
      }
    }
  }
}
