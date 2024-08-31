<template>
  <div>
    <div v-if="loading" class="text-center">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>
    <v-list v-else>
      <template v-for="ricetta in ricette" :key="ricetta.id">
        <v-list-item
          :title="ricetta.title"
          @click.prevent="passaId(ricetta.id)"
        >
          <template v-slot:prepend>
            <v-avatar>
              <v-img :src="ricetta.image"></v-img>
            </v-avatar>
          </template>
          <template v-if="ricetta.utente === utente" v-slot:append>
            <v-btn
              color="green"
              variant="text"
              @click.prevent="removeRicetta(ricetta.id)"
            >
              <v-icon>mdi-trash-can-outline</v-icon>
            </v-btn>
          </template>
        </v-list-item>
        <v-divider></v-divider>
      </template>
    </v-list>
    <v-snackbar v-model="snack"> {{ messaggio }} </v-snackbar>
  </div>
</template>

<script>
import DataService from "../dataservice";

export default {
  data: function () {
    return {
      loading: false,
      ricette: [],
      utente: localStorage.getItem("userMail"),
      snack: false,
      messaggio: "",
    };
  },
  methods: {
    //Passando l'id si viene mandati alla pagina di detail tramite router
    passaId: function (index) {
      this.$router.push({
        name: "detail",
        params: {
          id: index,
        },
      });
    },
    //Serve per cancellare la ricetta sia dal vettore ricette sia dal database
    removeRicetta: function (id) {
      let index = 0;
      for (let i = 0; i < this.ricette.length; i++) {
        if (this.ricette[i].id === id) {
          index = i;
        }
      }
      this.ricette.splice(index, 1);
      DataService.rimuoviDocumento("ricette", id);
      //Cerca tutti gli utenti che hanno la ricetta salvata nei preferiti e la rimuove anche da li
      DataService.scaricaAccount()
        .then((utenti) => {
          for (let utente of utenti) {
            DataService.rimuoviDocumento(utente, id);
          }
        })
        .catch((error) => {
          //Gestisco gli errori
          this.snack = true;
          this.messaggio = error;
        });
      this.snack = true;
      this.messaggio = "Ricetta rimossa!";
    },
  },
  //Rempiamo il vettore ricette con tutte le ricette create dagli utenti
  mounted: function () {
    this.loading = true;
    DataService.scaricaRicette()
      .then((ricette) => {
        this.ricette = ricette;
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
