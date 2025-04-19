import React from 'react';

const BasicFlowGraph = () => {
  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", padding: "20px", backgroundColor: "white" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", fontSize: "24px", fontWeight: "bold" }}>Game Timeline Performance</h2>
      
      {/* Graph container */}
      <div style={{ position: "relative", height: "300px", marginBottom: "40px" }}>
        {/* Y-axis labels */}
        <div style={{ position: "absolute", left: "0", top: "0", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ color: "#6b7280", fontSize: "12px", marginBottom: "4px", textAlign: "right" }}>Within optimal zone</div>
            <div style={{ fontWeight: "bold", textAlign: "right" }}>High</div>
          </div>
          <div>
            <div style={{ color: "#6b7280", fontSize: "12px", marginBottom: "4px", textAlign: "right" }}>Near optimal</div>
            <div style={{ fontWeight: "bold", textAlign: "right" }}>Medium</div>
          </div>
          <div>
            <div style={{ color: "#6b7280", fontSize: "12px", marginBottom: "4px", textAlign: "right" }}>Outside optimal zone</div>
            <div style={{ fontWeight: "bold", textAlign: "right" }}>Low</div>
          </div>
        </div>
        
        {/* Graph area */}
        <div style={{ marginLeft: "120px", height: "100%", position: "relative", borderLeft: "2px solid #333", borderBottom: "2px solid #333" }}>
          {/* X-axis labels */}
          <div style={{ position: "absolute", left: "0", right: "0", bottom: "-30px", display: "flex", justifyContent: "space-between" }}>
            <div style={{ textAlign: "center" }}>Pre-Game</div>
            <div style={{ textAlign: "center" }}>Start Q1</div>
            <div style={{ textAlign: "center" }}>End Q1</div>
            <div style={{ textAlign: "center" }}>Halftime</div>
            <div style={{ textAlign: "center" }}>End Q3</div>
            <div style={{ textAlign: "center" }}>End Game</div>
          </div>
          
          {/* Flow Zone Highlight */}
          <div style={{ position: "absolute", left: "78%", top: "5%", width: "7%", height: "15%", border: "1px dashed #10b981", backgroundColor: "rgba(16, 185, 129, 0.1)", borderRadius: "2px" }}></div>
          <div style={{ position: "absolute", left: "86%", top: "5%", color: "#10b981", fontWeight: "bold", fontSize: "14px" }}>FLOW ZONE</div>
          
          {/* Lines and Points */}
          {/* Cortisol Line (purple) - manually positioned points */}
          <div style={{ position: "absolute", backgroundColor: "#8b5cf6", width: "8px", height: "8px", borderRadius: "50%", left: "0%", top: "15%", transform: "translate(-50%, -50%)" }}></div>
          <div style={{ position: "absolute", backgroundColor: "#8b5cf6", width: "8px", height: "8px", borderRadius: "50%", left: "20%", top: "12%", transform: "translate(-50%, -50%)" }}></div>
          <div style={{ position: "absolute", backgroundColor: "#8b5cf6", width: "8px", height: "8px", borderRadius: "50%", left: "40%", top: "10%", transform: "translate(-50%, -50%)" }}></div>
          <div style={{ position: "absolute", backgroundColor: "#8b5cf6", width: "8px", height: "8px", borderRadius: "50%", left: "60%", top: "12%", transform: "translate(-50%, -50%)" }}></div>
          <div style={{ position: "absolute", backgroundColor: "#8b5cf6", width: "8px", height: "8px", borderRadius: "50%", left: "80%", top: "15%", transform: "translate(-50%, -50%)" }}></div>
          <div style={{ position: "absolute", backgroundColor: "#8b5cf6", width: "8px", height: "8px", borderRadius: "50%", left: "100%", top: "18%", transform: "translate(-50%, -50%)" }}></div>
          
          {/* Alpha-Amylase Line (blue) */}
          <div style={{ position: "absolute", backgroundColor: "#60a5fa", width: "8px", height: "8px", borderRadius: "50%", left: "0%", top: "15%", transform: "translate(-50%, -50%)" }}></div>
          <div style={{ position: "absolute", backgroundColor: "#60a5fa", width: "8px", height: "8px", borderRadius: "50%", left: "20%", top: "18%", transform: "translate(-50%, -50%)" }}></div>
          <div style={{ position: "absolute", backgroundColor: "#60a5fa", width: "8px", height: "8px", borderRadius: "50%", left: "40%", top: "15%", transform: "translate(-50%, -50%)" }}></div>
          <div style={{ position: "absolute", backgroundColor: "#60a5fa", width: "8px", height: "8px", borderRadius: "50%", left: "60%", top: "12%", transform: "translate(-50%, -50%)" }}></div>
          <div style={{ position: "absolute", backgroundColor: "#60a5fa", width: "8px", height: "8px", borderRadius: "50%", left: "80%", top: "10%", transform: "translate(-50%, -50%)" }}></div>
          <div style={{ position: "absolute", backgroundColor: "#60a5fa", width: "8px", height: "8px", borderRadius: "50%", left: "100%", top: "15%", transform: "translate(-50%, -50%)" }}></div>
          
          {/* IZOF Line (green) */}
          <div style={{ position: "absolute", backgroundColor: "#10b981", width: "8px", height: "8px", borderRadius: "50%", left: "0%", top: "18%", transform: "translate(-50%, -50%)" }}></div>
          <div style={{ position: "absolute", backgroundColor: "#10b981", width: "8px", height: "8px", borderRadius: "50%", left: "20%", top: "15%", transform: "translate(-50%, -50%)" }}></div>
          <div style={{ position: "absolute", backgroundColor: "#10b981", width: "8px", height: "8px", borderRadius: "50%", left: "40%", top: "12%", transform: "translate(-50%, -50%)" }}></div>
          <div style={{ position: "absolute", backgroundColor: "#10b981", width: "8px", height: "8px", borderRadius: "50%", left: "60%", top: "10%", transform: "translate(-50%, -50%)" }}></div>
          <div style={{ position: "absolute", backgroundColor: "#10b981", width: "8px", height: "8px", borderRadius: "50%", left: "80%", top: "10%", transform: "translate(-50%, -50%)" }}></div>
          <div style={{ position: "absolute", backgroundColor: "#10b981", width: "8px", height: "8px", borderRadius: "50%", left: "100%", top: "12%", transform: "translate(-50%, -50%)" }}></div>
          
          {/* PR Index (red) - starts from Start Q1 */}
          <div style={{ position: "absolute", backgroundColor: "#ef4444", width: "8px", height: "8px", borderRadius: "50%", left: "20%", top: "50%", transform: "translate(-50%, -50%)" }}></div>
          <div style={{ position: "absolute", backgroundColor: "#ef4444", width: "8px", height: "8px", borderRadius: "50%", left: "40%", top: "45%", transform: "translate(-50%, -50%)" }}></div>
          <div style={{ position: "absolute", backgroundColor: "#ef4444", width: "8px", height: "8px", borderRadius: "50%", left: "60%", top: "35%", transform: "translate(-50%, -50%)" }}></div>
          <div style={{ position: "absolute", backgroundColor: "#ef4444", width: "8px", height: "8px", borderRadius: "50%", left: "80%", top: "12%", transform: "translate(-50%, -50%)" }}></div>
          <div style={{ position: "absolute", backgroundColor: "#ef4444", width: "8px", height: "8px", borderRadius: "50%", left: "100%", top: "15%", transform: "translate(-50%, -50%)" }}></div>
          
          {/* Simplified Line Connections - not real lines, just for display */}
          <div style={{ position: "absolute", height: "1px", backgroundColor: "#8b5cf6", width: "20%", left: "0%", top: "13.5%", transform: "rotate(8.5deg)" }}></div>
          <div style={{ position: "absolute", height: "1px", backgroundColor: "#8b5cf6", width: "20%", left: "20%", top: "11%", transform: "rotate(-6deg)" }}></div>
          <div style={{ position: "absolute", height: "1px", backgroundColor: "#8b5cf6", width: "20%", left: "40%", top: "11%", transform: "rotate(6deg)" }}></div>
          <div style={{ position: "absolute", height: "1px", backgroundColor: "#8b5cf6", width: "20%", left: "60%", top: "13.5%", transform: "rotate(8.5deg)" }}></div>
          <div style={{ position: "absolute", height: "1px", backgroundColor: "#8b5cf6", width: "20%", left: "80%", top: "16.5%", transform: "rotate(8.5deg)" }}></div>
          
          <div style={{ position: "absolute", height: "1px", backgroundColor: "#60a5fa", width: "20%", left: "0%", top: "16.5%", transform: "rotate(8.5deg)" }}></div>
          <div style={{ position: "absolute", height: "1px", backgroundColor: "#60a5fa", width: "20%", left: "20%", top: "16.5%", transform: "rotate(-8.5deg)" }}></div>
          <div style={{ position: "absolute", height: "1px", backgroundColor: "#60a5fa", width: "20%", left: "40%", top: "13.5%", transform: "rotate(-8.5deg)" }}></div>
          <div style={{ position: "absolute", height: "1px", backgroundColor: "#60a5fa", width: "20%", left: "60%", top: "11%", transform: "rotate(-6deg)" }}></div>
          <div style={{ position: "absolute", height: "1px", backgroundColor: "#60a5fa", width: "20%", left: "80%", top: "12.5%", transform: "rotate(14deg)" }}></div>
          
          <div style={{ position: "absolute", height: "1px", backgroundColor: "#10b981", width: "20%", left: "0%", top: "16.5%", transform: "rotate(-8.5deg)" }}></div>
          <div style={{ position: "absolute", height: "1px", backgroundColor: "#10b981", width: "20%", left: "20%", top: "13.5%", transform: "rotate(-8.5deg)" }}></div>
          <div style={{ position: "absolute", height: "1px", backgroundColor: "#10b981", width: "20%", left: "40%", top: "11%", transform: "rotate(-6deg)" }}></div>
          <div style={{ position: "absolute", height: "1px", backgroundColor: "#10b981", width: "20%", left: "60%", top: "10%", transform: "rotate(0deg)" }}></div>
          <div style={{ position: "absolute", height: "1px", backgroundColor: "#10b981", width: "20%", left: "80%", top: "11%", transform: "rotate(6deg)" }}></div>
          
          <div style={{ position: "absolute", height: "1px", backgroundColor: "#ef4444", width: "20%", left: "20%", top: "47.5%", transform: "rotate(-14deg)" }}></div>
          <div style={{ position: "absolute", height: "1px", backgroundColor: "#ef4444", width: "20%", left: "40%", top: "40%", transform: "rotate(-28deg)" }}></div>
          <div style={{ position: "absolute", height: "1px", backgroundColor: "#ef4444", width: "20%", left: "60%", top: "23.5%", transform: "rotate(-65deg)" }}></div>
          <div style={{ position: "absolute", height: "1px", backgroundColor: "#ef4444", width: "20%", left: "80%", top: "13.5%", transform: "rotate(8.5deg)" }}></div>
        </div>
      </div>
      
      {/* Legend */}
      <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: "12px", height: "12px", backgroundColor: "#8b5cf6", borderRadius: "50%", marginRight: "6px" }}></div>
          <span>Cortisol</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: "12px", height: "12px", backgroundColor: "#60a5fa", borderRadius: "50%", marginRight: "6px" }}></div>
          <span>α-Amylase</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: "12px", height: "12px", backgroundColor: "#10b981", borderRadius: "50%", marginRight: "6px" }}></div>
          <span>IZOF Score</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: "12px", height: "12px", backgroundColor: "#ef4444", borderRadius: "50%", marginRight: "6px" }}></div>
          <span>PR Index</span>
        </div>
      </div>
    </div>
  );
};

export default BasicFlowGraph;