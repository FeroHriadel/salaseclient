import { MapContainer, TileLayer,Marker,Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import "leaflet-defaulticon-compatibility";

import Link from 'next/link';





const Map = ({ huts }) => {

  return (
    <MapContainer center={[49.020606517888275, 19.603840559810987]} zoom={8} scrollWheelZoom={true} style={{height: "100%", width: "100%"}}>
        <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

          {huts && huts.length > 0 && huts.map(hut => (
            <Marker 
              position={[hut.latitude, hut.longitude]}
              draggable={true}
              animate={true}
            >
                <Popup>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: `url(${hut.image.url}) no-repeat center center/cover`,
                        marginRight: '15px'
                      }} />

                      <div>
                        <p style={{fontFamily: 'Fondamento, cursive'}}>{hut.name}</p>
                        <Link href={`/huts/${hut._id}`}>
                          <a style={{fontFamily: 'Fondamento, cursive', textDecoration: 'none'}}>See details</a>
                        </Link>
                      </div>
                    </div>
                </Popup>
            </Marker>
          ))}


    </MapContainer>
  )
}

export default Map

/*
    <MapContainer center={[49.020606517888275, 19.603840559810987]} zoom={8} scrollWheelZoom={true} style={{height: "100%", width: "100%"}}>
        <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker 
          position={[49.020606517888275, 19.603840559810987]}
          draggable={true}
          animate={true}
        >
            <Popup>
                Hey ! you found me
                <br />
                <a href='https://hiking.sk'>click</a>
            </Popup>
        </Marker>
    </MapContainer>
*/