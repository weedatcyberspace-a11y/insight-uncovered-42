import React from 'react';
import { Link } from 'react-router-dom';

type MiniSurvey = {
  id: string;
  title: string;
  passcode?: string | null;
  createdAt: number;
};

const key = 'mini_surveys';

function loadSurveys(): MiniSurvey[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as MiniSurvey[];
  } catch (e) {
    return [];
  }
}

function saveSurveys(surveys: MiniSurvey[]) {
  localStorage.setItem(key, JSON.stringify(surveys));
}

const List: React.FC = () => {
  const [surveys, setSurveys] = React.useState<MiniSurvey[]>(() => loadSurveys());

  const remove = (id: string) => {
    const next = surveys.filter((s) => s.id !== id);
    setSurveys(next);
    saveSurveys(next);
  };

  const [sharing, setSharing] = React.useState<null | { id: string; title: string; link: string; passcode?: string | null }>(null);

  const openShare = (s: MiniSurvey) => {
    const link = `${location.origin}/mini/respond/${s.id}`;
    setSharing({ id: s.id, title: s.title, link, passcode: s.passcode });
  };

  const closeShare = () => setSharing(null);

  const downloadImage = async (url: string, filename = 'qr.png') => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
    } catch (e) {
      alert('Failed to download QR image');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Mini Surveys</h2>
        <Link to="/mini/create" className="px-3 py-1 bg-blue-600 text-white rounded">Create</Link>
      </div>

      {surveys.length === 0 ? (
        <p>No surveys yet. Create one to get started.</p>
      ) : (
        <ul className="space-y-3">
          {surveys.map((s) => (
            <li key={s.id} className="p-3 border rounded flex items-center justify-between">
              <div>
                <div className="font-semibold">{s.title}</div>
                <div className="text-sm text-muted">Created {new Date(s.createdAt).toLocaleString()}</div>
              </div>
              <div className="space-x-2">
                <Link to={`/mini/respond/${s.id}`} className="px-2 py-1 bg-green-600 text-white rounded">Respond</Link>
                <Link to={`/mini/results/${s.id}`} className="px-2 py-1 bg-gray-700 text-white rounded">Results</Link>
                <button onClick={() => remove(s.id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                <button onClick={() => openShare(s)} className="px-2 py-1 bg-indigo-600 text-white rounded">Share</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {sharing && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999}} onClick={closeShare}>
          <div onClick={(e)=>e.stopPropagation()} style={{background:'#fff', padding:20, borderRadius:8, width:340, textAlign:'center'}}>
            <h3 style={{margin:0, marginBottom:8}}>{sharing.title}</h3>
            <div style={{fontSize:12, color:'#666', marginBottom:8}}>Link (share this):</div>
            <div style={{wordBreak:'break-all', background:'#f6f6f6', padding:8, borderRadius:4, marginBottom:8}}>{sharing.link}</div>
            <div style={{marginBottom:8}}>Passcode: {sharing.passcode ? sharing.passcode : '(none)'}</div>

            <div style={{marginBottom:12}}>
              <img alt="qr" src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(sharing.link)}`} style={{width:200, height:200}} />
            </div>

            <div style={{display:'flex', gap:8, justifyContent:'center'}}>
              <button onClick={async ()=>{
                try { await navigator.clipboard.writeText(sharing.link); alert('Link copied'); } catch { prompt('Copy link', sharing.link); }
              }} className="px-3 py-1 bg-blue-600 text-white rounded">Copy Link</button>

              <button onClick={()=>downloadImage(`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(sharing.link)}`, `survey-${sharing.id}-qr.png`)} className="px-3 py-1 bg-green-600 text-white rounded">Download QR</button>

              <button onClick={closeShare} className="px-3 py-1 bg-gray-200 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
