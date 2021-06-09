import { MapLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import { withLeaflet } from "react-leaflet";
import React from 'react';


class Routing extends MapLayer {
  constructor(props) {
    super(props);
  }

  createLeafletElement() {
    const { map ,pointM} = this.props;

    let leafletElement = L.Routing.control({
      waypoints: this.props.pointM,show:true
    }).addTo(map.leafletElement);
   this.routing = leafletElement;
    leafletElement.on('routesfound', function(e) {
   var routes = e.routes;
   var summary = routes[0].summary;
   // alert distance and time in km and minutes
   alert('The delivery revenue is ' +  summary.totalTime / 3600  * 50 + ' Shekels');
    });
    return leafletElement.getPlan();

  }

 

  updateLeafletElement(fromProps, toProps) {
    if(fromProps.pointM != toProps.pointM && (toProps.routingFlag == false)){
        const { map ,pointM,routing} = toProps;

    function generatePermutations(Arr){
        var permutations = [];
        var A = Arr.slice();
            
        function swap(a,b){
          var tmp = A[a];
          A[a] = A[b];
          A[b] = tmp;
        }
        function generate(n, A){
          if (n == 1){
            permutations.push(A.slice());
          } else {
            for(var i = 0; i <= n-1; i++) {
              generate(n-1, A);
              swap(n % 2 == 0 ? i : 0 ,n-1);
            }
          }
        }
        
        generate(A.length, A);
        return permutations;
    }

      var Points =[];
      toProps.pointM.forEach(e=>{

        Points.push([e.lat,e.lng]);
      });

      var x = generatePermutations(Points);
      var l = [];
      if(x.length <2){

        this.routing.setWaypoints([]);   
      }
      else{
          var myLocation = [toProps.pointM[0].lat,toProps.pointM[0].lng]
          const Undef = 1000000;
          x.forEach(e=>{
            if(e[0][0] == myLocation[0] && e[0][1] == myLocation[1])
            {
              var sum=0;
              for(var i=0; i < e.length-1 ; i++){
                sum+=distance(e[i][0], e[i][1], e[i+1][0], e[i+1][1], 'K');
              }
              l.push(sum);
            }else{
              l.push(Undef)
            }
          });

          var route = l.indexOf(Math.min.apply(null,l));

          this.routing.setWaypoints(x[route]);

      }

      function distance(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1/180
        var radlat2 = Math.PI * lat2/180
        var radlon1 = Math.PI * lon1/180
        var radlon2 = Math.PI * lon2/180
        var theta = lon1-lon2
        var radtheta = Math.PI * theta/180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist
      }

    }
  }
  componentDidMount() {
    super.componentDidMount()
    //console.log("update")
  }

}
export default withLeaflet(Routing);

