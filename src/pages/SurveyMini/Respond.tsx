import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

type Question = { id: string; text: string; type: 'mc' | 'text'; options?: string[] };

type MiniSurvey = { id: string; title: string; passcode?: string | null; createdAt: number; questions: Question[] };

function loadSurveys(): MiniSurvey[] { try { return JSON.parse(localStorage.getItem('mini_surveys') || '[]'); } catch { return []; } }
function loadResponses(): any[] { try { return JSON.parse(localStorage.getItem('mini_responses') || '[]'); } catch { return []; } }
function saveResponses(r: any[]) { localStorage.setItem('mini_responses', JSON.stringify(r)); }

const Respond: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = React.useState<MiniSurvey | null>(null);
  const [answers, setAnswers] = React.useState<{[q:string]: any}>({});
  const [entered, setEntered] = React.useState('');
  const [locked, setLocked] = React.useState(false);

  React.useEffect(()=>{
    if (!id) return;
    const s = loadSurveys().find(x=>x.id===id) || null;
    setSurvey(s);
    if (!s) return;
    if (s.passcode) setLocked(true);
  },[id]);

  if (!survey) return <div className="p-6">Survey not found.</div>;

  if (locked) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-3">{survey.title}</h2>
        <p>Enter passcode to continue</p>
        <input value={entered} onChange={(e)=>setEntered(e.target.value)} className="mt-2 p-2 border w-full" />
        <div className="mt-3 flex gap-2">
          <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={()=>{
            if (entered === (survey.passcode||'')) setLocked(false);
            else alert('Incorrect passcode');
          }}>Unlock</button>
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={()=>navigate('/mini')}>Cancel</button>
        </div>
      </div>
    );
  }

  const submit = ()=>{
    const responses = loadResponses();
    responses.push({ id: Date.now() + '-' + Math.random().toString(36).slice(2,9), surveyId: survey.id, submittedAt: Date.now(), answers });
    saveResponses(responses);
    alert('Thanks for your response');
    navigate('/mini');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{survey.title}</h2>
      <div className="space-y-4">
        {survey.questions.map((q)=> (
          <div key={q.id} className="p-3 border rounded">
            <div className="font-medium mb-2">{q.text}</div>
            {q.type === 'text' ? (
              <textarea value={answers[q.id]||''} onChange={(e)=>setAnswers({...answers, [q.id]: e.target.value})} className="w-full p-2 border" />
            ) : (
              <div className="space-y-2">
                {q.options?.map((o, idx)=> (
                  <label key={idx} className="flex items-center gap-2">
                    <input type="radio" name={q.id} checked={answers[q.id]===idx} onChange={()=>setAnswers({...answers, [q.id]: idx})} />
                    <span>{o}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="flex gap-2">
          <button onClick={submit} className="px-4 py-2 bg-green-600 text-white rounded">Submit</button>
          <button onClick={()=>navigate('/mini')} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Respond;
