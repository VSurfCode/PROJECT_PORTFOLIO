CREATE TABLE IF NOT EXISTS personal_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL,
  linkedin TEXT,
  github TEXT,
  summary TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  thumbnail_url TEXT,
  story_problem TEXT NOT NULL,
  story_decisions TEXT NOT NULL,
  story_result TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('frontend', 'backend', 'ai', 'tools', 'other')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_skills (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, skill_id)
);

CREATE TABLE IF NOT EXISTS experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT[] NOT NULL DEFAULT '{}',
  achievements TEXT[],
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  location TEXT NOT NULL,
  date TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured, display_order);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category, display_order);
CREATE INDEX IF NOT EXISTS idx_project_skills_project ON project_skills(project_id);
CREATE INDEX IF NOT EXISTS idx_project_skills_skill ON project_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_experience_dates ON experience(start_date DESC, end_date DESC NULLS LAST);

ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON personal_info FOR SELECT USING (true);
CREATE POLICY "Public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read access" ON project_skills FOR SELECT USING (true);
CREATE POLICY "Public read access" ON experience FOR SELECT USING (true);
CREATE POLICY "Public read access" ON education FOR SELECT USING (true);

CREATE POLICY "Admin users private" ON admin_users FOR ALL USING (false);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_personal_info_updated_at BEFORE UPDATE ON personal_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experience_updated_at BEFORE UPDATE ON experience
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
