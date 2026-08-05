const openingHoursList = document.getElementById("opening-hours-list");

if (openingHoursList) {
    const currentDay = new Intl.DateTimeFormat("sv-SE", {
        weekday: "long",
        timeZone: "Europe/Stockholm"
    })
        .format(new Date())
        .toUpperCase();

    const currentTime =
        currentDay === "FREDAG" || currentDay === "LÖRDAG"
            ? "19 – 03"
            : "19 – 02";

    openingHoursList.innerHTML = `
        <div class="hours-row is-today">
            <div class="hours-current-day">
                <span class="hours-open">ÖPPET</span>
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
