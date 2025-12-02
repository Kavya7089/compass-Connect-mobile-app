-- Dummy data for tests and library books
-- Run this in Supabase SQL Editor after setting up the database schema

-- Add dummy library books
INSERT INTO public.books (book_name, author, isbn, total_copies, available_copies, is_available)
VALUES
  ('Introduction to Computer Science', 'John Smith', '978-0123456789', 10, 8, true),
  ('Data Structures and Algorithms', 'Jane Doe', '978-0123456790', 5, 3, true),
  ('Database Systems', 'Robert Johnson', '978-0123456791', 8, 6, true),
  ('Operating Systems', 'Emily Williams', '978-0123456792', 6, 4, true),
  ('Computer Networks', 'Michael Brown', '978-0123456793', 7, 5, true),
  ('Software Engineering', 'Sarah Davis', '978-0123456794', 9, 7, true),
  ('Machine Learning Basics', 'David Miller', '978-0123456795', 4, 2, true),
  ('Web Development Guide', 'Lisa Wilson', '978-0123456796', 12, 10, true),
  ('Mobile App Development', 'James Moore', '978-0123456797', 6, 4, true),
  ('Cloud Computing Fundamentals', 'Patricia Taylor', '978-0123456798', 5, 3, true),
  ('Python Programming', 'Chris Anderson', '978-0123456799', 15, 12, true),
  ('JavaScript Essentials', 'Amanda White', '978-0123456800', 11, 9, true),
  ('React Native Guide', 'Mark Thompson', '978-0123456801', 8, 6, true),
  ('Node.js Development', 'Jennifer Lee', '978-0123456802', 7, 5, true),
  ('System Design', 'Kevin Martinez', '978-0123456803', 6, 4, true)
ON CONFLICT (isbn) DO NOTHING;

-- Note: Tests with questions should be created through the app interface
-- as they require proper question and option setup with the teacher's user ID

