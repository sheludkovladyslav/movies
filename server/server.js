import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const PORT = "3000";

const __dirname = path.resolve(fileURLToPath(import.meta.url));

const filePath = path.join(__dirname, "../..", "public", "students.json");

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

const writeFile = (students) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(students, null, 2));
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
  if (req.method === "GET" && req.url === "/students") {
    const students = readFile();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(students));
  } else if (req.method === "POST" && req.url === "/students") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const newStudent = JSON.parse(body);
        const students = readFile();
        students.push(newStudent);
        writeFile(students);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Студента успішно додано" }));
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Помилка при додаванні студента" }));
      }
    });
  } else if (req.method === "DELETE" && req.url.startsWith("/students/")) {
    const index = parseInt(req.url.split("/")[2], 10);

    const students = readFile();

    students.splice(index, 1);

    writeFile(students);

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
