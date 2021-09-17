<template>
  <div id="show" align="center">      
      <div class="cell cell-map">
        Map
      </div>
      <div class="cell cell-edit">
        Edit
      </div>
      <div class="cell cell-inspect">
        Inspect
      </div>
  </div>
</template>

<script>
  export default {
    name: 'ShowMap'
  }
</script>

<style>
  html, body {
    height: 100%;
    margin: 0;
  }

  #show {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    height: 100%;
    display: grid;
    grid-template-columns: 100vh;
    grid-auto-rows: 1fr;
    grid-gap: 1rem;
    padding: 1rem;
    box-sizing: border-box;
  }

  .cell {
    border-radius: 4px;
    background-color: lightgrey;
  }

  .cell-map {
    grid-column: 1;
    grid-row-start: 1;
    grid-row-end: 3;
  }

  .cell-edit {
    grid-column: 2;
    grid-row: 1;
  }

  .cell-inspect {
    grid-column: 2;
    grid-row: 2;
  }
</style>