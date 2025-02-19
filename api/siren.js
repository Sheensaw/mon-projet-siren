// api/siren.js

export default async function handler(req, res) {
  // On accepte uniquement la méthode GET
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  // Extraction du paramètre "siret" dans l'URL (ex: /api/siren?siret=12345678901234)
  const { siret } = req.query;

  if (!siret) {
    return res.status(400).json({ error: 'Paramètre "siret" manquant' });
  }

  try {
    // Construire l'URL de l'API Siren 3.11.
    // Ici, nous utilisons l'exemple de l'API Sirene de l'INSEE.
    // Adaptez cette URL si votre API diffère.
    const apiUrl = `https://api.insee.fr/entreprises/sirene/V3.11/siret/${siret}`;

    // Récupérer le token d'accès depuis les variables d'environnement
    const accessToken = process.env.INSEE_ACCESS_TOKEN;
    if (!accessToken) {
      return res.status(500).json({ error: 'Token d\'accès INSEE manquant' });
    }

    // Appel à l'API Siren
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    // En cas d'erreur de l'API, renvoyer le code d'erreur et le message
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();

    // Extraction du nom de l'entité.
    // La structure de la réponse peut varier : ici on teste dans "uniteLegale.denomination" ou "uniteLegale.nom"
    const etablissement = data.etablissement;
    let entityName = null;
    if (etablissement && etablissement.uniteLegale) {
      entityName = etablissement.uniteLegale.denomination || etablissement.uniteLegale.nom;
    }

    if (!entityName) {
      return res.status(404).json({ error: 'Nom de l\'entité introuvable dans la réponse de l\'API' });
    }

    // Retourner en JSON le SIRET et le nom de l'entité
    return res.status(200).json({ siret, entityName });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
