import React from 'react';
import { useNavigate } from 'react-router-dom';

// tiny id generator to avoid pulling in `uuid` dependency
const tinyId = () => Date.now().toString(36) + Math.random().toString(36).slice(2,8);

const SURVEYS_KEY = 'mini_surveys';

type Question = { id: string; text: string; type: 'mc' | 'text'; options?: string[] };

type MiniSurvey = { id: string; title: string; passcode?: string | null; createdAt: number; questions: Question[] };

function loadSurveys(): MiniSurvey[] {
  try { return JSON.parse(localStorage.getItem(SURVEYS_KEY) || '[]'); } catch { return []; }
}
function saveSurveys(s: MiniSurvey[]) { localStorage.setItem(SURVEYS_KEY, JSON.stringify(s)); }

const Create: React.FC = () => {
  const [title, setTitle] = React.useState('');
  const [passcode, setPasscode] = React.useState('');
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const navigate = useNavigate();

  const addQuestion = (type: 'mc' | 'text') => {
    setQuestions((q) => [...q, { id: tinyId(), text: '', type, options: type === 'mc' ? ['',''] : undefined }]);
  };

  const updateQuestionText = (id: string, text: string) => setQuestions((s) => s.map((q) => q.id === id ? {...q, text} : q));
  const updateOption = (qid: string, idx: number, val: string) => setQuestions((s) => s.map((q) => q.id === qid ? {...q, options: q.options!.map((o, i) => i===idx?val:o)} : q));
  const addOption = (qid: string) => setQuestions((s) => s.map((q) => q.id===qid?{...q, options: [...(q.options||[]),'']}:q));

  const handleCreate = () => {
    if (!title) return alert('Title required');
  const s: MiniSurvey = { id: tinyId(), title, passcode: passcode || undefined, createdAt: Date.now(), questions };
    const all = loadSurveys();
    all.unshift(s);
    saveSurveys(all);
    navigate(`/mini`);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Mini Survey</h2>
      <div className="mb-3">
        <label className="block text-sm font-medium">Title</label>
        <input value={title} onChange={(e)=>setTitle(e.target.value)} className="mt-1 p-2 border w-full" />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">Optional passcode (share this with respondents if set)</label>
        <input value={passcode} onChange={(e)=>setPasscode(e.target.value)} className="mt-1 p-2 border w-full" />
      </div>

      <div className="mb-3">
        <div className="flex gap-2 mb-2">
          <button onClick={()=>addQuestion('mc')} className="px-3 py-1 bg-blue-600 text-white rounded">Add MC</button>
          <button onClick={()=>addQuestion('text')} className="px-3 py-1 bg-gray-700 text-white rounded">Add Text</button>
        </div>
        {questions.map((q) => (
          <div key={q.id} className="mb-4 p-3 border rounded">
            <input value={q.text} onChange={(e)=>updateQuestionText(q.id, e.target.value)} placeholder="Question text" className="w-full p-2 border mb-2" />
            {q.type === 'mc' && (
              <div>
                {q.options?.map((o, idx) => (
                  <div key={idx} className="flex gap-2 mb-1">
                    <input value={o} onChange={(e)=>updateOption(q.id, idx, e.target.value)} className="flex-1 p-2 border" />
                  </div>
                ))}
                <button onClick={()=>addOption(q.id)} className="mt-2 px-2 py-1 bg-indigo-600 text-white rounded">Add option</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded">Create</button>
        <button onClick={()=>navigate('/mini')} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
      </div>
    </div>
  );
};

export default Create;
