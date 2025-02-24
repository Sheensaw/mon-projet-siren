// dataLoader.js
import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

// Pour obtenir le répertoire courant en mode ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadCategorieMapping() {
  // Chemin vers le fichier Excel dans le dossier "data"
  const filePath = path.join(__dirname, 'data', 'codes.xlsx');
  
  // Lecture du fichier Excel
  const workbook = XLSX.readFile(filePath);
  // On sélectionne la première feuille du classeur
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Conversion de la feuille en tableau d'arrays (chaque ligne est un array)
  // Ici, on suppose que le fichier n'a pas d'en-tête (les codes sont en colonne A, libellé en colonne B)
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
  
  // Construction du mapping
  const mapping = {};
  // Parcours de toutes les lignes (ajustez l'indice si vous avez une ligne d'en-tête)
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const code = String(row[0]).trim();
    const libelle = String(row[1]).trim();
    if (code) {
      mapping[code] = libelle;
    }
  }
  return mapping;
}
