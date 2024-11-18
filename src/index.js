import Handlebars from "handlebars";
import filmTemplateSource from "bundle-text:./templates/film-item.hbs";

const renderFilms = (films) => {
  const filmList = document.querySelector(".films-list");
  const filmTemplate = Handlebars.compile(filmTemplateSource);
  filmList.innerHTML = filmTemplate(films);
};

const SERVER_URL = "http://localhost:3000";

const loadFilms = () => {
  const request = new XMLHttpRequest();
  request.open("GET", `${SERVER_URL}/films`, false);
  request.send();

  if (request.status === 200) {
    try {
      const films = JSON.parse(request.responseText);
      renderFilms(films);
    } catch (error) {
      console.error("Помилка при парсингу!");
      alert("Помилка при парсингу!");
    }
  } else {
    alert("Не вдалося отримати фільми");
  }
};

const addFilm = (film) => {
  const request = new XMLHttpRequest();
  request.open("POST", `${SERVER_URL}/films`, false);
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(film));

  if (request.status === 200) {
    loadFilms();
  } else {
    alert("Не вдалося додати фільм");
  }
};

//Відправлення запиту на видалення фільму за його індексом
function deleteFilm(index) {
  const request = new XMLHttpRequest(); // Створення об'єкту запиту
  request.open("DELETE", `${SERVER_URL}/films/${index}`, false); // Синхронний запит з методом DELETE на ендпоінт http://localhost:3000/films/1
  request.send(); // надсилання

  if (request.status === 200) {
    //Якщо успішний запит - викликаємо функцію loadFilms
    loadFilms();
  } else {
    alert("Не вдалося видалити фільм.");
  }
}

document.querySelector("#film-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const film = {
    name: document.querySelector("#title").value,
    year: parseInt(document.querySelector("#year").value),
    type: document.querySelector("#type").value,
    priority: document.querySelector("#priority").value,
  };
  addFilm(film);
});

const filmList = document.getElementById("films-list"); //Список фільмів

// Додаємо обробник події на батьківський елемент
filmList.addEventListener("click", (event) => {
  // Перевіряємо, чи натиснута кнопка видалення
  if (event.target.classList.contains("delete-btn")) {
    const index = event.target.dataset.index; // Отримуємо індекс через data-атрибут
    deleteFilm(index); // Викликаємо функцію для видалення фільму і передаємо їй індекс фільму
  }
});

loadFilms();
