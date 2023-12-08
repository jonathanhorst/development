$(document).ready(function() {

    let mm = gsap.matchMedia();

    mm.add("(min-width: 480px)", () => {

        // Initialize ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        // Get the elements
        const $quoteBackground = $("[th-element='technology-quote-background']");
        const $quoteComponent = $("[th-element='technology-quote-component']");

        const rootStyles = getComputedStyle(document.documentElement);
        const paddingValue = rootStyles.getPropertyValue('--container-padding').trim();
        const borderRadiusValue = rootStyles.getPropertyValue('--border-radius-large').trim();

        // Create the animation
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: $quoteComponent,
                start: "bottom bottom",
            },
        });

        // Add the .to animation
        tl.to($quoteBackground, {
            top: paddingValue,
            left: paddingValue,
            bottom: paddingValue,
            right: paddingValue,
            borderRadius: borderRadiusValue,
            duration: 1,
            ease: "power2.out",
        });

    })
});