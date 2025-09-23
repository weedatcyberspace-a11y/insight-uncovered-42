export type QuestionType = 'multiple_choice' | 'text' | 'rating';

export interface Survey {
  id: string;
  owner: string | null;
  title: string;
  description?: string | null;
  is_public: boolean;
  created_at: string;
}

export interface Question {
  id: string;
  survey_id: string;
  question_type: QuestionType;
  prompt: string;
  position: number;
}

export interface QuestionOption {
  id: string;
  question_id: string;
  option_text: string;
  position: number;
}

export interface ResponseRow {
  id: string;
  survey_id: string;
  respondent_id?: string | null;
  created_at: string;
}

export interface Answer {
  id: string;
  response_id: string;
  question_id: string;
  option_id?: string | null;
  text_answer?: string | null;
  rating_answer?: number | null;
}
