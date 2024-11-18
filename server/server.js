import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const PORT = "3000";

const __dirname = path.resolve(fileURLToPath(import.meta.url));

const filePath = path.join(__dirname, "../..", "public", "films.json");

const readFile = () => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
    }
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    console.log("Виникла помилка при читанні файлу", error);
  }
};

const writeFile = (films) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(films, null, 2));
  } catch (error) {
    console.log("Виникла помилка при читанні файлу", error);
  }
};

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }
  //Обробляємо запит на отримання фільмів
  if (req.method === "GET" && req.url === "/films") {
    const films = readFile();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(films));
  }
  //Обробляємо запит на додавання фільму до файлу films.json
  else if (req.method === "POST" && req.url === "/films") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const newFilm = JSON.parse(body);
        const films = readFile();
        films.push(newFilm);
        writeFile(films);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Фільм додано успішно" }));
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Помилка при додаванні фільму" }));
      }
    });
  }
  //Обробляємо запит на видалення фільму з файлу films.json
  else if (req.method === "DELETE" && req.url.startsWith("/films/")) {
    // Перевіряємо чи ендоінт починається з "/films/" та чи використовується метод DELETE

    const index = parseInt(req.url.split("/")[2], 10); // знаходимо індекс переданого фільму ()
    //req.url.split("/"): розбиває URL запиту на масив частин. Наприклад, для запиту /films/3 отримаємо масив ["", "films", "3"].
    //req.url.split("/")[2]: вибирає третю частину масиву (індекс фільму), що містить числове значення, яке вказує на позицію фільму в масиві.

    const films = readFile(); //Беремо список фільмів з films.json

    films.splice(index, 1); // видаляємо фільм за його індексом

    writeFile(films); // перезаписуємо файл films.json вже без видаленого фільму

    res.writeHead(200);
    res.end();
  } else {
    res.writeHead(404);
    res.end("Не знайдено");
  }
});

server.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});
