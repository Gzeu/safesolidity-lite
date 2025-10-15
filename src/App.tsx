import { useState } from 'react';
import { analyzeSource } from './utils/vulnerability-matcher';
import { vulnerableExample } from './utils/examples';

export default function App() {
  const [code, setCode] = useState(vulnerableExample);
  const [results, setResults] = useState(() => analyzeSource(vulnerableExample));

  const runAnalysis = () => setResults(analyzeSource(code));

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: 'audit.json' });
    a.click(); URL.revokeObjectURL(url);
  };

  const badge = (sev: string) => {
    const color = sev === 'CRITICAL' ? '#ef4444'
      : sev === 'HIGH' ? '#f97316'
      : sev === 'MEDIUM' ? '#f59e0b'
      : '#10b981';
    return { background: color, color: 'white', borderRadius: 6, padding: '2px 6px', fontSize: 12 } as const;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0B1220', color: '#E5E7EB', padding: 16 }}>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>SafeSolidity Lite — MVP</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <h2 style={{ marginBottom: 8 }}>Editor</h2>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ width: '100%', height: 400, fontFamily: 'monospace', background: '#0F172A', color: '#E5E7EB', border: '1px solid #1F2937', borderRadius: 8, padding: 12 }}
          />
          <button onClick={runAnalysis} style={{ marginTop: 12, padding: '8px 12px', background: '#2563EB', color: 'white', borderRadius: 8, border: 'none' }}>
            Rulează analiza
          </button>
          <button onClick={exportJSON} style={{ marginTop: 12, marginLeft: 8, padding: '8px 12px', background: '#10B981', color: 'white', borderRadius: 8, border: 'none' }}>
            Export JSON
          </button>
        </div>
        <div>
          <h2 style={{ marginBottom: 8 }}>Rezultate</h2>
          {results.vulnerabilities.length === 0 ? (
            <div style={{ color: '#9CA3AF' }}>Nicio problemă detectată</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {results.vulnerabilities.map((v, i) => (
                <li key={i} style={{ background: '#111827', border: '1px solid '#1F2937', padding: 12, borderRadius: 8, marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <strong>{v.title}</strong>
                    <span style={badge(v.severity)}>{v.severity}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#9CA3AF' }}>
                    Linie: {v.line ?? '-'}
                  </div>
                  {v.snippet && (
                    <pre style={{ marginTop: 6, background: '#0B1220', padding: 8, borderRadius: 6, overflowX: 'auto' }}>
                      {v.snippet}
                    </pre>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
