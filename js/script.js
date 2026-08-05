const openingHoursList = document.getElementById("opening-hours-list");

if (openingHoursList) {
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

    function getStockholmTime() {
        const weekday = new Intl.DateTimeFormat("sv-SE", {
            weekday: "long",
            timeZone: "Europe/Stockholm"
        })
            .format(new Date())
            .toLowerCase();

        const timeParts = new Intl.DateTimeFormat("sv-SE", {
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23",
            timeZone: "Europe/Stockholm"
        }).formatToParts(new Date());

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

    renderOpeningHours();

    window.setInterval(renderOpeningHours, 60000);
}
