-- This script sets up the database and creates only the essential System entities.
-- It is idempotent, meaning it can be run multiple times without causing errors.

-- =================================================================
--  DATABASE & TABLE CREATION 
-- =================================================================

GRANT ALL PRIVILEGES ON DATABASE flow_fi TO flowadmin;
\connect flow_fi;

-- User Service Tables
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'blocked')),
    email_verified BOOLEAN DEFAULT FALSE,
    kyc_verified BOOLEAN DEFAULT FALSE,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kyc_info (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    pan_number VARCHAR(20) UNIQUE NOT NULL,
    aadhaar_number VARCHAR(20),
    verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    balance DECIMAL(12,2) DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY,
    from_wallet_id UUID NOT NULL,
    to_wallet_id UUID NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('TRANSFER','DEPOSIT','WITHDRAWAL')),
    status VARCHAR(10) CHECK (status IN ('PENDING','SUCCESS','FAILED')),
    category VARCHAR(50) DEFAULT 'Uncategorized',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

-- Bank Service Tables
-- For future scope
CREATE TABLE IF NOT EXISTS bank_accounts (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    bank_name VARCHAR(100),
    account_token VARCHAR(255) NOT NULL,
    ifsc_code VARCHAR(20),
    verified BOOLEAN DEFAULT FALSE
);

-- For Future scope
CREATE TABLE IF NOT EXISTS add_money_requests (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    bank_account_id UUID REFERENCES bank_accounts(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(10) CHECK (status IN ('initiated', 'success', 'failed')),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT 'Tables created or already exist.';

-- =================================================================
--  SYSTEM ENTITY CREATION (The only data inserted)
--  This is important to make the payments
-- =================================================================

DO $$
DECLARE
    -- Define the fixed UUIDs for the system user and wallet.
    system_user_id UUID := '00000000-0000-0000-0000-000000000000';
    system_wallet_id UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
    -- This user acts as the owner of the system wallet and is not meant for direct login.
    INSERT INTO users (
        id,
        phone_number,
        email,
        name,
        status,
        email_verified,
        kyc_verified,
        role,
        password_hash
    ) VALUES (
        system_user_id,
        '0000000000',
        'system@walletapp.local',
        'System Account',
        'active',
        TRUE,
        TRUE,
        'admin',
        '__SYSTEM_ACCOUNT_NO_LOGIN__'
    )
    -- This ensures that if the user already exists, the script doesn't fail.
    ON CONFLICT (id) DO NOTHING;
    RAISE NOTICE 'System user check/creation complete.';

    -- This wallet acts as the source for deposits and the destination for withdrawals.
    INSERT INTO wallets (
        id,
        user_id,
        balance,
        updated_at
    ) VALUES (
        system_wallet_id,
        system_user_id,
        9999999999.99, -- A very large balance to represent an 'infinite' source/sink.
        CURRENT_TIMESTAMP
    )
    -- This ensures that if the wallet already exists, the script doesn't fail.
    ON CONFLICT (id) DO NOTHING;
    RAISE NOTICE 'System wallet check/creation complete.';

END $$;

SELECT 'System entities created or already exist.';
