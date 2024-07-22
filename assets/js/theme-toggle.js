document.addEventListener('DOMContentLoaded', (event) => {
    const toggleThemeBtn = document.getElementById('toggle-theme');

    // Function to update the color of all elements with the class 'typed' based on the theme
    function updateTypedElementsColor() {
        const typedElements = document.querySelectorAll('.typed');
        const isDarkMode = document.body.classList.contains('dark-mode');
        const textColor = isDarkMode ? '#fafafa' : '#252525';

        typedElements.forEach(element => {
            element.style.color = textColor;
        });

        console.log(`Updated color of ${typedElements.length} elements to ${textColor}`);
    }

    // Function to update the script src based on the theme
    function updateScriptSrc() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const lightSrc = 'https://mapmyvisitors.com/map.js?cl=606060&w=a&t=n&d=NuzI5fMF9fqCHtkxcTx3LZO5mvAbEZrLLxG3ZW1E-KY&co=ffffff&ct=606060';
        const darkSrc = 'https://mapmyvisitors.com/map.js?cl=606060&w=a&t=n&d=NuzI5fMF9fqCHtkxcTx3LZO5mvAbEZrLLxG3ZW1E-KY&co=ffffff&ct=606060';
        mapScript.src = isDarkMode ? darkSrc : lightSrc;
        console.log(`Updated script src to ${mapScript.src}`);
    }

    // Function to apply the theme
    function applyTheme(theme) {
        document.body.classList.toggle('dark-mode', theme === 'dark');
        updateTypedElementsColor();
        updateScriptSrc();
    }

    // Load the theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    // Toggle theme on button click
    toggleThemeBtn.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme); // Save the new theme in localStorage
    });
});