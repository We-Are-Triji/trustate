create type verification_status as enum ('pending', 'processing', 'verified', 'review', 'rejected');

create table verification_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  
  id_image_s3_key text,
  id_type text,
  extracted_name text,
  extracted_id_number text,
  extracted_data jsonb,
  
  liveness_session_id text,
  liveness_confidence numeric,
  liveness_image_s3_key text,
  
  face_similarity_score numeric,
  face_comparison_status text,
  
  status verification_status default 'pending',
  reviewed_by uuid,
  reviewed_at timestamptz,
  review_notes text,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_verification_sessions_user_id on verification_sessions(user_id);
create index idx_verification_sessions_status on verification_sessions(status);

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger verification_sessions_updated_at
  before update on verification_sessions
  for each row execute function update_updated_at();
