(function() {
  const ORIGINAL_PLACEHOLDER = "Ask anything about Henry, then press Enter.";

  function fixAskPlaceholder() {
    document.querySelectorAll(".sp-input").forEach(input => {
      if (input.getAttribute("placeholder") !== ORIGINAL_PLACEHOLDER) {
        input.setAttribute("placeholder", ORIGINAL_PLACEHOLDER);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function() {
    fixAskPlaceholder();

    const observer = new MutationObserver(fixAskPlaceholder);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["placeholder"]
    });

    document.addEventListener("input", fixAskPlaceholder, true);
    document.addEventListener("click", function() {
      window.setTimeout(fixAskPlaceholder, 0);
    }, true);

    window.setInterval(fixAskPlaceholder, 500);
  });
})();
