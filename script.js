// PAGE COLOR POWER-UP
window.addEventListener("DOMContentLoaded", (event) => {
  // attribute value checker
  function attr(defaultVal, attrVal) {
    const defaultValType = typeof defaultVal;
    if (typeof attrVal !== "string" || attrVal.trim() === "") return defaultVal;
    if (attrVal === "true" && defaultValType === "boolean") return true;
    if (attrVal === "false" && defaultValType === "boolean") return false;
    if (isNaN(attrVal) && defaultValType === "string") return attrVal;
    if (!isNaN(attrVal) && defaultValType === "number") return +attrVal;
    return defaultVal;
  }
  // pagecolor trigger
  $("[th-pagecolor-element='trigger']").each(function(index) {
    // elements
    let triggerEl = $(this),
      targetEl = $("body");
    // settings
    let classSetting = attr("mode-2", triggerEl.attr("th-pagecolor-class"));
    let startSetting = attr("top center", triggerEl.attr("th-pagecolor-start"));

    // check if th-pagecolor-start is set to 'bottom', and update startSetting accordingly
    if (triggerEl.attr("th-pagecolor-start") === "bottom") {
      startSetting = "top bottom";
    }

    // result
    ScrollTrigger.create({
      trigger: triggerEl,
      start: startSetting,
      end: "bottom center",
      onToggle: ({ self, isActive }) => {
        if (isActive) {
          targetEl.addClass(classSetting);
        } else {
          targetEl.removeClass(classSetting);
        }
      }
    });
  });
});



// MARQUEE POWER-UP
window.addEventListener("DOMContentLoaded", (event) => {
  // attribute value checker
  function attr(defaultVal, attrVal) {
    const defaultValType = typeof defaultVal;
    if (typeof attrVal !== "string" || attrVal.trim() === "") return defaultVal;
    if (attrVal === "true" && defaultValType === "boolean") return true;
    if (attrVal === "false" && defaultValType === "boolean") return false;
    if (isNaN(attrVal) && defaultValType === "string") return attrVal;
    if (!isNaN(attrVal) && defaultValType === "number") return +attrVal;
    return defaultVal;
  }
  // marquee component
  $("[th-marquee-element='component']").each(function(index) {
    let componentEl = $(this),
      panelEl = componentEl.find("[th-marquee-element='panel']"),
      triggerHoverEl = componentEl.find("[th-marquee-element='triggerhover']"),
      triggerClickEl = componentEl.find("[th-marquee-element='triggerclick']");
    let speedSetting = attr(100, componentEl.attr("th-marquee-speed")),
      verticalSetting = attr(false, componentEl.attr("th-marquee-vertical")),
      reverseSetting = attr(false, componentEl.attr("th-marquee-reverse")),
      scrollDirectionSetting = attr(false, componentEl.attr("th-marquee-scrolldirection")),
      scrollScrubSetting = attr(false, componentEl.attr("th-marquee-scrollscrub")),
      moveDistanceSetting = -100,
      timeScaleSetting = 1,
      pausedStateSetting = false;
    if (reverseSetting) moveDistanceSetting = 100;
    let marqueeTimeline = gsap.timeline({ repeat: -1, onReverseComplete: () => marqueeTimeline.progress(1) });
    if (verticalSetting) {
      speedSetting = panelEl.first().height() / speedSetting;
      marqueeTimeline.fromTo(panelEl, { yPercent: 0 }, { yPercent: moveDistanceSetting, ease: "none", duration: speedSetting });
    } else {
      speedSetting = panelEl.first().width() / speedSetting;
      marqueeTimeline.fromTo(panelEl, { xPercent: 0 }, { xPercent: moveDistanceSetting, ease: "none", duration: speedSetting });
    }
    let scrubObject = { value: 1 };
    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (!pausedStateSetting) {
          if (scrollDirectionSetting && timeScaleSetting !== self.direction) {
            timeScaleSetting = self.direction;
            marqueeTimeline.timeScale(self.direction);
          }
          if (scrollScrubSetting) {
            let v = self.getVelocity() * 0.006;
            v = gsap.utils.clamp(-60, 60, v);
            let scrubTimeline = gsap.timeline({ onUpdate: () => marqueeTimeline.timeScale(scrubObject.value) });
            scrubTimeline.fromTo(scrubObject, { value: v }, { value: timeScaleSetting, duration: 0.5 });
          }
        }
      }
    });

    function pauseMarquee(isPausing) {
      pausedStateSetting = isPausing;
      let pauseObject = { value: 1 };
      let pauseTimeline = gsap.timeline({ onUpdate: () => marqueeTimeline.timeScale(pauseObject.value) });
      if (isPausing) {
        pauseTimeline.fromTo(pauseObject, { value: timeScaleSetting }, { value: 0, duration: 0.5 });
        triggerClickEl.addClass("is-paused");
      } else {
        pauseTimeline.fromTo(pauseObject, { value: 0 }, { value: timeScaleSetting, duration: 0.5 });
        triggerClickEl.removeClass("is-paused");
      }
    }
    if (window.matchMedia("(pointer: fine)").matches) {
      triggerHoverEl.on("mouseenter", () => pauseMarquee(true));
      triggerHoverEl.on("mouseleave", () => pauseMarquee(false));
    }
    triggerClickEl.on("click", function() {
      !$(this).hasClass("is-paused") ? pauseMarquee(true) : pauseMarquee(false);
    });
  });
});



