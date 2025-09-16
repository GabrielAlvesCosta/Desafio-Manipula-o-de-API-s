document.addEventListener('DOMContentLoaded', () => {
  // elementos da interface
  const nasaInput = document.getElementById('nasa-input');
  const nasaBtn = document.getElementById('nasa-btn');
  const nasaResultado = document.getElementById('nasa-resultado');
  const todayBtn = document.getElementById('today-btn');
  const backBtn = document.getElementById('back-btn');
  const nextBtn = document.getElementById('next-btn');

  // chave da API
  const API_KEY = "QMWwKLUl6EItsgSlPdOYE2iCNphbg1ukzs8Q1Kck";

  // variável para controlar a data atual exibida
  let currentDate = new Date();

function formatDate(date) {
  // força fuso horário local para evitar +1 dia
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

  // função principal de busca
  async function fetchAPOD(date) {
    nasaResultado.innerHTML = `<p>Buscando...</p>`;

    try {
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${formatDate(date)}`
      );

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}`);
      }

      const data = await response.json();

      nasaResultado.innerHTML = `
        <h3>${data.title} (${data.date})</h3>
        ${
          data.media_type === "image"
            ? `<img src="${data.url}" alt="${data.title}" >`
            : data.media_type === "video"
              ? `<iframe src="${data.url}" width="560" height="315" frameborder="0" allowfullscreen></iframe>`
              : `<p style="color: red;">⚠️ Nenhuma mídia disponível.</p>`
        }
        <h4>${data.explanation}</h4>
      `;
    } catch (error) {
      nasaResultado.innerHTML = `<p style="color: red;">Erro: ${error.message}</p>`;
    }
  }

  // botão de busca manual (mantém o seu código original)
  const buscarnasa = async () => {
    const nasaDate = nasaInput.value.trim();
    if (nasaDate === "") {
      nasaResultado.innerHTML = `<p style="color: red;">Por favor, digite uma Data.</p>`;
      return;
    }
    currentDate = new Date(nasaDate); // sincroniza com navegação
    fetchAPOD(currentDate);
  };
  nasaBtn.addEventListener('click', buscarnasa);

  // botão "Hoje"
  todayBtn.addEventListener("click", () => {
    currentDate = new Date();
    fetchAPOD(currentDate);
  });

  // botão "Anterior"
  backBtn.addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() - 1);
    fetchAPOD(currentDate);
  });

  // botão "Próximo"
  nextBtn.addEventListener("click", () => {
    const today = new Date();
    if (currentDate < today) {
      currentDate.setDate(currentDate.getDate() + 1);
      fetchAPOD(currentDate);
    }
  });
});