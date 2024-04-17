//Helper functions
function upperCase(name) {
  return name[0].toUpperCase() + name.slice(1).toLowerCase();
}

//Makes back to top button appear only around the bottom of the screen
window.addEventListener("scroll", function () {
  var backToTopButton = document.getElementById("back");
  // Calculate the threshold as 95% of the scroll height
  var threshold = 0.85 * document.documentElement.scrollHeight;
  if (window.scrollY + window.innerHeight >= threshold) {
    backToTopButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
  }
});
