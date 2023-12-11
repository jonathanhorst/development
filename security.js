document.addEventListener('DOMContentLoaded', function() {
    const hoverTabElements = document.querySelectorAll('[th-tab-onhover="click"]');
    let autoProgressInterval;
    const tabChangeInterval = 2500; // Interval in milliseconds for automatic tab change
    const postClickInterval = 6000; // Interval in milliseconds after a tab is clicked

    // Safari Scroll Fix
    if (navigator.userAgent.includes("Safari")) {
        hoverTabElements.forEach(tabLink => {
            tabLink.focus = function() {
                const x = window.scrollX, y = window.scrollY;
                const f = () => {
                    setTimeout(() => window.scrollTo(x, y), 1);
                    tabLink.removeEventListener("focus", f);
                };
                tabLink.addEventListener("focus", f);
                HTMLElement.prototype.focus.apply(this, arguments);
            };
        });
    }

    function switchToNextTab() {
        // Find the currently active tab
        const currentActive = document.querySelector('.w--current');
        let nextTab = currentActive.nextElementSibling;

        // If there's no next element, go back to the first one
        if (!nextTab) {
            nextTab = hoverTabElements[0];
        }

        nextTab.click();
    }

    hoverTabElements.forEach(hoverTabElement => {
        hoverTabElement.addEventListener('mouseenter', function() {
            hoverTabElement.click(); // Click on the element when hovering
            resetAutoProgress(postClickInterval); // Reset the auto-progress with a longer delay after a click
        });
    });

    function startAutoProgress(delay = tabChangeInterval) {
        // Clear any existing interval to avoid duplicates
        clearInterval(autoProgressInterval);
        autoProgressInterval = setInterval(switchToNextTab, delay);
    }

    function resetAutoProgress(delay = tabChangeInterval) {
        clearInterval(autoProgressInterval);
        startAutoProgress(delay);
    }

    // Start the auto-progress initially
    startAutoProgress();

    // Reset and start the auto-progress timer when the mouse moves
    document.addEventListener('mousemove', function() {
        resetAutoProgress();
    });
});