import { createApp } from "vue";

import App from "./App.vue";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { createRouter, createWebHistory } from "vue-router";

import Home from "./pages/Home.vue";
import Ricerca from "./pages/Ricerca.vue";
import Preferiti from "./pages/Preferiti.vue";
import Detail from "./pages/Detail.vue";
import Ricette from "./pages/Ricette.vue";

const vuetify = createVuetify({
  components,
  directives,
});

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { name: "home", path: "/home", component: Home },
    { name: "ricerca", path: "/ricerca", component: Ricerca },
    { name: "preferiti", path: "/preferiti", component: Preferiti },
    { name: "detail", path: "/detail/:id", component: Detail },
    { name: "ricette", path: "/ricette", component: Ricette },
    { path: "/", redirect: "/home" },
  ],
});

//Fa in modo che se si cerca di navigare tra le rotte senza fare l'accesso si viene rimandati alla login(home)
router.beforeEach((to, from, next) => {
  if (to.name !== "home" && localStorage.getItem("accesso") !== "true") {
    next("/home");
  } else {
    next();
  }
});

createApp(App).use(vuetify).use(router).mount("#app");
