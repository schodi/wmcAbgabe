import express from 'express'; // Express-Framework
import pg from 'pg'; // PostgreSQL-Client
import bodyParser from 'body-parser'; // Middleware für das Parsen von JSON-Daten
import path from 'path'; // Modul für den Zugriff auf den Dateipfad
import { fileURLToPath } from 'url'; // Modul für den Zugriff auf die aktuelleDatei-URL
const { Pool } = pg; // PostgreSQL-Pool für die Verbindung zur Datenbank
const app = express(); // Express-Anwendung initialisieren
const __filename = fileURLToPath(import.meta.url); // gibt die aktuelle Datei-URLzurück
const __dirname = path.dirname(__filename); // gibt das Verzeichnis der aktuellen Datei zurück
// PostgreSQL-Datenbankverbindung
const pool = new Pool({
 user: 'postgres', // anpassen
 host: 'localhost',
 database: 'customer_app', // anpassen
 password: '123', // anpassen
 port: 5432,
});
app.use(bodyParser.json()); // Middleware für das Parsen von JSON-Daten
app.use(bodyParser.urlencoded({ extended: true })); // Middleware für das Parsenvon URL-kodierten Daten
app.use(express.static(path.join(__dirname, 'public'))); // Middleware fürstatische Dateien
// Route für das Speichern von Kundendaten
app.post('/api/kunden', async (req, res) => {
 const { nachname, vorname, email } = req.body; // Daten aus dem Request-Body mitDestructuring extrahieren. Es werden drei Variablen erstellt: nachname, vornameund email
 try {
 await pool.query(
 'INSERT INTO kunden (nachname, vorname, email) VALUES ($1, $2, $3)',
 [nachname, vorname, email] // Daten aus dem Request-Body in die Datenbankeinfügen
 );
 res.status(201).send('Kunde gespeichert'); // Erfolgreiche Antwort mit Status
201 (Created)
 } catch (error) {
 console.error(error);
 res.status(500).send('Fehler beim Speichern');
 }
});
// Route Kundendaten abrufen + optionaler Suchbegriff
app.get('/api/kunden', async (req, res) => {
 const search = req.query.search || ''; // Suchbegriff aus der URL abfragen
 // Wenn kein Suchbegriff angegeben ist, wird ein leerer String verwendet
 try {
 const result = await pool.query(
 `SELECT * FROM kunden WHERE
 nachname ILIKE $1 OR
 vorname ILIKE $1 OR
 email ILIKE $1`,
 [`%${search}%`]
 );
 res.json(result.rows); // Ergebnis als JSON zurückgeben
 } catch (error) {
 console.error(error);
 res.status(500).send('Fehler beim Abrufen');
 }
});
// Get Route wenn auf / zugegriffen wird, es wird ein String zurückgegeben
app.get('/', (req, res) => {
 res.send('Willkommen zur Kundenverwaltung!');
});
// Route für das Abrufen von Kundendaten nach ID
const PORT = 3000;
app.listen(PORT, () => {
 console.log(`Server läuft auf http://localhost:${PORT}`);
});
