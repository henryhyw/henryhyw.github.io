document.addEventListener('DOMContentLoaded', (event) => {
    const toggleThemeBtn = document.getElementById('toggle-theme');
    const toggleIcon = toggleThemeBtn.querySelector('i');

    // Function to update the color of all elements with the class 'typed' based on the theme
    function updateTypedElementsColor() {
        const typedElements = document.querySelectorAll('.typed');
        const isDarkMode = document.body.classList.contains('dark-mode');
        const textColor = isDarkMode ? '#fafafa' : '#252525';

        typedElements.forEach(element => {
            element.style.color = textColor;
        });
    }

    // Function to load visitor map script dynamically
    function loadVisitorMap() {
        try {
            const visitorMapContainer = document.querySelector('.visitormap');
            if (!visitorMapContainer) {
                throw new Error('Visitor map container not found');
            }

            const isDarkMode = document.body.classList.contains('dark-mode');
            const mapScriptUrl = isDarkMode 
                ? 'https://mapmyvisitors.com/map.js?cl=fafafa&w=a&t=n&d=NuzI5fMF9fqCHtkxcTx3LZO5mvAbEZrLLxG3ZW1E-KY&co=000000&cmo=3acc3a&cmn=ff5353&ct=808080'
                : 'https://mapmyvisitors.com/map.js?cl=606060&w=a&t=n&d=NuzI5fMF9fqCHtkxcTx3LZO5mvAbEZrLLxG3ZW1E-KY&co=ffffff&ct=606060';

            // Clear existing map container content
            visitorMapContainer.innerHTML = '';

            // Create a new script element
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.id = 'mapmyvisitors';
            script.src = mapScriptUrl;

            // Append the script to the visitor map container
            visitorMapContainer.appendChild(script);
        } catch (error) {
        }
    }

    // Function to update the theme icon
    function updateThemeIcon(isDarkMode) {
        if (isDarkMode) {
            toggleIcon.classList.remove('fa-sun');
            toggleIcon.classList.add('fa-moon');
        } else {
            toggleIcon.classList.remove('fa-moon');
            toggleIcon.classList.add('fa-sun');
        }
    }

    // Function to apply the theme
    function applyTheme(theme) {
        const isDarkMode = theme === 'dark';
        document.body.classList.toggle('dark-mode', isDarkMode);
        updateTypedElementsColor();
        updateThemeIcon(isDarkMode);
        loadVisitorMap();
    }

    // Determine the initial theme
    const savedTheme = localStorage.getItem('theme');
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (userPrefersDark ? 'dark' : 'light');

    // Apply the initial theme
    applyTheme(initialTheme);

    // Toggle theme on button click
    toggleThemeBtn.addEventListener('click', () => {
        document.body.style.transition = 'background-color 2s';
        document.querySelectorAll('header *').forEach(element => {
            element.style.transition = 'color 2s';
        });
        document.querySelectorAll('footer *').forEach(element => {
            element.style.transition = 'color 2s';
        });
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        const subtitleElement = document.getElementById('welcomeSubtitle');
        subtitleElement.style.transition = 'color 0s';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme); // Save the new theme in localStorage
        // Use setTimeout to ensure the transition has time to start
        setTimeout(() => {
            document.body.style.transition = '';
            const textColor = currentTheme === 'light' ? '#fafafa' : '#252525'; // Change text color based on theme
            console.log(newTheme);
            console.log(textColor);
            subtitleElement.style.transition = 'color 2s';
            subtitleElement.style.color = textColor;
            document.querySelectorAll('header *').forEach(element => {
                element.style.transition = 'color 0.5s';
            });
            document.querySelectorAll('footer *').forEach(element => {
                element.style.transition = 'color 0.5s';
            });
        }, 5000);
    });
});