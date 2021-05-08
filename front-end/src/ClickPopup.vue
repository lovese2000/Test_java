<template>
  <v-row>
    <v-list class="ma-1 pa-0">
      <v-list-item class="subtitle-1">
        {{lat.toFixed(4)}}, {{lon.toFixed(4)}}
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item
        class="subtitle-1"
        @click="requestBlockID(blockID)"
      >
        {{block}}
      </v-list-item>
    </v-list>
  </v-row>
</template>

<script>
import Vue from 'vue'
import {setBlockID} from "@/index";

export default Vue.extend({
  props: {
    lat: {
      type: Number,
      default: 0
    },
    lon: {
      type: Number,
      default: 0
    },
    block: {
      type: String,
      default: "No valid block"
    },
  },
  data: ()=>({
    blockID:0
  }),
  methods: {
    requestBlockID(id){
      if(id !== -1) {
        setBlockID(id);
      }
    },
  },
})
</script>

<style scoped>

</style>