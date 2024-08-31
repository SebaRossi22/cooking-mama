<template>
  <div>
    <v-progress-linear v-if="loading" indeterminate></v-progress-linear>
    <v-container v-else>
      <v-row>
        <v-col cols="12" lg="6" md="6">
          <v-img class="align-end text-white" :src="immagine" cover> </v-img>
        </v-col>
        <v-col cols="12" lg="6" md="6">
          <v-card-title
            >{{ titolo }}
            <v-btn
              color="pink"
              variant="text"
              v-if="!prefer.includes(id)"
              @click.prevent="addPreferito(id, titolo, immagine)"
              ><v-icon>mdi-heart-outline</v-icon></v-btn
            >
            <v-btn
              v-else
              variant="text"
              @click.prevent="removePreferito(id)"
              color="pink"
              ><v-icon>mdi-heart</v-icon></v-btn
            ></v-card-title
          >
          <v-card-subtitle v-if="creatore !== ''"
            >Chef: {{ creatore }}</v-card-subtitle
          >

          <v-item-group class="mt-5">
            <v-card-subtitle>Ingredienti</v-card-subtitle>
            <v-item v-for="ingrediente in ingredienti" :key="ingrediente">
              <v-chip class="ma-2">{{ ingrediente }}</v-chip>
            </v-item>
          </v-item-group>
        </v-col>
      </v-row>

      <v-card-subtitle class="mt-5">Istruzioni</v-card-subtitle>
      <v-list>
        <v-list-item v-for="(step, index) in istruzioni" :key="index">
          {{ index + 1 }}. {{ step }}
        </v-list-item>
      </v-list>

      <v-card
        v-for="(rec, index) in recensioni"
        :key="index"
        class="ma-5"
        cols="12"
      >
        <v-card-title
          >{{ rec.titolo }}
          <template v-if="recPresente && rec.utente === utente">
            <valutazione
              :id="id"
              :recPresente="recPresente"
              :titolo="rec.titolo"
              :rec="rec.recensione"
              :stelle="rec.stelle"
              @recensioni="caricaRecensioni"
            ></valutazione>
            <v-btn variant="text" @click.prevent="removeRecensione(rec.index)">
              <v-icon>mdi-trash-can-outline</v-icon>
            </v-btn>
          </template>
        </v-card-title>
        <v-card-subtitle>{{ rec.utente }}</v-card-subtitle>
        <v-card-text> {{ rec.recensione }} </v-card-text>
        <div class="text-center">
          <div class="text-h2 mt-5">
            {{ rec.stelle }}
            <span class="text-h6 ml-n3">/5</span>
          </div>
          <v-rating
            color="yellow-darken-3"
            v-model="rec.stelle"
            readonly
          ></v-rating>
        </div>
      </v-card>

      <div class="text-center">
        <valutazione
          v-if="!recPresente"
          :id="id"
          @recensioni="caricaRecensioni"
        ></valutazione>
      </div>
    </v-container>
    <v-snackbar v-model="snack"> {{ messaggio }}</v-snackbar>
  </div>
</template>

<script>
import axios from "axios";
import DataService from "../dataservice.js";
import valutazione from "/src/components/Valutazione.vue";

export default {
  data: function () {
    return {
      immagine: "",
      titolo: "",
      istruzioni: [],
      ingredienti: [],
      id: "",
      creatore: "",
      messaggio: "",
      snack: false,
      loading: false,
      recensioni: [],
      prefer: [],
      recPresente: false,
      utente: localStorage.getItem("userMail"),
    };
  },
  components: {
    valutazione,
  },
  methods: {
    //Prende il vettore recensioni e la variavile booleana che ci dice se la recensione per l'utente loggato è presente oppure no
    caricaRecensioni: function (valori) {
      this.recensioni = valori[0];
      this.recPresente = valori[1];
    },
    //Rimuove la recensione sia dal vettore recensioni che da database
    removeRecensione: function (piatto) {
      let index = 0;
      for (let i = 0; i < this.recensioni.length; i++) {
        if (this.recensioni[i].utente === this.utente) {
          index = i;
        }
      }
      this.recensioni.splice(index, 1);
      DataService.rimuoviDocumento(piatto, this.utente);
      //Metto a false questa variabile per determinare che non è presente una recesnione per l'utente loggato
      this.recPresente = false;
      this.snack = true;
      this.messaggio = "Recensione rimossa!";
    },
    //Aggiungo il piatto ai preferiti
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
    //Rimuovo il piatto dai preferiti
    removePreferito: function (index) {
      let i = this.prefer.indexOf(index);
      this.prefer.splice(i, 1);
      DataService.rimuoviDocumento(this.utente, index);
      this.snack = true;
      this.messaggio = "Piatto rimosso dai preferiti!";
    },
    //Riempie i vettori prefer e recensioni con le informazioni scaricate dal database
    RecensioniEPreferiti: function () {
      DataService.riempiPreferiti(this.utente)
        .then((prefer) => {
          for (let i = 0; i < prefer.length; i++) {
            this.prefer.push(prefer[i].index);
          }

          DataService.scaricaRecensioni(this.id.toString())
            .then((recensioni) => {
              this.recensioni = recensioni;
              //Controllo che se c'è una recensione per l'utente che è loggato
              for (let recensione of this.recensioni) {
                if (recensione.utente === this.utente) {
                  this.recPresente = true;
                }
              }
              this.loading = false;
            })
            .catch((error) => {
              this.snack = true;
              this.messaggio = error;
              this.loading = false;
            });
        })
        .catch((error) => {
          this.snack = true;
          this.messaggio = error;
          this.loading = false;
        });
    },
  },
  mounted: function () {
    //Assegna l'id passato tramite router alla variabile id
    this.id = this.$route.params.id.toString();
    this.loading = true;
    this.prefer = [];

    //Se l'id passato inizia con "db-" indexOf restituisce un indice che è maggiore di -1
    const inizio = "db-";
    const indiceInizio = this.id.indexOf(inizio);
    //Se indiceInizio è maggiore di -1 significa che la ricetta è stata creata da un utente
    if (indiceInizio > -1) {
      //Scarico la ricetta interessata e assegno ogni valore alle varibili
      DataService.scaricaRicetta(this.id)
        .then((ricetta) => {
          this.immagine = ricetta.image;
          this.titolo = ricetta.title;
          this.creatore = ricetta.utente;

          for (let passaggio of ricetta.procedimento) {
            this.istruzioni.push(passaggio);
          }

          for (let ingrediente of ricetta.ingredienti) {
            this.ingredienti.push(ingrediente);
          }

          //Scarico recensioni e preferiti
          this.RecensioniEPreferiti();
        })
        .catch((error) => {
          this.snack = true;
          this.messaggio = error;
          this.loading = false;
        });
    } else {
      //Se la ricetta non è tra quelle create dagli utenti significa che devo fare una chiamata all'API
      axios({
        method: "get",
        url:
          "https://api.spoonacular.com/recipes/" +
          this.id +
          "/information?apiKey=fbc24a0698bd4f19ae6abb0267b5387d",
      })
        .then((result) => {
          this.immagine = result.data.image;
          this.titolo = result.data.title;

          for (let passaggio of result.data.analyzedInstructions[0].steps) {
            this.istruzioni.push(passaggio.step);
          }

          for (let ingrediente of result.data.extendedIngredients) {
            this.ingredienti.push(ingrediente.name);
          }

          this.RecensioniEPreferiti();
        })
        .catch(function (error) {
          this.snack = true;
          this.messaggio = error;
          this.loading = false;
        });
    }
  },
};
</script>

<style></style>
