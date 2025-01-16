import { useEffect } from 'react';
import { themeConfig } from './theme';

export function ThemeProvider({ children }) {
  
  const setFavicon = (faviconUrl) => {
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.href = faviconUrl;
    } else {
      const newFavicon = document.createElement('link');
      newFavicon.rel = 'icon';
      newFavicon.href = faviconUrl;
      document.head.appendChild(newFavicon);
    }
  };
  
  useEffect(() => {
    // Set CSS variables from config
    document.documentElement.style.setProperty('--theme-main-bg', themeConfig.colors.mainBg);
    document.documentElement.style.setProperty('--theme-main-bg-secundary', themeConfig.colors.mainBgSecundary);
   
    document.documentElement.style.setProperty('--theme-primary', themeConfig.colors.primary);
    document.documentElement.style.setProperty('--theme-secondary', themeConfig.colors.secondary);
    document.documentElement.style.setProperty('--theme-tertiary', themeConfig.colors.tertiary);


    document.documentElement.style.setProperty('--theme-error', themeConfig.colors.error);
    document.documentElement.style.setProperty('--theme-success', themeConfig.colors.success);
    document.documentElement.style.setProperty('--theme-focus', themeConfig.colors.focus);

    //setFavicon(themeConfig.favicon);

  }, []);

  return children;
}