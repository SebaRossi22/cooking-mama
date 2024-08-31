<template>
  <div>
    <v-sheet class="pt-12 pb-6" rounded>
      <v-card class="mx-auto px-6 py-8 form">
        <form @submit.prevent="registrazione()">
          <v-container>
            <v-text-field
              v-model="first"
              label="First name"
              variant="underlined"
            ></v-text-field>

            <v-text-field
              v-model="last"
              label="Last name"
              variant="underlined"
            ></v-text-field>

            <v-text-field
              v-model="user"
              label="Username"
              variant="underlined"
            ></v-text-field>

            <v-text-field
              v-model="Mail"
              label="Email"
              variant="underlined"
            ></v-text-field>

            <v-text-field
              v-model="pass"
              label="Password"
              type="password"
              placeholder="Enter your password"
              variant="underlined"
            ></v-text-field>
            <div v-if="error === true">{{ errore }}</div>
          </v-container>

          <v-card-actions>
            <v-btn
              :loading="loading"
              block
              class="bg-success"
              size="large"
              type="submit"
              variant="elevated"
              >Sign Up
            </v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-sheet>
  </div>
</template>

<script>
import DataService from "../dataservice.js";

export default {
  data: function () {
    return {
      //Dati inseriti dall'utente
      first: "",
      last: "",
      Mail: "",
      pass: "",
      user: "",
      //-----------
      loading: false, //Gestisco il caricamento
      accesso: localStorage.getItem("accesso"), //Variabile che gestisce l'accesso, è salvata su localStorage
      //Variabili per la gestione degli errori
      error: false,
      errore: "",
    };
  },
  methods: {
    registrazione: function () {
      this.loading = true;

      //Controllo che i campi siano stati riempiti
      if (
        this.first === "" ||
        this.last === "" ||
        this.user === "" ||
        this.pass === "" ||
        this.Mail === ""
      ) {
        this.error = true;
        this.errore = "Riempi i campi vuoti!";
        this.loading = false;
      } else {
        //Controllo che non sia gia registrato
        DataService.presenza(this.Mail)
          .then((presente) => {
            if (presente) {
              this.error = true;
              this.errore = "Utente già registrato!";
              this.first = "";
              this.last = "";
              this.pass = "";
              this.user = "";
              this.Mail = "";
              this.loading = false;
            } else {
              //Registro l'utente
              DataService.registra(
                this.first,
                this.last,
                this.user,
                this.pass,
                this.Mail
              )
                .then(() => {
                  //Una volta eseguita la registarzione, faccio l'accesso, registro tre parametri nel localStorage e rimando alla home
                  this.accesso = "true";
                  localStorage.setItem("accesso", this.accesso);
                  localStorage.setItem("userName", this.user);
                  localStorage.setItem("userMail", this.Mail);
                  this.$router.replace("/home");
                  this.loading = false;
                })
                .catch((error) => {
                  //Gestisco l'errore nel caso in cui la richiesta relativa alla registrazione fallisca
                  this.error = true;
                  this.errore = error;
                  this.loading = false;
                });
            }
          })
          .catch((error) => {
            //Gestisco l'errore nel caso in cui la richiesta relativa alla mail già presente fallisca
            this.error = true;
            this.errore = error;
            this.loading = false;
          });
      }
    },
  },
};
</script>

<style scoped>
.form {
  max-width: 344px;
}
</style>
