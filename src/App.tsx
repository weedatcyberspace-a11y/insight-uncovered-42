import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const MiniList = React.lazy(() => import('./pages/SurveyMini/List'));
const MiniCreate = React.lazy(() => import('./pages/SurveyMini/Create'));
const MiniRespond = React.lazy(() => import('./pages/SurveyMini/Respond'));
const MiniResults = React.lazy(() => import('./pages/SurveyMini/Results'));

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff'}}>
            <div style={{textAlign: 'center', color: '#444'}}>
              <h1 style={{fontSize: 20, marginBottom: 8}}>Site removed</h1>
              <p style={{margin: 0}}>This site has been cleared. Contact the administrator for more information.</p>
              <p style={{marginTop: 12}}><Link to="/mini" style={{color:'#0b5fff'}}>Open mini survey site</Link></p>
            </div>
          </div>
        } />

        <Route path="/mini" element={<React.Suspense fallback={<div className="p-6">Loading...</div>}><MiniList /></React.Suspense>} />
        <Route path="/mini/create" element={<React.Suspense fallback={<div className="p-6">Loading...</div>}><MiniCreate /></React.Suspense>} />
        <Route path="/mini/respond/:id" element={<React.Suspense fallback={<div className="p-6">Loading...</div>}><MiniRespond /></React.Suspense>} />
        <Route path="/mini/results/:id" element={<React.Suspense fallback={<div className="p-6">Loading...</div>}><MiniResults /></React.Suspense>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
