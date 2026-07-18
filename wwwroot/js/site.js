(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener);
  };

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select("#header");
    let offset = header.offsetHeight;
    let target = select(el);
    if (!target) return;
    window.scrollTo({
      top: target.offsetTop - offset,
      behavior: "smooth",
    });
  };

  /**
   * Navbar links active state on scroll
   */
  const navbarlinksActive = () => {
    let navbarlinks = select("#navbar .scrollto", true);
    let position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };
  window.addEventListener("load", navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select("#header");
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add("header-scrolled");
      } else {
        selectHeader.classList.remove("header-scrolled");
      }
    };
    window.addEventListener("load", headerScrolled);
    onscroll(document, headerScrolled);
  }

  /**
   * Back to top button
   */
  let backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add("active");
      } else {
        backtotop.classList.remove("active");
      }
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * Mobile nav toggle — uses event delegation so it survives DOM changes
   */
  document.addEventListener("click", function (e) {
    let toggle = e.target.closest(".mobile-nav-toggle");
    if (toggle) {
      select("#navbar").classList.toggle("navbar-mobile");
      toggle.classList.toggle("bi-list");
      toggle.classList.toggle("bi-x");
    }
  });

  /**
   * Mobile nav dropdowns activate — event delegation
   */
  document.addEventListener("click", function (e) {
    let dropdownLink = e.target.closest(".navbar .dropdown > a");
    if (dropdownLink && select("#navbar").classList.contains("navbar-mobile")) {
      e.preventDefault();
      dropdownLink.nextElementSibling.classList.toggle("dropdown-active");
    }
  });

  /**
   * Scroll with offset on links with class .scrollto — event delegation
   */
  document.addEventListener("click", function (e) {
    let link = e.target.closest(".scrollto");
    if (!link) return;
    if (link.hash && select(link.hash)) {
      e.preventDefault();

      let navbar = select("#navbar");
      if (navbar.classList.contains("navbar-mobile")) {
        navbar.classList.remove("navbar-mobile");
        let navbarToggle = select(".mobile-nav-toggle");
        navbarToggle.classList.toggle("bi-list");
        navbarToggle.classList.toggle("bi-x");
      }
      scrollto(link.hash);
    }
  });

  /**
   * Scroll with offset on page load with hash links in the url
   */
  window.addEventListener("load", () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Preloader
   */
  window.addEventListener("load", () => {
    let preloader = select("#preloader");
    if (preloader) {
      preloader.remove();
    }
  });

  /**
   * Animation on scroll (AOS)
   */
  window.addEventListener("load", () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  });

  /**
   * Handle Blazor enhanced navigation.
   * When Blazor patches the DOM for a new page, the preloader div
   * gets re-inserted and AOS needs re-initialization.
   */
  function onEnhancedLoad() {
    // Remove preloader that Blazor re-added to the DOM
    let preloader = document.getElementById("preloader");
    if (preloader) preloader.remove();

    // Re-initialize AOS for new page content
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 1000,
        easing: "ease-in-out",
        once: true,
        mirror: false,
      });
    }

    // Scroll to top on page navigation
    window.scrollTo(0, 0);
  }

  // Register once Blazor is available
  function registerBlazorEnhancedNav() {
    if (typeof Blazor !== "undefined" && Blazor.addEventListener) {
      Blazor.addEventListener("enhancedload", onEnhancedLoad);
    } else {
      // Blazor script hasn't loaded yet — retry shortly
      setTimeout(registerBlazorEnhancedNav, 100);
    }
  }
  registerBlazorEnhancedNav();

  /**
   * Expose interop for Blazor if needed
   */
  window.siteInterop = {
    refreshAos: () => {
      AOS.refresh();
    },
  };
})();
