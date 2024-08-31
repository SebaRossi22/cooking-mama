<template>
  <div>
    <div class="mx-auto" max-width="auto">
      <v-card-text>
        <v-text-field
          :loading="loading"
          density="compact"
          variant="solo"
          label="Cerca piatto"
          v-model="piattoCercato"
          append-inner-icon="mdi-magnify"
          single-line
          hide-details
          @click:append-inner="cercaPiatti()"
        ></v-text-field>
        <div class="pt-4" v-if="error === true">{{ errore }}</div>
      </v-card-text>
    </div>

    <v-container>
      <h1 v-if="error !== true" class="text-center">{{ nomePiatto }}</h1>

      <v-row>
        <v-col
          class="justify-center text-center"
          cols="12"
          sm="6"
          md="4"
          lg="4"
          v-for="piatto in piatti"
          :key="piatto.id"
        >
          <cards :piatto="piatto"></cards>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import cards from "/src/components/Card.vue";

export default {
  data: function () {
    return {
      loading: false,
      piattoCercato: "",
      nomePiatto: "",
      piatti: [],
      error: false,
      errore: "",
    };
  },
  components: {
    cards,
  },
  methods: {
    //In base al piatto inserito nella barra di ricerca fa una chiamata all'API e scarica i piatti relativi
    cercaPiatti: function () {
      this.piatti = [];
      this.loading = true;
      this.error = false;

      axios({
        method: "get",
        url:
          "https://api.spoonacular.com/recipes/complexSearch?query=" +
          this.piattoCercato +
          "&apiKey=fbc24a0698bd4f19ae6abb0267b5387d&includeNutrition=true&number=21",
      })
        .then((result) => {
          //Riempio il vettore piatti con il risultato della chiamata
          for (let piatto of result.data.results) {
            this.piatti.push(piatto);
          }

          //Controllo che la chiamata abbia restituito qualcosa
          if (this.piatti.length === 0) {
            this.error = true;
            this.errore = "Nessun piatto trovato!";
            this.piattoCercato = "";
          }

          this.nomePiatto = this.piattoCercato.toUpperCase();
          this.loading = false;
        })
        .catch((error) => {
          this.error = true;
          this.errore = error;
          this.loading = false;
        });
    },
  },
};
</script>

<style></style>
