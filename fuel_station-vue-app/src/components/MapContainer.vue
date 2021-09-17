<template>
  <div ref="map-root" id="map-root"
       style="width: 100%; height: 100%">
       <div style="width: 100%;" align="right" v-if="this.dataMap!=null"><!-- download and price details buttons -->
          <b-button variant="outline-secondary" size="sm" @click="downloadJson">Download Json</b-button>
          <b-button variant="outline-secondary" v-b-toggle.sidebar-prices size="sm">Prices</b-button>
          <b-sidebar id="sidebar-prices" title="Prices" right shadow bg-variant="light" text-variant="secondary">
              <div class="px-3 py-2" align="left" style="width:90%">  
                <div v-for="prc in this.r_prices" :key="prc.product_id">
                  <span v-html="prc.product_id"></span>:<br>
                    <b-input-group>
                      <b-form-input v-model="prc.price" placeholder="Enter price" trim />&nbsp;{{prc.currency}} 
                    </b-input-group> 
                     <b-button variant="outline-secondary" size="sm" @click="updatePrice(prc, prc.price)">Update</b-button> 
                    <br><br>                                                           
                </div>
              </div>
             
          </b-sidebar>
        </div>
      <FileUpload @CustomEventInputChanged="getDateFromJson"/>
   
    <b-modal id="bv-modal-station"><!-- station details -->
      <template #modal-header>
          <span v-if="!isChangeNAbil" v-html="r_starion.name"></span>
          <b-form-input v-if="isChangeNAbil" v-model="r_starion.name" placeholder="Enter station name" trim >          
          </b-form-input>  
          <b-button variant="outline-secondary" size="sm" @click="openNameForChange" v-if="!isChangeNAbil">Change</b-button>  
                    
      </template>
      <div>
        <span>Adress: </span><span v-html="r_starion.address"></span><br>
        <span>City: </span><span v-html="r_starion.city"></span> <br>
        <span>Latitude: </span><span v-html="r_starion.latitude"></span>
        <span> Longitude: </span><span v-html="r_starion.longitude"></span> 
        <hr>
        <div v-for="prod in r_product" :key="prod.product_id">
          <div v-if="prod.status=='available'">
            <span v-html="prod.product_id"/>: <span v-html="prod.price"/>&nbsp;<span v-html="prod.currency"/><br>       
          </div>
        </div>
             
      </div>

       <template #modal-footer="">        
        <b-button @click="saveNameStation" variant="outline-secondary" :disabled="!isChangeNAbil">Save update</b-button>
        <b-button @click="deleteStation" variant="outline-secondary" >Delete station</b-button>
        <b-button @click="closeModal" variant="outline-secondary">Close</b-button>       
      </template>      
    </b-modal>


    <b-modal id="bv-modal-new-station" hide-footer><!-- insert new station -->
      <template #modal-title>
        Input New Fuel Station
      </template>
      <div class="d-block text-center">
        <b-form-input v-model="n_id" :state="idState" type="number"
          aria-describedby="input-live-help input-live-feedback" placeholder="Enter id station" trim>
        </b-form-input>
        <br>
        <b-form-input v-model="n_name" :state="nameState" 
          aria-describedby="input-live-help input-live-feedback" placeholder="Enter station name" trim>
        </b-form-input>
        <br><b-form-input v-model="n_address" :state="adrState" 
          aria-describedby="input-live-help input-live-feedback" placeholder="Enter station address" trim>
        </b-form-input>
        <br><b-form-input v-model="n_city" :state="cityState" 
          aria-describedby="input-live-help input-live-feedback" placeholder="Enter station city" trim>
        </b-form-input>
        <br><b-form-input v-model="n_latitude" :state="latitState" 
          aria-describedby="input-live-help input-live-feedback" disabled placeholder="Enter station latitude" trim>
        </b-form-input>
        <br><b-form-input v-model="n_longitude" :state="longState" 
          aria-describedby="input-live-help input-live-feedback" disabled placeholder="Enter station longitude" trim>
        </b-form-input>
      </div >
      <div>
        <b-button class="mt-2" @click="saveStation" :disabled="saveDis">Save</b-button>
        <b-button class="mt-2" @click="$bvModal.hide('bv-modal-new-station')">Close</b-button>
      </div>
    </b-modal>
  </div> 
</template>

