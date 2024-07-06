import { appWindow } from "@tauri-apps/api/window"
import { HSeperator, Styles, useTheme, useThemeContext } from "./theme";
import { SvgIcon, svgGenerators } from "../svg/svg-editor.tsx";
import { ReactNode, useRef } from "react";
import { useHover } from "usehooks-ts";



export function TitleBar(props: { children: ReactNode }) {
  const styles: Styles = {
    container: {
      height: "30px",
      display: 'flex',
      justifyContent: 'space-between',
    },
  };
  return (
    <div data-tauri-drag-region style={styles.container}>
      <Menu>
        {props.children}
      </Menu>
      <WindowActionButtons />
    </div>
  )
}

export function Menu(props: { children: ReactNode }) {
  return <div style={{
    display: "flex",
    alignItems: "stretch",
  }}>
    {props.children}
  </div>
}

export function MenuItem(props: { children: ReactNode, onClick: () => void, selected?: boolean }) {
  const theme = useTheme()
  const ref = useRef(null)
  const isHover = useHover(ref)

  const bgColor = props.selected
    ? theme.colors.bgSelected
    : isHover
      ? theme.colors.bgHover
      : ""
  const fgColor = props.selected
    ? theme.colors.bg
    : theme.colors.fg
  return <>
    <div onClick={props.onClick} ref={ref} style={{
      display: "flex",
      alignItems: "end",
      cursor: "default",
      minWidth: "50px",
      paddingInline: "5px",
      paddingBottom: "2px",
      backgroundColor: bgColor,
      color: fgColor
    }}>
      {props.children}
    </div >
    <HSeperator />
  </>
}

function WindowActionButtons() {
  const { theme, setTheme } = useThemeContext()
  return <div style={{
    display: "flex",
  }}>
    <TitlebarButton
      action={() => setTheme(!theme.isDarkMode)}
      svg={svgGenerators.sun()}
      alt="toggle theme" />
    <Spacer size="16px" />
    <TitlebarButton
      action={() => appWindow.minimize()}
      svg={svgGenerators.minus()}
      alt="minimize" />
    <TitlebarButton
      action={() => appWindow.toggleMaximize()}
      svg={svgGenerators.box()}
      alt="maximize" />
    <TitlebarButton
      action={() => appWindow.close()}
      svg={svgGenerators.cross()}
      alt="close" />
  </div>
}

type TitleBarProps = {
  action: (() => Promise<void>) | (() => void),
  alt: string,
  icon?: string,
  svg?: ReactNode
}
function Spacer(props: { size: string; }) {
  return <div style={{ width: props.size }}
  />
}
function TitlebarButton(props: TitleBarProps) {
  const { action, alt, icon, svg } = props

  const hoverRef = useRef(null)
  const isHover = useHover(hoverRef)
  const theme = useTheme()

  return <div
    ref={hoverRef}
    style={{
      width: "32px",
      display: "flex",
      justifyContent: "center",
      alignContent: "center",
      backgroundColor: isHover ? theme.colors.bgHover : ""
    }}
    onClick={action}
  >
    {icon ? <img src={icon} alt={alt} /> : <SvgIcon path={svg} />}
  </div>
}
