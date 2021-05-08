<template>
  <v-card
    class="pt-10"
    flat
  >
    <v-navigation-drawer
      width="320px"
      permanent
      class="pt-5"
    >
      <v-card flat min-width="320px">
        <template style="background:#ffffff;">
          <div
            id="gui-container"
            style="position:absolute;right:0;z-index:999"
          ></div>
          <div id="container" class="d-flex justify-sm-center">
          </div>
        </template>
        
      </v-card>
      <v-divider></v-divider>
      
      <v-row
        dense
        class="my-3"
      >
        <v-col
          v-for="item in items"
          :key="item.label"
          class="col-12"
          dense
        >
          <v-slider
            class="px-5"
            dense
            v-model="item.val"
            step="0.0001"
            max="1"
            min="0"
            color="black"
            track-color="grey"
            thumb-color="brown"
            :label="item.label"
            :hint="item.hint"
            persistent-hint
          >

          </v-slider>
          <v-divider
            class="mx=0"
            v-if="item.hint===''"
          ></v-divider>

        </v-col>
        <v-card flat>
          <template style="background:#ffffff;">
            <div id="piechart" class="d-flex justify-sm-center">
            </div>

  
          </template>
  
        </v-card>
        

      </v-row>
  

    </v-navigation-drawer>
  

  </v-card>
</template>

<script>
export default {
  name: "SideBar",
  data: () => ({
    items: [
      { label: 'Morphology', val: 0.2, hint: '' },
      { label: 'Area', val: 0.2, hint: 'loading...' },
      { label: 'GSI', val: 0.3, hint: 'loading...' },
      { label: 'Activity', val: 0.4, hint: 'loading...' },
      { label: 'Function', val: 0.5, hint: 'ratio is changeable' },
    ],
    right: null,
  }),
  mounted() {
    window.SideBar = this;
  
    const index = require('@/index.js');
    index.main();
    
    const pie = require('@/piechart.js');
    pie.main();
  },
}
</script>

<style scoped>

</style>