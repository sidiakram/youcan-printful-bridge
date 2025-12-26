// nuxt.com
export default defineNuxtConfig({
  // Cette section permet à l'application de lire vos clés secrètes
  runtimeConfig: {
    // Clés privées (accessibles uniquement par le serveur, pas par le client)
    printfulToken: process.env.PRINTFUL_API_TOKEN,
    youcanKey: process.env.YOUCAN_API_KEY,
    
    // Si vous avez besoin de variables publiques, mettez-les dans 'public'
    public: {
      apiBase: '/api'
    }
  },

  // Configuration de compatibilité pour 2025
  compatibilityDate: '2025-01-01',

  // Active les outils de développement dans le navigateur
  devtools: { enabled: true }
})
