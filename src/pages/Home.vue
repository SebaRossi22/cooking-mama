<template>
  <div>
    <div v-if="accesso !== 'true'">
      <login v-if="type === true"></login>
      <registra v-else></registra>
      <div class="container">
        <template v-if="type === true">
          <p>Non hai ancora un account?</p>
          <v-btn variant="text" @click="type = false"> Registrati </v-btn>
        </template>
        <template v-else>
          <p>Hai già un account?</p>
          <v-btn variant="text" @click="type = true"> Accedi </v-btn>
        </template>
      </div>
    </div>
    <carosello v-else></carosello>
  </div>
</template>

<script>
import login from "/src/components/Login.vue";
import registra from "/src/components/Registra.vue";
import carosello from "/src/components/Carosello.vue";

export default {
  data: function () {
    return {
      type: true,
      accesso: localStorage.getItem("accesso"),
    };
  },
  components: {
    login,
    registra,
    carosello,
  },
  created: function () {
    this.$router.afterEach((from, to) => {
      this.accesso = localStorage.getItem("accesso");
    });
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
