/* -----------------------------------------
   STORAGE
----------------------------------------- */
function loadEvents() {
  return JSON.parse(localStorage.getItem("shared_calendar")) || [];
}

function saveEvents(events) {
  localStorage.setItem("shared_calendar", JSON.stringify(events));
}

/* -----------------------------------------
   DATE STATE
----------------------------------------- */
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

const monthLabel = document.getElementById("monthLabel");
const calendarGrid = document.getElementById("calendarGrid");
const eventPopup = document.getElementById("eventPopup");
const popupContent = document.getElementById("popupContent");
const weekView = document.getElementById("weekView");

/* -----------------------------------------
   RENDER MONTH VIEW
----------------------------------------- */
function renderCalendar() {
  calendarGrid.innerHTML = "";

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  monthLabel.textContent = new Date(currentYear, currentMonth).toLocaleString(
    "default",
    { month: "long", year: "numeric" },
  );

  const events = loadEvents();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.classList.add("day-cell");
    calendarGrid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    cell.classList.add("day-cell");

    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0",
    )}-${String(day).padStart(2, "0")}`;
    cell.dataset.date = dateStr;

    cell.addEventListener("dragover", (e) => {
      e.preventDefault();
      cell.classList.add("drag-over");
    });

    cell.addEventListener("dragleave", () => {
      cell.classList.remove("drag-over");
    });

    cell.addEventListener("drop", (e) => {
      cell.classList.remove("drag-over");
      const eventId = e.dataTransfer.getData("eventId");
      moveEvent(eventId, dateStr);
    });

    const num = document.createElement("div");
    num.classList.add("day-number");
    num.textContent = day;
    cell.appendChild(num);

    events.forEach((ev) => {
      if (ev.date === dateStr) {
        const dot = document.createElement("div");
        dot.classList.add("event-dot");
        dot.style.background = ev.color;
        dot.dataset.id = ev.id;

        dot.onclick = () => showEventPopup(ev);

        dot.draggable = true;
        dot.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("eventId", ev.id);
          dot.classList.add("dragging");
        });
        dot.addEventListener("dragend", () => {
          dot.classList.remove("dragging");
        });

        cell.appendChild(dot);
      }
    });

    calendarGrid.appendChild(cell);
  }
}

/* -----------------------------------------
   WEEK VIEW
----------------------------------------- */
function renderWeekView() {
  if (weekView.style.display !== "grid") return;

  weekView.innerHTML = "";

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const events = loadEvents();

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);

    const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(day.getDate()).padStart(2, "0")}`;

    const cell = document.createElement("div");
    cell.classList.add("week-day");

    const title = document.createElement("div");
    title.classList.add("week-day-title");
    title.textContent = day.toLocaleString("default", { weekday: "long" });
    cell.appendChild(title);

    const dayEvents = events.filter((ev) => ev.date === dateStr);

    dayEvents.forEach((ev) => {
      const dot = document.createElement("div");
      dot.classList.add("event-dot");
      dot.style.background = ev.color;
      dot.onclick = () => showEventPopup(ev);
      cell.appendChild(dot);
    });

    weekView.appendChild(cell);
  }
}

/* -----------------------------------------
   WEEK VIEW TOGGLE
----------------------------------------- */
document.getElementById("toggleWeekView").onclick = () => {
  if (weekView.style.display === "grid") {
    weekView.style.display = "none";
  } else {
    weekView.style.display = "grid";
    renderWeekView();
  }
};

/* -----------------------------------------
   MONTH ANIMATION
----------------------------------------- */
function animateMonthChange(callback) {
  calendarGrid.classList.add("fade-out");

  setTimeout(() => {
    callback();
    renderCalendar();

    calendarGrid.classList.remove("fade-out");
    calendarGrid.classList.add("fade-in");

    setTimeout(() => {
      calendarGrid.classList.remove("fade-in");
    }, 350);
  }, 350);
}

document.getElementById("prevMonth").onclick = () => {
  animateMonthChange(() => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
  });
};

document.getElementById("nextMonth").onclick = () => {
  animateMonthChange(() => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
  });
};

/* -----------------------------------------
   MOVE EVENT
----------------------------------------- */
function moveEvent(id, newDate) {
  const events = loadEvents();
  const ev = events.find((e) => e.id === id);
  if (!ev) return;

  ev.date = newDate;
  saveEvents(events);

  renderCalendar();
  renderWeekView();
  displayEvents();
}

/* -----------------------------------------
   EVENT LIST + SEARCH
----------------------------------------- */
function displayEvents(filter = "") {
  const list = document.getElementById("eventList");
  list.innerHTML = "";

  const events = loadEvents()
    .filter(
      (ev) =>
        ev.title.toLowerCase().includes(filter.toLowerCase()) ||
        ev.category.toLowerCase().includes(filter.toLowerCase()),
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  events.forEach((ev) => {
    const div = document.createElement("div");
    div.classList.add("event-item");

    div.innerHTML = `
      <h3 style="color:${ev.color}">${ev.title}</h3>
      <p><strong>Date:</strong> ${ev.date}</p>
      <p><strong>Time:</strong> ${ev.time}</p>
      <p><strong>Category:</strong> ${ev.category}</p>
      <button class="delete-btn" data-id="${ev.id}">Delete</button>
    `;

    div.querySelector(".delete-btn").onclick = () => deleteEvent(ev.id);

    list.appendChild(div);
  });
}

document.getElementById("searchBar").addEventListener("input", (e) => {
  displayEvents(e.target.value);
});

/* -----------------------------------------
   DELETE EVENT
----------------------------------------- */
function deleteEvent(id) {
  let events = loadEvents();
  events = events.filter((e) => e.id !== id);
  saveEvents(events);

  renderCalendar();
  renderWeekView();
  displayEvents();
  eventPopup.style.display = "none";
}

/* -----------------------------------------
   POPUP
----------------------------------------- */
document.getElementById("closePopup").onclick = () => {
  eventPopup.style.display = "none";
};

function showEventPopup(ev) {
  popupContent.innerHTML = `
    <h3 style="color:${ev.color}">${ev.title}</h3>
    <p><strong>Date:</strong> ${ev.date}</p>
    <p><strong>Time:</strong> ${ev.time}</p>
    <p><strong>Category:</strong> ${ev.category}</p>
    <button class="delete-btn" onclick="deleteEvent('${ev.id}')">Delete Event</button>
  `;
  eventPopup.style.display = "block";
}

/* -----------------------------------------
   SAVE EVENT
----------------------------------------- */
document.getElementById("saveEvent").onclick = () => {
  const date = document.getElementById("eventDate").value;
  const time = document.getElementById("eventTime").value;
  const title = document.getElementById("eventTitle").value;
  const category = document.getElementById("eventCategory").value;
  const color = document.getElementById("eventColor").value;

  if (!date || !title || !time) return;

  const events = loadEvents();
  const id = crypto.randomUUID();

  events.push({ id, date, time, title, category, color });
  saveEvents(events);

  displayEvents();
  renderCalendar();
  renderWeekView();
};

/* -----------------------------------------
   INIT
----------------------------------------- */
renderCalendar();
displayEvents();
