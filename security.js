document.addEventListener('DOMContentLoaded', function() {
    const hoverTabElements = document.querySelectorAll('[th-tab-onhover="click"]');
    let autoProgressInterval;
    const tabChangeInterval = 2000; // Interval in milliseconds

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
            resetAutoProgress(); // Reset the auto-progress when a tab is manually hovered
        });
    });

    function startAutoProgress() {
        // Clear any existing interval to avoid duplicates
        clearInterval(autoProgressInterval);
        autoProgressInterval = setInterval(switchToNextTab, tabChangeInterval);
    }

    function resetAutoProgress() {
        clearInterval(autoProgressInterval);
        startAutoProgress();
    }

    // Start the auto-progress initially
    startAutoProgress();

    // Reset and start the auto-progress timer when the mouse moves
    document.addEventListener('mousemove', function() {
        resetAutoProgress();
    });
});