export function DarkModeScript() {
  const codeToRunOnClient = `
(function() {
  try {
    // Check localStorage first
    const storedTheme = localStorage.getItem('theme');
    
    // Check for a theme already set on the HTML element (if script runs multiple times)
    const docTheme = document.documentElement.classList.contains('dark') ? 'dark' : 
                     document.documentElement.classList.contains('light') ? 'light' : null;
    
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = prefersDark ? 'dark' : 'light';
    
    // Determine which theme to use (priority: localStorage > existing theme > system)
    let theme = storedTheme || docTheme || systemTheme;
    
    // Apply the theme class to the html element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }

    // Save a system-setting reference
    const isSystemDark = prefersDark ? 'true' : 'false';
    document.documentElement.setAttribute('data-prefers-dark', isSystemDark);
    
    // Listen for system changes
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    colorSchemeQuery.addEventListener('change', (e) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-prefers-dark', e.matches ? 'true' : 'false');
      
      // Only change theme if we're using system preference (no localStorage value)
      if (!localStorage.getItem('theme')) {
        if (newSystemTheme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        }
      }
    });

  } catch (e) {
    console.error('Failed to set theme:', e);
  }
})();
`;

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: codeToRunOnClient,
      }}
    />
  );
} 