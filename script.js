let images = [];
let ratings = {};
let currentIndex = Object.keys(ratings).length;
currentIndex = 0;

function showImage(index) {
  let imgElement = document.getElementById("slideshow");
  imgElement.src = images[index];
  document.getElementById("imageNumber").innerText =
    `Image ${index + 1} of ${images.length}`;
  document.getElementById("imageName").innerText = `${images[index]}`;

  let imgURL = images[index];
  fetch(imgURL)
    .then((response) => response.blob())
    .then((blob) => {
      let imgFile = new File([blob], "myImage.jpg");

      EXIF.getData(imgFile, function () {
        let allMetaData = EXIF.getAllTags(this);

        // Stringify without indent
        //leftBox.value=JSON.stringify(allMetaData);

        // Stringify with indent
        leftBox.value = JSON.stringify(allMetaData, null, 2);
      });
    })
    .catch((error) => console.error("Error fetching image:", error));
}

function nextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  showImage(currentIndex);
}

function prevImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showImage(currentIndex);
}

function createSquares() {
  let panel = document.getElementById("panel");
  panel.innerHTML = "";

  for (let i = 0; i < images.length; i++) {
    let square = document.createElement("div");
    square.classList.add("square");

    if (i === currentIndex) {
      square.classList.add("selected");
    }

    let item = ratings[i];

    let directoryName = images[i].split("/")[1];
    square.innerText = directoryName[0];

    if (!item) {
    } else if (item === "no") {
      square.classList.add("red");
    } else if (item === "maybe") {
      square.classList.add("yellow");
    } else if (item === "yes") {
      square.classList.add("green");
    } else if (item in ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]) {
      square.classList.add("grey");
      square.innerText = item;
    } else {
      console.log(item);
      square.classList.add("grey");
    }

    square.onclick = function () {
      currentIndex = i;
      showImage(i);
      createSquares();
    };

    panel.appendChild(square);
  }

  let customLabelRight = document.getElementById("customLabelRight");
  let percent = Math.round(
    (Object.keys(ratings).length / images.length) * 100,
  );
  let total = Object.keys(ratings).length;
  customLabelRight.innerText = `${percent}% Complete (${total}/${images.length})`;

  let customLabelLeft = document.getElementById("customLabelLeft");

  let array = Object.keys(ratings).map((e) => ratings[e]);
  let yes = array.filter((item) => item === "yes").length;
  let maybe = array.filter((item) => item === "maybe").length;
  let no = array.filter((item) => item === "no").length;
  customLabelLeft.innerText = `${yes}/${maybe}/${no}/${images.length - total}`;

  document.querySelector("#rightBox").value = JSON.stringify(ratings);
}

function displayThisText(text, color, durationInSeconds) {
  let textElement = document.createElement("div");
  textElement.className = "fade-out";
  textElement.textContent = text;
  textElement.style.color = color;
  textElement.classList.add(color);
  textElement.style.top = "50%";
  textElement.style.left = "50%";
  textElement.style.transform = "translate(-50%, -50%)";
  textElement.style.transitionDuration = `${durationInSeconds}s`;

  document.body.appendChild(textElement);

  setTimeout(() => {
    textElement.style.opacity = "0";
  }, 500);

  setTimeout(() => {
    document.body.removeChild(textElement);
  }, durationInSeconds * 5000);
}

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowUp") {
    displayThisText("YES!", "green-text", 0.75);
    ratings[currentIndex] = "yes";
    nextImage();
  } else if (event.key === "ArrowRight") {
    displayThisText("MAYBE!", "yellow-text", 0.5);
    ratings[currentIndex] = "maybe";
    nextImage();
  } else if (event.key === "ArrowDown") {
    displayThisText("NO!", "red-text", 0.5);
    ratings[currentIndex] = "no";
    nextImage();
  } else if (event.key === "ArrowLeft") {
    prevImage();
  }

  createSquares();
});

window.onload = function () {
  fetch("manifest.json")
    .then((response) => response.json())
    .then((data) => {
      images=data;
      createSquares();
      showImage(currentIndex);
    });
}
