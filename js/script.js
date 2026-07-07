/*==================================================
=                 ELEMENTS
==================================================*/

const body = document.body;
const loader = document.querySelector(".loader");

const header = document.querySelector(".header");

const themeToggle = document.querySelector(".theme-toggle");

const mobileToggle = document.querySelector(".mobile-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const mobileClose = document.querySelector(".mobile-nav__close");

const scrollTopButton = document.querySelector(".scroll-top");

const navLinks = document.querySelectorAll(".navbar__link");
const mobileLinks = document.querySelectorAll(".mobile-nav a");

const sections = document.querySelectorAll("main section");

const newsletterForm = document.querySelector(".newsletter__form");
const contactForm = document.querySelector(".contact__form");

/*==================================================
=                 LOADER
==================================================*/

window.addEventListener("load", () => {

    setTimeout(() => {

        loader.style.opacity = "0";
        loader.style.visibility = "hidden";
        loader.style.pointerEvents = "none";

    }, 1200);

});

/*==================================================
=                 DARK MODE
==================================================*/

const savedTheme = localStorage.getItem("echo-theme");

if(savedTheme === "dark"){

    body.classList.add("dark-mode");

    themeToggle.innerHTML =
        '<i class="ri-sun-line"></i>';

}

themeToggle.addEventListener("click",()=>{

    body.classList.toggle("dark-mode");

    const dark = body.classList.contains("dark-mode");

    themeToggle.innerHTML = dark
        ? '<i class="ri-sun-line"></i>'
        : '<i class="ri-moon-line"></i>';

    localStorage.setItem(
        "echo-theme",
        dark ? "dark" : "light"
    );

});

/*==================================================
=                 HEADER
==================================================*/

window.addEventListener("scroll",()=>{

    if(window.scrollY > 80){

        header.classList.add("scrolled");

    }

    else{

        header.classList.remove("scrolled");

    }

});

/*==================================================
=              SCROLL TO TOP
==================================================*/

window.addEventListener("scroll",()=>{

    if(window.scrollY > 500){

        scrollTopButton.classList.add("show");

    }

    else{

        scrollTopButton.classList.remove("show");

    }

});

scrollTopButton.addEventListener("click",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});

/*==================================================
=                 MOBILE MENU
==================================================*/

mobileToggle.addEventListener("click",()=>{

    mobileNav.classList.add("active");

});

mobileClose.addEventListener("click",()=>{

    mobileNav.classList.remove("active");

});

mobileLinks.forEach(link=>{

    link.addEventListener("click",()=>{

        mobileNav.classList.remove("active");

    });

});

/*==================================================
=              ACTIVE NAVBAR
==================================================*/

const activateLink = () =>{

    let current = "";

    sections.forEach(section=>{

        const top =
            section.offsetTop - 140;

        const height =
            section.offsetHeight;

        if(window.scrollY >= top){

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link=>{

        link.classList.remove("active");

        if(

            link.getAttribute("href") ===
            "#" + current

        ){

            link.classList.add("active");

        }

    });

};

window.addEventListener(
    "scroll",
    activateLink
);

/*==================================================
=             FADE UP ANIMATION
==================================================*/

const observer =
new IntersectionObserver(

(entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("fade-up");

        }

    });

},

{

    threshold:.15

}

);

document.querySelectorAll(

".section, .issue-card, .team-card"

).forEach(element=>{

    observer.observe(element);

});

/*==================================================
=           NEWSLETTER (BREVO)
==================================================*/

newsletterForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const emailInput = document.getElementById("newsletter-email");
    const message = document.getElementById("newsletter-message");

    message.textContent = "";
    message.className = "newsletter__message";

    try {

        const response = await fetch(
            "https://echo-magazine-api.echomagazine.workers.dev/newsletter",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: emailInput.value.trim()
                })
            }
        );

        const data = await response.json();

        if (data.success) {

            message.textContent = "✓ Successfully subscribed to Echo Magazine.";
            message.classList.add("success");

            newsletterForm.reset();

        } else {

            message.textContent = data.message || "This email is already subscribed.";
            message.classList.add("error");

        }

    } catch (error) {

        message.textContent = "Connection error. Please try again.";
        message.classList.add("error");

        console.error(error);

    }

});

/*==================================================
=             CONTACT FORM
==================================================*/

contactForm.addEventListener(
"submit",

(event)=>{

    event.preventDefault();

    const inputs =
    contactForm.querySelectorAll(

        "input[required], textarea"

    );

    let valid = true;

    inputs.forEach(input=>{

        if(input.value.trim()===""){

            valid = false;

        }

    });

    if(!valid){

        alert("Please complete all required fields.");

        return;

    }

    alert("Your message has been sent!");

    contactForm.reset();

});
/*==================================================
=         INITIAL ACTIVE LINK
==================================================*/

