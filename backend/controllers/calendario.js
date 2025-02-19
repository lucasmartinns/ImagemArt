const calendario = document.querySelector(".calendario"),
  data = document.querySelector(".data"),
  containerDia = document.querySelector(".dias"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next");

let hoje = new Date();
let ativo;
let dia = hoje.getDate();
let mes = hoje.getMonth();
let ano = hoje.getFullYear();

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
  // busca o mês
  const primeiroDia = new Date(ano, mes, 1);
  const ultimoDia = new Date(ano, mes + 1, 0);
  const prevUltimoDia = new Date(ano, mes, 0);
  const prevDias = prevUltimoDia.getDate();
  const ultimaData = ultimoDia.getDate();
  const dia = primeiroDia.getDay();
  const nextDias = 7 - ultimoDia.getDay() - 1;

  // atualiza a data
  data.innerHTML = `${meses[mes]} ${ano}`;

  //adicionar dias
  let dias = "";

  // dias prévios do mês
  for (let x = dia; x > 0; x--) {
    dias = `<div class="dia prev-date">${prevDias - x + 1}</div>`;
  }
  // dias atuais do mês
  for (let i = 1; i <= ultimaData; i++) {
    if (
      i === hoje.getDate() &&
      mes === hoje.getMonth() &&
      ano === hoje.getFullYear()
    ) {
      dias += `<div class="dia hoje">${i}</div>`;
    } else {
      dias += `<div class="dia">${i}</div>`;
    }
  }
  // dias próximos do mês
  for (let x = 1; x <= nextDias; x++) {
    dias += `<div class="dia next-date">${x}</div>`;
  }

  containerDia.innerHTML = dias;
}

iniciarCalendario();
