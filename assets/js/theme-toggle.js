function initThemeToggle() {
    const toggleThemeBtn = document.getElementById('toggle-theme');
    if (!toggleThemeBtn || window.__themeToggleInitialized) {
        return;
    }
    window.__themeToggleInitialized = true;

    const toggleIcon = toggleThemeBtn.querySelector('i');
    const TRAFFIC_RESIZE_FLAG = '__trafficThemeResizeBound';
    const THEME_EVENT_NAME = 'theme-change';
    const THEME_TRANSITION_MS = 2000;
    const NAV_THEME_SELECTORS = [
        '.header-title a',
        '.header-subtitle',
        '.menu-content a',
        '.social-icons a',
        '.footer a',
        '.footer-description',
    ];
    let themeTransitionTimer = null;

    // Function to update the color of all elements with the class 'typed' based on the theme
    function updateTypedElementsColor() {
        const typedElements = document.querySelectorAll('.typed');
        const isDarkMode = document.body.classList.contains('dark-mode');
        const textColor = isDarkMode ? '#fafafa' : '#252525';

        typedElements.forEach(element => {
            element.style.color = textColor;
        });
    }

    // Header/footer colors should normally come from CSS. The home intro temporarily
    // writes inline colors for the fade-in animation; if those inline values remain,
    // later theme toggles cannot recolor the nav correctly. Preserve transparent while
    // the intro is still hiding the nav, but release concrete inline colors back to CSS.
    function releaseNavInlineColors() {
        NAV_THEME_SELECTORS.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                const inlineColor = (element.style.color || '').trim();
                if (inlineColor && inlineColor !== 'transparent') {
                    element.style.color = '';
                }
            });
        });
    }

    function adjustIframeHeight() {
        var iframe = document.getElementById('trafficReportFrame');
        if (!iframe) {
            return;
        }
        var aspectRatio = 1068 / 600;
        iframe.style.height = (iframe.clientWidth * aspectRatio) + 'px';
    }

    function bindTrafficResize() {
        if (window[TRAFFIC_RESIZE_FLAG]) {
            return;
        }
        window.addEventListener('resize', adjustIframeHeight);
        window[TRAFFIC_RESIZE_FLAG] = true;
    }

    function createTrafficLoader() {
        const loader = document.createElement('div');
        loader.className = 'traffic-loader';
        loader.innerHTML = `
            <span class="traffic-loader__spinner" aria-hidden="true"></span>
            <p>Loading traffic insights…</p>
        `;
        return loader;
    }

    // Function to load traffic reports dynamically
    function loadTrafficReports() {
        const trafficContainer = document.querySelector('.trafficReport');
        if (!trafficContainer) {
            return;
        }

        const isDarkMode = document.body.classList.contains('dark-mode');
        const iframeSrc = isDarkMode
            ? 'https://lookerstudio.google.com/embed/reporting/fa45582a-0947-4aa9-a259-df74aaaf38a1/page/EkW8D'
            : 'https://lookerstudio.google.com/embed/reporting/4a46ee2f-a660-48a5-8717-eea7cd8eaaa2/page/EkW8D';

        trafficContainer.innerHTML = '';
        trafficContainer.classList.add('traffic-report-wrapper');

        const loader = createTrafficLoader();
        trafficContainer.appendChild(loader);

        const iframe = document.createElement('iframe');
        iframe.id = 'trafficReportFrame'
        iframe.src = iframeSrc;
        iframe.style.width = '100%';
        iframe.style.border = '0';
        iframe.allowFullscreen = true;
        iframe.sandbox = 'allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox';

        iframe.addEventListener('load', () => {
            iframe.classList.add('traffic-report-frame-ready');
            loader.classList.add('traffic-loader--hidden');
            setTimeout(() => loader.remove(), 600);
            adjustIframeHeight();
        });

        trafficContainer.appendChild(iframe);
        adjustIframeHeight();
        bindTrafficResize();
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
        document.documentElement.classList.toggle('dark-mode', isDarkMode);
        document.body.classList.toggle('dark-mode', isDarkMode);
        releaseNavInlineColors();
        updateTypedElementsColor();
        updateThemeIcon(isDarkMode);
        loadTrafficReports();
        window.dispatchEvent(new CustomEvent(THEME_EVENT_NAME, { detail: { theme } }));
    }

    function beginThemeTransition() {
        document.documentElement.classList.add('theme-transitioning');
        document.body.classList.add('theme-transitioning');
        clearTimeout(themeTransitionTimer);
        themeTransitionTimer = setTimeout(() => {
            document.documentElement.classList.remove('theme-transitioning');
            document.body.classList.remove('theme-transitioning');
            themeTransitionTimer = null;
        }, THEME_TRANSITION_MS + 250);
    }

    // Determine the initial theme
    const savedTheme = localStorage.getItem('theme');
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (userPrefersDark ? 'dark' : 'light');

    // Apply the initial theme
    applyTheme(initialTheme);

    // Toggle theme on button click
    toggleThemeBtn.addEventListener('click', () => {
        beginThemeTransition();
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        try{
            const subtitleElement = document.getElementById('welcomeSubtitle');
            const textColor = currentTheme === 'light' ? '#fafafa' : '#252525'; // Change text color based on theme
            applyTheme(newTheme);
            if (subtitleElement) {
                subtitleElement.style.color = textColor;
            }
        } catch {}
        localStorage.setItem('theme', newTheme); // Save the new theme in localStorage
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle);
} else {
    initThemeToggle();
}