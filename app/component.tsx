"use client";
import React, { useRef, useEffect, useState } from "react";

function createElement(x1, y1, x2, y2) {
  return { x1, y1, x2, y2 };
}

const GroupBoard = ({
  rows,
  cols,
  size,
  gap,
}: {
  rows: number;
  cols: number;
  size: number;
  gap: number;
}) => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [seatStatus, setSeatStatus] = useState(
    new Array(rows).fill(null).map(() => new Array(cols).fill(false))
  );
  const [elements, setElements] = useState([]);
  const [drawing, setDrawing] = useState(false);

  const draw = (context) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    seatStatus.map((cols, row) => {
      cols.map((value, col) => {
        const x = col * (gap + size) + gap;
        const y = row * (gap + size) + gap;
        context.fillStyle = value ? "#f00" : "#ccc";
        context.fillRect(x, y, size, size);
      });
    });
  };

  const drag = (context, element) => {
    draw(context);
    context.beginPath();
    const { x1, y1, x2, y2 } = element;
    context.moveTo(x1, y1);
    context.lineTo(x2, y1);
    context.lineTo(x2, y2);
    context.lineTo(x1, y2);
    context.lineTo(x1, y1);
    context.strokeStyle = "#000";
    context.stroke();
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = cols * (gap + size) + gap;
      canvas.height = rows * (gap + size) + gap;
      const context = canvas.getContext("2d");
      setContext(context);
      draw(context);
    }
  }, []);

  useEffect(() => {
    if (context) {
      draw(context);
    }
  }, [seatStatus]);

  useEffect(() => {
    if (context) {
      elements.forEach((element) => drag(context, element));
    }
  }, [elements]);

  const handleMouseDown = (event) => {
    setDrawing(true);

    const clientX = event.nativeEvent.offsetX;
    const clientY = event.nativeEvent.offsetY;

    const element = createElement(clientX, clientY, clientX, clientY);

    setElements((prev) => [...prev, element]);
  };

  const handleMouseMove = (event) => {
    if (!drawing) return;

    const clientX = event.nativeEvent.offsetX;
    const clientY = event.nativeEvent.offsetY;

    const index = elements.length - 1;

    const { x1, y1 } = elements[index] ?? {};

    const updateElement = createElement(x1, y1, clientX, clientY);

    const elementsCopy = [...elements];
    elementsCopy[index] = updateElement;
    setElements(elementsCopy);
  };

  const handleMouseUp = () => {
    setDrawing(false);

    const index = elements.length - 1;

    const { x1, y1, x2, y2 } = elements[index] ?? {};

    const startCol = Math.min(
      Math.floor(x1 / (gap + size)),
      Math.floor(x2 / (gap + size))
    );
    const startRow = Math.min(
      Math.floor(y1 / (gap + size)),
      Math.floor(y2 / (gap + size))
    );
    const endCol = Math.max(
      Math.floor(x1 / (gap + size)),
      Math.floor(x2 / (gap + size))
    );
    const endRow = Math.max(
      Math.floor(y1 / (gap + size)),
      Math.floor(y2 / (gap + size))
    );

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        updateSeat(row, col);
      }
    }

    setElements([]);
  };

  const updateSeat = (row, col) => {
    const newSeatStatus = [...seatStatus];
    newSeatStatus[row][col] = !newSeatStatus[row][col];
    setSeatStatus(newSeatStatus);
  };

  const handleButtonClick = () => {
    seatStatus.map((cols, row) => {
      cols.map((value, col) => {
        if (value) {
          console.log("row,col :>>", row, col);
        }
      });
    });
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseUp}
        className="border border-gray-400"
      />
      <div className="flex justify-center my-4">
        <button
          className="bg-blue-400 text-white px-4 py-2 mr-2"
          onClick={handleButtonClick}
        >
          Undo
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 "
          // onClick={clearDrawing}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default GroupBoard;
