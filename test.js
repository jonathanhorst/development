window.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger, Flip);
  ScrollTrigger.normalizeScroll(true);

  let homeMergeComponent = $("[th-homemerge-element='component']");
  let homeMergeContainer = $("[th-homemerge-element='container']");
  let homeMergeCoin = $("[th-homemerge-element='coin']");
  let homeMergeNft = $("[th-homemerge-element='nft']");
  let homeMergeCoinDestination = $("[th-homemerge-element='coin-destination']");
  let homeMergeNftDestination = $("[th-homemerge-element='nft-destination']");
  // Store initial parent elements of the coins
  const homeMergeCoinParents = homeMergeCoin.map((_, element) => $(element).parent()).get();
  // Store initial parent elements of the nfts
  const homeMergeNftParents = homeMergeNft.map((_, element) => $(element).parent()).get();
  // Add a boolean variable to track whether the flipHomeMerge function has been executed
  let elementsFlipped = false;

  function applyFlip(objects, parents, destination) {
    objects.each((index, object) => {
      let state = Flip.getState(object);
      $(object).appendTo(destination ? destination : parents[index]);
      Flip.from(state, {
        duration: 0.8,
        ease: "power2.out",
      });
    });
  }

  function moveItems() {
    // Get the current heights of the .home-merge_wallet elements
    let walletHeightsBefore = $(".home-merge_wallet").map((_, wallet) => $(wallet).outerHeight()).get();

    if (elementsFlipped) {
      applyFlip(homeMergeCoin, homeMergeCoinParents);
      applyFlip(homeMergeNft, homeMergeNftParents);
      elementsFlipped = false;
    } else {
      applyFlip(homeMergeCoin, null, homeMergeCoinDestination);
      applyFlip(homeMergeNft, null, homeMergeNftDestination);
      elementsFlipped = true;
    }

    // Animate the height of the .home-merge_wallet elements
    $(".home-merge_wallet").each((index, wallet) => {
      let walletHeightBefore = walletHeightsBefore[index];
      let walletHeightAfter = $(wallet).outerHeight();

      gsap.fromTo(wallet, {
        height: walletHeightBefore,
      }, {
        height: walletHeightAfter,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          // Unset the height style after the animation is complete
          $(wallet).css("height", "");
        },
      });
    });
  }


  function toggleHomeMergeContainer() {
    let object = $("[th-homemerge-element='container'] > div");
    let state = Flip.getState(object);
    $(homeMergeContainer).toggleClass('is-switched');
    Flip.from(state, {
      duration: 0.8,
      ease: "power2.out"
    });
  }

  function formatNumber(value, decimals) {
    let s = (+value).toLocaleString('en-US').split(".");
    return decimals ? s[0] + "." + ((s[1] || "") + "00000000").substr(0, decimals) : s[0];
  }

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: homeMergeComponent,
      // endTrigger: "",
      markers: true,
      // toggleActions: "play pause resume reverse",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      defaults: {
        ease: "power2.out"
      },
      pin: homeMergeContainer,
      onEnter: () => {
        // console.log("enter");
        toggleHomeMergeContainer();
      },
      // onLeave: () => {
      //   console.log("leave");
      // },
      // onEnterBack: () => {
      //   console.log("enter back");
      // },
      onLeaveBack: () => {
        // console.log("Leave back");
        toggleHomeMergeContainer();
      }
    }
  });
  tl.to("[th-homemerge-element='copy-1']", {
      opacity: 0,
      display: "none",
      duration: 0.3,
    }, ">1")
    .from("[th-homemerge-element='copy-2']", {
      opacity: 0,
      display: "none",
      duration: 0.3,
    }, ">0.1")
    .from(".home-merge_wallet-container.is-first", {
      y: "50vh",
      opacity: 0,
      display: "none",
      duration: 1,
    }, ">0.5")
    .call(moveItems, null, ">1")
    .from("[th-homemerge-element='wallet-total-1']", {
      textContent: "0",
      duration: 0.5,
      modifiers: {
        textContent: value => formatNumber(value, 2)
      },
    }, "<")
    .fromTo(["[th-homemerge-element='wallet-total-2']", "[th-homemerge-element='wallet-total-3']", "[th-homemerge-element='wallet-total-4']", ], {
      textContent: (i, target) => parseFloat(target.textContent.replace(/,/g, '')),
    }, {
      textContent: "0",
      duration: 0.5,
      modifiers: {
        textContent: (value) => formatNumber(value, 2),
      },
    }, "<")
    .to("[th-homemerge-element='copy-2']", {
      opacity: 0,
      display: "none",
      duration: 0.3,
    }, "<")
    .from("[th-homemerge-element='copy-3']", {
      opacity: 0,
      display: "none",
      duration: 0.3,
    }, ">0.1")
    .to(".home-merge_wallet-container.is-second, .home-merge_wallet-container.is-third, .home-merge_wallet-container.is-fourth", {
      opacity: 0,
      display: "none",
      duration: 0.7,
      ease: "power2.out"
    }, ">0.5");

});