//@flow
import React, {createRef, Component } from 'react';
import './App.css';
import L, { Point } from 'leaflet';
import { Map, TileLayer, Marker, Popup,LayerGroup } from 'react-leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import woltIcon from "./woltIcon.png";
import Routing from "./routingMachine";
import Control from 'react-leaflet-control';

let DefaultIcon = L.icon({
    iconUrl: icon,
    iconAnchor: [10, 55],
});

//L.Marker.prototype.options.icon = DefaultIcon;
const cusIcon = new L.Icon({
    iconUrl: woltIcon,
    iconAnchor: [17, 17],
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(35, 35),

    className: 'leaflet-div-icon'
});

export { cusIcon };

L.Marker.prototype.options.icon = cusIcon;

export default class App extends Component  {

  constructor() {
    super();

        this.state = {
        isMapInit: false,
        hasLocation: false,
        flag: true,
        latlng: {
          lat: 31.0461,
          lng: 34.8516,
        },
        markers:[],
        rMarkers:[],
      };

    this.routingEvent = this.routingEvent.bind(this);
  }
routingEvent = event =>{
   // L.DomEvent.stopPropagation(event);
    const {rMarkers,markers,flag} = this.state
    let rMarkers2 = markers.slice()
    const map = this.map
    
    let pointer = this
    let myLocation=null
    if(map!=null && flag == true)
    {
        myLocation = map.leafletElement.locate({setView:false,maxZoom:16}).once('locationfound',function(e){
          rMarkers2.unshift(e.latlng)
          if(rMarkers2.length>=2){
            pointer.btnReview.setAttribute("disabled", "disabled");
            pointer.setState((state,props) => ({rMarkers:rMarkers2,markers:[],flag:false}))

          }
          else{
            console.log("not enough points");
          }
      });
    }
  }

  saveMap = map => {

      this.map = map;
      this.setState({
        isMapInit: true
      });
   
    };

  mapRef = createRef<Map>()

  addMarker = (e) => {
    const {markers,flag} = this.state
    if(flag){
      markers.push(e.latlng)
      this.setState({markers})
    }

  }
   handleClick = event => {
    const { lat, lng } = event.latlng
    this.addMarker(event)
    
  }

  updateRoute = () =>{
    this.setState((state,props) =>({markers:[],rMarkers:[],flag:true}))
    this.btnReview.removeAttribute("disabled")
  }
  
  




  render(){
    const marker = this.state.hasLocation ? (
      <Marker position={this.state.latlng}>
        <Popup>You are here</Popup>
      </Marker>
    ) : null


    return (

      <Map className="map" onClick={this.handleClick}  ref= {this.saveMap}
        onLocationfound={this.handleLocationFound}
       center={this.state.latlng} zoom={13}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LayerGroup>
            {this.state.markers.map((position, idx) => 
              <Marker key={`marker-${idx}`} position={position}>
                <Popup>
                  <span>Popup</span>
                </Popup>
              </Marker>
            )}
        </LayerGroup>
        <Control position="topleft" >
          <button 
            onClick={this.updateRoute}
          >
            Reset route
          </button>
        </Control>
         <Control position="topleft" >
          <button onClick={this.routingEvent} ref={btnReview  => {this.btnReview = btnReview;}} >
            Delivery Route
          </button>
        </Control>
        <Routing mapInit = {this.state.isMapInit}  id="routeI" name="routeM" map={this.map} pointM={this.state.rMarkers} routingFlag = {this.state.flag} /> 
      </Map>
   
    );
  }
}
      //console.log('22')
         //console.log('ffff');
           /*
  shouldComponentUpdate(nextProps, nextState) {
    
      //let currentState = this.state
      //return currentState.search.id !== nextState.search.id
  }*/
  /*
  handleLocationFound = (e: Object) => {
    this.setState({
      hasLocation: true,
      latlng: e.latlng,
    })
  }*/
     //event.preventDefault()
    //event.stopPropagation()
  // console.log(map)
      //this.navOpen = this.navOpen.bind(this);
