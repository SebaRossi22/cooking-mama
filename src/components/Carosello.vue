<template>
  <div>
    <v-progress-linear v-if="loading" indeterminate></v-progress-linear>
    <template v-else>
      <h1 class="text-center mt-3">Lasciati ispirare</h1>
      <v-carousel class="pa-5" show-arrows="hover" hide-delimiters height="700">
        <v-carousel-item v-for="piatto in piatti" :key="piatto.id">
          <v-card>
            <v-img :src="piatto.image" height="650" cover></v-img>
            <v-btn variant="text" @click.prevent="passaId(piatto.id)">{{
              piatto.title
            }}</v-btn>
          </v-card>
        </v-carousel-item>
      </v-carousel>
    </template>
    <v-snackbar v-model="snack"> {{ messaggio }} </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: function () {
    return {
      piatti: [],
      loading: false,
      snack: false,
      messaggio: "",
    };
  },
  methods: {
    //Passa l'id alla pagina di detail tramite router
    passaId: function (index) {
      this.$router.push({
        name: "detail",
        params: {
          id: index,
        },
      });
    },
  },
  //Scarico i piatti dall'API e gli inserisco nel vettore piatti
  mounted: function () {
    this.loading = true;
    this.piatti = [];
    axios({
      method: "get",
      url: "https://api.spoonacular.com/recipes/random?number=10&apiKey=fbc24a0698bd4f19ae6abb0267b5387d",
    })
      .then((result) => {
        for (let piatto of result.data.recipes) {
          this.piatti.push(piatto);
        }
        this.loading = false;
      })
      .catch((error) => {
        this.snack = true;
        this.messaggio = error;
        this.loading = false;
      });
  },
};
</script>

<style></style>
