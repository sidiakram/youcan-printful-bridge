export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  try {
    // 1. Récupérer la liste de vos produits Printful
    const printfulResponse = await $fetch('api.printful.com', {
      headers: { 'Authorization': `Bearer ${config.printfulToken}` }
    });

    const products = printfulResponse.result;

    // 2. Boucler pour chaque produit et l'envoyer à YouCan
    for (const item of products) {
      // On récupère les détails (image et prix) du produit
      const details = await $fetch(`api.printful.com/${item.id}`, {
        headers: { 'Authorization': `Bearer ${config.printfulToken}` }
      });

      const p = details.result.sync_product;
      const variant = details.result.sync_variants[0]; // On prend la 1ère variante pour le prix

      // 3. Création du produit sur YouCan
      // Documentation : https://developer.youcan.shop
      await $fetch('api.youcan.shop', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${config.youcanKey}`,
          'Content-Type': 'application/json'
        },
        body: {
          name: p.name,
          slug: p.external_id || `printful-${p.id}`,
          price: variant.retail_price,
          description: "Produit importé depuis Printful",
          images: [{ url: p.thumbnail_url }],
          active: 1,
          inventory: 999
        }
      });
    }

    return { success: true, count: products.length };

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur lors de l'importation : " + error.message,
    });
  }
});
