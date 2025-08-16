import React, { useState } from "react";

const Window = ({ color, title, onClick, zIndex, top, left }) => (
  <div
    onClick={onClick}
    style={{
      width: "200px",
      height: "150px",
      background: color,
      position: "absolute",
      top,
      left,
      zIndex,
      border: "2px solid black",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
      color: "white",
    }}
  >
    {title}
  </div>
);

export default function Desktop() {
  const [windows, setWindows] = useState([]);
  const [order, setOrder] = useState([]);

  const addWindow = () => {
    const id = Date.now();
    const index = windows.length;
    const newWin = {
      id,
      comp: <Window color={["red", "blue", "green", "purple"][index % 4]} title={`Window ${id}`} />,
      top: 50 + index * 30,   // 👈 cascade down
      left: 50 + index * 40,  // 👈 cascade right
    };
    setWindows([...windows, newWin]);
    setOrder([...order, id]); // put it on top
  };

  const bringToFront = (id) => {
    setOrder((prev) => [...prev.filter((wid) => wid !== id), id]);
  };

  return (
    <div style={{ position: "relative", height: "100vh", background: "#eee" }}>
      <button onClick={addWindow} style={{ margin: 10 }}>➕ Add Window</button>

      {order.map((id, index) => {
        const win = windows.find((w) => w.id === id);
        return (
          <div key={id} style={{ position: "absolute", top: win.top, left: win.left, zIndex: index + 1 }}>
            {React.cloneElement(win.comp, { onClick: () => bringToFront(id), zIndex: index + 1 })}
          </div>
        );
      })}
    </div>
  );
}
