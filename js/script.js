const openingHoursList = document.getElementById("opening-hours-list");
const karaokeSchedule = document.getElementById("karaoke-schedule");
const languageToggle = document.getElementById("language-toggle");

let currentLanguage = "sv";

const dayNames = {
    sv: [
        "SÖNDAG",
        "MÅNDAG",
        "TISDAG",
        "ONSDAG",
        "TORSDAG",
        "FREDAG",
        "LÖRDAG"
    ],

    en: [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY"
    ]
};

const dayIndexes = {
    söndag: 0,
    måndag: 1,
    tisdag: 2,
    onsdag: 3,
    torsdag: 4,
    fredag: 5,
    lördag: 6
};

const closingHours = {
    0: 2,
    1: 2,
    2: 2,
    3: 2,
    4: 2,
    5: 3,
    6: 3
};

const karaokeStartHours = {
    3: 21,
    4: 21,
    5: 22,
    6: 22
};

function getStockholmTime() {
    const now = new Date();

    const weekday = new Intl.DateTimeFormat("sv-SE", {
        weekday: "long",
        timeZone: "Europe/Stockholm"
    })
        .format(now)
        .toLowerCase();

    const timeParts = new Intl.DateTimeFormat("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone: "Europe/Stockholm"
    }).formatToParts(now);

    const hour = Number(
        timeParts.find((part) => part.type === "hour").value
    );

    const minute = Number(
        timeParts.find((part) => part.type === "minute").value
    );

    return {
        dayIndex: dayIndexes[weekday],
        hour,
        minute
    };
}

function renderOpeningHours() {
    if (!openingHoursList) {
        return;
    }

    const { dayIndex, hour, minute } = getStockholmTime();

    const minutesNow = (hour * 60) + minute;
    const previousDayIndex = (dayIndex + 6) % 7;

    const opensAt = 19 * 60;
    const previousDayClosesAt =
        closingHours[previousDayIndex] * 60;

    const isOpen =
        minutesNow >= opensAt ||
        minutesNow < previousDayClosesAt;

    const statusText =
        currentLanguage === "sv"
            ? (isOpen ? "ÖPPET" : "ÖPPNAR")
            : (isOpen ? "OPEN" : "OPENS");

    const currentDay =
        dayNames[currentLanguage][dayIndex];

    const currentClosingHour =
        closingHours[dayIndex];

    const currentTime =
        `19 – 0${currentClosingHour}`;

    const firstSummary =
        currentLanguage === "sv"
            ? "SÖNDAG – TORSDAG"
            : "SUNDAY – THURSDAY";

    const secondSummary =
        currentLanguage === "sv"
            ? "FREDAG – LÖRDAG"
            : "FRIDAY – SATURDAY";

    openingHoursList.innerHTML = `
        <div class="hours-row is-today">
            <div class="hours-current-day">
                <span class="hours-open">${statusText}</span>
                <span class="hours-day">${currentDay}</span>
            </div>

            <span class="hours-time">${currentTime}</span>
        </div>

        <div class="hours-row hours-summary-row">
            <span class="hours-day">${firstSummary}</span>
            <span class="hours-time">19 – 02</span>
        </div>

        <div class="hours-row hours-summary-row">
            <span class="hours-day">${secondSummary}</span>
            <span class="hours-time">19 – 03</span>
        </div>
    `;
}

function getNextKaraokeDay(dayIndex) {
    for (let offset = 0; offset < 7; offset += 1) {
        const candidateDay = (dayIndex + offset) % 7;

        if (karaokeStartHours[candidateDay] !== undefined) {
            return candidateDay;
        }
    }

    return 3;
}

