import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

type Question = { id: string; text: string; type: 'mc' | 'text'; options?: string[] };

type MiniSurvey = { id: string; title: string; passcode?: string | null; createdAt: number; questions: Question[] };

function loadSurveys(): MiniSurvey[] { try { return JSON.parse(localStorage.getItem('mini_surveys') || '[]'); } catch { return []; } }
function loadResponses(): any[] { try { return JSON.parse(localStorage.getItem('mini_responses') || '[]'); } catch { return []; } }

const Results: React.FC = ()=>{
  const { id } = useParams();
  const navigate = useNavigate();
  const survey = React.useMemo(()=> loadSurveys().find(s=>s.id===id) || null, [id]);
  const responses = React.useMemo(()=> loadResponses().filter(r=>r.surveyId===id), [id]);

  if (!survey) return <div className="p-6">Survey not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Results for {survey.title}</h2>
      <div className="mb-4">Responses: {responses.length}</div>

      <div className="space-y-4">
        {survey.questions.map((q)=> (
          <div key={q.id} className="p-3 border rounded">
            <div className="font-medium mb-2">{q.text}</div>
            {q.type === 'text' ? (
              <div className="space-y-2">
                {responses.map((r, idx)=> (
                  <div key={idx} className="p-2 border rounded">{r.answers[q.id] || ''}</div>
                ))}
              </div>
            ) : (
              <div>
                {q.options?.map((opt, idx)=>{
                  const count = responses.reduce((acc, r)=> acc + ((r.answers[q.id]===idx)?1:0), 0);
                  return <div key={idx} className="flex items-center justify-between"><div>{opt}</div><div>{count}</div></div>;
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button onClick={()=>navigate('/mini')} className="px-3 py-1 bg-gray-200 rounded">Back</button>
      </div>
    </div>
  );
};

export default Results;
