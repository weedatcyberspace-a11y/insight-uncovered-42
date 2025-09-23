-- Migration: Create surveys, questions, options, responses, and answers
-- Assumes `pgcrypto` or `pgcrypto`/`gen_random_uuid()` is available in the Postgres instance (Supabase supports this).

CREATE TABLE IF NOT EXISTS public.surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id uuid NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
  question_type text NOT NULL CHECK (question_type IN ('multiple_choice','text','rating')),
  prompt text NOT NULL,
  position int NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.question_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  option_text text NOT NULL,
  position int NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id uuid NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
  respondent_id uuid NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id uuid NOT NULL REFERENCES public.responses(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  option_id uuid NULL REFERENCES public.question_options(id) ON DELETE SET NULL,
  text_answer text NULL,
  rating_answer int NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_surveys_owner ON public.surveys(owner);
CREATE INDEX IF NOT EXISTS idx_questions_survey ON public.questions(survey_id);
CREATE INDEX IF NOT EXISTS idx_options_question ON public.question_options(question_id);
CREATE INDEX IF NOT EXISTS idx_responses_survey ON public.responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_answers_response ON public.answers(response_id);

-- RLS and security notes (enable RLS and policies in Supabase GUI or via SQL as desired):
-- Example: allow inserts into public.responses for anonymous users and restrict survey writes to owners.