function renderKaraokeSchedule() {
    if (!karaokeSchedule) {
        return;
    }

    const { dayIndex, hour, minute } = getStockholmTime();

    const minutesNow = (hour * 60) + minute;
    const previousDayIndex = (dayIndex + 6) % 7;

    const previousDayHadKaraoke =
        karaokeStartHours[previousDayIndex] !== undefined;

    const previousKaraokeStillLive =
        previousDayHadKaraoke &&
        minutesNow < (closingHours[previousDayIndex] * 60);

    const todayHasKaraoke =
        karaokeStartHours[dayIndex] !== undefined;

    let displayedDayIndex;
    let isLive = false;

    if (previousKaraokeStillLive) {
        displayedDayIndex = previousDayIndex;
        isLive = true;
    } else if (todayHasKaraoke) {
        displayedDayIndex = dayIndex;

        const startsAt =
            karaokeStartHours[dayIndex] * 60;

        isLive = minutesNow >= startsAt;
    } else {
        displayedDayIndex =
            getNextKaraokeDay(dayIndex);
    }

    const statusText =
        currentLanguage === "sv"
            ? (isLive ? "LIVE" : "BÖRJAR")
            : (isLive ? "LIVE" : "STARTS");

    const displayedDay =
        dayNames[currentLanguage][displayedDayIndex];

    const displayedStart =
        karaokeStartHours[displayedDayIndex];

    const firstSummary =
        currentLanguage === "sv"
            ? "ONSDAG – TORSDAG"
            : "WEDNESDAY – THURSDAY";

    const secondSummary =
        currentLanguage === "sv"
            ? "FREDAG – LÖRDAG"
            : "FRIDAY – SATURDAY";

    karaokeSchedule.innerHTML = `
        <div class="karaoke-row is-current">
            <div class="karaoke-current-day">
                <span class="karaoke-status">${statusText}</span>
                <span class="karaoke-day">${displayedDay}</span>
            </div>

            <span class="karaoke-time">${displayedStart}</span>
        </div>

        <div class="karaoke-row karaoke-summary-row">
            <span class="karaoke-day">${firstSummary}</span>
            <span class="karaoke-time">21</span>
        </div>

        <div class="karaoke-row karaoke-summary-row">
            <span class="karaoke-day">${secondSummary}</span>
            <span class="karaoke-time">22</span>
        </div>
    `;
}

function renderStaticLanguage() {
    const openingLink =
        document.querySelector('a[href="#oppettider"]');

    const contactLink =
        document.querySelector('a[href="#kontakt"]');

    const openingTitle =
        document.getElementById("opening-hours-title");

    const instagramTitle =
        document.getElementById("instagram-title");

    const footerHeadings =
        document.querySelectorAll(".footer-grid h2");

    const privacyLink =
        document.querySelector(".footer-bottom a");

    if (currentLanguage === "sv") {
        document.documentElement.lang = "sv";

        if (openingLink) {
            openingLink.textContent = "ÖPPETTIDER";
        }

        if (contactLink) {
            contactLink.textContent = "KONTAKT";
        }

        if (openingTitle) {
            openingTitle.textContent = "ÖPPETTIDER BAR";
        }

        if (instagramTitle) {
            instagramTitle.textContent = "FÖLJ TALANGERNA";
        }

        if (footerHeadings[0]) {
            footerHeadings[0].textContent = "KONTAKT";
        }

        if (footerHeadings[1]) {
            footerHeadings[1].textContent = "FÖLJ OSS";
        }

        if (privacyLink) {
            privacyLink.textContent = "Integritetspolicy";
        }

        if (languageToggle) {
            languageToggle.textContent = "🇬🇧";
            languageToggle.setAttribute(
                "aria-label",
                "Switch to English"
            );
        }
    } else {
        document.documentElement.lang = "en";

        if (openingLink) {
            openingLink.textContent = "OPENING HOURS";
        }

        if (contactLink) {
            contactLink.textContent = "CONTACT";
        }

        if (openingTitle) {
            openingTitle.textContent = "BAR HOURS";
        }

        if (instagramTitle) {
            instagramTitle.textContent = "FOLLOW THE SINGERS";
        }

        if (footerHeadings[0]) {
            footerHeadings[0].textContent = "CONTACT";
        }

        if (footerHeadings[1]) {
            footerHeadings[1].textContent = "FOLLOW US";
        }

        if (privacyLink) {
            privacyLink.textContent = "Privacy policy";
        }

        if (languageToggle) {
            languageToggle.textContent = "🇸🇪";
            languageToggle.setAttribute(
                "aria-label",
                "Byt till svenska"
            );
        }
    }
}

