const calendario = document.querySelector(".calendario"), // Container principal do calendário
  data = document.querySelector(".data"), // Elemento que exibe o mês e o ano
  containerDia = document.querySelector(".dias"), // Container onde os dias do mês serão inseridos
  prev = document.querySelector(".prev"), // Botão para voltar um mês
  next = document.querySelector(".next"); // Botão para avançar um mês
inputData = document.querySelector(".inputData"); // Input para selecionar uma data
irBtn = document.querySelector(".ir-btn"); // Botão para ir ao dia escrito pelo usuário
hojeBtn = document.querySelector(".hojeBotao"); // Botão para ir ao dia atual

// Obtém a data atual
let hoje = new Date();
let ativo; // Dia ativo no calendário
let dia = hoje.getDate(); // Dia atual
let mes = hoje.getMonth(); // Mês atual (0 a 11)
let ano = hoje.getFullYear(); // Ano atual

// Array com os nomes dos meses para exibição
const meses = [
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

function iniciarCalendario() {
  const primeiroDia = new Date(ano, mes, 1); // Primeiro dia do mês atual
  const ultimoDia = new Date(ano, mes + 1, 0); // Último dia do mês atual
  const prevUltimoDia = new Date(ano, mes, 0); // Último dia do mês anterior
  const prevDias = prevUltimoDia.getDate(); // Total de dias do mês anterior
  const ultimaData = ultimoDia.getDate(); // Total de dias do mês atual
  const dia = primeiroDia.getDay(); // Dia da semana do primeiro dia do mês
  const nextDias = 7 - ultimoDia.getDay() - 1; // Dias extras para completar a última linha

  // Atualiza o mês e o ano exibidos no calendário
  data.innerHTML = `${meses[mes]} ${ano}`;

  let dias = ""; // Armazena os dias do calendário

  // Adiciona os últimos dias do mês anterior para preencher o início da grade
  for (let x = dia; x > 0; x--) {
    dias += `<div class="dia prev-date">${prevDias - x + 1}</div>`;
  }

  // Adiciona os dias do mês atual
  for (let i = 1; i <= ultimaData; i++) {
    if (
      i === hoje.getDate() &&
      mes === hoje.getMonth() &&
      ano === hoje.getFullYear()
    ) {
      // Destaca o dia atual
      dias += `<div class="dia hoje">${i}</div>`;
    } else {
      dias += `<div class="dia">${i}</div>`;
    }
  }

  // Adiciona os primeiros dias do próximo mês para completar a última linha da grade
  for (let x = 1; x <= nextDias; x++) {
    dias += `<div class="dia next-date">${x}</div>`;
  }

  // Insere os dias gerados no container do calendário
  containerDia.innerHTML = dias;
}

// Inicializa o calendário ao carregar a página
iniciarCalendario();

// Retrocede um mês
function prevMes() {
  mes--;
  if (mes < 0) {
    mes = 11; // Se for janeiro (0), volta para dezembro (11) do ano anterior
    ano--;
  }
  iniciarCalendario(); // Atualiza o calendário
}

// Avança um mês
function nextMes() {
  mes++;
  if (mes > 11) {
    mes = 0; // Se for dezembro (11), avança para janeiro (0) do próximo ano
    ano++;
  }
  iniciarCalendario(); // Atualiza o calendário
}

// Eventos de clique nos botões de navegação
next.addEventListener("click", nextMes);
prev.addEventListener("click", prevMes);

// Volta para o dia atual
hojeBtn.addEventListener("click", () => {
  hoje = new Date();
  mes = hoje.getMonth();
  ano = hoje.getFullYear();
  iniciarCalendario();
});

// Restringe o input para aceitar apenas números e formatar como MM/AAAA
inputData.addEventListener("input", (e) => {
  inputData.value = inputData.value.replace(/[^0-9/]/g, ""); // Permite apenas números e "/"

  if (inputData.value.length === 2) {
    inputData.value += "/"; // Adiciona a barra automaticamente
  }

  if (inputData.value.length > 7) {
    inputData.value = inputData.value.slice(0, 7); // Limita a entrada a MM/AAAA
  }

  // Se o usuário apagar a barra, remove automaticamente
  if (e.inputData === "deleteContentBackward" && inputData.value.length == 3) {
    inputData.value = inputData.value.slice(0, 2);
  }
});

// Vai para a data digitada pelo usuário - Clique
irBtn.addEventListener("click", irData);

// Vai para a data digitada pelo usuário - Tecla Enter
inputData.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    irData(); // Chama a função para ir à data digitada
  }
});

function irData() {
  const dataArr = inputData.value.split("/");

  if (dataArr.length === 2) {
    let mesInput = parseInt(dataArr[0], 10); // Converte mês para número
    let anoInput = parseInt(dataArr[1], 10); // Converte ano para número

    if (mesInput > 0 && mesInput < 13 && dataArr[1].length === 4) {
      mes = mesInput - 1; // Ajusta para o índice do array (0 a 11)
      ano = anoInput;
      iniciarCalendario();
      return;
    }
    alert("Data Inválida!"); // Mensagem de erro se a entrada for inválida
  }
}
