const strip = document.getElementById("reel-strip");
const status = document.getElementById("reel-status");

const viewer = document.getElementById("reel-viewer");
const video = document.getElementById("reel-video");
const closeButton = document.getElementById("reel-close");
const instagramLink = document.getElementById("reel-instagram-link");

let currentReel = null;

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

        const reels = data.reels.slice(0, 8);

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
                openViewer(reel);
            });

            strip.appendChild(button);
        });

        status.hidden = true;
    } catch (error) {
        console.error(error);
        status.textContent = "Kunde inte ladda Reels.";
    }
}

function openViewer(reel) {
    currentReel = reel;

    video.src = reel.video;
    instagramLink.href = reel.instagram;

    viewer.hidden = false;
    document.body.classList.add("reel-viewer-open");

    video.play().catch(() => {});
}

function closeViewer() {
    video.pause();
    video.removeAttribute("src");
    video.load();

    viewer.hidden = true;
    document.body.classList.remove("reel-viewer-open");

    currentReel = null;
}

closeButton.addEventListener("click", closeViewer);

viewer.addEventListener("click", (event) => {
    if (event.target.hasAttribute("data-close-reel")) {
        closeViewer();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !viewer.hidden) {
        closeViewer();
    }
});

loadReels();
