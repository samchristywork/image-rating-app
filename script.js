let images = [];
let ratings = {};

window.onload = function () {
  fetch("manifest.json")
    .then((response) => response.json())
    .then((data) => {
      images=data;
    });
}
