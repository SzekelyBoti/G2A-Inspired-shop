import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataRoute = path.join(__dirname, "shop.json");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", express.static(path.join(__dirname, "..", "client")));

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.get("/cart", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.get("/api/shop", async (req, res) => {
  const data = await fs.readFile(dataRoute, "utf8");
  const shop = JSON.parse(data);
  return res.send(shop);
});

app.get("/shop/:gameId", async (req, res) => {
  const data = await fs.readFile(dataRoute, "utf8");
  const shop = JSON.parse(data);
  const index = parseInt(req.params.gameId);
  const game = shop.find((game) => game.id === index);
  if (game) {
    return res.json(game);
  } else {
    return res.status(404).send({ state: "Game not found" });
  }
});

app.post("/shop", async (req, res) => {
  try {
    let games = await readFile();
    let highestId = 0;
    games.forEach((game) => {
      if (game.id > highestId) {
        highestId = game.id;
      }
    });
    const newGame = req.body;
    newGame.id = highestId + 1;
    games.push(newGame);

    await writeFiles(games);

    res.status(201).json(newGame);
  } catch (error) {
    console.error("Error adding new game:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/shop/:id", async (req, res) => {
  let games = await readFile();
  const gameId = parseInt(req.params.id);
  const update = req.body;
  const index = games.findIndex((m) => m.id === gameId);

  if (index !== -1) {
    games[index] = { ...games[index], ...update };
    await writeFiles(games);
    res.json(games[index]);
  } else {
    res.status(404).json({ error: "Game not found" });
  }
});

app.delete("/shop/:gameId", async (req, res) => {
  let games = await readFile();
  const gameId = parseInt(req.params.gameId);
  games = games.filter((game) => game.id !== gameId);
  await writeFiles(games);
  return res.json({ message: "Game deleted" });
});

app.listen(8000, () => {
  console.log("http://localhost:8000");
});

async function readFile() {
  try {
    const data = await fs.readFile(dataRoute, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
  }
}

async function writeFiles(newItem) {
  try {
    await fs.writeFile(dataRoute, JSON.stringify(newItem, null, 2), "utf-8");
  } catch (error) {
    console.error(error);
  }
}
