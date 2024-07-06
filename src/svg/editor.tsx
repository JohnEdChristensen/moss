import CodeMirror from '@uiw/react-codemirror';
import { xml } from '@codemirror/lang-xml';
import { Vim, vim } from '@replit/codemirror-vim';
import { oneDarkTheme, defaultLightThemeOption } from '@uiw/react-codemirror';
import { useTheme } from '../system/theme';

Vim.map("jk", "<Esc>", "insert")
export function Editor({ code, onChange }: { code: string, onChange: (value: string) => void }) {
  const theme = useTheme()
  const editorTheme = theme.isDarkMode ? oneDarkTheme : defaultLightThemeOption
  return (
    <CodeMirror
      value={code}
      height="200px"
      theme={editorTheme}
      extensions={[xml(), vim()]}
      onChange={onChange}
    />
  );
}
