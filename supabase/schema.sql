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
