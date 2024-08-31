  <template>
  <v-dialog class="dialog" v-model="dialog" scrollable width="500">
    <template v-slot:activator="{ props }">
      <v-btn v-if="!recPresente" variant="text" color="pink" v-bind="props">
        Aggiungi Recensione
      </v-btn>
      <v-btn
        v-else
        variant="text"
        v-bind="props"
        @click.prevent="dati(titolo, rec, stelle)"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-text>
        <v-text-field
          v-model="titoloRec"
          variant="filled"
          label="Titolo recensione"
          type="text"
        ></v-text-field>
        <v-textarea
          name="input-7-1"
          variant="filled"
          label="Recensione"
          auto-grow
          v-model="recensione"
        ></v-textarea>
        <div class="text-center">
          <v-rating v-model="rating" hover></v-rating>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
          Close
        </v-btn>
        <v-btn
          :loading="loading"
          color="blue-darken-1"
          variant="text"
          @click.prevent="
            salvaRecensione(titoloRec, recensione, rating, id, utente)
          "
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-snackbar v-model="snack"> {{ messaggio }}</v-snackbar>
</template>

<script>
import DataService from "../dataservice.js";

export default {
  props: {
    id: Number,
    recPresente: Boolean,
    titolo: String,
    rec: String,
    stelle: Number,
  },
  data: function () {
    return {
      dialog: false,
      utente: localStorage.getItem("userMail"),
      rating: 0,
      recensione: "",
      titoloRec: "",
      messaggio: "",
      snack: false,
      loading: false,
      recensioni: [],
      presente: false,
    };
  },
methods: {
    //Funzione che nel caso della modifica della recensione gia creata, inserisce negli elementi di input(textfield, textarea e rating)
    //il valori della recensione da modificare
    dati: function (titolo, rec, stelle) {
      this.rating = stelle;
      this.recensione = rec;
      this.titoloRec = titolo;
    },
    //Funzione che salva la recensione
    salvaRecensione: function (titolo, recensione, stelle, id, utente) {
      this.loading = true;
      //Controllo che l'utente abbia inserito il titolo e la recensione
      if (titolo !== "" && recensione !== "") {
        //Salviamo una nuova recensione
        DataService.aggiungiRecensione(
          titolo,
          recensione,
          stelle,
          id.toString(),
          utente
        )
          .then(() => {
            this.snack = true;
            this.messaggio = "Recensione salvata!";
            this.loading = false;
            this.dialog = false;

            //Scarica tutte le recensioni per il piatto interessato
            DataService.scaricaRecensioni(this.id.toString())
              .then((recensioni) => {
                for (let recensione of recensioni) {
                  if (recensione.utente === this.utente) {
                    this.presente = true;
                  }
                }
                //Emmette un evento chiamato recensioni che serve a passare alla pagina Detail il vettore recensioni e la variabile booleana
                //che dice se è presente oppure non la recensione dell'utente loggato
                this.$emit("recensioni", [recensioni, this.presente]);

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
            this.dialog = false;
          });
      } else {
        this.snack = true;
        this.messaggio = "Inserisci la recensione completa!";
        this.loading = false;
      }
    },
  },
};
</script>

<style></style>
