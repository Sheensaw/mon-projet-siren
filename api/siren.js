// api/siren.js

// Table de correspondance pour la catégorie juridique
const categorieMapping = {
  "1000": "1000 - Entrepreneur individuel",
  "2000": "2000 - Société par Actions Simplifiée",
  // Ajoutez ici les autres correspondances selon la documentation officielle...
};

export default async function handler(req, res) {
  // Vérifie que la méthode HTTP est GET
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  // Extraction du paramètre "siret" de la requête
  const { siret } = req.query;
  if (!siret) {
    return res.status(400).json({ error: 'Paramètre "siret" manquant' });
  }

  try {
    // URL pour la version V3.11 de l'API Sirene
    const apiUrl = `https://api.insee.fr/entreprises/sirene/V3.11/siret/${siret}`;
    
    // Récupération du token d'accès depuis les variables d'environnement
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

    // Si la réponse n'est pas ok, loguez l'erreur et renvoyez le message
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();

    // Extraction des informations depuis l'API
    const etablissement = data.etablissement;
    let entityName = null;
    let categorieJuridique = null;
    if (etablissement && etablissement.uniteLegale) {
      entityName = etablissement.uniteLegale.denominationUniteLegale ||
                   etablissement.uniteLegale.nomUniteLegale;
      
      // Récupération du code de la catégorie juridique
      const rawCategorie = etablissement.uniteLegale.categorieJuridiqueUniteLegale;
      // Utilisation de la table de correspondance pour obtenir la mention complète
      if (rawCategorie && categorieMapping[rawCategorie]) {
        categorieJuridique = categorieMapping[rawCategorie];
      } else {
        categorieJuridique = rawCategorie;
      }
    }

    if (!entityName) {
      return res.status(404).json({ error: "Nom de l'entité introuvable dans la réponse de l'API" });
    }

    // Renvoie le SIRET, le nom de l'entité et la catégorie juridique complète
    return res.status(200).json({ siret, entityName, categorieJuridique });
  } catch (error) {
    console.error('Function Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
