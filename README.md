# Aerosol-Logic

**Aerosol-Logic** is the core CAD-to-Ink-Density compiler architecture. 

It optimizes spatial density matrices for aerosol inkjet deposition, utilizing scientific simulations via NumPy and SciPy to predict and manage fluid dynamics mathematically before the physical printing process.

## Architecture

- `src/compiler.py`: Main compiler entrypoint that translates `.stl` or `.obj` CAD files into voxelized ink-density constraints.
- `src/physics_engine.py`: Handles the underlying aerosol dynamics and physical modeling for nozzle deposition.
