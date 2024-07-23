document.addEventListener('DOMContentLoaded', (event) => {
    const toggleThemeBtn = document.getElementById('toggle-theme');
    const toggleIcon = toggleThemeBtn.querySelector('i');

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
            console.log(error.message);
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
        // Select all elements to observe
        const allElements = document.querySelectorAll('*');
        // Loop through each element and add the 'toggling-theme' class
        allElements.forEach(element => {
            element.classList.add('toggling-theme');
        });

        function toggleColors() {
            const allElements = document.querySelectorAll('*');

            allElements.forEach(element => {
                const style = window.getComputedStyle(element);

                // Check and toggle text color
                if (style.color === 'rgb(0, 0, 0)') { // black color
                    element.style.color = 'white';
                } else if (style.color === 'rgb(255, 255, 255)') { // white color
                    element.style.color = 'black';
                }

                // Check and toggle background color
                if (style.backgroundColor === 'rgb(0, 0, 0)') { // black background
                    element.style.backgroundColor = 'white';
                } else if (style.backgroundColor === 'rgb(255, 255, 255)') { // white background
                    element.style.backgroundColor = 'black';
                }
            });
        }

        // Use setTimeout to ensure the transition has time to start
        setTimeout(() => {
            // Loop through each element again and remove the 'toggling-theme' class
            allElements.forEach(element => {
                element.classList.remove('toggling-theme');
            });
        }, 2000); // 2 seconds delay to match the transition duration

        // Call the function to toggle the colors
        toggleColors();

        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme); // Save the new theme in localStorage
    });
});