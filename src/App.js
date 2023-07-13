import React, { useState, useRef, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import tinycolor from 'tinycolor2'
import { SVG } from '@svgdotjs/svg.js';
import './App.css';

function LogoDesigner() {
  const [text, setText] = useState('Logo');
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 200});
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderColor, setBorderColor] = useState('#000000');
  const [borderRadius, setBorderRadius] = useState(0);
  const [font, setFont] = useState('sans-serif');
  const [fontWeight, setFontWeight] = useState('normal');
  const [fontSize, setFontSize] = useState(32);
  const [svg, setSvg] = useState(null);
  const [logoImage, setLogoImage] = useState(null);
  const [elementState, setElementState] = useState({});
  const [elements, setElements] = useState([]);
  const [slogan, setSlogan] = useState('Slogan'); // Add the slogan state variable here
  const canvasRef = useRef(null);
  const [downloadUrl, setDownloadUrl] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const newSvg = SVG().addTo(canvas).size(canvasSize.width, canvasSize.height);
    setSvg(newSvg);
  
    return () => {
      // Remove the SVG element and its listeners when the component unmounts
      newSvg.remove();
    };
  }, [canvasSize]);

  const handleGenerateLogo = () => {
    if (svg) {
      const logo = generateLogo(
        text,
        slogan, // Add the slogan parameter here
        canvasSize,
        borderWidth,
        borderColor,
        textColor,
        backgroundColor,
        borderRadius,
        font,
        fontWeight,
        fontSize,
        // { color:'#BD10E0' , width: 0 },
      );
      svg.clear();
      svg.svg(logo);
      setLogoImage(logo);
      setDownloadUrl(logo);
    }
  };

  const handleElementMouseDown = (event, element) => {
    // Set drag flag for the clicked element
    setElementState({
      ...elementState,
      [element.id()]: {
        ...elementState[element.id()],
        isDragging: true,
      },
    });
  };

  const handleMouseMove = (event) => {
    // Update position of any dragging element
    Object.values(elementState).forEach((state) => {
      if (state.isDragging) {
        const { element } = state;
        const { clientX, clientY } = event;
        const { x, y } = element.bbox();
        element.move(clientX - x, clientY - y);
      }
    });
  };

  const handleMouseUp = () => {
    // Clear drag flag for any dragging element
    setElementState(
      Object.fromEntries(
        Object.entries(elementState).map(([id, state]) => [
          id,
          { ...state, isDragging: false },
        ])
      )
    );
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // Create a new SVG image element with the data URL of the file
        const image = svg.image(reader.result).size(50,50);
  
        // Add the rectangle and image elements to the elements array and update the element state
        setElements([...elements, image]);
        setElementState({
          ...elementState,
          [image.id()]: {
            element: image,
            isDragging: true,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCanvasClick = (event) => {
    const { clientX, clientY } = event;
    const rect = svg.rect(50, 50).move(clientX, clientY).fill("#FFFFFF");
    setElements([...elements, rect]);
    setElementState({
      ...elementState,
      [rect.id()]: {
        element: rect,
        isDragging: false,
      },
    });
  };

  const handleElementClick = (event, element) => {
    console.log("Clicked element:", element);
  };
  
  return (
    <div className="logo-designer">
      <h1>Chanlogo</h1>
      <div className="controls">
        <div className="control">
          <label>Text:</label>
          <input
            type="text"onChange={(event) => setText(event.target.value)}
          />
        </div>
        <div className="control">
          <label>Slogan:</label>
          <input
            type="text"
            value={slogan}
            onChange={(event) => setSlogan(event.target.value)}
            style={{ fontSize: 16 }}
          />
        </div>
        <div className="control">
          <label>Text Color:</label>
          <SketchPicker
            color={textColor}
            onChange={(color) => setTextColor(color.hex)}
          />
        </div>
        <div className="control">
          <label>Background Color:</label>
          <SketchPicker
            color={backgroundColor}
            onChange={(color) => setBackgroundColor(color.hex)}
          />
        </div>
        <div className="control">
          <label>Canvas Size:</label>
          <input
            type="number"
            value={canvasSize.width}
            onChange={(event) =>
              setCanvasSize({
                ...canvasSize,
                width: parseInt(event.target.value),
              })
            }
          />
          <span>x</span>
          <input
            type="number"
            value={canvasSize.height}
            onChange={(event) =>
              setCanvasSize({
                ...canvasSize,
                height: parseInt(event.target.value),
              })
            }
          />
        </div>
        <div className="control">
          <label>Border Width:</label>
          <input
            type="number"
            value={borderWidth}
            onChange={(event) => setBorderWidth(parseInt(event.target.value))}
          />
        </div>
        <div className="control">
          <label>Border Color:</label>
          <SketchPicker
            color={borderColor}
            onChange={(color) => setBorderColor(color.hex)}
          />
        </div>
        <div className="control">
          <label>Border Radius:</label>
          <input
            type="number"
            value={borderRadius}
            onChange={(event) => setBorderRadius(parseInt(event.target.value))}
          />
        </div>
        <div className="control">
          <label>Font:</label>
          <select
            value={font}
            onChange={(event) => setFont(event.target.value)}
          >
            <option value="sans-serif">Sans-serif</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Georgia">Georgia</option>
            <option value="Courier New">Courier</option>
            <option value="Verdana">Verdana</option>
            <option value="Impact">Impact</option>
            <option value="Display">Display</option>
            <option value="Script">Script</option>
            <option value="Zorus Serif">Zorus</option>
            <option value="Futura">Futura</option>
            <option value="Garamond">Garamond</option>
            <option value="Trajan">Trajan</option>
            <option value="Flix">Flix</option>
            <option value="Zenzero Sans">Zenzero</option>
            <option value="Open Sans">OpenSans</option>
            <option value="SPORTY">SPORTY</option>
          </select>
        </div>
        <div className="control">
          <label>Font Weight:</label>
          <select
            value={fontWeight}
            onChange={(event) => setFontWeight(event.target.value)}
          >
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>  
            <option value="Monospace">Monospace</option> 
          </select>
        </div>
        <div className="control">
          <label>Font Size:</label>
          <input
            type="number"
            value={fontSize}
            onChange={(event) => setFontSize(parseInt(event.target.value))}
          />
        </div>
        <div className="control">
          <label>Upload Image:</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
        {/* <div className="control">
          <button onClick={handleDrawRectangle}>Draw Rectangle</button>
        </div> */}
        <div className="control">
          <button onClick={handleGenerateLogo}>Generate Logo</button>
        </div>
      </div>
      <div
        className="canvas"
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleCanvasClick}
      >
        {logoImage && <img className="logo" src={logoImage} alt="Logo" />}
        {elements.map((element) => (
          <div
            key={element.id()}
            onMouseDown={(event) => handleElementMouseDown(event, element)}
            onClick={(event) => handleElementClick(event, element)}
            className="element"
            style={{
              transform: `translate(${element.x()}px, ${element.y()}px)`,
            }}
          >
            {element.svg()}
          </div>
        ))}
      </div>
      <button onClick={() => {
      const link = document.createElement('a');
      link.href = logoImage;
      link.download = 'logo.svg';
      link.click();
    }} className="download-button">Download Logo</button>
  
    </div>
  );
}
function generateLogo(
  text,
  slogan,
  canvasSize,
  borderWidth,
  borderColor,
  textColor,
  backgroundColor,
  borderRadius,
  font,
  fontWeight,
  fontSize,
  // borderLine = { color: '#000000', width: 0 }
  
) {
  // const borderRect = `<rect x="5" y="5" width="${canvasSize.width-10}" height="${canvasSize.height-10}" fill="none" stroke="${borderLine.color}" stroke-width="${borderLine.width}" rx="${borderRadius}"/>`;
  
  // Use a color library to manipulate the colors and ensure visual balance
  const textColorObj = tinycolor(textColor);
  const backgroundColorObj = tinycolor(backgroundColor);
  const complementaryColorObj = textColorObj.complement();
  const complementaryColor = complementaryColorObj.toHexString();

  // Use a formula to calculate the appropriate font size based on canvas size
  const maxDimension = Math.max(canvasSize.width, canvasSize.height);
  const idealFontSize = Math.round(maxDimension /5);
  const adjustedFontSize = Math.min(fontSize, idealFontSize);
  const svg = `
     <svg width="${canvasSize.width}" height="${canvasSize.height}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${canvasSize.width}" height="${canvasSize.height}" fill="${backgroundColor}" stroke="${borderColor}" stroke-width="${borderWidth}" rx="${borderRadius}"/>
       <text x="${canvasSize.width /2}" y="${canvasSize.height / 2 + adjustedFontSize}" font-family="${font}" font-weight="${fontWeight}" font-size="${adjustedFontSize}" fill="${textColor}" text-anchor="middle">${text}</text>
        <text x="${canvasSize.width / 2}" y="${canvasSize.height / 2 + (1.6*adjustedFontSize)}" font-family="${font}" font-weight="${fontWeight}" font-size="${adjustedFontSize / 2}" fill="${complementaryColor}" text-anchor="middle">${slogan}</text>
      </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export default LogoDesigner;