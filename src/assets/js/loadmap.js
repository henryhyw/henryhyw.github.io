export function initScript() {
    function onDOMContentLoaded() {
        console.log('DOM fully loaded and parsed');
        // Your script logic here
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
          console.error('An error occurred:', error);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
    } else {
        // The DOMContentLoaded event has already fired
        onDOMContentLoaded();
    }
}