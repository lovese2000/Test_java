<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      max-width="750"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          dark
          icon
          large
        >
          <v-icon color="black">mdi-cog</v-icon>
        </v-btn>
      </template>
      <v-card
        class="pa-2"
      >
        <v-card-title class="headline justify-center">
          
          User Manual
        </v-card-title>

        <v-card-text class="pa-1">
          <v-col
            v-for="id in (manual.length/2)"
            :key="id"
          >
            <v-row no-gutters>
              <v-spacer></v-spacer>
              <v-col>
                {{ manual[(id - 1) * 2].split(":")[0] }}
              
              </v-col>
              <v-col>
                {{ manual[(id - 1) * 2].split(":")[1] }}
              </v-col>
              <v-spacer></v-spacer>
              <v-col>
                {{ manual[(id - 1) * 2 + 1].split(":")[0] }}
              
              </v-col>
              <v-col>
                {{ manual[(id - 1) * 2 + 1].split(":")[1] }}
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
          </v-col>
          <v-spacer></v-spacer>
        
        
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>

export default {
  name: "ViewSelectCard",
  data: () => ({
    value: 1,
    dialog: false,
    
    manual: [
      "import:导入新图片，并刷新场景", "update:使用新参数生成体量，返回结果" , "save:保存无水印截图",
      "edge:是否有边线","threshold:明度差剖分阈值", "minimal:最小体素大小",
      "W:Translate", "E:Rotate", "R:Scale", "+/-:Size"
      , "Q:World/Local", "S:Snap", "C:Camera", "1-9:Camera View"]
  }),
  mounted() {
  },

}
</script>

<style scoped>

</style>