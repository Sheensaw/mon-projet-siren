// dataLoader.js
import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

// Permet de déterminer le répertoire courant (pour ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadCategorieMapping() {
  // Chemin vers votre fichier Excel situé dans le dossier "data"
  const filePath = path.join(__dirname, 'data', 'codes.xlsx');
  
  // Lecture du fichier Excel
  const workbook = XLSX.readFile(filePath);
  // On récupère la première feuille
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Conversion de la feuille en tableau d'arrays (chaque ligne est un array)
  // Ici, nous utilisons header: 1 pour obtenir toutes les lignes sans traitement des en-têtes.
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
  
  // Construire la table de correspondance
  // Supposons que chaque ligne est structurée ainsi : [code, libellé]
  const mapping = {};
  // Si votre fichier n'a pas d'en-tête, commencez à index 0.
  // Sinon, commencez à 1 pour ignorer la ligne d'en-tête.
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
