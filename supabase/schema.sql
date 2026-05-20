-- Run this in your Supabase SQL editor (https://supabase.com/dashboard → SQL Editor)

-- Tracks each user's subscription plan
CREATE TABLE IF NOT EXISTS user_plans (
  user_id TEXT PRIMARY KEY,
  plan TEXT NOT NULL DEFAULT 'free',           -- 'free' | 'pro'
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tracks how many generation sessions each user has used today
CREATE TABLE IF NOT EXISTS daily_usage (
  user_id TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, date)
);

-- Stores posts saved by Pro users
CREATE TABLE IF NOT EXISTS post_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  format TEXT NOT NULL,
  topic TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS post_history_user_id_idx ON post_history (user_id, created_at DESC);
