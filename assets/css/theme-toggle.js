document.addEventListener('DOMContentLoaded', (event) => {
    const toggleThemeBtn = document.getElementById('toggle-theme');

    // Function to apply the theme
    function applyTheme(theme) {
        document.body.classList.toggle('dark-mode', theme === 'dark');
        updateSubtitleColor();
    }

    // Load the theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    // Function to update the color of the subtitle based on the theme
    function updateSubtitleColor() {
        const subtitleElement = document.getElementById('welcomeSubtitle');
        const isDarkMode = document.body.classList.contains('dark-mode');
        const textColor = isDarkMode ? '#fafafa' : '#252525';
        subtitleElement.style.color = textColor;
    }

    // Toggle theme on button click
    toggleThemeBtn.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme); // Save the new theme in localStorage
    });
});