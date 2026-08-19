import { useState, useEffect } from 'react'
import { 
  Body, 
  GeoVector,
  Ecliptic,
  MoonPhase
} from 'astronomy-engine'
import './App.css'

const ZODIAC_SIGNS = [
  { name: 'Aries', sym: '♈' }, { name: 'Taurus', sym: '♉' }, 
  { name: 'Gemini', sym: '♊' }, { name: 'Cancer', sym: '♋' }, 
  { name: 'Leo', sym: '♌' }, { name: 'Virgo', sym: '♍' }, 
  { name: 'Libra', sym: '♎' }, { name: 'Scorpio', sym: '♏' }, 
  { name: 'Sagittarius', sym: '♐' }, { name: 'Capricorn', sym: '♑' }, 
  { name: 'Aquarius', sym: '♒' }, { name: 'Pisces', sym: '♓' }
];

const PLANETS = [
  { name: 'Sun', sym: '☉', body: Body.Sun },
  { name: 'Moon', sym: '☽', body: Body.Moon },
  { name: 'Mercury', sym: '☿', body: Body.Mercury },
  { name: 'Venus', sym: '♀', body: Body.Venus },
  { name: 'Mars', sym: '♂', body: Body.Mars },
  { name: 'Jupiter', sym: '♃', body: Body.Jupiter },
  { name: 'Saturn', sym: '♄', body: Body.Saturn },
  { name: 'Uranus', sym: '♅', body: Body.Uranus },
  { name: 'Neptune', sym: '♆', body: Body.Neptune },
  { name: 'Pluto', sym: '♇', body: Body.Pluto }
];

function getZodiacSign(longitude) {
  const signIndex = Math.floor(longitude / 30);
  return ZODIAC_SIGNS[signIndex % 12];
}

function calculateAspects(transits) {
  const aspects = [];
  const orbs = { Conjunction: 8, Sextile: 6, Square: 6, Trine: 6, Opposition: 8 };
  const angles = { Conjunction: 0, Sextile: 60, Square: 90, Trine: 120, Opposition: 180 };

  for (let i = 0; i < transits.length; i++) {
    for (let j = i + 1; j < transits.length; j++) {
      const p1 = transits[i];
      const p2 = transits[j];
      
      // Calculate shortest distance on a 360 degree circle
      let diff = Math.abs(p1.longitude - p2.longitude);
      if (diff > 180) diff = 360 - diff;

      for (const [aspectName, angle] of Object.entries(angles)) {
        if (Math.abs(diff - angle) <= orbs[aspectName]) {
          aspects.push({
            p1: p1,
            p2: p2,
            aspect: aspectName,
            orb: Math.abs(diff - angle).toFixed(2),
            sym: aspectName === 'Conjunction' ? '☌' : 
                 aspectName === 'Sextile' ? '⚹' : 
                 aspectName === 'Square' ? '□' : 
                 aspectName === 'Trine' ? '△' : '☍'
          });
        }
      }
    }
  }
  return aspects.sort((a, b) => a.orb - b.orb); // Sort by exactness
}

