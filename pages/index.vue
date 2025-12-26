<template>
  <div>
    <h1>Ma Boutique Printful x YouCan</h1>
    <button @click="importProducts" :disabled="loading">
      {{ loading ? 'Importation en cours...' : 'Importer mes produits Printful' }}
    </button>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup>
const loading = ref(false);
const message = ref('');

async function importProducts() {
  loading.value = true;
  try {
    const response = await $fetch('/api/sync-products');
    message.value = response.message;
  } catch (err) {
    message.value = "Erreur lors de l'importation";
  } finally {
    loading.value = false;
  }
}
</script>
