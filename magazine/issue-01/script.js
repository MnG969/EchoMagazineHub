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

    book.style.zoom = zoom;

    /*
     * Wait until the browser recalculates
     * the zoomed dimensions.
     */
    requestAnimationFrame(() => {

        const bookRect = book.getBoundingClientRect();

        const wrapperWidth = wrapper.clientWidth;
        const wrapperHeight = wrapper.clientHeight;

        /*
         * Space needed so the zoomed book can be
         * completely moved away from the fixed header.
         */
        const headerSpace = isMobile ? 170 : 110;

        /*
         * Extra space created by zoom.
         *
         * This is what fixes the problem where the
         * top of the magazine becomes unreachable.
         */
        const extraVerticalSpace =
            Math.max(
                0,
                bookRect.height - wrapperHeight
            );

        /*
         * Extra horizontal space for zoomed pages.
         */
        const extraHorizontalSpace =
            Math.max(
                0,
                bookRect.width - wrapperWidth
            );

        /*
         * Add enough space before and after the book.
         *
         * The top padding is especially important because
         * the header is fixed above the magazine.
         */
        const topPadding =
            headerSpace +
            Math.min(
                extraVerticalSpace,
                bookRect.height * 0.5
            );

        const bottomPadding =
            isMobile ? 100 : 80;

        const horizontalPadding =
            Math.max(
                30,
                Math.min(
                    extraHorizontalSpace / 2,
                    bookRect.width * 0.25
                )
            );

        wrapper.style.paddingTop =
            `${topPadding}px`;

        wrapper.style.paddingBottom =
            `${bottomPadding}px`;

        wrapper.style.paddingLeft =
            `${horizontalPadding}px`;

        wrapper.style.paddingRight =
            `${horizontalPadding}px`;

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