function App() {
  const [sign, setSign] = useState('Aries');
  const [horoscope, setHoroscope] = useState(null);
  const [transits, setTransits] = useState([]);
  const [aspects, setAspects] = useState([]);
  const [moonPhase, setMoonPhase] = useState('');
  const [loading, setLoading] = useState(false);

  // Update Live Transits
  useEffect(() => {
    const updateTransits = () => {
      const date = new Date();
      const newTransits = PLANETS.map(p => {
        // Calculate geocentric vector with aberration correction (true)
        const vector = GeoVector(p.body, date, true);
        const ecliptic = Ecliptic(vector);
        const lon = ecliptic.elon;

        return {
          name: p.name,
          sym: p.sym,
          longitude: lon,
          displayLon: lon.toFixed(2),
          signObj: getZodiacSign(lon)
        };
      });
      setTransits(newTransits);
      setAspects(calculateAspects(newTransits));

      // Moon Phase calculation (0-360 degrees)
      const phase = MoonPhase(date);
      let phaseName = 'Unknown';
      if (phase < 11.25 || phase > 348.75) phaseName = 'New Moon 🌑';
      else if (phase < 78.75) phaseName = 'Waxing Crescent 🌒';
      else if (phase < 101.25) phaseName = 'First Quarter 🌓';
      else if (phase < 168.75) phaseName = 'Waxing Gibbous 🌔';
      else if (phase < 191.25) phaseName = 'Full Moon 🌕';
      else if (phase < 258.75) phaseName = 'Waning Gibbous 🌖';
      else if (phase < 281.25) phaseName = 'Third Quarter 🌗';
      else phaseName = 'Waning Crescent 🌘';
      setMoonPhase(phaseName);
    };

    updateTransits();
    const timer = setInterval(updateTransits, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  // Fetch Horoscope
  useEffect(() => {
    const fetchHoroscope = async () => {
      setLoading(true);
      try {
        // Switching to ohmanda.com for CORS-compliant horoscope data
        const response = await fetch(`https://ohmanda.com/api/horoscope/${sign.toLowerCase()}`);
        if (!response.ok) throw new Error('Celestial link interrupted');
        const rawData = await response.json();
        
        // Transform the response to match the existing UI structure
        setHoroscope({
          description: rawData.horoscope,
          date_range: rawData.date,
          mood: 'Harmonious', // Placeholder as ohmanda doesn't provide mood
          lucky_time: 'Dawn',
          compatibility: 'Universal',
          lucky_number: Math.floor(Math.random() * 100),
          color: '#d4af37'
        });
      } catch (err) {
        console.error('Failed to fetch horoscope', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHoroscope();
  }, [sign]);

  return (
    <div className="glass-box astrology-theme">
      <header className="header">
        <h1>Celestial Logic <span>PRO</span></h1>
        <p>Real-Time Astral Telemetry & Advanced Ephemeris</p>
      </header>

      <section className="live-data-ribbon" aria-label="Live Lunar and Planetary Status">
        <div className="ribbon-item pulse">
          <span className="label">Live Lunar Phase</span>
          <span className="value phase-text">{moonPhase}</span>
        </div>
        {transits.slice(0, 3).map(t => (
          <div key={t.name} className="ribbon-item">
            <span className="label">{t.sym} {t.name}</span>
            <span className="value">{t.signObj.sym} {t.signObj.name}</span>
          </div>
        ))}
      </section>

      <div className="main-layout">
        <aside className="sidebar">
          <section>
            <h3>Live Transits</h3>
            <div className="transit-list">
              {transits.map(t => (
                <div key={t.name} className="transit-item">
                  <div className="planet-group">
                    <span className="symbol" aria-hidden="true">{t.sym}</span>
                    <span className="planet">{t.name}</span>
                  </div>
                  <div className="sign-group">
                    <span className="degree">{t.displayLon}°</span>
                    <span className="sign-symbol" aria-hidden="true">{t.signObj.sym}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-4">
            <h3>Active Aspects</h3>
            <div className="aspect-list">
              {aspects.length === 0 ? <div className="no-aspects">No major aspects</div> : 
                aspects.slice(0, 5).map((a, idx) => (
                <div key={idx} className="aspect-item">
                  <span className="aspect-planets">{a.p1.sym} {a.sym} {a.p2.sym}</span>
                  <span className="aspect-orb">Orb: {a.orb}°</span>
                </div>
              ))}
            </div>
          </section>
        </aside>

        <main className="content">
          <section className="controls">
            <label htmlFor="sign-selector">Select Target Sign:</label>
            <div className="custom-select">
              <select 
                id="sign-selector"
                value={sign} 
                onChange={(e) => setSign(e.target.value)}
                aria-label="Select Zodiac Sign"
              >
                {ZODIAC_SIGNS.map(s => <option key={s.name} value={s.name}>{s.sym} {s.name}</option>)}
              </select>
            </div>
          </section>

          {loading ? (
            <div className="loader" role="alert">Calculating Astrological Matrices...</div>
          ) : horoscope && (
            <article className="horoscope-card premium-card">
              <div className="card-header">
                <h2>{ZODIAC_SIGNS.find(s => s.name === sign)?.sym} {sign} Telemetry</h2>
                <span className="mood-tag">{horoscope.mood}</span>
              </div>
              <p className="description">{horoscope.description}</p>
              <div className="stats-grid">
                <div className="stat">
                  <span className="label">Lucky Time</span>
                  <span className="value">{horoscope.lucky_time}</span>
                </div>
                <div className="stat">
                  <span className="label">Compatibility</span>
                  <span className="value">{horoscope.compatibility}</span>
                </div>
                <div className="stat">
                  <span className="label">Lucky Number</span>
                  <span className="value">{horoscope.lucky_number}</span>
                </div>
                <div className="stat">
                  <span className="label">Color Resonant</span>
                  <span className="value" style={{color: horoscope.color}}>{horoscope.color}</span>
                </div>
              </div>
            </article>
          )}
        </main>
      </div>

      <footer className="footer-meta">
        <span className="live-indicator">● LIVE EPOCH: {new Date().toLocaleTimeString()}</span>
        <span>Engine: VSOP87 (High Precision)</span>
      </footer>
    </div>
  )
}

export default App