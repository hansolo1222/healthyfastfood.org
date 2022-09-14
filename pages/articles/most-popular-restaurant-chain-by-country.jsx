const Choropleth = require('react-leaflet-choropleth')
import { Map } from 'react-leaflet'

const style = {
    fillColor: '#F28F3B',
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.5
}

export default function Viz(geojson) {
    return(<Map>
    <Choropleth
      data={{type: 'FeatureCollection', features: geojson}}
      valueProperty={(feature) => feature.properties.value}
      visible={(feature) => feature.id !== active.id}
      scale={['#b3cde0', '#011f4b']}
      steps={7}
      mode='e'
      style={style}
      onEachFeature={(feature, layer) => layer.bindPopup(feature.properties.label)}
      ref={(el) => this.choropleth = el.leafletElement}
    />
  </Map>)
}