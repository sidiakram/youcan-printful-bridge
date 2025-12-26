<template>
  <div style="padding: 20px; font-family: sans-serif;">
    <h1>Synchronisation Printful</h1>
    <p>Cliquez sur le bouton pour importer vos produits Printful vers votre boutique YouCan.</p>
    
    <button 
      @click="startImport" 
      :disabled="isImporting"
      style="padding: 10px 20px; cursor: pointer; background: #007bff; color: white; border: none; border-radius: 5px;"
    >
      {{ isImporting ? 'Importation en cours...' : 'Lancer l\'importation' }}
    </button>

    <div v-if="statusMessage" style="margin-top: 20px; padding: 10px; border: 1px solid #ccc;">
      {{ statusMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isImporting = ref(false);
const statusMessage = ref('');

const startImport = async () => {
  isImporting.value = true;
  statusMessage.value = "Connexion aux API en cours...";
  
  try {
    const data = await $fetch('/api/import-printful', { method: 'POST' });
    statusMessage.value = `Succès ! ${data.count} produits ont été ajoutés à votre boutique YouCan.`;
  } catch (err) {
    statusMessage.value = "Erreur : " + err.statusMessage;
  } finally {
    isImporting.value = false;
  }
};
</script>
