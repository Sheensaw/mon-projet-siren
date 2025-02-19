export default async function handler(req, res) {
<<<<<<< HEAD
  // Vérifie que la méthode HTTP est GET
=======
>>>>>>> a592aa7ffac6d1931484335a78f728119a1d6991
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

<<<<<<< HEAD
  // Extraction du paramètre "siret" de la requête
=======
>>>>>>> a592aa7ffac6d1931484335a78f728119a1d6991
  const { siret } = req.query;
  if (!siret) {
    return res.status(400).json({ error: 'Paramètre "siret" manquant' });
  }

  try {
<<<<<<< HEAD
    // MODIFICATION 1 : Mise à jour de l'URL pour utiliser la version V3.11 de l'API
    const apiUrl = `https://api.insee.fr/entreprises/sirene/V3.11/siret/${siret}`;
    
    // Récupération du token d'accès depuis les variables d'environnement
=======
    const apiUrl = `https://api.insee.fr/entreprises/sirene/V3/siret/${siret}`;
>>>>>>> a592aa7ffac6d1931484335a78f728119a1d6991
    const accessToken = process.env.INSEE_ACCESS_TOKEN;
    if (!accessToken) {
      return res.status(500).json({ error: "Token d'accès INSEE manquant" });
    }

<<<<<<< HEAD
    // Appel à l'API Sirene avec le token dans l'en-tête
=======
>>>>>>> a592aa7ffac6d1931484335a78f728119a1d6991
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

<<<<<<< HEAD
    // Gestion d'erreur en cas de réponse non OK de l'API
=======
>>>>>>> a592aa7ffac6d1931484335a78f728119a1d6991
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();

<<<<<<< HEAD
    // MODIFICATION 2 : Extraction du nom de l'entité avec les champs corrects
    // Utilise "denominationUniteLegale" puis "nomUniteLegale" si le premier n'est pas présent.
    const etablissement = data.etablissement;
    let entityName = null;
    if (etablissement && etablissement.uniteLegale) {
      entityName = etablissement.uniteLegale.denominationUniteLegale ||
                   etablissement.uniteLegale.nomUniteLegale;
=======
    // Extraction correcte du nom de la société
    const etablissement = data.etablissement;
    let entityName = null;
    if (etablissement && etablissement.uniteLegale) {
      entityName = etablissement.uniteLegale.denominationUniteLegale 
                   || etablissement.uniteLegale.nomUniteLegale;
>>>>>>> a592aa7ffac6d1931484335a78f728119a1d6991
    }

    if (!entityName) {
      return res.status(404).json({ error: "Nom de l'entité introuvable dans la réponse de l'API" });
    }

<<<<<<< HEAD
    // Retourne le SIRET et le nom de l'entité en JSON
=======
>>>>>>> a592aa7ffac6d1931484335a78f728119a1d6991
    return res.status(200).json({ siret, entityName });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
