export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  try {
    // 1. Récupérer les produits depuis Printful
    const printfulData = await $fetch(`api.printful.com`, {
      headers: { 'Authorization': `Bearer ${config.printfulToken}` }
    });

    const products = printfulData.result;

    // 2. Boucler sur chaque produit pour l'envoyer à YouCan
    for (const product of products) {
      // On récupère les détails (images, prix) de chaque produit
      const details = await $fetch(`api.printful.com/${product.id}`, {
        headers: { 'Authorization': `Bearer ${config.printfulToken}` }
      });

      const p = details.result.sync_product;
      const variants = details.result.sync_variants;

      // 3. Envoyer vers YouCan
      await $fetch('api.youcan.shop', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${config.youcanKey}`,
          'Content-Type': 'application/json'
        },
        body: {
          name: p.name,
          description: "Produit Printful haute qualité",
          price: variants[0].retail_price, // Prix de la première variante
          images: [{ url: p.thumbnail_url }],
          inventory: 100, // Printful gère le stock, on met une valeur par défaut
          active: true
        }
      });
    }

    return { status: "success", message: `${products.length} produits synchronisés !` };

  } catch (error) {
    return { status: "error", message: error.message };
  }
});
