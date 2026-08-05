const openingHoursList = document.getElementById("opening-hours-list");
const karaokeSchedule = document.getElementById("karaoke-schedule");

const dayNames = [
    "SÖNDAG",
    "MÅNDAG",
    "TISDAG",
    "ONSDAG",
    "TORSDAG",
    "FREDAG",
    "LÖRDAG"
];

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

    const statusText = isOpen ? "ÖPPET" : "ÖPPNAR";
    const currentDay = dayNames[dayIndex];
    const currentClosingHour = closingHours[dayIndex];
    const currentTime = `19 – 0${currentClosingHour}`;

    openingHoursList.innerHTML = `
        <div class="hours-row is-today">
            <div class="hours-current-day">
                <span class="hours-open">${statusText}</span>
                <span class="hours-day">${currentDay}</span>
            </div>

            <span class="hours-time">${currentTime}</span>
        </div>

        <div class="hours-row hours-summary-row">
            <span class="hours-day">SÖNDAG – TORSDAG</span>
            <span class="hours-time">19 – 02</span>
        </div>

        <div class="hours-row hours-summary-row">
            <span class="hours-day">FREDAG – LÖRDAG</span>
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
    let statusText;

    if (previousKaraokeStillLive) {
        displayedDayIndex = previousDayIndex;
        statusText = "LIVE";
    } else if (todayHasKaraoke) {
        displayedDayIndex = dayIndex;

        const startsAt =
            karaokeStartHours[dayIndex] * 60;

        statusText =
            minutesNow >= startsAt
                ? "LIVE"
                : "BÖRJAR";
    } else {
        displayedDayIndex = getNextKaraokeDay(dayIndex);
        statusText = "BÖRJAR";
    }

    const displayedDay = dayNames[displayedDayIndex];
    const displayedStart =
        karaokeStartHours[displayedDayIndex];

    karaokeSchedule.innerHTML = `
        <div class="karaoke-row is-current">
            <div class="karaoke-current-day">
                <span class="karaoke-status">${statusText}</span>
                <span class="karaoke-day">${displayedDay}</span>
            </div>

            <span class="karaoke-time">${displayedStart}</span>
        </div>

        <div class="karaoke-row karaoke-summary-row">
            <span class="karaoke-day">ONSDAG – TORSDAG</span>
            <span class="karaoke-time">21</span>
        </div>

        <div class="karaoke-row karaoke-summary-row">
            <span class="karaoke-day">FREDAG – LÖRDAG</span>
            <span class="karaoke-time">22</span>
        </div>
    `;
}

function renderDynamicInformation() {
    renderOpeningHours();
    renderKaraokeSchedule();
}

renderDynamicInformation();

window.setInterval(renderDynamicInformation, 60000);
