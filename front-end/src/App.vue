<template>
  <v-app class="d-flex">

    <TopNav/>
    <v-row class="pa-0 ma-0">
      <v-col class="pa-0">
        <SideBar></SideBar>
  
        <div class="text-center mb-16" style="width: 320px">
          <v-btn rounded outlined large @click="search">
            Search
          </v-btn>
        </div>

      </v-col>
      <v-col class="pa-0">
        <v-row class="pa-0 ma-0">
  
            <Result></Result>
        </v-row>
      </v-col>

    </v-row>
    
    <Footer/>
      
  </v-app>
</template>

<script>
import TopNav from './components/TopNav'
import Footer from './components/Footer'
import SideBar from "@/SideBar";
import Result from "@/Result";
import {searchImage} from "@/index";

export default {
  name: 'App',
  components: {
    SideBar,
    TopNav,
    Footer,
    Result,
  },
  methods: {
    search() {
      searchImage();
    }
  }
}
</script>

<style>
/*black outline of focus*/
*,*:focus,*:hover{
  outline:none;
}
</style>