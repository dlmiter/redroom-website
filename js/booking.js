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

document.documentElement.lang = currentLanguage;

document
    .querySelectorAll("[data-sv][data-en]")
    .forEach((element) => {
        element.textContent =
            element.dataset[currentLanguage];
    });

const description =
    document.querySelector('meta[name="description"]');

if (currentLanguage === "en") {
    document.title =
        "Private bookings | Red room Uppsala";

    if (description) {
        description.setAttribute(
            "content",
            "Book Red room privately in Uppsala. Reserve the entire venue for larger groups or arrange private karaoke Sunday to Tuesday."
        );
    }
} else {
    document.title =
        "Boka Red room | Privatbokning i Uppsala";

    if (description) {
        description.setAttribute(
            "content",
            "Boka Red room privat i Uppsala. Abonnera hela Red room för större sällskap eller boka privat karaoke söndag till tisdag."
        );
    }
}
