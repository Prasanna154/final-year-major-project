-- Create a table for Bitcoin predictions
CREATE TABLE IF NOT EXISTS public.predictions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    predicted_price DECIMAL NOT NULL,
    actual_price DECIMAL NOT NULL,
    confidence INTEGER NOT NULL,
    accuracy DECIMAL NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own predictions" 
ON public.predictions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own predictions" 
ON public.predictions FOR SELECT 
USING (auth.uid() = user_id);

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS predictions_user_id_idx ON public.predictions (user_id);