function renderEverything() {
    renderStaticLanguage();
    renderOpeningHours();
    renderKaraokeSchedule();
}

if (languageToggle) {
    languageToggle.addEventListener("click", () => {
        currentLanguage =
            currentLanguage === "sv"
                ? "en"
                : "sv";

        renderEverything();
    });
}

renderEverything();

window.setInterval(() => {
    renderOpeningHours();
    renderKaraokeSchedule();
}, 60000);

/* ---------- Gallery ---------- */

const galleryStrip = document.querySelector(".gallery-strip");
const galleryImages = document.querySelectorAll(".gallery-strip img");

if (galleryStrip && galleryImages.length > 0) {
    let galleryAutoScroll;
    let galleryPaused = false;

    const desktopGallery = window.matchMedia("(min-width: 751px)");

    function startGalleryAutoScroll() {
        window.clearInterval(galleryAutoScroll);

        if (!desktopGallery.matches) {
            return;
        }

        galleryAutoScroll = window.setInterval(() => {
            if (galleryPaused) {
                return;
            }

            const firstImage = galleryImages[0];
            const imageWidth = firstImage.getBoundingClientRect().width;

            const nearEnd =
                galleryStrip.scrollLeft + galleryStrip.clientWidth >=
                galleryStrip.scrollWidth - imageWidth / 2;

            if (nearEnd) {
                galleryStrip.scrollTo({
                    left: 0,
                    behavior: "smooth"
                });
            } else {
                galleryStrip.scrollBy({
                    left: imageWidth,
                    behavior: "smooth"
                });
            }
        }, 5000);
    }

    galleryStrip.addEventListener("mouseenter", () => {
        galleryPaused = true;
    });

    galleryStrip.addEventListener("mouseleave", () => {
        galleryPaused = false;
    });

    galleryStrip.addEventListener("pointerdown", () => {
        galleryPaused = true;
    });

    galleryStrip.addEventListener("pointerup", () => {
        galleryPaused = false;
    });

    galleryImages.forEach((image) => {
        image.setAttribute("tabindex", "0");
        image.setAttribute("role", "button");

        image.addEventListener("click", () => {
            openGalleryImage(image);
        });

        image.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openGalleryImage(image);
            }
        });
    });

    function openGalleryImage(image) {
        galleryPaused = true;

        const lightbox = document.createElement("div");
        lightbox.className = "gallery-lightbox";

        const enlargedImage = document.createElement("img");
        enlargedImage.src = image.src;
        enlargedImage.alt = image.alt;

        const closeButton = document.createElement("button");
        closeButton.className = "gallery-lightbox-close";
        closeButton.type = "button";
        closeButton.setAttribute("aria-label", "Stäng bild");
        closeButton.textContent = "×";

        lightbox.appendChild(enlargedImage);
        lightbox.appendChild(closeButton);

        document.body.appendChild(lightbox);
        document.body.classList.add("gallery-lightbox-open");

        function closeLightbox() {
            lightbox.remove();
            document.body.classList.remove("gallery-lightbox-open");
            galleryPaused = false;
            document.removeEventListener("keydown", handleEscape);
        }

        function handleEscape(event) {
            if (event.key === "Escape") {
                closeLightbox();
            }
        }

        closeButton.addEventListener("click", closeLightbox);

        lightbox.addEventListener("click", (event) => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener("keydown", handleEscape);
    }

    startGalleryAutoScroll();

    desktopGallery.addEventListener("change", startGalleryAutoScroll);
}
