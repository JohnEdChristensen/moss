import { createContext, useContext, useState, ReactNode, CSSProperties } from 'react'

// Theme definitions
export const darkColors = {
  fg: "#D3C6AA",
  bg: "#2D353B",
  bgHover: "#343F44",
  bgSelected: "#D3C6AACC",
  fgSelected: "#baaf96",
  fgHover: "#eddfc0",
  neutral: "#859289",
  borderColor: "#D3C6AA",
  accent1: "#A7C080",
  accent2: "#DBBC7F",
  accent3: "#E69875",
}

export const lightColors = {
  fg: "#5C6A72",
  bg: "#FDF6E3",
  bgHover: "#F4F0D9",
  bgSelected: "#8DA101AA",
  fgHover: "#677780 ",
  fgSelected: "#525f66",
  neutral: "#939F91",
  borderColor: "#8DA101",
  accent1: "#8DA101",
  accent2: "#DFA000",
  accent3: "#F57D26",
}

export type Styles = Record<string, CSSProperties>

type Theme = {
  isDarkMode: boolean
  colors: typeof darkColors
  styleConstants: Record<string, string>
  styles: Styles
}

function getTheme(isDarkMode: boolean): Theme {
  const colors = isDarkMode ? darkColors : lightColors
  const borderWidth = "2px"

  const styleConstants = {
    borderWidth: borderWidth,
    border: `solid ${borderWidth} ${colors.borderColor}`
  }

  const styles: Styles = {
    flexCenter: {
      display: "flex",
      justifyItems: "center",
      alignItems: "center",
    },
    svgDefault: {
      stroke: colors.fg,
      fill: "none"
    }
  }

  return {
    isDarkMode,
    colors: {
      ...colors, bg: colors.bg.concat("77"),
      //fg: colors.fg.concat("00")
    },
    styleConstants,
    styles
  }
}

export function VSeperator() {
  const theme = useTheme()
  return <div style={{
    width: "100%",
    height: theme.styleConstants.borderWidth,
    backgroundColor: theme.colors.borderColor
  }} />
}
export function HSeperator() {
  const theme = useTheme()
  return <div style={{
    height: "100%",
    width: theme.styleConstants.borderWidth,
    backgroundColor: theme.colors.borderColor,
    display: "inline-block",
    boxSizing: "border-box"
  }} />
}

/// Context

const ThemeContext = createContext<{
  theme: Theme
  setTheme: (isDarkMode: boolean) => void
}>({
  theme: getTheme(false),
  setTheme: () => { }, // placeholder function
})

export function useThemeContext() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const useTheme = () => useThemeContext().theme

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const setTheme = (isDarkMode: boolean) => {
    setIsDarkMode(isDarkMode)
  }
  const theme = getTheme(isDarkMode)

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

