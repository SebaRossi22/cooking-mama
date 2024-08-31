<template>
  <div>
    <v-sheet class="pt-12 pb-6" rounded>
      <v-card class="mx-auto px-6 py-8 form">
        <v-form @submit.prevent="accedi()">
          <!--clearable serve per creare l'icona che consente di cancellare il testo-->
          <v-text-field
            v-model="email"
            class="mb-2"
            clearable
            label="Email"
          ></v-text-field>

          <v-text-field
            type="password"
            v-model="password"
            clearable
            label="Password"
            placeholder="Enter your password"
          ></v-text-field>

          <div v-if="error === true">{{ errore }}</div>
          <br />
          <v-btn
            :loading="loading"
            block
            class="bg-success"
            size="large"
            type="submit"
            >Sign In
          </v-btn>
        </v-form>
      </v-card>
    </v-sheet>
  </div>
</template>

<script>
import DataService from "../dataservice.js";

export default {
  data: function () {
    return {
      email: "",
      password: "",
      loading: false,
      accesso: localStorage.getItem("accesso"),
      utente: {}, //Oggetto che conterrà le informazioni del utente
      error: false,
      errore: "",
    };
  },
  methods: {
    accedi: function () {
      this.loading = true;
      this.utente = {};

      //Controllo che i campi siano stati riempiti
      if (this.email === "" || this.password === "") {
        this.error = true;
        this.errore = "Riempi i campi vuoti!";
        this.loading = false;
      } else {
        // Richiedo i dati per la login
        DataService.login(this.email)
          .then((utente) => {
            // Riempio l'oggetto utente con i dati ottenuti
            this.utente = utente;

            //Controllo che la password e la mail inserite coincidano con quelle inserite nell'oggetto utente
            //Altrimenti fornisco un errore
            if (
              this.utente.mail === this.email &&
              this.utente.password === this.password
            ) {
              //Se coincidono faccio l'accesso, registro tre parametri nel localStorage e rimando alla home
              this.accesso = "true";
              localStorage.setItem("accesso", this.accesso);
              localStorage.setItem("userName", this.utente.username);
              localStorage.setItem("userMail", this.utente.mail);
              this.$router.replace("/home");
            } else {
              this.error = true;
              this.errore = "Password errata!";
              this.password = "";
            }
            this.loading = false;
          })
          .catch((error) => {
            // Gestisco l'errore nel caso in cui la richiesta fallisca
            this.error = true;
            this.errore = error;
            this.loading = false;
            this.email = "";
            this.password = "";
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
