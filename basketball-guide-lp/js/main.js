window.addEventListener("scroll", () => {
  windowHeight = window.innerHeight;

  document
    .querySelectorAll(
      "#womens-features .heading > div, #mens-features .heading > div, #mens-exhibitions .heading > div, #general-content .heading > div"
    )
    .forEach((heading) => {
      // Show & animate heading when scrolled into view
      if (
        heading.getBoundingClientRect().top - windowHeight <=
        0 - windowHeight * 0.2
      ) {
        heading.classList.add("fromLeft");
      }

      // Hide heading when scrolled out of view
      if (heading.getBoundingClientRect().top - windowHeight >= windowHeight) {
        heading.classList.remove("fromLeft");
      }
    });
});
