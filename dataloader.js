// dataLoader.js
import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

// Permet de d�terminer le r�pertoire courant (pour ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadCategorieMapping() {
  // Chemin vers votre fichier Excel situ� dans le dossier "data"
  const filePath = path.join(__dirname, 'data', 'codes.xlsx');
  
  // Lecture du fichier Excel
  const workbook = XLSX.readFile(filePath);
  // On r�cup�re la premi�re feuille
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Conversion de la feuille en tableau d'arrays (chaque ligne est un array)
  // Ici, nous utilisons header: 1 pour obtenir toutes les lignes sans traitement des en-t�tes.
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
  
  // Construire la table de correspondance
  // Supposons que chaque ligne est structur�e ainsi : [code, libell�]
  const mapping = {};
  // Si votre fichier n'a pas d'en-t�te, commencez � index 0.
  // Sinon, commencez � 1 pour ignorer la ligne d'en-t�te.
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
