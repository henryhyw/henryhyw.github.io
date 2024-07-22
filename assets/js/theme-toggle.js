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

    // Function to toggle map visibility based on the theme
    function toggleMapVisibility() {
        const lightMap = document.querySelector('.lightmap');
        const darkMap = document.querySelector('.darkmap');
        const isDarkMode = document.body.classList.contains('dark-mode');

        if (isDarkMode) {
            lightMap.style.display = 'none';
            darkMap.style.display = 'block';
        } else {
            lightMap.style.display = 'block';
            darkMap.style.display = 'none';
        }
    }

    // Function to apply the theme
    function applyTheme(theme) {
        document.body.classList.toggle('dark-mode', theme === 'dark');
        updateTypedElementsColor();
        toggleMapVisibility();
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