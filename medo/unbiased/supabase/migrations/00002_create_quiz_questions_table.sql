-- Create quiz_questions table
2CREATE TABLE quiz_questions (
3  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
4  quiz_type text NOT NULL CHECK (quiz_type IN ('name_that_bias', 'bias_checker')),
5  question text NOT NULL,
6  options jsonb NOT NULL,
7  correct_answer text NOT NULL,
8  translations jsonb DEFAULT '{}'::jsonb,
9  created_at timestamptz DEFAULT now()
10);
11
12-- Create index for quiz type
13CREATE INDEX idx_quiz_questions_type ON quiz_questions(quiz_type);
14
15-- Enable RLS
16ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
17
18-- Public read access
19CREATE POLICY "Allow public read access to quiz questions"
20  ON quiz_questions FOR SELECT
21  TO public
22  USING (true);