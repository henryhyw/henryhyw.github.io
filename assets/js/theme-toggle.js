document.addEventListener('DOMContentLoaded', (event) => {
    const toggleThemeBtn = document.getElementById('toggle-theme');

    // Function to apply the theme
    function applyTheme(theme) {
        document.body.classList.toggle('dark-mode', theme === 'dark');
        const subtitleText = document.getElementById('welcomeSubtitle').textContent;
        const subtitleElement = document.getElementById('welcomeSubtitle');
        subtitleElement.style.textAlign = 'left'; // Initially set to left align
        subtitleElement.style.textAlignLast = 'left'; // Initially set to left align
        subtitleElement.style.MozTextAlignLast = 'left'; // Initially set to left align
        typeWriterEffect(subtitleText, subtitleElement, 15, () => {
            subtitleElement.style.textAlign = 'justify'; // Change to justify after typing is complete
            subtitleElement.style.textAlignLast = 'justify'; // Change to justify after typing is complete
            subtitleElement.style.MozTextAlignLast = 'justify'; // Change to justify after typing is complete
        });
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