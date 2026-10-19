const strip = document.getElementById("reel-strip");
const status = document.getElementById("reel-status");

const viewer = document.getElementById("reel-viewer");
const video = document.getElementById("reel-video");
const closeButton = document.getElementById("reel-close");
const previousButton = document.getElementById("reel-prev");
const nextButton = document.getElementById("reel-next");
const instagramLink = document.getElementById("reel-instagram-link");

let reels = [];
let currentIndex = -1;

let reelAutoScroll;
let reelPaused = false;

const desktop = window.matchMedia("(min-width: 751px)");

async function loadReels() {
    try {
        const response = await fetch("/api/instagram");

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const data = await response.json();

        if (!data.ok || !data.reels || data.reels.length === 0) {
            throw new Error("No Reels found");
        }

        reels = data.reels.slice(0, 10);

        strip.innerHTML = "";

        reels.forEach((reel, index) => {
            const button = document.createElement("button");

            button.className = "reel-preview";
            button.type = "button";
            button.setAttribute(
                "aria-label",
                `Spela Reel ${index + 1} från Red room`
            );

            const image = document.createElement("img");
            image.src = reel.thumbnail;
            image.alt = "";
            image.loading = "lazy";

            const play = document.createElement("span");
            play.className = "reel-play";
            play.setAttribute("aria-hidden", "true");
            play.textContent = "▶";

            button.append(image, play);

            button.addEventListener("click", () => {
                openViewer(index);
            });

            strip.appendChild(button);
        });

        status.hidden = true;

        startReelAutoScroll();
    } catch (error) {
        console.error(error);

        status.textContent =
            document.documentElement.lang === "en"
                ? "Could not load Reels."
                : "Kunde inte ladda Reels.";
    }
}

function startReelAutoScroll() {
    window.clearInterval(reelAutoScroll);

    if (!desktopReels.matches || reels.length === 0) {
        return;
    }

    reelAutoScroll = window.setInterval(() => {
        if (reelPaused) {
            return;
        }

        const firstReel = strip.querySelector(".reel-preview");

        if (!firstReel) {
            return;
        }

        const reelWidth =
            firstReel.getBoundingClientRect().width;

        const reelGap =
            parseFloat(getComputedStyle(strip).columnGap) || 0;

        const reelStep = reelWidth + reelGap;

        const nearEnd =
            strip.scrollLeft + strip.clientWidth >=
            strip.scrollWidth - reelStep / 2;

        if (nearEnd) {
            strip.scrollTo({
                left: 0,
                behavior: "smooth"
            });
        } else {
            strip.scrollBy({
                left: reelStep,
                behavior: "smooth"
            });
        }
    }, 5000);
}

function showReel(index) {
    if (reels.length === 0) {
        return;
    }

    currentIndex =
        ((index % reels.length) + reels.length) %
        reels.length;

    const reel = reels[currentIndex];

    video.pause();
    video.src = reel.video;
    instagramLink.href = reel.instagram;
    video.load();

    video.play().catch(() => {});
}

function openViewer(index) {
    reelPaused = true;

    viewer.hidden = false;
    document.body.classList.add("reel-viewer-open");

    showReel(index);
}

function closeViewer() {
    video.pause();
    video.removeAttribute("src");
    video.load();

    viewer.hidden = true;
    document.body.classList.remove("reel-viewer-open");

    currentIndex = -1;
    reelPaused = false;
}

function previousReel() {
    showReel(currentIndex - 1);
}

function nextReel() {
    showReel(currentIndex + 1);
}

previousButton.addEventListener("click", previousReel);
nextButton.addEventListener("click", nextReel);
closeButton.addEventListener("click", closeViewer);

viewer.addEventListener("click", (event) => {
    if (event.target.hasAttribute("data-close-reel")) {
        closeViewer();
    }
});

document.addEventListener("keydown", (event) => {
    if (viewer.hidden) {
        return;
    }

    if (event.key === "Escape") {
        closeViewer();
    }

    if (event.key === "ArrowLeft") {
        previousReel();
    }

    if (event.key === "ArrowRight") {
        nextReel();
    }
});

strip.addEventListener("mouseenter", () => {
    reelPaused = true;
});

strip.addEventListener("mouseleave", () => {
    reelPaused = false;
});

strip.addEventListener("pointerdown", () => {
    reelPaused = true;
});

strip.addEventListener("pointerup", () => {
    reelPaused = false;
});

desktopReels.addEventListener(
    "change",
    startReelAutoScroll
);

loadReels();
