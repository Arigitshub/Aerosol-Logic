# Celestial Logic: Real-Time Astral Telemetry

Celestial Logic is a high-performance astronomical engine designed to synthesize real-time planetary positions and zodiacal transitions into actionable personal telemetry.

## Architecture

The system operates using a **Celestial-Data-to-Insight** architecture:
1. **Astral Engine (`frontend/src/App.jsx`)**: Fetches real-time horoscope and ephemeris data from the Aztro API.
2. **Glass Box Observer**: A polished React UI that visualizes astral phases, mood metrics, and lucky indicators.
3. **Data Pipeline (`src/export_pipeline.py`)**: (Legacy) Transitioning to export structured astrological historical data.

## Installation

```bash
# Frontend Dashboard
cd frontend
npm install
npm run dev
```

## How to Run

Launch the "Glass Box" observer dashboard:
```bash
cd frontend
npm run dev
```

The app will connect to the Aztro real-time engine to provide live daily horoscopes based on your zodiac sign.
