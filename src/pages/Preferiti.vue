<template>
  <div>
    <v-progress-linear v-if="loading" indeterminate></v-progress-linear>
    <v-list v-else>
      <template v-for="preferito in prefer" :key="preferito.id">
        <v-list-item
          :title="preferito.titolo"
          @click.prevent="passaId(preferito.index)"
        >
          <template v-slot:prepend>
            <v-avatar>
              <v-img :src="preferito.foto"></v-img>
            </v-avatar>
          </template>
          <template v-slot:append>
            <v-btn
              @click.prevent.stop="removePreferito(preferito.index)"
              icon="mdi-close"
              variant="text"
            ></v-btn>
          </template>
        </v-list-item>
        <v-divider></v-divider>
      </template>
    </v-list>
    <v-snackbar v-model="snack"> {{ messaggio }} </v-snackbar>
  </div>
</template>

<script>
import DataService from "../dataservice.js";
import axios from "axios";

export default {
  data: function () {
    return {
      prefer: [],
      utente: localStorage.getItem("userMail"),
      loading: false,
      snack: false,
      messaggio: "",
    };
  },
  methods: {
    passaId: function (index) {
      this.$router.push({
        name: "detail",
        params: {
          id: index,
        },
      });
    },
    removePreferito: function (index) {
      let ind = -1;
      for (let i = 0; i < this.prefer.length; i++) {
        if (this.prefer[i].index === index) {
          ind = i;
        }
      }
      if (ind !== -1) {
        this.prefer.splice(ind, 1);
        DataService.rimuoviDocumento(this.utente, index);
        this.snack = true;
        this.messaggio = "Piatto rimosso dai preferiti!";
      }
    },
  },
  mounted: function () {
    this.loading = true;
    this.prefer = [];

    DataService.riempiPreferiti(this.utente)
      .then((preferiti) => {
        this.prefer = preferiti;
        this.loading = false;
      })
      .catch((error) => {
        //Gestisco gli errori
        this.snack = true;
        this.messaggio = error;
        this.loading = false;
      });
  },
};
</script>

<style></style>
