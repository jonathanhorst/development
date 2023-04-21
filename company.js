let mmCompany1 = gsap.matchMedia();

mmCompany1.add("(min-width: 768px)", () => {

  function toggleBioAnimation() {
    let triggers = $("[th-member='trigger']");

    triggers.each(function() {
      let trigger = $(this);
      let bio = trigger.next("[th-member='bio']");
      let triggerIcon = trigger.find("[th-member='trigger-icon']");

      // Set the initial state of the bio element
      gsap.set(bio, { yPercent: 101, opacity: 1 });

      let tl = gsap.timeline({ paused: true });

      tl.to(bio, {
        yPercent: 0,
        duration: 0.2,
        ease: "power2.out",
      });

      tl.to(
        triggerIcon, {
          rotate: 45,
          color: "var(--color-white)",
          duration: 0.3,
          ease: "power2.out",
        },
        0
      );

      let isReversed = true;

      trigger.on("click", () => {
        if (isReversed) {
          tl.play();
        } else {
          tl.reverse();
        }
        isReversed = !isReversed;
      });
    });
  }

  window.addEventListener("DOMContentLoaded", (event) => {
    toggleBioAnimation();
  });

})



let mmCompany2 = gsap.matchMedia();

mmCompany2.add("(max-width: 767px)", () => {



  function toggleBioAnimation() {
    let triggers = $("[th-member='trigger']");
    let zIndexCounter = 3;

    triggers.each(function() {
      let trigger = $(this);
      let bio = trigger.next("[th-member='bio']");
      let closeIcon = bio.find("[th-member='close-icon']");

      gsap.set(bio, { xPercent: -101, opacity: 1 });

      let tl = gsap.timeline({ paused: true });

      tl.to(bio, {
        xPercent: 0,
        duration: 0.1,
        ease: "power2.out",
      });

      trigger.on("click", () => {
        zIndexCounter++;
        bio.css("z-index", zIndexCounter);

        if (tl.progress() === 1) {
          tl.reverse();
        } else {
          tl.play();
        }
      });

      closeIcon.on("click", () => {
        zIndexCounter++;
        bio.css("z-index", zIndexCounter);

        if (tl.progress() === 1) {
          tl.reverse();
        }
      });
    });
  }

  window.addEventListener("DOMContentLoaded", (event) => {
    toggleBioAnimation();
  });






})