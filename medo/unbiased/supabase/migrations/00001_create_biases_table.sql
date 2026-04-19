-- Create biases table
2CREATE TABLE biases (
3  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
4  name text NOT NULL,
5  overview text NOT NULL,
6  details text NOT NULL,
7  where_occurs text NOT NULL,
8  why_happens text NOT NULL,
9  why_matters text NOT NULL,
10  examples jsonb NOT NULL DEFAULT '[]'::jsonb,
11  affects_you text NOT NULL,
12  affects_business text NOT NULL,
13  how_to_avoid text NOT NULL,
14  translations jsonb DEFAULT '{}'::jsonb,
15  created_at timestamptz DEFAULT now()
16);
17
18-- Create index for faster lookups
19CREATE INDEX idx_biases_name ON biases(name);
20
21-- Enable RLS
22ALTER TABLE biases ENABLE ROW LEVEL SECURITY;
23
24-- Public read access
25CREATE POLICY "Allow public read access to biases"
26  ON biases FOR SELECT
27  TO public
28  USING (true);