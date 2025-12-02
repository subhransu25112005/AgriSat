// src/components/Map/PolygonSelector.jsx
import React, { useEffect } from "react";
import { useMapEvents, Polygon, Marker } from "react-leaflet";

export default function PolygonSelector({ points=[], onAddPoint, onFinish, onClear }) {
  useMapEvents({
    click(e) { onAddPoint && onAddPoint([e.latlng.lat, e.latlng.lng]); }
  });

  return (
    <>
      {points && points.length>0 && (
        <>
          <Polygon positions={points.map(p=>[p[0], p[1]])} pathOptions={{color:'#1FA65A', fillOpacity:0.05}} />
          {points.map((p,idx)=> <Marker key={idx} position={[p[0],p[1]]} />)}
          <div style={{position:'absolute', right:12, top:12, zIndex: 999}}>
            <div className="flex flex-col gap-2 bg-white p-2 rounded shadow">
              <button onClick={()=>onFinish && onFinish(points)} className="bg-brand text-white px-3 py-1 rounded text-sm">Finish</button>
              <button onClick={()=>onClear && onClear()} className="border px-3 py-1 rounded text-sm">Clear</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
