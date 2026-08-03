let zoom = 1;

const wrapper = document.getElementById("book-wrapper");
const book = document.getElementById("book");
const pageNumber = document.getElementById("page-number");

const TOTAL_PAGES = 30;
const MIN_ZOOM = 0.6;
const MAX_ZOOM = 2;

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

const availH = Math.max(
    300,
    window.innerHeight - topBarHeight
);

const availW = Math.max(
    300,
    window.innerWidth
);

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

    maxShadowOpacity: 0.65,

    drawShadow: true
});

pageFlip.loadFromHTML(
    document.querySelectorAll(".page")
);

/*==================================
=       ZOOM / SCROLL SYSTEM
==================================*/

function updateZoom() {

    /*
     * Instead of CSS zoom, use transform.
     * The spacer dimensions below make the
     * transformed book fully scrollable.
     */

    book.style.transform = `scale(${zoom})`;
    book.style.transformOrigin = "center center";

    requestAnimationFrame(() => {

        const baseWidth = book.offsetWidth;
        const baseHeight = book.offsetHeight;

        const scaledWidth = baseWidth * zoom;
        const scaledHeight = baseHeight * zoom;

        const wrapperWidth = wrapper.clientWidth;
        const wrapperHeight = wrapper.clientHeight;

        const headerSpace = isMobile ? 170 : 110;

        /*
         * Amount of extra space created by zoom.
         */
        const horizontalOverflow = Math.max(
            0,
            scaledWidth - wrapperWidth
        );

        const verticalOverflow = Math.max(
            0,
            scaledHeight - (wrapperHeight - headerSpace)
        );

        /*
         * The invisible space around the book
         * guarantees that BOTH sides can be reached.
         */
        const horizontalSpace =
            Math.ceil(horizontalOverflow / 2);

        const verticalSpace =
            Math.ceil(verticalOverflow / 2);

        wrapper.style.paddingTop =
            `${headerSpace + verticalSpace}px`;

        wrapper.style.paddingBottom =
            `${Math.max(
                isMobile ? 100 : 80,
                verticalSpace + 40
            )}px`;

        wrapper.style.paddingLeft =
            `${horizontalSpace}px`;

        wrapper.style.paddingRight =
            `${horizontalSpace}px`;

    });
}

/*==================================
=          INITIAL UPDATE
==================================*/

window.addEventListener("load", () => {

    pageFlip.update();

    updateZoom();

});

/*==================================
=       PAGE COUNTER
==================================*/

pageFlip.on("flip", (event) => {

    let current = event.data + 1;

    if (current < 1) {
        current = 1;
    }

    pageNumber.textContent =
        `${current} / ${TOTAL_PAGES}`;

});

/*==================================
=          PAGE BUTTONS
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

    zoom = Math.min(
        MAX_ZOOM,
        Math.round((zoom + 0.1) * 10) / 10
    );

    updateZoom();

}

function zoomOut() {

    zoom = Math.max(
        MIN_ZOOM,
        Math.round((zoom - 0.1) * 10) / 10
    );

    updateZoom();

}

/*==================================
=          KEYBOARD
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