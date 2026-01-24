const express = require("express");
const path = require("path");
const hbs = require("hbs");

const app = express();

// Rutas absolutas
const viewsPath = path.join(__dirname, "views");
const partialsPath = path.join(__dirname, "views/partials");
const publicPath = path.join(__dirname, "../public");

// Configurar HBS
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Helper lte (menor o igual)
hbs.registerHelper("lte", function (a, b) {
  return a <= b;
});

// Servir archivos estáticos
app.use(express.static(publicPath));

// Cargar datos JSON
const site = require("./data/site.json");
const cities = require("./data/cities.json");
const countries = require("./data/countries.json");

// Ruta principal
app.get("/", (req, res) => {
  res.render("index", site);
});

// Ruta informe
app.get("/informe", (req, res) => {
  res.render("informe", {
    site,
    cities: cities.cities,
    countries: countries.countries,
    threshold: 800000
  });
});

// Iniciar servidor
app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});
