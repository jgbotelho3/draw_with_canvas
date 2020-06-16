document.addEventListener("DOMContentLoaded", () => {
  const socket = io.connect();
  const screen = document.querySelector("#screen");
  const context = screen.getContext("2d");
  const pen = {
    active: false,
    isMoving: false,
    pos: { x: 0, y: 0 },
    posBefore: null,
  };

  screen.width = 700;
  screen.height = 500;

  context.lineWidth = 5;

  const drawLine = (line) => {
    context.beginPath();
    context.moveTo(line.posBefore.x, line.posBefore.y);
    context.lineTo(line.pos.x, line.pos.y);
    context.stroke();
  };

  screen.onmousedown = (e) => {
    pen.active = true;
  };
  screen.onmouseup = (e) => {
    pen.active = false;
  };

  screen.onmousemove = (e) => {
    pen.pos.x = e.clientX;
    pen.pos.y = e.clientY;
    pen.isMoving = true;
  };

  socket.on("isDrawing", (line) => {
    drawLine(line);
  });

  const checkIsDraw = () => {
    if (pen.active && pen.isMoving && pen.posBefore) {
      socket.emit("isDrawing", { pos: pen.pos, posBefore: pen.posBefore });
      pen.isMoving = false;
    }
    pen.posBefore = { ...pen.pos };

    setTimeout(checkIsDraw, 10);
  };

  checkIsDraw();
});
