let images = [];
let ratings = {};
let currentIndex = Object.keys(ratings).length;

function showImage(index) {
  let imgElement = document.getElementById("slideshow");
  imgElement.src = images[index];
  document.getElementById("imageNumber").innerText =
    `Image ${index + 1} of ${images.length}`;
  document.getElementById("imageName").innerText = `${images[index]}`;
}

function nextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  showImage(currentIndex);
}

function prevImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showImage(currentIndex);
}

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowUp") {
    ratings[currentIndex] = "yes";
    nextImage();
  } else if (event.key === "ArrowRight") {
    ratings[currentIndex] = "maybe";
    nextImage();
  } else if (event.key === "ArrowDown") {
    ratings[currentIndex] = "no";
    nextImage();
  } else if (event.key === "ArrowLeft") {
    prevImage();
  }
});

window.onload = function () {
  fetch("manifest.json")
    .then((response) => response.json())
    .then((data) => {
      images=data;
      showImage(currentIndex);
    });
}
