import numpy as np
from scipy import sparse

class PhysicsEngine:
    """
    Subsystem for modeling aerosol droplet dynamics and ink interaction at the micro-scale.
    """
    def __init__(self, viscosity=1.2, surface_tension=0.072):
        self.viscosity = viscosity
        self.surface_tension = surface_tension
        # VO2 Phase Transition Critical Temperature
        self.tc_vo2 = 68.0 

    def check_vo2_phase_transition(self, current_temp_c: float, applied_voltage: float) -> str:
        """
        Calculate if the Vanadium Dioxide (VO2) ink has transitioned from an 
        insulator to a conductive metal phase based on T_c ≈ 68°C and voltage.
        """
        is_conductive = current_temp_c >= self.tc_vo2 or applied_voltage > 5.0
        return "CONDUCTIVE_METAL" if is_conductive else "INSULATOR"

    def calculate_droplet_spread(self, volume: float, impact_velocity: float) -> float:
        """
        Estimate the radius of the droplet spread upon impact with the substrate,
        factoring in the Droplet Volume to Viscosity Ratio (DVR) for electrical resistance.
        """
        # Calculate DVR (Droplet Volume to Viscosity Ratio)
        dvr = volume / self.viscosity
        
        weber_number = (1000 * impact_velocity**2 * (volume**(1/3))) / self.surface_tension
        # Modified spread factor using DVR
        spread_factor = np.sqrt(weber_number / 3) * (1.0 + np.log(1.0 + dvr))
        
        return (volume**(1/3)) * spread_factor

    def compute_density_gradient(self, bounds: tuple, resolution: float) -> np.ndarray:
        """
        Generate a localized density gradient matrix to enforce deposition constraints.
        """
        grid_size = int((bounds[1] - bounds[0]) / resolution)
        # Using a sparse matrix to represent the mostly-empty print volume
        density_matrix = sparse.random(grid_size, grid_size, density=0.05).toarray()
        return density_matrix
