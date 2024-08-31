<template>
  <h1 class="text-center ma-4">Aggiungi una nuova ricetta</h1>
  <v-form @submit.prevent="saveRicetta()">
    <v-container>
      <v-text-field v-model="title" label="Nome del piatto"></v-text-field>
      <v-text-field
        v-model="ingrediente"
        label="Inserisci nuovo ingrediente"
        append-inner-icon="mdi-plus"
        @click:append-inner="addIngrediente()"
      ></v-text-field>
      <template v-if="ingredienti.length">
        <p>Ingredienti aggiunti</p>
        <v-chip-group>
          <v-chip v-for="(ing, index) in ingredienti" :key="index" class="ma-2"
            >{{ ing
            }}<v-btn variant="text" @click.prevent="removeIngrediente(ing)"
              ><v-icon>mdi-trash-can-outline</v-icon></v-btn
            ></v-chip
          >
        </v-chip-group>
      </template>
      <v-textarea
        v-if="modifica !== true"
        v-model="step"
        label="Inserisci nuovo step di preparazione"
        append-inner-icon="mdi-plus"
        @click:append-inner="addStep()"
      ></v-textarea>
      <v-textarea
        v-else
        v-model="step"
        label="Modifica step di preparazione"
        append-inner-icon="mdi-pencil"
        @click:append-inner="saveStep(step)"
      ></v-textarea>
      <template v-if="procedimento.length">
        <p>Passaggi aggiunti</p>
        <v-list>
          <v-list-item v-for="(passo, index) in procedimento" :key="index">
            {{ index + 1 }}. {{ passo }}
            <v-btn variant="text" @click.prevent="modificaStep(passo)"
              ><v-icon>mdi-pencil</v-icon></v-btn
            ><v-btn variant="text" @click.prevent="removeStep(passo)"
              ><v-icon>mdi-trash-can-outline</v-icon></v-btn
            >
          </v-list-item>
        </v-list>
      </template>
      <v-text-field v-model="url" label="Link dell'immagine"></v-text-field>
    </v-container>
    <div class="text-center">
      <v-btn
        v-if="
          title !== '' &&
          ingredienti.length !== 0 &&
          procedimento.length !== 0 &&
          url !== ''
        "
        type="submit"
        :loading="loading"
        class="ma-5"
        >Salva ricetta</v-btn
      >
    </div>
  </v-form>
  <v-snackbar v-model="snack">{{ messaggio }}</v-snackbar>
</template>

<script>
import DataService from "../dataservice";

export default {
  data: function () {
    return {
      title: "",
      ingrediente: "",
      url: "",
      step: "",
      ingredienti: [],
      procedimento: [],
      stepVecchio: "",
      modifica: false,
      loading: false,
      utente: localStorage.getItem("userMail"),
      snack: false,
      messaggio: "",
    };
  },
  methods: {
    //Aggiunge un nuovo ingrediente al vettore ingredienti
    addIngrediente: function () {
      if (this.ingrediente !== "") {
        //Controlla che l'ingrediente non sia già presente nel vettore
        let presente = this.ingredienti.includes(this.ingrediente);
        if (!presente) {
          this.ingredienti.push(this.ingrediente);
        }
        this.ingrediente = "";
      }
    },
    //Rimuove l'ingrediente dal vettore ingredienti
    removeIngrediente: function (ingrediente) {
      let i = this.ingredienti.indexOf(ingrediente);
      this.ingredienti.splice(i, 1);
    },
    //Aggiunge lo step di preparazione al vettore procedimento
    addStep: function () {
      if (this.step !== "") {
        this.procedimento.push(this.step);
        this.step = "";
      }
    },
    //Serve per salvare lo step prima della modifica e la variabile modifica che cambia textarea viene messa a true
    modificaStep: function (passo) {
      this.stepVecchio = passo;
      this.step = passo;
      this.modifica = true;
    },
    //Elimina ilm vecchio elemento dal vettore procedimento e inserisce quello modificato
    saveStep: function (passo) {
      let i = this.procedimento.indexOf(this.stepVecchio);
      this.procedimento.splice(i, 1, passo);
      this.step = "";
      this.modifica = false;
    },
    //Elimina lo step dal vettore procedimento
    removeStep: function (passo) {
      let i = this.procedimento.indexOf(passo);
      this.procedimento.splice(i, 1);
    },
    //Salva la ricetta nel database
    saveRicetta: function () {
      this.loading = true;
      DataService.salvaRicetta(
        this.utente,
        this.title,
        this.ingredienti,
        this.procedimento,
        this.url,
        "db-" + this.title.toLowerCase().split(" ").join("")
      )
        .then(() => {
          this.loading = false;
          this.snack = true;
          this.messaggio = "Ricetta salvata";
          this.title = "";
          this.ingredienti = [];
          this.procedimento = [];
          this.url = "";
        })
        .catch((error) => {
          this.snack = true;
          this.messaggio = error;
          this.loading = false;
        });
    },
  },
};
</script>

<style></style>
