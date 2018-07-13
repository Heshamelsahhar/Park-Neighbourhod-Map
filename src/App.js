import React, { Component } from 'react';
import './App.css';
import Parks from './Parks';
import List from './List'

/* Creating script which loads Google Map and appending it to html */
  let loadMapScript = () => {
    let mapScript = document.createElement('script');
    mapScript.async = true;
    mapScript.defer = true;
    mapScript.src ="https://maps.googleapis.com/maps/api/js?key=AIzaSyBUuPD5LK99-Vl_861643CpvZpt_FKmY0c&callback=initMap";
    document.querySelector('body').appendChild(mapScript);
};


class App extends Component {
  
  
  constructor(props) {
    super(props);
    this.state = {
      map: "",
      data: Parks.results,
      markers:[],
      openedInfoWindow:null,
      animatingMarker:null
    };
    // localizing functions
    this.initMap = this.initMap.bind(this);
    this.info = this.info.bind(this);
    this.attach=this.attach.bind(this);
    this.update=this.update.bind(this);
    this.setMarkers=this.setMarkers.bind(this);

  }

  componentDidMount () {
    // add map script after making sure that dom mounted
    loadMapScript();
    window.initMap = this.initMap;
    
  }

  initMap () {
    /* iniitalizing map settings and location*/
    let map = new window.google.maps.Map(document.getElementById('map'),{
    center: {lat:40.7413549,lng: -73.9980244},
    zoom:12
  });
  /* saving map in state for later access */
  this.setState({map},()=>{
    this.setMarkers();
  });
    }
    /* function which adds infowindow of each marker */
  info(marker){
    if (this.state.openedInfoWindow){this.state.openedInfoWindow.close();}
    if (this.state.animatingMarker)this.state.animatingMarker.setAnimation(null);

  let infoWind = new window.google.maps.InfoWindow({content:''});
  /* data is grabbed by foursquare 3rd party api */
  const url = `https://api.foursquare.com/v2/venues/search?client_id=TTPE1C3V5UXNXNHX43TZNJVZ0O1X40BIDV5AXHO11UMXJCHN&client_secret=EHODAEZD1OELIMLGCSIZXCIIO13EHRZPVHIKQVJYTQAMNRKL&ll=${marker.getPosition().lat()},${marker.getPosition().lng()}&v=20180606&limit=1&query=${marker.title.split(' ').join('')}`;
  fetch(url).then( (Response) => {
    Response.json().then(
      (data) => {
        infoWind.setOptions({maxWidth:100}); 
        infoWind.setContent(`<h2>${data.response.venues[0].name}</h2><br><h4>${data.response.venues[0].location.formattedAddress}</h4><br><h6>this data by FourSquare</h6>`);infoWind.open(this.state.map,marker);}
    ).catch(infoWind.setContent('Error Fetching Data')) // in case of fetch failure
   this.setState({openedInfoWindow:infoWind,animatingMarker:marker});
  });
  }

  attach(idx){
    /* click handler for list item key press */
    this.state.markers[idx].setAnimation(window.google.maps.Animation.BOUNCE);
    this.info(this.state.markers[idx]);
  }

  update(newList)
  {
    /* in case of changing list items by filter */
     this.setState({data:newList},()=>{
     this.state.markers.forEach((marker)=>marker.setMap(null));
     this.setMarkers(); 
    });
  }

  setMarkers()
  {
    /* adding markers to the map on the locations imported from parks.json file */
      let markers = this.state.data.map((place) => new window.google.maps.Marker({position:place.geometry.location
      ,map:this.state.map,
      title:place.name}));
      this.setState({markers},()=>{
      markers.forEach( (marker)=>{
      marker.addListener('click', ()=>{this.info(marker);marker.setAnimation(window.google.maps.Animation.BOUNCE);})});
      document.getElementById('map').addEventListener('click',()=>{
        if (this.state.openedInfoWindow)this.state.openedInfoWindow.close();
        if (this.state.animatingMarker)this.state.animatingMarker.setAnimation(null);
      });
    });
  }

  
  
render() {
    return (
      /* adding map and calling list component */
      <div  className="App" role='main'>
          <div id="map" role='application' tabIndex='-1' className='show'></div>
          <List places={Parks.results} attach={this.attach} markers={this.state.markers} updateMarker={this.update}/>
      </div>
    );
  }
}

export default App;
