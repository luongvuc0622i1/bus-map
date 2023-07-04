import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import bus_list from './bus_list.json' //list of all bus routes
import bn01Go from './json/bus-router/bn01-go.json';
import bn01Back from './json/bus-router/bn01-back.json';
import bn02Go from './json/bus-router/bn02-go.json';
import bn02Back from './json/bus-router/bn02-back.json';
import bn03Go from './json/bus-router/bn03-go.json';
import bn03Back from './json/bus-router/bn03-back.json';
import bn08Go from './json/bus-router/bn08-go.json';
import bn08Back from './json/bus-router/bn08-back.json';
import bn27Go from './json/bus-router/bn27-go.json';
import bn27Back from './json/bus-router/bn27-back.json';
import bn68Go from './json/bus-router/bn68-go.json';
import bn68Back from './json/bus-router/bn68-back.json';
import bn54Go from './json/bus-router/54-go.json';
import bn54Back from './json/bus-router/54-back.json';
import bn217Go from './json/bus-router/217-go.json';
import bn217Back from './json/bus-router/217-back.json';
import { bus_stop_list_bn01 } from './json/bus-stop/bn01';
import { bus_stop_list_bn02 } from './json/bus-stop/bn02';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FhZGlxbSIsImEiOiJjamJpMXcxa3AyMG9zMzNyNmdxNDlneGRvIn0.wjlI8r1S_-xxtq2d-W5qPA';

