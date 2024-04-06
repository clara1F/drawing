// Selecting elements from the DOM
const canvas = document.querySelector("canvas"), // Selecting the canvas element from the HTML document
  toolButtons = document.querySelectorAll(".tool"), // Selecting all elements with the class 'tool'
  fillColour = document.querySelector("#fill-colour"), // Selecting the element with the ID 'fill-colour'
  sizeSlider = document.querySelector("#size-slider"), // Selecting the element with the ID 'size-slider'
  colourButtons = document.querySelectorAll(".colours .option"), // Selecting all elements with the class 'option' inside the element with class 'colours'
  colourPicker = document.querySelector("#colour-picker"), // Selecting the element with the ID 'colour-picker'
  clearCanvas = document.querySelector(".clear-canvas"), // Selecting the element with the class 'clear-canvas'
  saveImg = document.querySelector(".save-image"), // Selecting the element with the class 'save-image'
  AddText = document.querySelector("#add-text"), // Selecting the element with the ID 'add-text'
  ctx = canvas.getContext("2d"); // Getting the 2D rendering context of the canvas for drawing operations

// Variables for tracking drawing state and settings
let PrevMouseX, PrevMouseY, screenshot,
  isDrawing = false,
  selectedTool = "round-brush", // Default tool
  brushWidth = 5,
  selectedColour = "#000";

// Function to set the canvas background
const setCanvasBackground = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColour;
};

// Event listener for when the window has finished loading
window.addEventListener('load', () => {
  // Set canvas dimensions and background
  canvas.height = canvas.offsetHeight;
  canvas.width = canvas.offsetWidth;
  setCanvasBackground();
});