// Create a gsap.matchMedia object to match the specified media query
let mm = gsap.matchMedia();

// Add a listener for the media query (min-width: 768px)
mm.add("(min-width: 768px)", () => {

  // Function to initialize the cards animation
  function initCards(direction) {
    // Select all elements with attribute 'th-{direction}-cards' set to 'component'
    let components = $(`[th-${direction}-cards='component']`);

    // Iterate over each component
    components.each(function() {
      // Select the current component, wrapper, and panel elements
      let component = $(this);
      let wrapper = component.find(`[th-${direction}-cards='wrapper']`);
      let panel = component.find(`[th-${direction}-cards='panel']`);

      // Calculate the dimensions of the parent and panel elements based on the direction
      let parentDimension = wrapper[direction === 'horizontal' ? 'width' : 'height']();
      let panelDimension = panel[direction === 'horizontal' ? 'width' : 'height']();

      // Calculate the distance to move based on the direction
      let moveDistance = direction === 'horizontal' ? parentDimension - panelDimension : panelDimension - parentDimension;

      // Create a new gsap timeline with a scroll trigger
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: component,
          endTrigger: component,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: wrapper,
        },
      });

      // Animate the panel element based on the direction
      tl.to(panel, {
        [direction === 'horizontal' ? 'x' : 'y']: direction === 'horizontal' ? moveDistance : -moveDistance,
        delay: 0.025,
        ease: "power2.out",
      });
    });
  }

  // Add an event listener for when the DOM is fully loaded
  window.addEventListener("DOMContentLoaded", (event) => {
    // Initialize the cards animations for both horizontal and vertical directions
    initCards('horizontal');
    initCards('vertical');
  });

})




document.addEventListener("DOMContentLoaded", function() {

  function setHeights(elements) {
    // Find the tallest element
    var tallestHeight = 0;
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].clientHeight > tallestHeight) {
        tallestHeight = elements[i].clientHeight;
      }
    }
    // Set the height of all elements to the tallest height
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.height = tallestHeight + 'px';
    }
  }

  //Get all elements with the attribute 'th-element="table-header"'
  var headerElements = document.querySelectorAll('[th-element="table-header"]');
  setHeights(headerElements);

  // On page size change
  window.onresize = function() {
    // Remove the inline height for header elements
    for (var i = 0; i < headerElements.length; i++) {
      headerElements[i].style.height = '';
    }
    // Recalculate the heights for header elements
    setHeights(headerElements);
  }
});

window.onload = function() {
  // Code to set the min-widths of elements goes here
  function setMinWidths(elements) {
    // Find the widest element
    var widestWidth = 0;
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].clientWidth > widestWidth) {
        widestWidth = elements[i].clientWidth;
      }
    }
    // Set the min-width of all elements to the widest width
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.minWidth = widestWidth + 'px';
    }
  }
  //Get all elements with the attribute 'th-element="table-column"'
  var columnElements = document.querySelectorAll('[th-element="table-column"]');
  setMinWidths(columnElements);

  // On page size change
  window.onresize = function() {
    // Remove the inline min-width for column elements
    for (var i = 0; i < columnElements.length; i++) {
      columnElements[i].style.minWidth = '';
    }
    // Recalculate the min-widths for column elements
    setMinWidths(columnElements);
  }
}