class Application extends React.Component {

  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this)
    this.state = {
      lng: 106.1306849,
      lat: 21.1169071,
      zoom: 10,
      selected_bus: 1,
      bus_stop_list: bus_stop_list_bn01
    };
  }

  componentDidMount() {
    const {lng, lat, zoom } = this.state;
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/saadiqm/cjbjougmt08z72rsa7me1duoi',
      center: [lng, lat],
      zoom
    });

    this.map.on('load', () => { //Get initial geojson data from Calgary Open Data
      let geojsonGo = { "type": "FeatureCollection", "features": [{"type":"Feature","geometry":{"type":"MultiLineString","coordinates":[bn01Go]}}], "crs" : { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } } };
      let geojsonBack = { "type": "FeatureCollection", "features": [{"type":"Feature","geometry":{"type":"MultiLineString","coordinates":[bn01Back]}}], "crs" : { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } } };

      this.map.addSource('Bus Route Go', {
        type: 'geojson',
        data: geojsonGo
      });
      this.map.addLayer({
          "id": "Bus Route Go",
          "type": "line",
          "source": 'Bus Route Go',
          "paint": {
              "line-color": "blue",
              "line-width": 4,
              "line-opacity": 0.5
          },
          "layout": {
              "line-join": "round",
              "line-cap": "round"
          },
      });

      this.map.addSource('Bus Route Back', {
        type: 'geojson',
        data: geojsonBack
      });
      this.map.addLayer({
          "id": "Bus Route Back",
          "type": "line",
          "source": 'Bus Route Back',
          "paint": {
              "line-color": "red",
              "line-width": 4,
              "line-opacity": 0.5
          },
          "layout": {
              "line-join": "round",
              "line-cap": "round"
          },
      });
    });
    
    // add markers to map
    for (const feature of this.state.bus_stop_list.features) {
      // create a HTML element for each feature
      const el = document.createElement('div');
      el.className = 'marker';
      const elGo = document.createElement('div');
      elGo.className = 'marker-blue';
      const elBack = document.createElement('div');
      elBack.className = 'marker-red';
      
      // make a marker for each feature and add it to the map
      new mapboxgl.Marker(feature.color?(feature.color==='blue'?elGo:elBack):el).setLngLat(feature.geometry.coordinates).setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML(
          `<div>
            <h1>`+feature.properties.title+`</h1>
            <p>`+feature.properties.description+`</p>
            <small>`+feature.properties.router+`</small>
          </div>`
          )
        ).addTo(this.map)
    };
  }

  handleSelect(e){
    e.preventDefault();
    let selection = e.target.value;

    this.setState({selected_bus: selection}, () => { //update selected bus route
      let geojsonGo = "";
      let geojsonBack = "";
      if (this.state.selected_bus === "BN01") {
        geojsonGo = { "type": "FeatureCollection", "features": [{"type":"Feature","geometry":{"type":"MultiLineString","coordinates":[bn01Go]}}], "crs" : { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } } };
        geojsonBack = { "type": "FeatureCollection", "features": [{"type":"Feature","geometry":{"type":"MultiLineString","coordinates":[bn01Back]}}], "crs" : { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } } };
        this.setState({bus_stop_list: bus_stop_list_bn01}, () => { //update selected bus stop
          // add markers to map
          for (const feature of this.state.bus_stop_list.features) {
            // create a HTML element for each feature
            const el = document.createElement('div');
            el.className = 'marker';
            const elGo = document.createElement('div');
            elGo.className = 'marker-blue';
            const elBack = document.createElement('div');
            elBack.className = 'marker-red';
            
            // make a marker for each feature and add it to the map
            new mapboxgl.Marker(feature.color?(feature.color==='blue'?elGo:elBack):el).setLngLat(feature.geometry.coordinates).setPopup(
              new mapboxgl.Popup({ offset: 25 }) // add popups
              .setHTML(
                `<div>
                  <h1>`+feature.properties.title+`</h1>
                  <p>`+feature.properties.description+`</p>
                  <small>`+feature.properties.router+`</small>
                </div>`
                )
              ).addTo(this.map)
          };
        });
      } else if (this.state.selected_bus === "BN02") {
        geojsonGo = { "type": "FeatureCollection", "features": [{"type":"Feature","geometry":{"type":"MultiLineString","coordinates":[bn02Go]}}], "crs" : { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } } };
        geojsonBack = { "type": "FeatureCollection", "features": [{"type":"Feature","geometry":{"type":"MultiLineString","coordinates":[bn02Back]}}], "crs" : { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } } };
        this.setState({bus_stop_list: bus_stop_list_bn02}, () => { //update selected bus stop
          // add markers to map
          for (const feature of this.state.bus_stop_list.features) {
            // create a HTML element for each feature
            const el = document.createElement('div');
            el.className = 'marker';
            const elGo = document.createElement('div');
            elGo.className = 'marker-blue';
            const elBack = document.createElement('div');
            elBack.className = 'marker-red';
            
            // make a marker for each feature and add it to the map
            new mapboxgl.Marker(feature.color?(feature.color==='blue'?elGo:elBack):el).setLngLat(feature.geometry.coordinates).setPopup(
              new mapboxgl.Popup({ offset: 25 }) // add popups
              .setHTML(
                `<div>
                  <h1>`+feature.properties.title+`</h1>
                  <p>`+feature.properties.description+`</p>
                  <small>`+feature.properties.router+`</small>
                </div>`
                )
              ).addTo(this.map)
          };
        });
      } else if (this.state.selected_bus === "BN03") {
        geojsonGo = { "type": "FeatureCollection", "features": [{"type":"Feature","geometry":{"type":"MultiLineString","coordinates":[bn03Go]}}], "crs" : { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } } };
        geojsonBack = { "type": "FeatureCollection", "features": [{"type":"Feature","geometry":{"type":"MultiLineString","coordinates":[bn03Back]}}], "crs" : { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } } };
      } else if (this.state.selected_bus === "BN08") {
        geojsonGo = { "type": "FeatureCollection", "features": [{"type":"Feature","geometry":{"type":"MultiLineString","coordinates":[bn08Go]}}], "crs" : { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } } };
        geojsonBack = { "type": "FeatureCollection", "features": [{"type":"Feature","geometry":{"type":"MultiLineString","coordinates":[bn08Back]}}], "crs" : { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } } };
      } else if (this.state.selected_bus === "BN27") {
        geojsonGo = { "type": "FeatureCollection", "features": [{"type":"Feature","geometry":{"type":"MultiLineString","coordinates":[bn27Go]}}], "crs" : { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } } };
        geojsonBack = { "type": "FeatureCollection", "features": [{"type":"Feature","geometry":{"type":"MultiLineString","coordinates":[bn27Back]}}], "crs" : { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } } };
      } else if (this.state.selected_bus === "BN68") {
        geojsonGo = { "type": "FeatureCollection", "features": [{"type":"Feature","geometry":{"type":"MultiLineString","coordinates":[bn68Go]}}], "crs" : { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } } };
        geojsonBack = { "type": "FeatureCollection", "features": [{"type":"Feature","geometry":{"type":"MultiLineString","coordinates":[bn68Back]}}], "crs" : { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } } };
      } else if (this.state.selected_bus === "54") {
        geojsonGo = { "type": "FeatureCollection", "features": [{"type":"Feature","geometry":{"type":"MultiLineString","coordinates":[bn54Go]}}], "crs" : { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } } };
        geojsonBack = { "type": "FeatureCollection", "features": [{"type":"Feature","geometry":{"type":"MultiLineString","coordinates":[bn54Back]}}], "crs" : { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } } };
      } else if (this.state.selected_bus === "217") {
        geojsonGo = { "type": "FeatureCollection", "features": [{"type":"Feature","geometry":{"type":"MultiLineString","coordinates":[bn217Go]}}], "crs" : { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } } };
        geojsonBack = { "type": "FeatureCollection", "features": [{"type":"Feature","geometry":{"type":"MultiLineString","coordinates":[bn217Back]}}], "crs" : { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } } };
      };

      this.map.getSource('Bus Route Go').setData(geojsonGo);
      this.map.getSource('Bus Route Back').setData(geojsonBack); //update data source through Mapbox setData()

    });

    const elements = document.getElementsByClassName('mapboxgl-marker'); //clear all old markers
    while (elements.length > 0) elements[0].remove();
  }

  render() {

    let optionItems = bus_list.map((bus) => <option key={bus.route_short_name} value={bus.route_short_name}>{bus.route_short_name+" : "+bus.route_long_name}</option>);

    return (
      <div>
        <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
        <select onChange={this.handleSelect} value={this.state.value}  style={{display: "inline-block",position: "absolute", height: "40px",width:"330px",padding: "10px",top:"40px", left:"40px", fontSize:"17px",border: "none",borderRadius: "3px",color: "#fff",
        background: "#6d6d6d", fontStyle:"bold",outline:"none"}}>
          {optionItems}
        </select>
        <div style={{display: "inline-block",position: "absolute", height: "100%",width:"300px",padding: "10px", right:"0px", fontSize:"17px",border: "none",
        background: "#fff", fontStyle:"bold",outline:"none"}}/>
      </div>
    );
  }
}
ReactDOM.render(<Application />, document.getElementById('root'));
