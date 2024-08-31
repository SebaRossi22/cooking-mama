<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer">
      <v-list>
        <v-list-subheader>Menu</v-list-subheader>

        <v-list-item link to="/home">
          <template v-slot:prepend>
            <v-icon>mdi-home</v-icon>
          </template>
          Home
        </v-list-item>

        <template v-if="accesso === 'true'">
          <v-list-item link to="/ricerca">
            <template v-slot:prepend>
              <v-icon>mdi-magnify</v-icon>
            </template>
            Ricerca
          </v-list-item>
          <v-list-item link to="/ricette">
            <template v-slot:prepend>
              <v-icon>mdi-pen-plus</v-icon>
            </template>
            Crea ricetta
          </v-list-item>
          <v-list-item link to="/preferiti">
            <template v-slot:prepend>
              <v-icon>mdi-heart</v-icon>
            </template>
            Preferiti
          </v-list-item>
          <v-list-item @click.prevent="logout()">
            <template v-slot:prepend>
              <v-icon>mdi-logout</v-icon>
            </template>
            Logout
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar class="bg-warning">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-row class="align-start">
        <v-col cols="auto">
          <v-img
            width="30px"
            src="https://web.app-ofcr.com/OFFICE_CREATE/Website/APP_AC/APP_CMArcade/_img/appIcon_mama_150311.png"
          ></v-img>
        </v-col>
        <v-col cols="auto">
          <v-toolbar-title>Cooking Mama</v-toolbar-title>
        </v-col>
      </v-row>
      <p v-if="accesso === 'true'" class="pe-2">Benvenuto {{ user }}</p>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: function () {
    return {
      drawer: false,
      accesso: localStorage.getItem("accesso"),
      user: localStorage.getItem("userName"),
    };
  },
  methods: {
    //Setto la variabile di accesso a false e rimando alla home
    logout: function () {
      this.accesso = "false";
      localStorage.setItem("accesso", this.accesso);
      localStorage.setItem("userName", "");
      localStorage.setItem("userMail", "");
      this.$router.replace("/home");
    },
  },
  created: function () {
    //Riassegno alle varibili accesso e user il valore contenuto nel localstorage dopo ogni cambio di rotta
    this.$router.afterEach((from, to) => {
      this.accesso = localStorage.getItem("accesso");
      this.user = localStorage.getItem("userName");
    });
  },
};
</script>

<style></style>
