let zoom = 1;

const wrapper = document.getElementById("book-wrapper");
const book = document.getElementById("book");
const pageNumber = document.getElementById("page-number");

const TOTAL_PAGES = 30;

const isMobile = window.innerWidth < 768;

/*==================================
=         CREATE PAGES
==================================*/

for (let i = 2; i <= TOTAL_PAGES; i++) {

    const div = document.createElement("div");

    div.className = "page";

    div.innerHTML = `<img src="./pages/${i}.jpg">`;

    book.appendChild(div);

}

/*==================================
=       PAGE SIZE
==================================*/

const topBarHeight = isMobile ? 150 : 100;

const availH = window.innerHeight - topBarHeight;
const availW = window.innerWidth;

const pageW = isMobile
    ? Math.min(availW - 30, 600)
    : Math.min(availW / 2, 520);

const pageH = isMobile
    ? availH
    : Math.min(availH, 720);

/*==================================
=        PAGE FLIP
==================================*/

const pageFlip = new St.PageFlip(book, {

    width: pageW,

    height: pageH,

    size: "fixed",

    showCover: true,

    usePortrait: isMobile,

    mobileScrollSupport: false,

    swipeDistance: 10,

    maxShadowOpacity: .65,

    drawShadow: true

});

pageFlip.loadFromHTML(document.querySelectorAll(".page"));

window.addEventListener("load", () => {

    pageFlip.update();

});

/*==================================
=       PAGE COUNTER
==================================*/

pageFlip.on("flip", (event) => {

    let current = event.data + 1;

    if (current < 1) current = 1;

    pageNumber.textContent = `${current} / ${TOTAL_PAGES}`;

});

/*==================================
=          BUTTONS
==================================*/

function nextPage() {

    pageFlip.flipNext();

}

function prevPage() {

    pageFlip.flipPrev();

}

/*==================================
=            ZOOM
==================================*/

function zoomIn() {

    zoom = Math.min(2, zoom + .1);

    wrapper.style.transform = `scale(${zoom})`;

}

function zoomOut() {

    zoom = Math.max(.6, zoom - .1);

    wrapper.style.transform = `scale(${zoom})`;

}

/*==================================
=        KEYBOARD
==================================*/

document.addEventListener("keydown", (e) => {

    switch (e.key) {

        case "ArrowRight":

            pageFlip.flipNext();

            break;

        case "ArrowLeft":

            pageFlip.flipPrev();

            break;

        case "+":

        case "=":

            zoomIn();

            break;

        case "-":

            zoomOut();

            break;

    }

});

/*==================================
=      RESPONSIVE UPDATE
==================================*/

window.addEventListener("resize", () => {

    location.reload();

});