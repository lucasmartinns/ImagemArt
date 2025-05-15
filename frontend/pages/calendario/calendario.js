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
    eventsHTML = `<div class="no-event"><h3>Nenhuma Tarefa</h3></div>`;
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

eventsContainer.addEventListener("click", async function (e) {
  // Se o clique foi dentro de um evento
  const eventElement = e.target.closest(".event");
  if (!eventElement) {
    return;
  }

  // Obter o título do evento
  const eventTitleElement = eventElement.querySelector(".event-title");
  if (!eventTitleElement) {
    return;
  }

  const title = eventTitleElement.textContent.trim();

  // Confirmar com o usuário
  const confirmed = await showCustomConfirm(
    "Tem certeza de que deseja concluir este evento?"
  );
  if (!confirmed) {
    return;
  }

  // Variável para acompanhar se o evento foi removido
  let eventRemoved = false;

  // Iterar através de cada objeto de evento
  for (let i = 0; i < eventsArr.length; i++) {
    const eventObj = eventsArr[i];

    // Verificar se encontramos o dia correto
    if (
      eventObj.day === activeDay &&
      eventObj.month === month + 1 &&
      eventObj.year === year
    ) {
      // Procurar o evento pelo título
      const initialLength = eventObj.events.length;
      const eventsToKeep = [];

      // Busca manual para localizar o evento exato
      for (let j = 0; j < eventObj.events.length; j++) {
        const event = eventObj.events[j];

        if (event.title.trim() === title) {
          eventRemoved = true;
          // Não adicionar ao array de eventos para manter
        } else {
          eventsToKeep.push(event);
        }
      }

      // Atualizar a lista de eventos
      eventObj.events = eventsToKeep;

      // Se não houver mais eventos, remover o objeto do dia
      if (eventObj.events.length === 0) {
        eventsArr.splice(i, 1);
      }

      // Uma vez que encontramos o dia, não precisamos continuar procurando
      break;
    }
  }

  if (eventRemoved) {
    updateEvents(activeDay);
    saveEvents();
  }
});

// Envolver inicialização do modal dentro do DOMContentLoaded
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

  // Fechar modal ao clicar fora do conteúdo
  pendingTasksModal.addEventListener("click", (e) => {
    if (e.target === pendingTasksModal) {
      pendingTasksModal.classList.remove("active");
    }
  });
});

// Tarefas Pendentes
const pendingTasksContainer = document.getElementById("pendingTasksContainer");

// Função para atualizar o indicador de evento em qualquer dia do calendário
function updateEventIndicator(day) {
  const dayElements = document.querySelectorAll(
    ".day:not(.prev-date):not(.next-date)"
  );

  // Encontrar o elemento do dia específico
  const dayElement = Array.from(dayElements).find(
    (el) => parseInt(el.innerText, 10) === day
  );

  if (dayElement) {
    // Verificar se ainda existem eventos para este dia
    const hasEvent = eventsArr.some(
      (eventObj) =>
        eventObj.day === day &&
        eventObj.month === month + 1 &&
        eventObj.year === year &&
        eventObj.events.length > 0
    );

    // Atualizar a classe "event" com base na existência de eventos
    if (hasEvent) {
      dayElement.classList.add("event");
    } else {
      dayElement.classList.remove("event");
    }
  }
}

function loadPendingTasks() {
  let tasksHTML = "";
  if (eventsArr.length === 0) {
    tasksHTML = "<p>Sem Tarefas Pendentes</p>";
  } else {
    // Ordenar os eventos por data (mais próximos primeiro)
    const sortedEvents = [...eventsArr].sort((a, b) => {
      // Comparar anos
      if (a.year !== b.year) return a.year - b.year;
      // Comparar meses
      if (a.month !== b.month) return a.month - b.month;
      // Comparar dias
      return a.day - b.day;
    });

    sortedEvents.forEach((eventObj) => {
      const day = String(eventObj.day).padStart(2, "0");
      const month = String(eventObj.month).padStart(2, "0");
      const year = String(eventObj.year).padStart(4, "0");
      const dateStr = `${day}/${month}/${year}`;

      // Ordenar eventos do dia por horário
      const sortedDayEvents = [...eventObj.events].sort((a, b) => {
        const timeA = a.time.split(" - ")[0];
        const timeB = b.time.split(" - ")[0];
        return timeA.localeCompare(timeB);
      });

      sortedDayEvents.forEach((ev) => {
        // Escapar possíveis caracteres especiais no título para evitar problemas com HTML
        const safeTitle = ev.title.replace(/"/g, "&quot;");

        // Adicionar data-* atributos para permitir identificação dos eventos
        tasksHTML += `
          <div class="pending-task" 
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

// Função para atualizar o status de evento do dia (separa a lógica de updateEvents)
function updateDayEventStatus(dayNum) {
  const activeDayEl = document.querySelector(".day.active");
  if (activeDayEl) {
    // Verificar se há eventos neste dia
    const hasEvent = eventsArr.some(
      (eventObj) =>
        eventObj.day === dayNum &&
        eventObj.month === month + 1 &&
        eventObj.year === year &&
        eventObj.events.length > 0
    );

    // Atualizar a classe "event"
    if (hasEvent) {
      activeDayEl.classList.add("event");
    } else {
      activeDayEl.classList.remove("event");
    }
  }

  // Garantir que os eventos sejam salvos após qualquer modificação
  saveEvents();
}

pendingTasksContainer.addEventListener("click", (e) => {
  const taskDiv = e.target.closest(".pending-task");
  if (taskDiv) {
    const day = parseInt(taskDiv.dataset.day, 10);
    const month = parseInt(taskDiv.dataset.month, 10);
    const year = parseInt(taskDiv.dataset.year, 10);
    const title = taskDiv.dataset.title;

    showCustomConfirm("Tem certeza de que deseja concluir este evento?").then(
      (result) => {
        if (result) {
          // Itera o array de trás para frente para evitar problemas com splice
          for (let i = eventsArr.length - 1; i >= 0; i--) {
            let eventObj = eventsArr[i];
            if (
              eventObj.day === day &&
              eventObj.month === month &&
              eventObj.year === year
            ) {
              eventObj.events = eventObj.events.filter(
                (ev) => ev.title !== title
              );
              if (eventObj.events.length === 0) {
                eventsArr.splice(i, 1);
              }
              break;
            }
          }

          // Atualiza o armazenamento
          saveEvents();

          // Verificar se o evento excluído pertence ao mês atualmente exibido
          const isSameMonth = month - 1 === window.month;
          const isSameYear = year === window.year;

          if (isSameMonth && isSameYear) {
            // Atualizar o indicador de evento nos dias do calendário
            updateEventIndicator(day);
          }

          // SEMPRE atualizar a lista de eventos atual se houver um dia ativo
          if (activeDay) {
            updateEvents(activeDay);
          }

          // Recarregar a lista de tarefas pendentes
          loadPendingTasks();

          // Remover o elemento da tarefa do DOM para feedback visual imediato
          taskDiv.classList.add("fade-out");
          setTimeout(() => {
            taskDiv.remove();
          }, 300);
        }
      }
    );
  }
});

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
