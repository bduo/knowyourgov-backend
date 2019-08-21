ALTER TABLE knowyourgov_users 
ADD COLUMN street_address TEXT NOT NULL,
ADD COLUMN city TEXT NOT NULL,
ADD COLUMN state_code TEXT NOT NULL;