<script>
  import {Feature, Map, View} from 'ol/index';
  //import {OSM, Vector as VectorSource, TileWMS} from 'ol/source.js';
  import {OSM, Vector as VectorSource, TileWMS} from 'ol/source.js';
  import {Circle, Fill, Style} from 'ol/style';
  import {Point} from 'ol/geom';
  import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
  import {fromLonLat, toLonLat} from 'ol/proj';  
  //import {toStringXY} from 'ol/coordinate';
 
  
  const zurychCenter = [8.52981, 47.3943939];
  //const map = this.$refs['map-root'];
  import FileUpload from "./FileUpload.vue";
  import axios from "axios";
  import 'ol/ol.css'

  var map = null;

  export default {
    name: 'MapContainer',
    components: {
      FileUpload,
    },
    data() {
      return {
        dataMap:null,
        
        station:[],
        prices:[],
        products:[],

        place:[],
        feat:[],
        s_id:[],
        s_layers:[],
       
        r_starion:{},
        r_product:[],
        r_prices:[],

        n_id:null, 
        n_name:null,
        n_address:null,
        n_city:null,
        n_latitude:null,
        n_longitude:null,
        n_prices:[],

        isChangeNAbil:false,

      };
    },
    props: {},
    methods:{
      closeModal(){
        this.isChangeNAbil = false;
        this.$bvModal.hide('bv-modal-station');
      },
      openNameForChange(){
        this.isChangeNAbil = true;
      },
      downloadJson(){
        const self = this;
        const formData = new FormData();
        formData.append("json", JSON.stringify(self.dataMap)); 
        axios
          .post("http://localhost:4500/download", formData)
          .then(res => {
            //alert(res);
            console.log(res);
            var fileURL = window.URL.createObjectURL(new Blob([res.data]));
            var fileLink = document.createElement('a');
          
            fileLink.href = fileURL;
            fileLink.setAttribute('download', 'jsonMap.json');
            document.body.appendChild(fileLink);
          
            fileLink.click();
          
          })
          .catch(err => {
            console.log(err);
          });
      },
      updatePrice(obj, price){
        const self = this;
        for(var i=0;i<self.r_prices.length;i++){//update price for Price section
            if(self.r_prices[i].product_id==obj.product_id){
              self.r_prices[i].price = price;
              break;
            }
        }
        //const dateRes =[]
        for(i=0;i<self.dataMap.length;i++){
          //const pric = self.dataMap[i].prices;
          if(self.dataMap[i].prices.product_id==obj.product_id){
              self.dataMap[i].prices.price = price;
          }
        }
        // console.log("Update: "+JSON.stringify(self.dataMap));
        const formData = new FormData();
        formData.append("json", JSON.stringify(self.dataMap)); 
        axios
          .post("http://localhost:4500/save", formData)
          .then(res => {
            console.log(res);
          
          })
          .catch(err => {
            console.log(err);
          });
        
      },
      deleteStation(){
        const self = this;
         const formData = new FormData(); 
         const dateRes =[]
         for(var i=0;i<self.dataMap.length;i++){
           if(self.dataMap[i].id!=self.r_starion.id){
              dateRes.push(self.dataMap[i]);
           }
         }
         self.dataMap=dateRes;
         //console.log("Del: "+JSON.stringify(self.dataMap));
         formData.append("json", JSON.stringify(self.dataMap));
         axios
          .post("http://localhost:4500/save", formData)
          .then(res => {
            console.log(res);
            map.getLayers().forEach(layer => {
              if (layer && layer.get('id') === self.r_starion.id) {
                map.removeLayer(layer);
              }
            });
            this.$bvModal.hide('bv-modal-station');
           
          })
          .catch(err => {
            console.log(err);
          });
      },

      saveNameStation(){
         const self = this;
         const formData = new FormData();  
         //r_starion.name
         for(var i=0;i<self.dataMap.length;i++){
           if(self.dataMap[i].id==self.r_starion.id){
             self.dataMap[i].name=self.r_starion.name;
           }
         }
         formData.append("json", JSON.stringify(self.dataMap));
        // sending date for save the changes
        axios
          .post("http://localhost:4500/save", formData)
          .then(res => {
            console.log(res);
          // console.log("SaveName: "+JSON.stringify(self.dataMap));
            this.isChangeNAbil = false;
          })
          .catch(err => {
            console.log(err);
          });
      },

      saveStation(){
        const self = this;
        const formData = new FormData();         
        console.log("map: "+self.dataMap); 
        self.dataMap.push({
          id:self.n_id,
          name:self.n_name,
          city:self.n_city,
          address:self.n_address,
          latitude:self.n_latitude,
          longitude:self.n_longitude

        }) 
               
        formData.append("json", JSON.stringify(self.dataMap));
      // sending date for save the changes
      axios
        .post("http://localhost:4500/save", formData)
        .then(res => {
          console.log(res);
          //aggiunto point
          const place=new Point(fromLonLat([self.n_longitude,self.n_latitude]));

          const feat = (new Feature(place));
          
          const layer  = new VectorLayer({
            id:self.n_id,
            source: new VectorSource({
              features: [feat],
            }),
            style: new Style({
                image: new Circle({
                radius: 5,
                fill: new Fill({color: 'red'}),
              }),
            }),
          });
          map.addLayer(layer);          
          self.station=self.dataMap;
          self.n_id=null;
          self.n_name=null;
          self.n_city=null;
          self.n_address=null;
          self.n_latitude=null;
          self.n_longitude=null;
          self.$bvModal.hide('bv-modal-new-station');
        })
        .catch(err => {
          console.log(err);
        });
      },
     
    
      getDateFromJson (data) {
        const self = this;
        
        self.dataMap = data; 
        for(var i = 0; i<self.dataMap.length;i++) {
          
          self.station[i]=self.dataMap[i];
          console.log("Station: "+this.station[i]); 
          self.prices.push(self.station[i].prices);
          if(self.station[i].prices!=undefined){
            const pric = self.station[i].prices;
            self.r_prices.push(pric[0]);
            self.products.push(self.station[i].products);
          }
          self.place[i]=new Point(fromLonLat([self.station[i].longitude,self.station[i].latitude]));

          self.feat.push(new Feature(self.place[i]));
          self.s_id.push(self.station[i].id);

          const layers  = new VectorLayer({
            id:this.s_id[i],
            source: new VectorSource({
              features: [self.feat[i]],
            }),
            style: new Style({
                image: new Circle({
                radius: 5,
                fill: new Fill({color: 'red'}),
              }),
            }),
          });                
          this.s_layers.push(layers);
          //console.log("layers: "+this.s_layers);
        }         
        const zurychCenterC = fromLonLat(zurychCenter);

        console.log("prices: "+JSON.stringify(this.prices));  


       /*  const place = fromLonLat([8.52981, 47.3943939]);
        const place2 = fromLonLat([8.4942242729, 47.367348257]);

        const point = new Point(place);
        const point2 = new Point(place2); */
            
            map = new Map({
            // the map will be created using the 'map-root' ref
            target: "map-root",
            layers: [
                     new TileLayer({
                      source: new OSM(),
                    }),
                     new TileLayer({
                      source: new TileWMS({                        
                        projection: 'EPSG:21781',
                      })
                    })                  
                   
                ],

            // the map view will initially show the whole world
            view: new View({                       
                zoom: 12,
                center: zurychCenterC
            }),
        });
        for(i = 0; i<self.dataMap.length;i++){
        map.addLayer(self.s_layers[i]);}
        
        map.on('singleclick', function (event) {//add new station
          if (map.hasFeatureAtPixel(event.pixel) != true) {              
              //const source = this.vectorLayer.getSource();              
              const coordinate = event.coordinate;
              const hdms = toLonLat(coordinate);
              self.n_latitude =  hdms[1];
              self.n_longitude =  hdms[0];
              console.log("self: "+self);              
              self.$bvModal.show('bv-modal-new-station');         
              
          } else {
             // overlay.setPosition(coordinate);
          }
        });
        map.on('click', function (evt) {//details of station
           map.forEachFeatureAtPixel(evt.pixel, function (feature,layer) {
            
              for(var i = 0; i<self.station.length;i++) {
                if(self.station[i].id==layer.get("id")){
                  console.log("layer: "+layer.get("id"));
                  self.r_starion = self.station[i];
                  console.log("station: "+JSON.stringify(self.r_starion) ); 
                 
                  const product_=[];//list ov aviable(not) products with ID
                  for(var j = 0; j<self.products.length;j++){//points from products
                    const points = self.products[j][0].points;
                      for(var k = 0; k<points.length;k++){//id from points
                        if(points[k].id==self.r_starion.id){
                          var prices_ =[];
                          for(var kk = 0; kk<self.prices.length;kk++){//get date from prices to create product_
                               if(self.products[j][0].product_id==self.prices[kk][0].product_id){
                                 prices_=self.prices[kk];
                               }
                          }
                          product_.push({
                            product_id:self.products[j][0].product_id,
                            status:points[k].status,
                            price:prices_[0].price,
                            currency:prices_[0].currency
                          });
                       }
                      }
                  }
                  console.log("product_: "+JSON.stringify(product_) ); 
                  self.r_product = product_;                  
                  break;
                  
                }
              }; 
             console.log("self: "+self);            
             self.$bvModal.show('bv-modal-station');

          });
        });

       
        
      
    }
    },
     computed: {
      idState() {
        return this.n_id!=null&&this.n_id.length > 2 ? true : false
      },
      nameState() {
        return this.n_name!=null&&this.n_name.length > 2 ? true : false
      },
      adrState() {
        return this.n_address!=null&&this.n_address.length > 2 ? true : false
      },
      cityState() {
        return this.n_city!=null&&this.n_city.length > 2 ? true : false
      },
      latitState() {
        return true
      },
      longState() {
        return true
      },
      saveDis(){
        const self = this;
        var res = false;
        res=(self.n_id!=null)&&(self.n_id.length > 2);
        res=(self.n_name!=null)&&(self.n_name.length > 2);
        res=(self.n_address!=null)&&(self.n_address.length > 2);
        res=(self.n_city!=null)&&(self.n_city.length > 2);

        return res?false:true;
      }
    },
  }

  
</script>