-- Migration: Add Marin and Cedar voices to voice_settings table
-- Run this in your Supabase SQL Editor

-- Drop the old constraint
ALTER TABLE voice_settings DROP CONSTRAINT IF EXISTS voice_settings_voice_check;

-- Add the new constraint with Marin and Cedar
ALTER TABLE voice_settings ADD CONSTRAINT voice_settings_voice_check 
  CHECK (voice IN ('alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer', 'marin', 'cedar'));

-- Also ensure use_tts column exists
ALTER TABLE voice_settings ADD COLUMN IF NOT EXISTS use_tts BOOLEAN DEFAULT true;
