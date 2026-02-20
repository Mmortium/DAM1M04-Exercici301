const express = require('express');
const fs = require('fs');
const path = require('path');
const hbs = require('hbs'); // Usamos hbs directamente

const app = express();
const port = 3000;

// Desactivar caché (muy útil para desarrollo)
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

// Continguts estàtics (carpeta public)
app.use(express.static('public'));

// Configuración de Handlebars
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// --- REGISTRAR HELPERS ---
// ejercicio pide 'lte' (less than or equal)
hbs.registerHelper('lte', (a, b) => a <= b);

// --- REGISTRAR PARTIALS ---
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// --- RUTA / (Página principal) ---
app.get('/', (req, res) => {
  const site = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'site.json'), 'utf8')
  );

  res.render('index', site);
});

// --- RUTA /informe (Página con 3 JSONs) ---
app.get('/informe', (req, res) => {
  const site = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'site.json'), 'utf8')
  );
  const cities = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'cities.json'), 'utf8')
  );
  const countries = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'countries.json'), 'utf8')
  );

  // Pasamos los datos combinados
  const data = {
    site: site,
    cities: cities.cities,
    countries: countries.countries
  };

  res.render('informe', data);
});

// Start server
const httpServer = app.listen(port, () => {
  console.log(`Servidor en marxa a: http://localhost:${port}`);
  console.log(`Informe disponible a: http://localhost:${port}/informe`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  httpServer.close();
  process.exit(0);
});