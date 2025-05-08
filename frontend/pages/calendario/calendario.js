// ---------- DOM ELEMENT SELETORES & VARIÁVEIS GLOBAIS ----------
const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper"),
  addEventCloseBtn = document.querySelector(".close"),
  addEventTitle = document.querySelector(".event-name"),
  addEventFrom = document.querySelector(".event-time-from"),
  addEventTo = document.querySelector(".event-time-to"),
  addEventSubmit = document.querySelector(".add-event-btn");

let today = new Date(),
  activeDay,
  month = today.getMonth(),
  year = today.getFullYear();

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const eventsArr = [];
getEvents(); // Carrega eventos do localStorage

// ---------- FUNÇÕES DO CALENDÁRIO ----------
function initCalendar() {
  const firstDay = new Date(year, month, 1),
    lastDay = new Date(year, month + 1, 0),
    prevLastDay = new Date(year, month, 0),
    prevDays = prevLastDay.getDate(),
    lastDate = lastDay.getDate(),
    day = firstDay.getDay(),
    nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = `${months[month]} ${year}`;
  let days = "";

  // Dias do mês anterior
  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  // Dias do mês atual
  for (let i = 1; i <= lastDate; i++) {
    let hasEvent = eventsArr.some(
      (eventObj) =>
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
    );
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      days += `<div class="day today active ${
        hasEvent ? "event" : ""
      }">${i}</div>`;
    } else {
      days += `<div class="day ${hasEvent ? "event" : ""}">${i}</div>`;
    }
  }

  // Dias do próximo mês
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;
  addDayListener();
}

function prevMonth() {
  // Prevent navigating to year 0 or below
  if (month === 0 && year === 1) {
    showCustomAlert("Foque no presente");
    return;
  }
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

// ---------- EVENTOS NOS DIAS & NAVEGAÇÃO ----------
function addDayListener() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      const selectedDay = Number(e.target.innerHTML);
      // Caso dia de meses anteriores ou próximos
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        setTimeout(() => highlightDay(selectedDay), 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        setTimeout(() => highlightDay(selectedDay), 100);
      } else {
        clearActiveDay();
        e.target.classList.add("active");
        activeDay = selectedDay;
      }
      getActiveDay(selectedDay);
      updateEvents(selectedDay);
    });
  });
}

function clearActiveDay() {
  document
    .querySelectorAll(".day")
    .forEach((day) => day.classList.remove("active"));
}

function highlightDay(dayNumber) {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    if (
      !day.classList.contains("prev-date") &&
      day.innerHTML === dayNumber.toString()
    ) {
      clearActiveDay();
      day.classList.add("active");
    }
  });
}

// ---------- ATUALIZAÇÃO DE INFORMAÇÕES & EVENTOS ----------
function getActiveDay(dayNum) {
  const activeDate = new Date(year, month, dayNum);
  const dayName = weekdays[activeDate.getDay()];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = `${dayNum} ${months[month]} ${year}`;
}

function updateEvents(dayNum) {
  let eventsHTML = "";
  let hasAnyEvent = false;
  eventsArr.forEach((eventObj) => {
    if (
      eventObj.day === dayNum &&
      eventObj.month === month + 1 &&
      eventObj.year === year
    ) {
      hasAnyEvent = true;
      // Ordena os eventos pelo horário de início
      const sortedEvents = eventObj.events.sort((a, b) => {
        const startA = a.time.split(" - ")[0];
        const startB = b.time.split(" - ")[0];
        return startA.localeCompare(startB);
      });
      sortedEvents.forEach((event) => {
        eventsHTML += `
           <div class="event">
             <div class="title">
               <i class="fas fa-circle"></i>
               <h3 class="event-title">${event.title}</h3>
             </div>
             <div class="event-time">
               <span>${event.time}</span>
             </div>
           </div>`;
      });
    }
  });
  if (!hasAnyEvent) {
    eventsHTML = `<div class="no-event"><h3>Sem Eventos</h3></div>`;
  }
  eventsContainer.innerHTML = eventsHTML;

  // Atualiza a classe "event" do dia ativo
  const activeDayEl = document.querySelector(".day.active");
  if (activeDayEl) {
    if (hasAnyEvent) {
      activeDayEl.classList.add("event");
    } else {
      activeDayEl.classList.remove("event");
    }
  }
  saveEvents();
}

// ---------- NAVEGAÇÃO ESPECÍFICA DE DATA ----------
todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

dateInput.addEventListener("input", (e) => {
  // Permite somente números e barra
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) {
    dateInput.value += "/";
  }
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }
  if (e.inputType === "deleteContentBackward" && dateInput.value.length === 3) {
    dateInput.value = dateInput.value.slice(0, 2);
  }
});

gotoBtn.addEventListener("click", gotoDate);
function gotoDate() {
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2) {
    const m = parseInt(dateArr[0], 10);
    const y = parseInt(dateArr[1], 10);
    if (m > 0 && m < 13 && y >= 1 && dateArr[1].length === 4) {
      month = m - 1;
      year = y;
      initCalendar();
      return;
    }
  }
  showCustomAlert("Data inválida");
}

// ---------- ADICIONAR/REMOVER EVENTOS ----------
addEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.toggle("active");
});
addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
  clearEventForm();
});

// Formatação automática para os campos de horário (formato 24h)
function autoFormatTime(input) {
  let value = input.value.replace(/[^0-9:]/g, "");
  if (value.length === 2 && !value.includes(":")) {
    value = value + ":";
  }
  if (value.length > 5) {
    value = value.slice(0, 5);
  }
  input.value = value;
}
addEventFrom.addEventListener("input", () => autoFormatTime(addEventFrom));
addEventTo.addEventListener("input", () => autoFormatTime(addEventTo));

