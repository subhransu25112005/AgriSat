# sentinel_service.py
import os
import numpy as np
from datetime import datetime, timedelta
import random

def sentinel_configured():
    return bool(os.getenv("SENTINELHUB_CLIENT_ID")) and bool(os.getenv("SENTINELHUB_CLIENT_SECRET"))

if sentinel_configured():
    from sentinelhub import SHConfig, MimeType, CRS, BBox, SentinelHubRequest, DataCollection, bbox_to_dimensions
    def _get_config():
        cfg = SHConfig()
        cfg.sh_client_id = os.getenv("SENTINELHUB_CLIENT_ID")
        cfg.sh_client_secret = os.getenv("SENTINELHUB_CLIENT_SECRET")
        return cfg

    def compute_ndvi_mean(lat, lon, size_km=1.0, days=30):
        cfg = _get_config()
        d = 0.009 * size_km
        minx, miny, maxx, maxy = lon - d, lat - d, lon + d, lat + d
        bbox = BBox(bbox=[minx, miny, maxx, maxy], crs=CRS.WGS84)
        size = bbox_to_dimensions(bbox, resolution=10)
        end = datetime.utcnow().date()
        start = end - timedelta(days=days)
        evalscript = """
        //VERSION=3
        function setup(){return{input:["B04","B08","dataMask"],output:{bands:1,sampleType:"FLOAT32"}};}
        function evaluatePixel(sample){let nd=(sample.B08 - sample.B04)/(sample.B08 + sample.B04); return [nd];}
        """
        request = SentinelHubRequest(
            evalscript=evalscript,
            input_data=[SentinelHubRequest.input_data(DataCollection.SENTINEL2_L2A, time_interval=(start.strftime("%Y-%m-%d"), end.strftime("%Y-%m-%d")) )],
            responses=[SentinelHubRequest.output_response('default', MimeType.TIFF)],
            bbox=bbox,
            size=size,
            config=cfg
        )
        try:
            data = request.get_data()
            arr = np.array(data[0])
            ndvi = arr[:,:,0]
            ndvi_valid = ndvi[np.isfinite(ndvi)]
            if ndvi_valid.size == 0:
                return {"ndvi_mean": None, "source": "sentinel", "error":"no valid pixels"}
            mean = float(np.nanmean(ndvi_valid))
            return {"ndvi_mean": round(mean, 4), "source": "sentinel"}
        except Exception as e:
            return {"ndvi_mean": None, "source":"sentinel", "error": str(e)}

    def ndvi_timeseries(geom_or_center, months=6, window_days=14, size_km=1.0):
        cfg = _get_config()
        # approximate same method as earlier but iterate windows
        today = datetime.utcnow().date()
        start0 = today - timedelta(days=months*30)
        windows = []
        t = start0
        out = []
        while t < today:
            s = t
            e = min(t + timedelta(days=window_days), today)
            try:
                # center: expect (lat,lon)
                if isinstance(geom_or_center, tuple) or isinstance(geom_or_center, list):
                    lat, lon = geom_or_center[0], geom_or_center[1]
                else:
                    # polygon centroid
                    coords = geom_or_center["coordinates"][0]
                    xs = [c[0] for c in coords]; ys = [c[1] for c in coords]
                    lon = sum(xs)/len(xs); lat = sum(ys)/len(ys)
                res = compute_ndvi_mean(lat, lon, size_km=size_km, days=(e - s).days + 1)
                out.append({"start": s.isoformat(), "end": e.isoformat(), "mean": res.get("ndvi_mean")})
            except Exception:
                out.append({"start": s.isoformat(), "end": e.isoformat(), "mean": None})
            t = t + timedelta(days=window_days)
        return out

else:
    def compute_ndvi_mean(lat, lon, size_km=1.0, days=30):
        v = round(0.35 + 0.5 * random.random(), 3)
        return {"ndvi_mean": v, "source":"mock"}
    def ndvi_timeseries(geom_or_center, months=6, window_days=14, size_km=1.0):
        npoints = max(1, int((months*30)/window_days))
        base = [round(0.45 + 0.15 * np.sin(i*0.5),3) for i in range(npoints)]
        res = []
        today = datetime.utcnow().date()
        t = today - timedelta(days=months*30)
        for i,v in enumerate(base):
            s = (t + timedelta(days=i*window_days)).isoformat()
            e = (t + timedelta(days=(i+1)*window_days)).isoformat()
            res.append({"start": s, "end": e, "mean": float(v)})
        return res
