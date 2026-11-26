/* ---------- Booking deep links ---------- */

const bookingHash = window.location.hash;

if (bookingHash) {
    const targetBooking =
        document.getElementById(bookingHash.slice(1));

    if (
        targetBooking &&
        targetBooking.tagName === "DETAILS"
    ) {
        targetBooking.open = true;

        window.requestAnimationFrame(() => {
            targetBooking.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    }
}

/* ---------- Booking language ---------- */

let savedLanguage = "sv";

try {
    savedLanguage =
        localStorage.getItem("redroom-language") || "sv";
} catch {
    savedLanguage = "sv";
}

const currentLanguage =
    savedLanguage === "en" ? "en" : "sv";

const languageToggle =
    document.getElementById("language-toggle");

document.documentElement.lang = currentLanguage;

if (languageToggle) {
    languageToggle.textContent =
        currentLanguage === "sv"
            ? "🇬🇧"
            : "🇸🇪";

    languageToggle.setAttribute(
        "aria-label",
        currentLanguage === "sv"
            ? "Switch to English"
            : "Byt till svenska"
    );

    languageToggle.addEventListener("click", () => {
        const nextLanguage =
            currentLanguage === "sv"
                ? "en"
                : "sv";

        localStorage.setItem(
            "redroom-language",
            nextLanguage
        );

        window.location.reload();
    });
}

document
    .querySelectorAll("[data-sv][data-en]")
    .forEach((element) => {
        element.textContent =
            element.dataset[currentLanguage];
    });

document
    .querySelectorAll("[data-sv-src][data-en-src]")
    .forEach((image) => {
        image.src =
            currentLanguage === "en"
                ? image.dataset.enSrc
                : image.dataset.svSrc;
    });

const description =
    document.querySelector('meta[name="description"]');

if (currentLanguage === "en") {
    document.title =
        "Corporate events & private bookings | Red room Uppsala";

    if (description) {
        description.setAttribute(
            "content",
            "Corporate events, private bookings and private karaoke at Red room in Uppsala. For company parties, kickoffs, birthdays and groups. Karaoke Sunday to Wednesday."
        );
    }
} else {
    document.title =
        "Företagsevent & privatbokning | Red room Uppsala";

    if (description) {
        description.setAttribute(
            "content",
            "Företagsevent, privatbokning och privat karaoke på Red room i Uppsala. För företagsfest, kickoff, födelsedag och grupper. Karaoke söndag–onsdag."
        );
    }
}

/* ---------- Sliding navbar ---------- */

const navbar = document.querySelector(".navbar");

if (navbar) {
    let lastScrollY = Math.max(window.scrollY, 0);

    window.addEventListener(
        "scroll",
        () => {
            const currentScrollY = Math.max(window.scrollY, 0);

            if (currentScrollY <= navbar.offsetHeight) {
                navbar.classList.remove("navbar-hidden");
            } else if (currentScrollY > lastScrollY + 30) {
                navbar.classList.add("navbar-hidden");
            } else if (currentScrollY < lastScrollY - 30) {
                navbar.classList.remove("navbar-hidden");
            }

            lastScrollY = currentScrollY;
        },
        { passive: true }
    );
}
