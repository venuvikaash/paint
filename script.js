/*tslint:disabled*/

var canvas,
    context,
    dragging = false,
    dragStartLocation,
    snapshot;


const getCanvasCoordinates = (event) => {
    var x = event.clientX - canvas.getBoundingClientRect().left,
        y = event.clientY - canvas.getBoundingClientRect().top;

    return {x: x, y: y};
}

const takeSnapshot = () => {
    snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
}

const restoreSnapshot = () => {
    context.putImageData(snapshot, 0, 0);
}

const drawTriangle = (position, sides, angle) => {
    var coordinates = [],
        radius = Math.sqrt(Math.pow((dragStartLocation.x - position.x), 2) + Math.pow((dragStartLocation.y - position.y), 2)),
        index = 0;

    for (index = 0; index < sides; index++) {
        coordinates.push({x: dragStartLocation.x + radius * Math.cos(angle), y: dragStartLocation.y - radius * Math.sin(angle)});
        angle += (2 * Math.PI) / sides;
    }

    context.beginPath();
    context.moveTo(coordinates[0].x, coordinates[0].y);
    for (index = 1; index < sides; index++) {
        context.lineTo(coordinates[index].x, coordinates[index].y);
    }

    context.closePath();
}

const draw = (position) => {

    var fillBox = document.getElementById("fillBox"),
        triangleAngle = document.getElementById("polygonAngle").value;
    
    drawTriangle(position, 3, triangleAngle * (Math.PI / 180));

    if (fillBox.checked) {
        context.fill();
    } else {
        context.stroke();
    }
}

const dragStart = (event) => {
    dragging = true;
    dragStartLocation = getCanvasCoordinates(event);
    takeSnapshot();
}

const drag = (event) => {
    var position;
    if (dragging === true) {
        restoreSnapshot();
        position = getCanvasCoordinates(event);
        draw(position, "polygon");
    }
}

const dragStop = (event) => {
    dragging = false;
    restoreSnapshot();
    var position = getCanvasCoordinates(event);
    draw(position, "polygon");
}

const changeFillStyle = () => {
    context.fillStyle = this.value;
	event.stopPropagation();
}

const changeStrokeStyle = () => {
    context.strokeStyle = this.value;
    event.stopPropagation();
}

const changeBackgroundColor = () => {
    context.save();
    context.fillStyle = document.getElementById("backgroundColor").value;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
}

const eraseCanvas = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

const init = () => {
    canvas = document.getElementById("canvas");
    context = canvas.getContext('2d');
    
    var fillColor = document.getElementById("fillColor"),
        strokeColor = document.getElementById("strokeColor"),
        canvasColor = document.getElementById("backgroundColor"),
        clearCanvas = document.getElementById("clearCanvas");

    context.strokeStyle = strokeColor.value;
    context.fillStyle = fillColor.value;

    canvas.addEventListener('mousedown', dragStart, false);
    canvas.addEventListener('mousemove', drag, false);
    canvas.addEventListener('mouseup', dragStop, false);
    fillColor.addEventListener("input", changeFillStyle, false);
    strokeColor.addEventListener("input", changeStrokeStyle, false);
    canvasColor.addEventListener("input", changeBackgroundColor, false);
    clearCanvas.addEventListener("click", eraseCanvas, false);
}

window.addEventListener('load', init, false);