activateLink();

/*==================================================
=          CLOSE MOBILE MENU (OUTSIDE CLICK)
==================================================*/

document.addEventListener("click", (event) => {

    if(
        mobileNav.classList.contains("active") &&
        !mobileNav.contains(event.target) &&
        !mobileToggle.contains(event.target)
    ){

        mobileNav.classList.remove("active");

    }

});

/*==================================================
=          CLOSE MOBILE MENU (ESC KEY)
==================================================*/

document.addEventListener("keydown",(event)=>{

    if(
        event.key === "Escape" &&
        mobileNav.classList.contains("active")
    ){

        mobileNav.classList.remove("active");

    }

});

/*==================================================
=            SMOOTH SCROLL
==================================================*/

document.querySelectorAll('a[href^="#"]').forEach(link=>{

    link.addEventListener("click",(event)=>{

        const id = link.getAttribute("href");

        if(id === "#") return;

        const target = document.querySelector(id);

        if(!target) return;

        event.preventDefault();

        target.scrollIntoView({

            behavior:"smooth",
            block:"start"

        });

    });

});

/*==================================================
=          IMAGE REVEAL EFFECT
==================================================*/

const images = document.querySelectorAll("img");

const imageObserver = new IntersectionObserver(

(entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.style.opacity = "1";
            entry.target.style.transform = "scale(1)";

            imageObserver.unobserve(entry.target);

        }

    });

},

{

    threshold:.15

}

);

images.forEach(image=>{

    image.style.opacity = "0";
    image.style.transform = "scale(.97)";
    image.style.transition = ".8s ease";

    imageObserver.observe(image);

});

/*==================================================
=             BUTTON RIPPLE
==================================================*/

document.querySelectorAll(".button").forEach(button=>{

    button.addEventListener("click",()=>{

        button.animate(

            [

                {

                    transform:"scale(1)"

                },

                {

                    transform:"scale(.96)"

                },

                {

                    transform:"scale(1)"

                }

            ],

            {

                duration:220

            }

        );

    });

});

/*==================================================
=             ACCESSIBILITY
==================================================*/

document.querySelectorAll("button").forEach(button=>{

    button.addEventListener("keyup",(event)=>{

        if(event.key==="Enter"){

            button.click();

        }

    });

});

/*==================================================
=           CONSOLE MESSAGE
==================================================*/

console.log(
`%cEcho Magazine`,
"font-size:26px;font-family:serif;color:#C9A96E;font-weight:bold;"
);

console.log(
"%cDesigned with HTML, CSS & Vanilla JavaScript.",
"color:#6E2435;font-size:14px;"
);

/*==================================================
=         READ MAGAZINE TRANSITION
==================================================*/

const readMagazine = document.getElementById("read-magazine");

if (readMagazine) {

    readMagazine.addEventListener("click", (event) => {

        event.preventDefault();

        sessionStorage.setItem(
            "loaderText",
            "Opening Issue 01..."
        );

        loader.style.opacity = "1";
        loader.style.visibility = "visible";
        loader.style.pointerEvents = "all";

        setTimeout(() => {

            window.location.href = readMagazine.href;

        }, 1000);

    });

}
/*==================================================
=               DYNAMIC TEAM
==================================================*/

const featuredContainer = document.getElementById("featured-team");
const teamContainer = document.getElementById("team-more");
const teamToggle = document.getElementById("team-toggle");

if (featuredContainer && teamContainer && teamToggle) {

    function createTeamCard(member) {

        return `
            <article class="team-card">

                <figure class="team-card__image">

                    <img
                        src="${member.image}"
                        alt="${member.name}">

                </figure>

                <h3>

                    ${member.name}

                </h3>

                <span>

                    ${member.role}

                </span>

            </article>
        `;

    }

    const featuredMembers = teamMembers.filter(member => member.featured);

    const otherMembers = teamMembers.filter(member => !member.featured);

    featuredContainer.innerHTML =
        featuredMembers.map(createTeamCard).join("");

    teamContainer.innerHTML =
        otherMembers.map(createTeamCard).join("");

    let opened = false;

    teamToggle.addEventListener("click", () => {

        opened = !opened;

        teamContainer.classList.toggle("show");

        teamToggle.classList.toggle("active");

        if (opened) {

            teamToggle.innerHTML = `
                Hide Team
                <i class="ri-arrow-down-s-line"></i>
            `;

            const cards = teamContainer.querySelectorAll(".team-card");

            cards.forEach((card, index) => {

                card.style.transitionDelay =
                    `${index * 0.05}s`;

            });

        }

        else {

            teamToggle.innerHTML = `
                Explore Our Team
                <i class="ri-arrow-down-s-line"></i>
            `;

        }

    });

}
/*==================================================
=               END OF FILE
==================================================*/