$(document).ready(function() {
  var gradientElements = $('[th-element="table-gradient"]');
  var tableComponent = $('[th-element="comp-table"]');

  tableComponent.scroll(function() {
    if (tableComponent.scrollLeft() > 0) {
      gradientElements.addClass("is-visible");
    } else {
      gradientElements.removeClass("is-visible");
    }
  });
});





// Unstick footer
$(document).ready(function() {
  var mainHeight = $("main").height();
  var footer = $(".footer_wrapper");
  var footerHeight = footer.outerHeight();
  var viewportHeight = $(window).height();

  // console.log(footerHeight);
  // console.log(viewportHeight);

  if (mainHeight - footerHeight < viewportHeight) {
    footer.addClass("is-not-sticky");
  }

  if (footerHeight >= viewportHeight) {
    footer.addClass("is-not-sticky");
  }
});




// blog list item hover
$(document).ready(function() {
  $("[th-element='blog-list-item']").on("mouseenter", function() {
    gsap.to($(this).find("img"), {
      scale: 1.1,
      duration: 0.5,
      ease: "power2.out",
    });
  });

  $("[th-element='blog-list-item']").on("mouseleave", function() {
    gsap.to($(this).find("img"), {
      scale: 1,
      duration: 0.5,
      ease: "power2.out",
    });
  });
});



// footer date update
// document.addEventListener("DOMContentLoaded", function() { 
//   const yrSpan = document.querySelector('.colophon__date');
//   const currentYr = new Date().getFullYear();
//   yrSpan.textContent = currentYr;
// });



// modal cookie
$(document).ready(function() {
  var $modal = $("[th-modal='component']");

  $("[th-modal='close']").click(function() {
    var date = new Date();
    date.setTime(date.getTime() + (14 * 24 * 60 * 60 * 1000));
    // date.setTime(date.getTime() + (0 * 1 * 60 * 60 * 1000));
    document.cookie = "modal=closed; expires=" + date.toUTCString() + "; path=/";
    $modal.hide();
    $modal.attr("aria-hidden", "true");
  });

  if (document.cookie.indexOf("modal=closed") < 0) {
    $modal.show();
    $modal.attr("aria-hidden", "false");
  }
});



// modal success message reaize
// $(document).ready(function() {
//   $("[th-element='email-opt-in-component']").each(function() {
//     var $form = $(this).find("form");
//     var $successMessage = $(this).find("[aria-label='Newsletter opt-in success']");
//     $successMessage.height($form.outerHeight());
//   });
// });



// form textarea grow
$(document).ready(function() {
  var growWrapTextareas = $("textarea[th-textarea='grow-wrap']");

  if (growWrapTextareas.length) {
    growWrapTextareas.wrap("<div class='grow-wrap'></div>");

    const growers = document.querySelectorAll(".grow-wrap");
    growers.forEach((grower) => {
      const textarea = grower.querySelector("textarea");
      textarea.addEventListener("input", () => {
        grower.dataset.replicatedValue = textarea.value;
      });
    });
  }
});




// navbar move and sticky css variable resize
$(document).ready(() => {
  const banner = $("[role='banner']");
  const bannerHeight = banner.outerHeight();
  let scrollTop = 0;

  const headerSpacingElements = $(".section_sticky-navigation");
  const headerSpacingValue = getComputedStyle(document.documentElement).getPropertyValue('--header-spacing').trim();

  gsap.set(headerSpacingElements, { top: headerSpacingValue });

  const tl = gsap.timeline({
      paused: true,
      defaults: {
        duration: 0.3,
        ease: "power2.out"
      }
    })
    .to(banner, { yPercent: -100 })
    .to(headerSpacingElements, { top: '0px' }, 0);

  const handleScroll = () => {
    const currentScrollTop = $(window).scrollTop();

    if (currentScrollTop > scrollTop && currentScrollTop > bannerHeight) {
      tl.play();
    } else if (scrollTop - currentScrollTop > 2) {
      tl.reverse();
    }

    scrollTop = currentScrollTop;
  };

  $(window).on("scroll", handleScroll);
});