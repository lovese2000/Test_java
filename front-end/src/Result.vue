<template>
  <section>
    <div id="map"></div>
    
    <div
      id="result"
    >
      
      <v-card
        id="result-card"
        class="overflow-x-auto overflow-y-hidden d-flex flex-no-wrap "
        flat
        height="248px"
      >
        
        <v-container v-for="(block, i) in blocks" :key="i">
          <v-hover v-slot:default="{ hover }">
            
            <v-card
              :class="{ 'on-hover': hover }"
              :elevation="hover ? 10 : 4"
              max-height="220px"
              max-width="220px"
              @click="flyTo(block.lat, block.lng)"
            >
              
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-img
                    v-bind="attrs"
                    v-on="on"
                    :src="'https://model.amomorning.com/block/'+(block.id)+'.jpg'"
                    class="mx-1"
                  >
                    <template v-slot:placeholder>
                      <v-row
                        align="center"
                        class="fill-height ma-0"
                        justify="center"
                      >
                        <v-progress-circular
                          color="grey lighten-5"
                          indeterminate
                        ></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </template>
                <span>
                  {{"id: " + block.id}} <br>
                  {{"lat: " + block.lat}} <br>
                  {{"lng: " + block.lng}} <br>
                  {{"block area: " + block.A.toFixed(2) + "m2"}} <br>
                  {{"built area: " + block.B.toFixed(2) + "m2"}} <br>
                  {{"GSI: " + block.GSI.toFixed(4)}} <br>
                  {{"activities: " + (block.T_dense / Math.sqrt(block.A)).toFixed(4)}} <br>
                  {{"trajectory nums: " + block.T_num}} <br>
                  {{"POI nums: " + block.F_num}} <br>
                  
                </span>
              </v-tooltip>
            
            </v-card>
          </v-hover>
        
        </v-container>
      
      </v-card>
    
    </div>
  
  
  </section>
  <!--  image result-->
</template>

<script>
import {main, mapFlyTo} from "@/map";

export default {
  name: "Result",
  data: () => ({
    length: 4,
    window: 0,
    blocks:[]
  }),
  mounted() {
    main();
    
    window.Result = this;
    
  },
  methods: {
    flyTo(lat, lng) {
      mapFlyTo(lat, lng);
    }
    
  }
}
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
}

#map {
  position: absolute;
  left: 320px;
  top: 0;
  bottom: 0;
  width: calc(100% - 320px);
  height: calc(100% - 300px);
  outline: 1px solid #E0E0E0;
}

#result {
  position: absolute;
  left: 320px;
  top: calc(100% - 300px);
  height: 250px;
  width: calc(100% - 320px);
  outline: 1px solid #E0E0E0;
  background: #FFFFFF;
}

#result-card {
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
}

*::-webkit-scrollbar {
  width: 4px;
  height: 8px;
}

*::-webkit-scrollbar-thumb {
  background-color: #6e6e6e;
  border-radius: 6px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}

*::-webkit-scrollbar-thumb:hover {
  background-color: #ababab;
}

*::-webkit-scrollbar-track {
  background: #ffffff;
}
</style>