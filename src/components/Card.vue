<template>
  <div>
    <v-card class="mx-auto" max-width="400">
      <v-img height="300" :src="piatto.image" cover></v-img>

      <div class="text-start">
        <v-card-title>{{ piatto.title }}</v-card-title>
      </div>

      <v-card-actions>
        <v-row no-gutters>
          <v-col cols="auto">
            <!--Se il piatto non è presente nei preferiti cuore vuoto altrimenti cuore pieno-->
            <v-btn
              color="pink"
              v-if="!prefer.includes(piatto.id.toString())"
              @click.prevent="
                addPreferito(piatto.id.toString(), piatto.title, piatto.image)
              "
            >
              <v-icon>mdi-heart-outline</v-icon>
            </v-btn>
            <v-btn
              v-else
              @click.prevent="removePreferito(piatto.id.toString())"
              color="pink"
            >
              <v-icon>mdi-heart</v-icon>
            </v-btn>
          </v-col>

          <v-col cols="auto" class="ml-auto">
            <v-btn
              class="d-flex justify-end"
              @click.prevent="passaId(piatto.id)"
            >
              LEGGI
              <v-icon>mdi-menu-right</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
    <!--Snackbar per mostrare messaggi e errori-->
    <v-snackbar v-model="snack">{{ messaggio }}</v-snackbar>
  </div>
</template>

<script>
import DataService from "../dataservice.js";

export default {
  //Oggetto passato dalla pagina ricerca
  props: {
    piatto: Object,
  },
  data: function () {
    return {
      prefer: [],
      utente: localStorage.getItem("userMail"),
      snack: false,
      messaggio: "",
    };
  },
  methods: {
    //Consente di passare l'id alla pagina di Detail tramite router
    passaId: function (index) {
      this.$router.push({
        name: "detail",
        params: {
          id: index,
        },
      });
    },
    //Consente di aggiungere un piatto ai preferiti sia nel vettore prefer che su database
    addPreferito: function (index, titolo, foto) {
      DataService.aggiungiPreferito(this.utente, index, titolo, foto)
        .then(() => {
          this.prefer.push(index);
          this.snack = true;
          this.messaggio = "Piatto aggiunto ai preferiti!";
        })
        .catch((error) => {
          this.snack = true;
          this.messaggio = error;
        });
    },
    //Consente di rimuovere un piatto dai preferiti sia nel vettore prefer sia dal database
    removePreferito: function (index) {
      //Cancello da vettore prefer
      let i = this.prefer.indexOf(index);
      this.prefer.splice(i, 1);
      //Elimino dal database
      DataService.rimuoviDocumento(this.utente, index);
      this.snack = true;
      this.messaggio = "Piatto rimosso dai preferiti!";
    },
  },
  //Riempie il vettore prefer con le informazioni sui preferiti passate dal database
  mounted: function () {
    this.prefer = [];

    DataService.riempiPreferiti(this.utente)
      .then((prefer) => {
        for (let i = 0; i < prefer.length; i++) {
          this.prefer.push(prefer[i].index);
        }
      })
      .catch((error) => {
        this.snack = true;
        this.messaggio = error;
      });
  },
};
</script>

<style></style>
