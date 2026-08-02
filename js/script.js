const openingHours = [
    { day: "SÖNDAG", time: "19 – 02" },
    { day: "MÅNDAG", time: "19 – 02" },
    { day: "TISDAG", time: "19 – 02" },
    { day: "ONSDAG", time: "19 – 02" },
    { day: "TORSDAG", time: "19 – 02" },
    { day: "FREDAG", time: "19 – 03" },
    { day: "LÖRDAG", time: "19 – 03" }
];

const hoursList = document.getElementById("opening-hours-list");

if (hoursList) {
    const todayIndex = new Date().getDay();

    const orderedHours = [
        ...openingHours.slice(todayIndex),
        ...openingHours.slice(0, todayIndex)
    ];

    orderedHours.forEach((entry, index) => {
        const row = document.createElement("div");
        row.className = "hours-row";

        if (index === 0) {
            row.classList.add("is-today");
        }

        row.innerHTML = `
            <span class="hours-day">${entry.day}</span>
            <span class="hours-time">${entry.time}</span>
        `;

        hoursList.appendChild(row);
    });
}