addEventSubmit.addEventListener("click", () => {
  const eventTitle = addEventTitle.value,
    eventTimeFrom = addEventFrom.value,
    eventTimeTo = addEventTo.value;

  if (!eventTitle || !eventTimeFrom || !eventTimeTo) {
    showCustomAlert("Por favor, preencha todos os campos");
    return;
  }

  if (!isValidTime(eventTimeFrom) || !isValidTime(eventTimeTo)) {
    showCustomAlert("Formato de Hora Inválido");
    return;
  }

  if (convertTime(eventTimeFrom) >= convertTime(eventTimeTo)) {
    showCustomAlert("O horário final não pode ser anterior ao inicial.");
    return;
  }

  // Verifica se o evento já existe
  let eventExist = eventsArr.some((eventObj) => {
    if (
      eventObj.day === activeDay &&
      eventObj.month === month + 1 &&
      eventObj.year === year
    ) {
      return eventObj.events.some((ev) => ev.title === eventTitle);
    }
    return false;
  });
  if (eventExist) {
    showCustomAlert("Evento já adicionado");
    return;
  }

  const newEvent = {
    title: eventTitle,
    time: `${convertTime(eventTimeFrom)} - ${convertTime(eventTimeTo)}`,
  };
  let eventAdded = false;
  eventsArr.forEach((eventObj) => {
    if (
      eventObj.day === activeDay &&
      eventObj.month === month + 1 &&
      eventObj.year === year
    ) {
      eventObj.events.push(newEvent);
      eventAdded = true;
    }
  });
  if (!eventAdded) {
    eventsArr.push({
      day: activeDay,
      month: month + 1,
      year: year,
      events: [newEvent],
    });
  }
  addEventWrapper.classList.remove("active");
  clearEventForm();
  updateEvents(activeDay);
  const activeDayEl = document.querySelector(".day.active");
  if (activeDayEl && !activeDayEl.classList.contains("event")) {
    activeDayEl.classList.add("event");
  }
});

eventsContainer.addEventListener("click", async (e) => {
  if (e.target.classList.contains("event") || e.target.closest(".event")) {
    const confirm = await showCustomConfirm(
      "Tem certeza de que deseja concluir este evento?"
    );
    if (confirm) {
      const eventTitle = e.target
        .closest(".event")
        .querySelector(".event-title").innerText;
      eventsArr.forEach((eventObj, indexObj) => {
        if (
          eventObj.day === activeDay &&
          eventObj.month === month + 1 &&
          eventObj.year === year
        ) {
          eventObj.events = eventObj.events.filter(
            (ev) => ev.title !== eventTitle
          );
          if (eventObj.events.length === 0) {
            eventsArr.splice(indexObj, 1);
          }
        }
      });
      updateEvents(activeDay);
    }
  }
});

// Tarefas Pendentes
const viewPendingTasksBtn = document.querySelector(".view-pending-tasks-btn");
const pendingTasksModal = document.getElementById("pendingTasksModal");
const closePendingTasksBtn = pendingTasksModal.querySelector(".close-modal");
const pendingTasksContainer = pendingTasksModal.querySelector(
  "#pendingTasksContainer"
);

viewPendingTasksBtn.addEventListener("click", () => {
  loadPendingTasks();
  pendingTasksModal.classList.add("active");
});

closePendingTasksBtn.addEventListener("click", () => {
  pendingTasksModal.classList.remove("active");
});

// Fechar modal ao clicar fora do conteúdo
pendingTasksModal.addEventListener("click", (e) => {
  if (e.target === pendingTasksModal) {
    pendingTasksModal.classList.remove("active");
  }
});

function loadPendingTasks() {
  let tasksHTML = "";
  if (eventsArr.length === 0) {
    tasksHTML = "<p>Sem Tarefas Pendentes</p>";
  } else {
    eventsArr.forEach((eventObj) => {
      const dateStr = `${eventObj.day}/${eventObj.month}/${eventObj.year}`;
      eventObj.events.forEach((ev) => {
        tasksHTML += `
          <div class="pending-task">
            <h4>${ev.title}</h4>
            <span>${dateStr} - ${ev.time}</span>
          </div>`;
      });
    });
  }
  pendingTasksContainer.innerHTML = tasksHTML;
}

// ---------- UTILITÁRIOS & ARMAZENAMENTO ----------
function clearEventForm() {
  addEventTitle.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";
}

function isValidTime(timeStr) {
  const timeArr = timeStr.split(":");
  if (timeArr.length !== 2) return false;
  const hour = parseInt(timeArr[0], 10),
    minute = parseInt(timeArr[1], 10);
  return hour >= 0 && hour < 24 && minute >= 0 && minute < 60;
}

// Atualizada para retornar o horário em formato 24h com zero preenchido
function convertTime(time) {
  const [h, m] = time.split(":");
  const hour = h.padStart(2, "0");
  const minute = m.padStart(2, "0");
  return `${hour}:${minute}`;
}

function saveEvents() {
  localStorage.setItem("events", JSON.stringify(eventsArr));
}

function getEvents() {
  const eventsFromStorage = localStorage.getItem("events");
  if (eventsFromStorage) {
    eventsArr.push(...JSON.parse(eventsFromStorage));
  }
}

// ---------- EVENTOS DE NAVEGAÇÃO DOS MESES ----------
prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

// ---------- INICIALIZAÇÃO ----------
initCalendar();
