# Aerosol-Logic: CAD-to-Ink-Density Compiler

Aerosol-Logic is a high-performance computational pipeline designed to simulate the physical properties of conductive inks—specifically Vanadium Dioxide ($VO_2$) nanoparticle matrices—deposited onto flexible substrates via aerosol jet printing.

## Architecture

The system operates using a **CAD-to-Ink-Density** architecture:
1. **Core Compiler (`core_compiler.py`)**: Parses incoming G-Code or CAD pathing instructions to determine the topological laydown coordinates.
2. **Physics Engine (`physics_engine.py`)**: Resolves the kinetic and thermodynamic state of the ink upon substrate impact.
3. **Telemetry Dashboard (`frontend/`)**: A "Glass Box" React UI that visualizing the fluid-to-solid matrix rules in real time.
4. **Data Pipeline (`export_pipeline.py`)**: Compiles telemetry sets into structured CSV logs for verifiable peer review.

### The Physics: DVR and $VO_2$ Phase Transitions

This repository heavily relies on two core chemical logic parameters:

1. **Vanadium Dioxide ($VO_2$) Phase Transition**: $VO_2$ is a thermochromic material that transitions from an insulator to a conductive metal at a critical temperature ($T_c \approx 68^\circ C$). The `physics_engine` monitors ambient temperatures and applied voltages to flag states as `INSULATOR` or `CONDUCTIVE_METAL`.
2. **Droplet Volume to Viscosity Ratio (DVR)**: $DVR = \frac{Volume}{\mu_{viscosity}}$. The physics engine modifies standard Weber number calculations with the DVR coefficient to predict the spread radius and structural resistance of the printed traces.

## Installation

This environment is optimized for scientific simulations requiring `numpy` and `scipy`.

```bash
# Core Environment
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
pip install numpy scipy

# Glass Box Telemetry UI
cd frontend
npm install
```

## How to Run

**1. Data Pipeline Export**
To generate a theoretical dataset of $VO_2$ transitions across 1,000 randomized droplets:
```bash
python src/export_pipeline.py
```
This outputs a peer-reviewable `telemetry_logs.csv`.

**2. Interactive Heatmap UI**
To launch the "Glass Box" observer dashboard:
```bash
cd frontend
npm run dev
```
