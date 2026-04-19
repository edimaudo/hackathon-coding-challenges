-- Create quiz_results table
2CREATE TABLE quiz_results (
3  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
4  session_id text NOT NULL,
5  quiz_type text NOT NULL CHECK (quiz_type IN ('name_that_bias', 'bias_checker')),
6  score integer NOT NULL CHECK (score >= 0 AND score <= 10),
7  created_at timestamptz DEFAULT now()
8);
9
10-- Create index for session lookups
11CREATE INDEX idx_quiz_results_session ON quiz_results(session_id);
12
13-- Enable RLS
14ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
15
16-- Allow anyone to insert their own results
17CREATE POLICY "Allow insert quiz results"
18  ON quiz_results FOR INSERT
19  TO public
20  WITH CHECK (true);
21
22-- Allow users to read their own results
23CREATE POLICY "Allow read own quiz results"
24  ON quiz_results FOR SELECT
25  TO public
26  USING (true);
27
28-- Create user_preferences table
29CREATE TABLE user_preferences (
30  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
31  session_id text UNIQUE NOT NULL,
32  theme text DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
33  font_size text DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large')),
34  language text DEFAULT 'en' CHECK (language IN ('en', 'fr', 'es')),
35  reminder_enabled boolean DEFAULT false,
36  reminder_time text DEFAULT '09:00',
37  created_at timestamptz DEFAULT now(),
38  updated_at timestamptz DEFAULT now()
39);
40
41-- Create index for session lookups
42CREATE INDEX idx_user_preferences_session ON user_preferences(session_id);
43
44-- Enable RLS
45ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
46
47-- Allow anyone to insert/update their own preferences
48CREATE POLICY "Allow insert user preferences"
49  ON user_preferences FOR INSERT
50  TO public
51  WITH CHECK (true);
52
53CREATE POLICY "Allow update user preferences"
54  ON user_preferences FOR UPDATE
55  TO public
56  USING (true);
57
58CREATE POLICY "Allow read user preferences"
59  ON user_preferences FOR SELECT
60  TO public
61  USING (true);