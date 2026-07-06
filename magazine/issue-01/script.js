let zoom = 1;
const wrapper = document.getElementById("book-wrapper");
const book = document.getElementById("book");

const isMobile = window.innerWidth < 768;

for (let i = 2; i <= 25; i++) {
  const div = document.createElement("div");
  div.className = "page";
  div.innerHTML = `<img src="./pages/${i}.jpg">`;
  book.appendChild(div);
}

// Ekran boyutuna göre sayfa boyutu hesapla
const topBarHeight = 60;
const availH = window.innerHeight - topBarHeight;
const availW = window.innerWidth;

// Mobil: tam genişlik, PC: yarı genişlik (çift sayfa)
const pageW = isMobile ? availW : Math.min(availW / 2, 500);
const pageH = isMobile ? availH : Math.min(availH, 700);

const pageFlip = new St.PageFlip(book, {
  width: pageW,
  height: pageH,
  size: "fixed",
  maxShadowOpacity: 0.5,
  showCover: true,
  usePortrait: isMobile,
  mobileScrollSupport: false,
  swipeDistance: 10,
});

pageFlip.loadFromHTML(document.querySelectorAll(".page"));

window.addEventListener("load", () => pageFlip.update());

function nextPage() { pageFlip.flipNext(); }
function prevPage() { pageFlip.flipPrev(); }

function zoomIn() {
  zoom = Math.min(2, zoom + 0.1);
  wrapper.style.transform = `scale(${zoom})`;
}
function zoomOut() {
  zoom = Math.max(0.5, zoom - 0.1);
  wrapper.style.transform = `scale(${zoom})`;
}

document.addEventListener("keydown", function(e) {
  if (e.key === "ArrowRight") pageFlip.flipNext();
  if (e.key === "ArrowLeft") pageFlip.flipPrev();
});