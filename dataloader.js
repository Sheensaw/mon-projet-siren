// dataLoader.js
import xlsx from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadCategorieMapping() {
  // Chemin vers le fichier Excel dans le dossier "data"
  const filePath = path.join(__dirname, 'data', 'codes.xlsx');
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  // R�cup�re les donn�es sous forme de tableau d'array (premi�re ligne = ent�tes)
  const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  
  const mapping = {};
  // Parcours � partir de la deuxi�me ligne (index 1)
  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    const code = row[0];
    const libelle = row[1];
    if (code && libelle) {
      // Concat�ne code et libell� au format "code - libell�"
      mapping[code] = `${code} - ${libelle}`;
    }
  }
  return mapping;
}
