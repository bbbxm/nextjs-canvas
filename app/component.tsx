"use client";
import React, { useRef, useEffect, useState } from "react";

class Rectangle {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  constructor(startX: number, startY: number, endX: number, endY: number) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
  }
  draw(context: any) {
    context.save();
    context.beginPath();
    context.moveTo(this.startX, this.startY);
    context.lineTo(this.endX, this.startY);
    context.lineTo(this.endX, this.endY);
    context.lineTo(this.startX, this.endY);
    context.lineTo(this.startX, this.startY);
    context.stroke();
    context.closePath();
    context.restore();
  }
}

interface Seat {
  isSet: boolean;
  color: string;
  price: number;
}

function getRandomRGBColor(limit: number = 256) {
  //十六进制颜色随机
  const r = Math.floor(Math.random() * limit);
  const g = Math.floor(Math.random() * limit);
  const b = Math.floor(Math.random() * limit);

  const color = `rgb(${r},${g},${b})`;
  return color;
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
  const canvasRef = useRef<any>(null);
  const [seatStatus, setSeatStatus] = useState<Seat[][]>(
    new Array(rows)
      .fill(null)
      .map(() =>
        new Array(cols).fill({ isSet: false, color: "#ccc", price: 0 })
      )
  );
  const [element, setElement] = useState<any>();
  const [drawing, setDrawing] = useState<boolean>(false);
  const [color, setColor] = useState<string>("#f00");
  const [price, setPrice] = useState<number>(0);

  const init = (context: any) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.save();
    context.beginPath();
    context.moveTo(50, 50);
    context.lineTo(50, rows * (gap + size) + gap + 50);
    context.lineTo(
      cols * (gap + size) + gap + 50,
      rows * (gap + size) + gap + 50
    );
    context.strokeStyle = "#000";
    context.stroke();
    context.closePath();
    context.beginPath();
    context.textAlign = "center";
    for (let i = 0; i < 12; i++) {
      context.fillText(i + 1, 40, i * 40 + 80);
    }

    for (let i = 0; i < 24; i++) {
      context.fillText(i + 1, i * 40 + 75, rows * (gap + size) + gap + 60);
    }
    context.fillStyle = "#000";
    context.lineWidth = 0.3;
    context.stroke();
    context.closePath();
    context.restore();
  };

  const draw = (context: any) => {
    context.save();
    seatStatus.map((cols: Seat[], row: number) => {
      cols.map((item: Seat, col: number) => {
        const x = col * (gap + size) + gap + 50;
        const y = row * (gap + size) + gap + 50;
        context.fillStyle = item.isSet ? item.color : "#ccc";
        context.fillRect(x, y, size, size);
      });
    });
    context.restore();
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = cols * (gap + size) + gap + 100;
      canvas.height = rows * (gap + size) + gap + 100;
      const context = canvas.getContext("2d");
      init(context);
      draw(context);
      if (element) {
        element.draw(context);
      }
    }
  }, [element]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);

    const clientX = event.nativeEvent.offsetX;
    const clientY = event.nativeEvent.offsetY;

    setElement(new Rectangle(clientX, clientY, clientX, clientY));
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;

    const clientX = event.nativeEvent.offsetX;
    const clientY = event.nativeEvent.offsetY;

    setElement(
      new Rectangle(element!.startX, element!.startY, clientX, clientY)
    );
  };

  const handleMouseUp = () => {
    setDrawing(false);
    if (!element) {
      return;
    }
    const startCol = Math.min(
      Math.floor((element.startX - 50) / (gap + size)),
      Math.floor((element.endX - 50) / (gap + size))
    );
    const startRow = Math.min(
      Math.floor((element.startY - 50) / (gap + size)),
      Math.floor((element.endY - 50) / (gap + size))
    );
    const endCol = Math.max(
      Math.floor((element.startX - 50) / (gap + size)),
      Math.floor((element.endX - 50) / (gap + size))
    );
    const endRow = Math.max(
      Math.floor((element.startY - 50) / (gap + size)),
      Math.floor((element.endY - 50) / (gap + size))
    );

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        updateSeat(row, col);
      }
    }

    setElement(null);
  };

  const updateSeat = (row: number, col: number) => {
    if (row >= rows || col >= cols || row < 0 || col < 0) {
      return;
    }

    const newSeatStatus = [...seatStatus];
    newSeatStatus[row][col] = {
      ...newSeatStatus[row][col],
      color: color,
      isSet: !newSeatStatus[row][col].isSet,
    };
    setSeatStatus(newSeatStatus);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    seatStatus.map((cols: Seat[], row: number) => {
      cols.map((item: Seat, col: number) => {
        if (item.isSet && item.color === color) {
          const newSeatStatus = [...seatStatus];
          newSeatStatus[row][col] = {
            ...newSeatStatus[row][col],
            price: price,
          };
          setSeatStatus(newSeatStatus);
        }
      });
    });
    setPrice(0);
    setColor(getRandomRGBColor());
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseUp}
      />
      <form className="flex justify-center" onSubmit={handleSubmit}>
        <div className="mt-2 flex rounded-md shadow-sm">
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="text"
              name="price"
              id="price"
              className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              value={price === 0 ? "" : price}
              onChange={(e) => setPrice(e.target.valueAsNumber)}
              placeholder="0.00"
            />
          </div>
          <button
            type="submit"
            className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            OK
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroupBoard;
