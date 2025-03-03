// api/siren.js

import { loadCategorieMapping } from './dataloader.js';

const categorieMapping = loadCategorieMapping();

export default async function handler(req, res) {
  // Vérification de la méthode HTTP
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  // Extraction du paramètre "siret"
  const { siret } = req.query;
  if (!siret) {
    return res.status(400).json({ error: 'Paramètre "siret" manquant' });
  }

  try {
    // URL pour l'API Sirene (v3.11)
    const apiUrl = `https://api.insee.fr/entreprises/sirene/V3.11/siret/${siret}`;
    
    // Récupération du token d'accès via les variables d'environnement
    const accessToken = process.env.INSEE_ACCESS_TOKEN;
    if (!accessToken) {
      return res.status(500).json({ error: "Token d'accès INSEE manquant" });
    }

    // Appel à l'API Sirene avec le token dans l'en-tête
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    // Gestion des erreurs de l'API Sirene
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();

    // Extraction des informations
    const etablissement = data.etablissement;
    let entityName = null;
    let categorieJuridique = null;
    if (etablissement && etablissement.uniteLegale) {
      entityName = etablissement.uniteLegale.denominationUniteLegale ||
                   etablissement.uniteLegale.nomUniteLegale;
      
      const rawCategorie = etablissement.uniteLegale.categorieJuridiqueUniteLegale;
      // Utilisation du mapping pour obtenir le libellé complet
      if (rawCategorie && categorieMapping[rawCategorie]) {
        categorieJuridique = categorieMapping[rawCategorie];
      } else {
        categorieJuridique = rawCategorie;
      }
    }

    if (!entityName) {
      return res.status(404).json({ error: "Nom de l'entité introuvable dans la réponse de l'API" });
    }

    // Retourne la réponse avec le SIRET, le nom et la catégorie juridique complète
    return res.status(200).json({ siret, entityName, categorieJuridique });
  } catch (error) {
    console.error('Function Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
