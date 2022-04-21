import { useContext, useEffect } from "react";
import Switch from "antd/lib/switch";
import { useThemeSwitcher } from "react-css-theme-switcher";
import ThemeContext from "./Themes/ThemeContext";

export default function ThemeSetter() {
	const { switcher, themes } = useThemeSwitcher();
	const { darkTheme, setDarkTheme } = useContext(ThemeContext);

	useEffect(() => {
		switcher({ theme: !darkTheme ? themes.light : themes.dark });
	}, [darkTheme]);

	const toggleDarkMode = () => {
		setDarkTheme(!darkTheme);
	};

	return <Switch checked={darkTheme} onChange={toggleDarkMode} />;
}
