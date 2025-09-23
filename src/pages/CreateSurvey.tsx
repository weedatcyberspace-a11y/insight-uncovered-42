import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const CreateSurvey = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["",""]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const addOption = () => setOptions((s) => [...s, ""]);
  const updateOption = (i: number, v: string) => setOptions((s) => s.map((x, idx) => idx === i ? v : x));

  const handleCreate = async () => {
    if (!title) return toast({ title: "Title required", variant: "destructive" });
    setLoading(true);
    try {
      // The generated Supabase types in this repo don't yet include the new
      // `surveys`, `questions`, and `question_options` tables. Cast the
      // client to `any` for these calls to avoid TypeScript errors until the
      // generated types are updated.
      const { data: survey, error: surveyErr } = await (supabase as any).from('surveys').insert([{ title, description, is_public: true }]).select().single();
      if (surveyErr) throw surveyErr;

      const { data: q, error: qErr } = await (supabase as any).from('questions').insert([{ survey_id: survey.id, question_type: 'multiple_choice', prompt: question, position: 0 }]).select().single();
      if (qErr) throw qErr;

      const opts = options.filter(Boolean).map((opt, idx) => ({ question_id: q.id, option_text: opt, position: idx }));
      if (opts.length) {
        const { error: optsErr } = await (supabase as any).from('question_options').insert(opts);
        if (optsErr) throw optsErr;
      }

      toast({ title: 'Survey created', description: 'Your survey has been created.' });
      navigate(`/`);
    } catch (err: any) {
      toast({ title: 'Create failed', description: err?.message || String(err), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create Survey</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Customer feedback" />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" />
            </div>
            <div>
              <Label>Question (multiple choice)</Label>
              <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="How satisfied are you?" />
            </div>
            <div>
              <Label>Options</Label>
              <div className="space-y-2">
                {options.map((opt, i) => (
                  <Input key={i} value={opt} onChange={(e) => updateOption(i, e.target.value)} placeholder={`Option ${i + 1}`} />
                ))}
              </div>
              <Button variant="ghost" onClick={addOption} className="mt-2">Add option</Button>
            </div>

            <Button onClick={handleCreate} disabled={loading}>{loading ? 'Creating...' : 'Create Survey'}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateSurvey;
