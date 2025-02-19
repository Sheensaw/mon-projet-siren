// api/siren.js

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { siret } = req.query;
  if (!siret) {
    return res.status(400).json({ error: 'Paramètre "siret" manquant' });
  }

  try {
    const apiUrl = `https://api.insee.fr/entreprises/sirene/V3/siret/${siret}`;
    const accessToken = process.env.INSEE_ACCESS_TOKEN;
    if (!accessToken) {
      return res.status(500).json({ error: 'Token d\'accès INSEE manquant' });
    }

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();

    // Extraction correcte du nom de la société
    const etablissement = data.etablissement;
    let entityName = null;
    if (etablissement && etablissement.uniteLegale) {
      entityName = etablissement.uniteLegale.denominationUniteLegale 
                   || etablissement.uniteLegale.nomUniteLegale;
    }

    if (!entityName) {
      return res.status(404).json({ error: 'Nom de l\'entité introuvable dans la réponse de l\'API' });
    }

    return res.status(200).json({ siret, entityName });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
