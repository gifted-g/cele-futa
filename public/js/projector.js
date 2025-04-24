const socket = io();

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("lyrics", (lyrics) => {
  console.log(lyrics);

  console.log(lyrics);
  document.getElementById("data").textContent = lyrics;
});

function openFullscreen() {
  const elem = document.getElementById("body");
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}
