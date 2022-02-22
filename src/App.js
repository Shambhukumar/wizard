import "./App.scss";
import { fabric } from "fabric";
import { useRef, useState } from "react";
function App() {
  
  const [ImageFile, setImage] = useState(null);
  const imgHandler = (event) => {
    console.log(event.target.files[0]);
    setImage(event.target.files[0]);
  };

const Inputref = useRef()
  if (ImageFile) {
    console.log("image if")
    const canvas = new fabric.Canvas("c");
    canvas.setHeight(580);
    canvas.setWidth(940);
    canvas.on("mouse:wheel", function (opt) {
      var delta = opt.e.deltaY;
      var zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 1) {
        zoom = 1;
        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      }
      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
      var vpt = this.viewportTransform;
      if (zoom < 400 / 1000) {
        vpt[4] = 200 - (1000 * zoom) / 2;
        vpt[5] = 200 - (1000 * zoom) / 2;
      } else {
        if (vpt[4] >= 0) {
          vpt[4] = 0;
        } else if (vpt[4] < canvas.getWidth() - 1000 * zoom) {
          vpt[4] = canvas.getWidth() - 1000 * zoom;
        }
        if (vpt[5] >= 0) {
          vpt[5] = 0;
        } else if (vpt[5] < canvas.getHeight() - 1000 * zoom) {
          vpt[5] = canvas.getHeight() - 1000 * zoom;
        }
      }
    });

    const reader = new FileReader();
    reader.onload = function (f) {
      const data = f.target.result;
      console.log(data)
      const newImg = new Image();

      newImg.src = URL.createObjectURL(ImageFile);
      newImg.onload = function () {
        console.log(this.height, this.width);
        let width = this.width;
        let height = this.height;

        fabric.Image.fromURL(data, function (img) {
          const oImg = img.set({
            left: 470 - width / 2,
            top: 290 - height / 2,
            scaleX: 940 / width,
            scaleY: 580 / height,
          });
          oImg.lockMovementX = true;
          oImg.lockMovementY = true;
          oImg.hasControls = false;
          oImg.hoverCursor = false;

          oImg.scaleToWidth(width);
          canvas.add(oImg).renderAll();
          canvas.setActiveObject(oImg);
          canvas.hoverCursor = "default";
          canvas.toDataURL({ format: "png", quality: 0.8 });
        });
      };
    };
    reader.readAsDataURL(ImageFile);

  }

  const clearCanvas = () =>{
    window.location = "/"
  }

  
  return (
    <div className="App">
      <h1>App</h1>
      <div className="App-btns">
        <input type="file" onChange={imgHandler} id="upload" ref={Inputref} />
        <button variant="contained" onClick={() => Inputref.current.click()} disabled={ImageFile && "true"}>
          Upload Image
        </button>

        <button onClick={clearCanvas} disabled={!ImageFile && "true"}>Clear</button>
        <button>Reset</button>
        <button>Download</button>
      </div>

      <div className="App-canvas">
        <canvas id="c" className="App-canvas-inner"></canvas>
      </div>
    </div>
  );
}

export default App;
