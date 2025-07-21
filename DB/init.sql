GRANT ALL PRIVILEGES ON DATABASE flow_fi TO flowadmin;
\connect flow_fi;


-- User Service
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'blocked')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kyc_info (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    pan_number VARCHAR(20) UNIQUE NOT NULL,
    aadhaar_number VARCHAR(20),
    verified BOOLEAN DEFAULT FALSE
);

-- Wallet Service
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    balance DECIMAL(12,2) DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transaction Service
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY,
    from_wallet_id UUID NOT NULL,
    to_wallet_id UUID NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    type VARCHAR(10) CHECK (type IN ('send', 'receive')),
    status VARCHAR(10) CHECK (status IN ('pending', 'success', 'failed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

-- Bank Service
CREATE TABLE IF NOT EXISTS bank_accounts (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    bank_name VARCHAR(100),
    account_token VARCHAR(255) NOT NULL,
    ifsc_code VARCHAR(20),
    verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS add_money_requests (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    bank_account_id UUID REFERENCES bank_accounts(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(10) CHECK (status IN ('initiated', 'success', 'failed')),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Auth Service (optional)
-- CREATE TABLE IF NOT EXISTS auth_sessions (...);
-- CREATE TABLE IF NOT EXISTS otp_logs (...);

SELECT '✅ Tables created';
