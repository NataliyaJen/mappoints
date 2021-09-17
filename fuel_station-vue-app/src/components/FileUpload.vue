<template>
  <div style="width:50%" >
      <div v-if="!isDataMapLoad">
        <b-form-file
          v-model="selectedFile"
          :state="Boolean(selectedFile)"
          placeholder="Choose or drop here..."
          drop-placeholder="Drop here..."
          ref="file-input"
          accept=".json"
          size="sm"                   
        ></b-form-file>
        <div class="mt-3">Selected file: <b>{{ selectedFile ? selectedFile.name : "" }}</b></div>
        <b-button @click="onUploadFile" :disabled="!this.selectedFile" size="sm" variant="outline-secondary" class="mr-2">Load JSON</b-button>
        <b-button @click="clearFiles" :disabled="!this.selectedFile" size="sm" variant="outline-secondary">Reset input</b-button>
      </div>
     
  </div>
</template>

<script>

import axios from "axios";
export default {
  data() {
    return {
      selectedFile: null,      
      isDataMapLoad:false,
      dataMap:null
    };
  },
  
   methods: {    
    onUploadFile() {
      const formData = new FormData();
      formData.append("file", this.selectedFile);  // appending file

     // sending file to the backend
      axios
        .post("http://localhost:4500/upload", formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        }) 
        .then(res => {
          this.dataMap = res.data;
          this.isDataMapLoad = false; //change on true after
          this.$emit('CustomEventInputChanged', this.dataMap);
          //console.log(res.data); 
        })
        .catch(err => {
          console.log(err);
        });
    },
     clearFiles() {
        this.$refs['file-input'].reset()
      },
    emitEventChanged () {
      alert(this.dataMap);
                this.$emit('CustomEventInputChanged', this.dataMap);
            }
  },

};
</script>