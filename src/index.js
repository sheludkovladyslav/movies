import Handlebars from "handlebars";
import studentTemplateSource from "bundle-text:./templates/students.hbs";

const renderStudents = (students) => {
  const studentsList = document.querySelector(".students-list");
  const studentsTemplate = Handlebars.compile(studentTemplateSource);
  studentsList.innerHTML = studentsTemplate(students);
};

const SERVER_URL = "http://localhost:3000";

const loadStudents = () => {
  const request = new XMLHttpRequest();
  request.open("GET", `${SERVER_URL}/students`, false);
  request.send();
  console.log(request.responseText); // Дивіться, що приходить від сервера

  if (request.status === 200) {
    try {
      const students = JSON.parse(request.responseText);
      renderStudents(students);
    } catch (error) {
      console.error("Помилка при парсингу!", error);
      alert("Помилка при парсингу!");
    }
  } else {
    alert("Не вдалося отримати студентів");
  }
};

const addStudent = (student) => {
  const request = new XMLHttpRequest();
  request.open("POST", `${SERVER_URL}/students`, false);
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(student));

  if (request.status === 200) {
    loadStudents();
  } else {
    alert("Не вдалося додати студента");
  }
};

function deleteStudent(index) {
  const request = new XMLHttpRequest();
  request.open("DELETE", `${SERVER_URL}/students/${index}`, false);
  request.send();

  if (request.status === 200) {
    loadStudents();
  } else {
    alert("Не вдалося видалити студента");
  }
}

document.querySelector("#student-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const courses = document.querySelector("#courses").value;
  const name = document.querySelector("#name").value;
  const lastName = document.querySelector("#lastName").value;
  const age = parseInt(document.querySelector("#age").value);
  const faculty = document.querySelector("#faculty").value;

  if (
    name.length >= 3 &&
    lastName.length >= 3 &&
    faculty.length > 3 &&
    courses.length > 3
  ) {
    const student = {
      name: name.trim(),
      lastName: lastName.trim(),
      age: age,
      faculty: faculty.trim(),
      courses: courses.split(","),
    };
    addStudent(student);
  } else {
    alert("Введіть валідні дані!");
  }
});

const studentsList = document.getElementById("students-list");

studentsList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const index = event.target.dataset.index;
    deleteStudent(index);
  }
});

loadStudents();
