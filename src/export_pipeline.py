import csv
import random
from physics_engine import PhysicsEngine

def export_telemetry_logs(filename="telemetry_logs.csv", num_samples=1000):
    """
    Generate mock VO2 state transition telemetry utilizing the physics engine
    and export the dataset to a structured CSV.
    """
    engine = PhysicsEngine(viscosity=1.2)
    
    headers = ["Sample_ID", "Temperature_C", "Applied_Voltage", "Droplet_Volume_pL", "DVR", "Impact_Velocity_m_s", "Spread_Radius", "VO2_State", "Resistance_Ohm"]
    
    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(headers)
        
        for i in range(num_samples):
            # Generate randomized environment and operation parameters
            temp_c = round(random.uniform(20.0, 100.0), 2)
            voltage = round(random.uniform(0.0, 10.0), 2)
            volume_pl = round(random.uniform(0.5, 5.0), 3)
            velocity = round(random.uniform(1.0, 5.0), 2)
            
            # Utilize the physics engine rules
            vo2_state = engine.check_vo2_phase_transition(temp_c, voltage)
            spread_radius = engine.calculate_droplet_spread(volume_pl, velocity)
            dvr = volume_pl / engine.viscosity
            resistance = engine.calculate_resistance(dvr, vo2_state)
            
            # Write to CSV
            writer.writerow([
                f"SAMP-{i:04d}", 
                temp_c, 
                voltage, 
                volume_pl, 
                round(dvr, 4),
                velocity, 
                round(spread_radius, 4), 
                vo2_state,
                round(resistance, 2)
            ])
            
    print(f"✅ Successfully exported {num_samples} telemetry logs to {filename}")

if __name__ == "__main__":
    export_telemetry_logs()
