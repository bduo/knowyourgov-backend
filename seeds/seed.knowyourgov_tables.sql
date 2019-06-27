BEGIN;

TRUNCATE
    knowyourgov_users
    RESTART IDENTITY CASCADE;

INSERT INTO knowyourgov_users (user_name, password)
VALUES
    ('Bob Dylan', '$2a$12$VKNlfggqVN2zA8dIAHWo/uumfGGzNK/wib1RBMVbdLxDbDpv1qvJy'),
    ('Neil Young', '$2a$12$MHfksPZNH0X4HsfPExdRi.4MdqhLoACSdVEucBN.U3jnk2tpxtVjK'),
    ('McCartney', '$2a$12$P2eORPG1pNW8DwT/FQ4GYe6c/8m0hbf0JhKUYt/OXWVKkbXgpcGN.'),
    ('Lennon', '$2a$12$h3au6BvmO7Y5nCw/qBTl2.mVjDob05B7RpoO2LZ..DMUsmFcggbQi');

COMMIT;