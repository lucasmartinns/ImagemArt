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

// Array para armazenar eventos carregados do banco
let eventsArr = [];

// ---------- FUNÇÕES DE INTEGRAÇÃO COM O BACKEND ----------

localStorage.removeItem("events"); // Limpa qualquer vestígio salvo

// Busca todos os eventos do banco e atualiza eventsArr
async function fetchAllEvents() {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch("/listarEventos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Erro ao buscar eventos");
    const eventos = await res.json();
    // Agrupa eventos por dia/mês/ano para manter compatibilidade com a lógica do calendário
    eventsArr = [];
    eventos.forEach((ev) => {
      // Remove espaços e garante formato correto
      const dataLimpa = ev.data.trim();
      const [anoStr, mesStr, diaStr] = dataLimpa.split("-");
      const ano = parseInt(anoStr, 10);
      const mes = parseInt(mesStr, 10);
      const dia = parseInt(diaStr, 10);

      if (isNaN(ano) || isNaN(mes) || isNaN(dia)) {
        console.warn("Data inválida recebida do banco:", ev.data);
        return; // pula esse evento
      }

      const hora_inicio = ev.hora_inicio.slice(0, 5);
      const hora_fim = ev.hora_fim.slice(0, 5);
      const time = `${hora_inicio} - ${hora_fim}`;
      let obj = eventsArr.find(
        (e) => e.day === dia && e.month === mes && e.year === ano
      );
      if (!obj) {
        obj = { day: dia, month: mes, year: ano, events: [] };
        eventsArr.push(obj);
      }
      obj.events.push({
        id: ev.id,
        title: ev.nome,
        time,
        hora_inicio,
        hora_fim,
        data: ev.data,
      });
    });
  } catch (err) {
    showCustomAlert("Erro ao carregar eventos do calendário.");
    eventsArr = [];
  }
}

// Cria um novo evento no banco
async function createEvent({ nome, data, hora_inicio, hora_fim }) {
  const token = localStorage.getItem("token");
  const res = await fetch("/criarEvento", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nome, data, hora_inicio, hora_fim }),
  });
  if (!res.ok) throw new Error("Erro ao criar evento");
  return res.json();
}

