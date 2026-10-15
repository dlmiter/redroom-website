const preview = document.getElementById("reel-preview");
const thumbnail = document.getElementById("reel-thumbnail");
const status = document.getElementById("reel-status");

const viewer = document.getElementById("reel-viewer");
const video = document.getElementById("reel-video");
const closeButton = document.getElementById("reel-close");
const instagramLink = document.getElementById("reel-instagram-link");

let currentReel = null;

async function loadLatestReel() {
    try {
        const response = await fetch("/api/instagram");

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const data = await response.json();

        if (!data.ok || !data.reels || data.reels.length === 0) {
            throw new Error("No Reels found");
        }

        currentReel = data.reels[0];

        thumbnail.src = currentReel.thumbnail;
        preview.disabled = false;
        status.hidden = true;
    } catch (error) {
        console.error(error);

        status.textContent = "Kunde inte ladda Reel.";
        preview.disabled = true;
    }
}

function openViewer() {
    if (!currentReel) {
        return;
    }

    video.src = currentReel.video;

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
}

preview.addEventListener("click", openViewer);
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

instagramLink.href = "https://www.instagram.com/redroom_uppsala/";

loadLatestReel();
