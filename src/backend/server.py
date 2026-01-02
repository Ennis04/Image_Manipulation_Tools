from fastapi import FastAPI
from pydantic import BaseModel
import base64, cv2, numpy as np
import main  # import your processing file

app = FastAPI()

class Params(BaseModel):
    brightness: int = 0
    sharpness: int = 0
    denoise: int = 0

class Request(BaseModel):
    image: str
    params: Params

def decode_image(data_url):
    _, b64 = data_url.split(",", 1)
    img_bytes = base64.b64decode(b64)
    return cv2.imdecode(np.frombuffer(img_bytes, np.uint8), cv2.IMREAD_COLOR)

def encode_image(img):
    _, buf = cv2.imencode(".png", img)
    return "data:image/png;base64," + base64.b64encode(buf).decode()

@app.post("/process")
def process(req: Request):
    img = decode_image(req.image)
    out = main.process_image(img, req.params.dict())
    return {"image": encode_image(out)}
