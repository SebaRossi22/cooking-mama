<template>
  <v-container>
    <div class="text-center ma-5">
      <!--Button che consentono di vedere o il componente vedi o il componente crea-->
      <v-btn-toggle>
        <v-btn :active="type === true" @click.prevent="type = true">
          Crea
        </v-btn>

        <v-btn @click.prevent="type = false"> Vedi </v-btn>
      </v-btn-toggle>
    </div>

    <crea v-if="type === true"></crea>
    <vedi v-if="type === false"></vedi>
  </v-container>
</template>

<script>
import crea from "/src/components/Crea.vue";
import vedi from "/src/components/Vedi.vue";

export default {
  data: function () {
    return {
      type: true,
    };
  },
  components: {
    crea,
    vedi,
  },
};
</script>

<style></style>
