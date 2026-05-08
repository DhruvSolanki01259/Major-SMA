import { create } from"zustand";

export const useThemeStore = create((set) => ({
 isDarkMode: localStorage.getItem("theme") ==="dark",
 toggleTheme: () => set((state) => {
 const newTheme = !state.isDarkMode;
 if (newTheme) {
 document.documentElement.classList.add("dark");
 localStorage.setItem("theme","dark");
 } else {
 document.documentElement.classList.remove("dark");
 localStorage.setItem("theme","light");
 }
 return { isDarkMode: newTheme };
 }),
 initTheme: () => set((state) => {
 const isDark = localStorage.getItem("theme") ==="dark" || (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
 if (isDark) {
 document.documentElement.classList.add("dark");
 } else {
 document.documentElement.classList.remove("dark");
 }
 return { isDarkMode: isDark };
 })
}));
