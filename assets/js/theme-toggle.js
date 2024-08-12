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

    // Function to load traffic reports dynamically
    function loadTrafficReports() {
        try {
            const trafficContainer = document.querySelector('.traffic');
            if (!trafficContainer) {
                throw new Error('Traffic container not found');
            }

            const isDarkMode = document.body.classList.contains('dark-mode');
            const iframeSrc = isDarkMode
                ? 'https://lookerstudio.google.com/embed/reporting/cb075bce-b506-41e8-a243-39502ee15d01/page/EkW8D'
                : 'https://lookerstudio.google.com/embed/reporting/4a46ee2f-a660-48a5-8717-eea7cd8eaaa2/page/EkW8D';

            // Clear existing traffic container content
            trafficContainer.innerHTML = '';

            // Create a new iframe element
            const iframe = document.createElement('iframe');
            iframe.src = iframeSrc;
            iframe.frameBorder = '0';
            iframe.style.width = '100%';
            iframe.style.height = 'calc(145vw)';
            iframe.style.border = '0';
            iframe.allowFullscreen = true;
            iframe.sandbox = 'allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox';

            // Append the iframe to the traffic container
            trafficContainer.appendChild(iframe);
        } catch (error) {
            console.error(error.message);
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
        loadTrafficReports();
    }

    // Determine the initial theme
    const savedTheme = localStorage.getItem('theme');
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (userPrefersDark ? 'dark' : 'light');

    // Apply the initial theme
    applyTheme(initialTheme);

    // Toggle theme on button click
    toggleThemeBtn.addEventListener('click', () => {
        document.body.style.transition = 'background-color 2s ease-in';
        document.querySelectorAll('header *').forEach(element => {
            element.style.transition = 'color 2s ease-in';
        });
        document.querySelectorAll('footer *').forEach(element => {
            element.style.transition = 'color 2s ease-in';
        });
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        try{
            const subtitleElement = document.getElementById('welcomeSubtitle');
            const textColor = currentTheme === 'light' ? '#fafafa' : '#252525'; // Change text color based on theme
            applyTheme(newTheme);
            subtitleElement.style.transition = 'color 2s ease-in';
            subtitleElement.style.color = textColor;
        } catch {}
        localStorage.setItem('theme', newTheme); // Save the new theme in localStorage
        // Use setTimeout to ensure the transition has time to start
        setTimeout(() => {
            document.body.style.transition = '';
            document.querySelectorAll('header *').forEach(element => {
                element.style.transition = 'color 0.5s';
            });
            document.querySelectorAll('footer *').forEach(element => {
                element.style.transition = 'color 0.5s';
            });
        }, 5000);
    });
});