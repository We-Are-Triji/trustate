# Broker Nexus Link System

## Overview
Secure agent-broker connection system using unique nexus links and time-based verification codes (TOTP).

## Setup Required

### 1. Add Supabase Service Role Key to .env
```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```
Get this from: Supabase Dashboard → Project Settings → API → service_role key

### 2. Run Database Migration
```bash
cd supabase
supabase db push
```

### 3. How It Works

**Broker Side:**
- Navigate to Dashboard → My Agents
- Generate unique nexus link (one-time setup)
- Share link + current 6-digit code with agents
- Code rotates every 30 seconds (like Google Authenticator)

**Agent Side (during verification):**
- Input broker's nexus link
- Input current 6-digit code from broker
- System validates both before creating connection request

### 4. Security Features
- TOTP codes expire every 30 seconds
- 1-minute window for clock skew tolerance
- Unique nexus codes per broker
- Row-level security on all tables

### 5. Next Steps
- [ ] Add broker ID from Cognito to API calls
- [ ] Implement nexus link reset with email verification
- [ ] Build pending agent requests list
- [ ] Update agent verification form to use nexus system
