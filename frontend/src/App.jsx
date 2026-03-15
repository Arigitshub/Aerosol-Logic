import { useState, useEffect } from 'react'

const GRID_SIZE = 20 * 10; // 20 columns, 10 rows
const TC_VO2 = 68.0; // Critical Temp
const BASE_VISCOSITY = 1.2;

function App() {
  const [temperature, setTemperature] = useState(25.0);
  const [voltage, setVoltage] = useState(0.0);
  const [gridData, setGridData] = useState([]);

  // Generate Droplet Volume to Viscosity Ratio (DVR) mapping
  useEffect(() => {
    const newGrid = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      // Simulate random droplet volumes across the print bed (0.5 to 5.0 picoliters)
      const volume = 0.5 + (Math.random() * 4.5);
      const dvr = volume / BASE_VISCOSITY;
      
      // Calculate state transition
      const isConductive = temperature >= TC_VO2 || voltage > 5.0;
      
      // Calculate hypothetical resistance based on DVR and phase state
      // Resistance drops massively when conductive, but is mediated by the DVR spread.
      const resistance = isConductive ? (10.0 / dvr) : (100000.0 * dvr);
      
      newGrid.push({
        id: i,
        volume: volume.toFixed(2),
        dvr: dvr.toFixed(2),
        isConductive,
        resistance: resistance.toFixed(2)
      });
    }
    setGridData(newGrid);
  }, [temperature, voltage]);

  const getCellColor = (cell) => {
    if (cell.isConductive) {
      // Metallic phase: color intensity tied to the DVR
      const intensity = Math.min(255, Math.floor(cell.dvr * 50));
      return `rgb(${intensity}, ${intensity + 50}, 255)`; // Cyan/Blue glow
    } else {
      // Insulator phase: dark, murky red/brown based on volume
      const intensity = Math.max(20, Math.floor(cell.volume * 20));
      return `rgb(${intensity + 50}, 20, 20)`;
    }
  };

  return (
    <div className="glass-box">
      <div className="header">
        <h1>Aerosol-Logic Telemetry</h1>
        <p>Dynamic DVR Array vs VO₂ State Transitions</p>
      </div>
      
      <div className="controls">
        <label>
          Temperature (°C): {temperature.toFixed(1)}
          <br/>
          <input 
            type="range" min="20" max="100" step="0.5" 
            value={temperature} 
            onChange={(e) => setTemperature(parseFloat(e.target.value))} 
          />
        </label>
        <label>
          Applied Voltage (V): {voltage.toFixed(1)}
          <br/>
          <input 
            type="range" min="0" max="10" step="0.1" 
            value={voltage} 
            onChange={(e) => setVoltage(parseFloat(e.target.value))} 
          />
        </label>
      </div>

      <div className="heatmap-container">
        {gridData.map(cell => (
          <div 
            key={cell.id} 
            className="cell" 
            style={{ backgroundColor: getCellColor(cell) }}
          >
            <div className="tooltip">
              DVR: {cell.dvr} | R: {cell.resistance}Ω
            </div>
          </div>
        ))}
      </div>

      <div className="legend">
        <span>Insulating Phase (Below T_c)</span>
        <span>Conductive Phase (T_c ≥ 68°C or V &gt; 5.0V)</span>
      </div>
    </div>
  )
}

export default App
