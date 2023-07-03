import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import bus_list from './bus_list.json' //list of all bus routes
import bn01Go from './bn01-go.json';
import bn01Back from './bn01-back.json';
import bn08Go from './bn08-go.json';
import bn08Back from './bn08-back.json';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FhZGlxbSIsImEiOiJjamJpMXcxa3AyMG9zMzNyNmdxNDlneGRvIn0.wjlI8r1S_-xxtq2d-W5qPA';

class Application extends React.Component {

  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this)
    this.state = {
      lng: 106.0346849,
      lat: 21.1169071,
      zoom: 10,
      selected_bus: 1,
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
      } else if (this.state.selected_bus === "BN08") {
        geojsonGo = { "type": "FeatureCollection", "features": [{"type":"Feature","geometry":{"type":"MultiLineString","coordinates":[bn08Go]}}], "crs" : { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } } };
        geojsonBack = { "type": "FeatureCollection", "features": [{"type":"Feature","geometry":{"type":"MultiLineString","coordinates":[bn08Back]}}], "crs" : { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } } };
      };

      this.map.getSource('Bus Route Go').setData(geojsonGo);
      this.map.getSource('Bus Route Back').setData(geojsonBack); //update data source through Mapbox setData()

    });
  }

  render() {

    let optionItems = bus_list.map((bus) => <option key={bus.route_short_name} value={bus.route_short_name}>{bus.route_short_name+" : "+bus.route_long_name}</option>);

    return (
      <div>
        <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
        <select onChange={this.handleSelect} value={this.state.value}  style={{display: "inline-block",position: "absolute", height: "40px",width:"300px",padding: "10px",top:"40px", left:"40px", fontSize:"17px",border: "none",borderRadius: "3px",color: "#fff",
        background: "#6d6d6d", fontStyle:"bold",outline:"none"}}>
          {optionItems}
        </select>
      </div>
    );
  }
}
ReactDOM.render(<Application />, document.getElementById('root'));