// Atualiza um evento existente no banco
async function updateEvent(id, { nome, data, hora_inicio, hora_fim }) {
  const token = localStorage.getItem("token");
  const res = await fetch(`/atualizarEvento/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nome, data, hora_inicio, hora_fim }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar evento");
  return res.json();
}

// Deleta um evento do banco
async function deleteEvent(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`/deletarEvento/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Erro ao deletar evento");
  return res.json();
}

// ---------- FUNÇÕES DO CALENDÁRIO ----------
async function initCalendar() {
  await fetchAllEvents();
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
      const sortedEvents = eventObj.events.sort((a, b) => {
        const startA = a.time.split(" - ")[0];
        const startB = b.time.split(" - ")[0];
        return startA.localeCompare(startB);
      });
      sortedEvents.forEach((event) => {
        eventsHTML += `
           <div class="event" data-event-id="${event.id}">
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
    eventsHTML = `<div class="no-event"><h3>Nenhuma Tarefa</h3></div>`;
  }
  eventsContainer.innerHTML = eventsHTML;

  const activeDayEl = document.querySelector(".day.active");
  if (activeDayEl) {
    if (hasAnyEvent) {
      activeDayEl.classList.add("event");
    } else {
      activeDayEl.classList.remove("event");
    }
  }
}

// ---------- NAVEGAÇÃO ESPECÍFICA DE DATA ----------
todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

dateInput.addEventListener("input", (e) => {
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

dateInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    gotoDate();
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

addEventSubmit.addEventListener("click", async () => {
  const eventTitle = addEventTitle.value,
    eventTimeFrom = addEventFrom.value;
  let eventTimeTo = addEventTo.value;

  if (!eventTitle || !eventTimeFrom || !eventTimeTo) {
    showCustomAlert("Por favor, preencha todos os campos");
    return;
  }

  if (!isValidTime(eventTimeFrom) || !isValidTime(eventTimeTo)) {
    showCustomAlert("Formato de Hora Inválido");
    return;
  }

  if (eventTimeTo === "00:00") {
    eventTimeTo = "23:59";
  }

  if (convertTime(eventTimeFrom) >= convertTime(eventTimeTo)) {
    showCustomAlert("O horário final não pode ser anterior ao inicial.");
    return;
  }

  // Verifica se já existe evento com mesmo nome, data e horário
  const dia = activeDay;
  const mes = month + 1;
  const ano = year;
  const dataStr = `${ano}-${String(mes).padStart(2, "0")}-${String(
    dia
  ).padStart(2, "0")}`;
  const existe = eventsArr.some(
    (eventObj) =>
      eventObj.day === dia &&
      eventObj.month === mes &&
      eventObj.year === ano &&
      eventObj.events.some((ev) => ev.title === eventTitle)
  );
  if (existe) {
    showCustomAlert("Evento já adicionado");
    return;
  }

  try {
    await createEvent({
      nome: eventTitle,
      data: dataStr,
      hora_inicio: convertTime(eventTimeFrom),
      hora_fim: convertTime(eventTimeTo),
    });
    addEventWrapper.classList.remove("active");
    clearEventForm();
    await initCalendar();
    highlightDay(dia);
    updateEvents(dia);
  } catch (err) {
    showCustomAlert("Erro ao criar evento.");
  }
});

eventsContainer.addEventListener("click", async function (e) {
  const eventElement = e.target.closest(".event");
  if (!eventElement) return;
  const eventTitleElement = eventElement.querySelector(".event-title");
  if (!eventTitleElement) return;
  const title = eventTitleElement.textContent.trim();

  // Busca o evento pelo título e dia/mês/ano
  const dia = activeDay;
  const mes = month + 1;
  const ano = year;
  const eventObj = eventsArr.find(
    (obj) => obj.day === dia && obj.month === mes && obj.year === ano
  );
  if (!eventObj) return;
  const event = eventObj.events.find((ev) => ev.title === title);
  if (!event) return;

  const confirmed = await showCustomConfirm(
    "Tem certeza de que deseja concluir este evento?"
  );
  if (!confirmed) return;

  try {
    await deleteEvent(event.id);
    await initCalendar();
    highlightDay(dia);
    updateEvents(dia);
  } catch (err) {
    showCustomAlert("Erro ao remover evento.");
  }
});

// ---------- MODAL DE TAREFAS PENDENTES ----------
document.addEventListener("DOMContentLoaded", () => {
  const viewPendingTasksBtn = document.querySelector(".view-pending-tasks-btn");
  const pendingTasksModal = document.getElementById("pendingTasksModal");
  const closePendingTasksBtn = pendingTasksModal.querySelector(".close-modal");

  viewPendingTasksBtn.addEventListener("click", () => {
    loadPendingTasks();
    pendingTasksModal.classList.add("active");
  });

  closePendingTasksBtn.addEventListener("click", () => {
    pendingTasksModal.classList.remove("active");
  });

  pendingTasksModal.addEventListener("click", (e) => {
    if (e.target === pendingTasksModal) {
      pendingTasksModal.classList.remove("active");
    }
  });
});

const pendingTasksContainer = document.getElementById("pendingTasksContainer");

async function loadPendingTasks() {
  await fetchAllEvents();
  let tasksHTML = "";
  if (eventsArr.length === 0) {
    tasksHTML = "<p>Sem Tarefas Pendentes</p>";
  } else {
    const sortedEvents = [...eventsArr].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      if (a.month !== b.month) return a.month - b.month;
      return a.day - b.day;
    });

    sortedEvents.forEach((eventObj) => {
      const day = String(eventObj.day).padStart(2, "0");
      const month = String(eventObj.month).padStart(2, "0");
      const year = String(eventObj.year).padStart(4, "0");
      const dateStr = `${day}/${month}/${year}`;

      const sortedDayEvents = [...eventObj.events].sort((a, b) => {
        const timeA = a.time.split(" - ")[0];
        const timeB = b.time.split(" - ")[0];
        return timeA.localeCompare(timeB);
      });

      sortedDayEvents.forEach((ev) => {
        const safeTitle = ev.title.replace(/"/g, "&quot;");
        tasksHTML += `
          <div class="pending-task" 
               data-event-id="${ev.id}"
               data-day="${eventObj.day}" 
               data-month="${eventObj.month}" 
               data-year="${eventObj.year}" 
               data-title="${safeTitle}">
            <div class="left-date">
              <h4>${ev.title}</h4>
              <span id="span1">${dateStr}</span>
              <span id="circle">•</span>
              <span id="span2">${ev.time}</span>
            </div>
            <div class="right-date">
              <i>✓</i>
            </div>            
          </div>`;
      });
    });
  }
  pendingTasksContainer.innerHTML = tasksHTML;
}

pendingTasksContainer.addEventListener("click", async (e) => {
  const taskDiv = e.target.closest(".pending-task");
  if (taskDiv) {
    const eventId = taskDiv.dataset.eventId;
    const day = parseInt(taskDiv.dataset.day, 10);

    const confirmed = await showCustomConfirm(
      "Tem certeza de que deseja concluir este evento?"
    );
    if (!confirmed) return;

    try {
      await deleteEvent(eventId);
      await loadPendingTasks();
      await initCalendar();
      highlightDay(day);
      updateEvents(day);
      taskDiv.classList.add("fade-out");
      setTimeout(() => {
        taskDiv.remove();
      }, 300);
    } catch (err) {
      showCustomAlert("Erro ao remover evento.");
    }
  }
});

// ---------- UTILITÁRIOS ----------
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

function convertTime(time) {
  const [h, m] = time.split(":");
  const hour = h.padStart(2, "0");
  const minute = m.padStart(2, "0");
  return `${hour}:${minute}`;
}

// ---------- EVENTOS DE NAVEGAÇÃO DOS MESES ----------
prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

// ---------- INICIALIZAÇÃO ----------
initCalendar();

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  let tipo = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      tipo = payload.tipo;
    } catch {
      tipo = null;
    }
  }
  if (!token || tipo !== 1) {
    window.location.href = "/home";
  }
});
