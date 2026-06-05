
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-dim":"#080A0A","on-tertiary-fixed":"#022c22","tertiary":"#10B981",
        "on-surface-variant":"#c6c6cd","on-error-container":"#ffdad6",
        "surface-container-highest":"#1d1f1d","outline":"#7a807a","background":"#080A0A",
        "surface-container":"#111311","inverse-primary":"#565e74","primary-fixed-dim":"#bec6e0",
        "surface-container-high":"#161816","inverse-on-surface":"#2d3133",
        "on-primary-container":"#798098","secondary-fixed-dim":"#f9bd22",
        "primary-container":"#0f172a","tertiary-container":"#064e3b","surface-tint":"#bec6e0",
        "on-tertiary":"#ffffff","on-tertiary-container":"#a7f3d0","on-primary-fixed":"#131b2e",
        "on-tertiary-fixed-variant":"#047857","on-surface":"#e0e3e5",
        "surface-container-low":"#0d0f0d","surface-container-lowest":"#050605",
        "primary":"#bec6e0","tertiary-fixed-dim":"#10B981","outline-variant":"#272927",
        "surface":"#080A0A","inverse-surface":"#e0e3e5","surface-variant":"#323537",
        "on-secondary-fixed-variant":"#5c4300","error":"#ffb4ab","tertiary-fixed":"#a7f3d0",
        "primary-fixed":"#dae2fd","surface-bright":"#222422","on-secondary-container":"#5a4100",
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
