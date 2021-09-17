<template>
  <div id="app" align="center">
      <div class="cell cell-map">       
        <MapContainer />
      </div>     
  </div>
</template>

<script>
//import FileUpload from "./components/FileUpload.vue";
import MapContainer from "./components/MapContainer.vue";

export default {
  name: "app",
  data() {
    return {          
    };
  },
  components: {   
    MapContainer
  },
};
</script>

<style>
  html, body {
    height: 100%;
    margin: 0;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    height: 90%;
    display: grid;
    
    grid-auto-rows: 1fr;
    grid-gap: 1rem;
    padding: 1rem;
    box-sizing: border-box;
  }

  .cell {
    border-radius: 4px;
    background-color: lightgrey;
  }

  .cell-upload {
    grid-column: 1;
    grid-row-start: 1;   
  }

  .cell-map {
    grid-column: 1;
    grid-row-start: 1;
    grid-row-end: 3;
  }

</style>

