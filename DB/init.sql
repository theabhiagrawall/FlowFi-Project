GRANT ALL PRIVILEGES ON DATABASE flow_fi TO flowadmin;
\connect flow_fi;

-- User Service
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
    type VARCHAR(20) CHECK (type IN ('transfer', 'deposit', 'withdrawal')),
    status VARCHAR(10) CHECK (status IN ('pending', 'success', 'failed')),
    category VARCHAR(50) DEFAULT 'Uncategorized',
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

SELECT '✅ Tables created';

-- Insert dummy users
INSERT INTO users (id, phone_number, email, name, status, email_verified, kyc_verified, password_hash)
VALUES 
(gen_random_uuid(), '9876543210', 'rahul.sharma@example.com', 'Rahul Sharma', 'active', true, true, 'hashed_pw1'),
(gen_random_uuid(), '9823456789', 'priya.kapoor@example.com', 'Priya Kapoor', 'active', true, false, 'hashed_pw2'),
(gen_random_uuid(), '9812345678', 'arjun.verma@example.com', 'Arjun Verma', 'inactive', false, false, 'hashed_pw3'),
(gen_random_uuid(), '9871122334', 'neha.mehra@example.com', 'Neha Mehra', 'active', true, true, 'hashed_pw4'),
(gen_random_uuid(), '9845567788', 'vikas.patil@example.com', 'Vikas Patil', 'blocked', false, false, 'hashed_pw5'),
(gen_random_uuid(), '9912345670', 'ananya.sen@example.com', 'Ananya Sen', 'active', true, true, 'hashed_pw6'),
(gen_random_uuid(), '9988776655', 'rohit.yadav@example.com', 'Rohit Yadav', 'inactive', true, false, 'hashed_pw7'),
(gen_random_uuid(), '9900112233', 'kavita.nair@example.com', 'Kavita Nair', 'active', true, true, 'hashed_pw8'),
(gen_random_uuid(), '9955667788', 'sachin.jain@example.com', 'Sachin Jain', 'blocked', false, false, 'hashed_pw9'),
(gen_random_uuid(), '9988991122', 'meena.kumari@example.com', 'Meena Kumari', 'active', true, true, 'hashed_pw10');

-- Sample static example:
INSERT INTO kyc_info (id, user_id, pan_number, aadhaar_number, verified)
VALUES
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'rahul.sharma@example.com'), 'ABCDE1234F', '123456789012', true),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'neha.mehra@example.com'), 'WXYZ5678K', '987654321098', true);

-- Dummy wallets
INSERT INTO wallets (id, user_id, balance)
SELECT gen_random_uuid(), id, ROUND((RANDOM() * 10000)::numeric, 2) FROM users;

-- Dummy bank accounts
INSERT INTO bank_accounts (id, user_id, bank_name, account_token, ifsc_code, verified)
SELECT gen_random_uuid(), id,
       'State Bank of India',
       md5(random()::text),
       'SBIN0001234',
       true
FROM users LIMIT 5;

-- Dummy add_money_requests
INSERT INTO add_money_requests (id, user_id, bank_account_id, amount, status)
SELECT
    gen_random_uuid(),
    ba.user_id,
    ba.id,
    ROUND((RANDOM() * 5000 + 100)::numeric, 2),
    'initiated'
FROM bank_accounts ba;


WITH all_wallets AS (
    SELECT id FROM wallets
),
     transaction_data AS (
         SELECT
             gen_random_uuid() AS id,
             (SELECT id FROM all_wallets ORDER BY RANDOM() LIMIT 1) AS from_w,
        (SELECT id FROM all_wallets ORDER BY RANDOM() LIMIT 1) AS to_w,
        ROUND((RANDOM() * 1000 + 10)::numeric, 2) AS amt,
        (ARRAY['transfer', 'deposit', 'withdrawal'])[floor(random() * 3) + 1] AS txn_type,
        (ARRAY['success', 'failed', 'pending'])[floor(random() * 3) + 1] AS txn_status,
        (ARRAY['Groceries', 'Utilities', 'Rent', 'Entertainment', 'Shopping', 'Travel', 'Food', 'Salary', 'Investment', 'Uncategorized'])[floor(random() * 10) + 1] AS txn_category,
        CASE
            WHEN (RANDOM() < 0.3) THEN NULL
            ELSE (ARRAY['Groceries', 'Utilities', 'Rent', 'Entertainment', 'Shopping', 'Travel', 'Food', 'Salary', 'Investment'])[floor(random() * 9) + 1]
END AS selected_category,
        CASE
            WHEN (RANDOM() < 0.5) THEN 'Payment for services'
            WHEN (RANDOM() < 0.7) THEN 'Online purchase'
            WHEN (RANDOM() < 0.9) THEN 'Fund transfer'
            ELSE 'Various expenses'
END AS txn_description
    FROM generate_series(1, 50)
)
INSERT INTO transactions (id, from_wallet_id, to_wallet_id, amount, type, status, category, description)
SELECT
    id,
    from_w,
    to_w,
    amt,
    txn_type,
    txn_status,
    COALESCE(selected_category, 'Uncategorized'),
    txn_description
FROM transaction_data
WHERE from_w IS NOT NULL AND to_w IS NOT NULL;

SELECT '✅ Dummy data inserted';