// Event listener for mouse down to start drawing
const startDrawing = (e) => {
  isDrawing = true;
  PrevMouseX = e.offsetX;
  PrevMouseY = e.offsetY;
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = selectedColour;
  ctx.fillStyle = selectedColour;

  // Set line cap based on the selected tool
  if (selectedTool === "round-brush") {
    ctx.lineCap = "round";
  } else if (selectedTool === "square-brush") {
    ctx.lineCap = "square";
  } else if (selectedTool === "flat-brush") {
    ctx.lineCap = "butt";
  }

  screenshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

// Function to draw a rectangle
const drawRect = (e) => {
  if (!fillColour.checked) {
    return ctx.strokeRect(e.offsetX, e.offsetY, PrevMouseX - (e.offsetX), PrevMouseY - (e.offsetY));
  }
  ctx.fillRect(e.offsetX, e.offsetY, PrevMouseX - (e.offsetX), PrevMouseY - (e.offsetY));
};

// Function to draw a circle
const drawCircle = (e) => {
  ctx.beginPath();
  let radius = Math.sqrt(Math.pow((PrevMouseX - e.offsetX), 2) + Math.pow((PrevMouseY - e.offsetY), 2));
  ctx.arc(PrevMouseX, PrevMouseY, radius, 0, 2 * Math.PI);
  fillColour.checked ? ctx.fill() : ctx.stroke();
};

// Function to draw a triangle
const drawTriangle = (e) => {
  // Begin a new path for drawing
  ctx.beginPath();
  // Move to the starting point of the triangle (previous mouse position)
  ctx.moveTo(PrevMouseX, PrevMouseY);
  // Draw lines to the other two vertices of the triangle (current mouse position and mirrored position)
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(PrevMouseX * 2 - e.offsetX, e.offsetY);
  // Close the path to form a triangle
  ctx.closePath();
  // If fill checkbox is checked, fill the triangle, otherwise stroke the triangle
  fillColour.checked ? ctx.fill() : ctx.stroke();
};

// Function to draw a hexagon
const drawHexagon = (e) => {
  ctx.beginPath();
  const sideLength = Math.min(Math.abs(PrevMouseX - e.offsetX), Math.abs(PrevMouseY - e.offsetY));
  const apothem = Math.sqrt(3) / 2 * sideLength; // Apothem length for a regular hexagon
  ctx.moveTo(PrevMouseX + sideLength, PrevMouseY);
  for (let i = 1; i <= 6; i++) {
    const angle = (i * 2 * Math.PI) / 6;
    const x = PrevMouseX + Math.cos(angle) * sideLength;
    const y = PrevMouseY + Math.sin(angle) * sideLength;
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  fillColour.checked ? ctx.fill() : ctx.stroke();
};

// Function to draw a line
const drawLine = (e) => {
  ctx.beginPath();
  ctx.moveTo(PrevMouseX, PrevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
};

// Function for handling ongoing drawing actions
const drawing = (e) => {
  if (!isDrawing) return;
  ctx.putImageData(screenshot, 0, 0);

  // Draw based on the selected tool
  if (selectedTool === "round-brush" || selectedTool === "square-brush" || selectedTool === "flat-brush" || selectedTool === "eraser") {
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColour;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  } else if (selectedTool === "rectangle") {
    drawRect(e);
  } else if (selectedTool === "circle") {
    drawCircle(e);
  } else if (selectedTool === "line") {
    drawLine(e);
  } else if (selectedTool === "triangle") {
    drawTriangle(e);
  } else if (selectedTool === "hexagon") {
    drawHexagon(e);
}
};

// Event listeners for tool buttons
toolButtons.forEach(button => {
  button.addEventListener("click", () => {
    // Remove active class from the previously active button
    document.querySelector(".options .active").classList.remove("active");
    // Add active class to the clicked button
    button.classList.add("active");
    // Update the selected tool
    selectedTool = button.id;
    console.log(selectedTool);
  });
});

// Event listener for size slider change
sizeSlider.addEventListener("change", () => {
  // Update brush width based on the slider value
  brushWidth = sizeSlider.value;
});

// Event listeners for colour buttons
colourButtons.forEach(button => {
  button.addEventListener("click", () => {
    // Remove selected class from the previously selected colour button
    document.querySelector(".options .selected").classList.remove("selected");
    // Add selected class to the clicked colour button
    button.classList.add("selected");
    // Update the selected colour
    selectedColour = window.getComputedStyle(button).getPropertyValue("background-color");
  });
});


// Event listener for colour picker change
colourPicker.addEventListener("change", () => {
  // Update colour picker background
  colourPicker.parentElement.style.background = colourPicker.value;
  // Trigger a click event on the colour picker parent to apply the new colour
  colourPicker.parentElement.click();
});

// Event listener for clearing the canvas
clearCanvas.addEventListener("click", () => {
  // Clear the canvas and set the background
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground();
});

// Event listener for saving the canvas as an image
saveImg.addEventListener("click", () => {
  const link = document.createElement("a");
  // Get the current date in a formatted string
  const currentDate = new Date().toISOString().replace(/[-T:]/g, '_').slice(0, -14);
  // Set the download attribute with the formatted date and file extension
  link.download = `${currentDate}.jpg`;
  // Set the href attribute with the canvas data URL
  link.href = canvas.toDataURL();
  // Trigger a click event on the link to initiate the download
  link.click();
});

// Event listener for adding text to the canvas 
AddText.addEventListener("dblclick", () => { // the add text funtion is triggered by a double click
  const textInput = prompt("Enter text:");
  if (textInput !== null) {
    const textSizeInput = document.getElementById("text-size-input");
    const textColorInput = document.getElementById("text-colour-input");
    const fontSelector = document.getElementById("font-selector");
    const positionXInput = prompt("Enter X position (in pixels):");
    const positionYInput = prompt("Enter Y position (in pixels):");
    const textSize = parseInt(textSizeInput.value) || 16; // Default size if not entered
    const textColor = textColorInput.value || "#000000"; // Default colour if not entered
    const font = fontSelector.value || "Arial"; // Default font if not selected
    const positionX = parseInt(positionXInput) || canvas.width / 2;
    const positionY = parseInt(positionYInput) || canvas.height / 2;
    ctx.font = `${textSize}px ${font}`;
    ctx.fillStyle = textColor;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(textInput, positionX, positionY);
  }
});

// Event listener for mouse down to start drawing
canvas.addEventListener("mousedown", startDrawing);

// Event listener for ongoing drawing actions
canvas.addEventListener("mousemove", drawing);

// Event listener for mouse up to stop drawing
canvas.addEventListener("mouseup", () => isDrawing = false);
