/**
 * Script to add dummy data for tests and library books
 * Run this in Supabase SQL Editor or use Node.js with Supabase client
 * 
 * Usage in Supabase SQL Editor:
 * Copy and paste the SQL queries below
 */

// SQL script for adding dummy data
const dummyDataSQL = `
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
  ('Cloud Computing Fundamentals', 'Patricia Taylor', '978-0123456798', 5, 3, true)
ON CONFLICT (isbn) DO NOTHING;

-- Note: Tests with questions need to be created through the app interface
-- as they require proper question and option setup
-- But we can add some basic test records if needed

-- Example: Add a test (you'll need to add questions separately through the app)
-- Make sure to replace 'teacher_user_id' with an actual teacher user ID
-- INSERT INTO public.tests (title, subject, total_marks, created_by)
-- VALUES
--   ('Sample Math Test', 'Mathematics', 100, 'teacher_user_id'),
--   ('Sample Science Test', 'Science', 50, 'teacher_user_id')
-- ON CONFLICT DO NOTHING;
`;

// Node.js script version (if you want to run it programmatically)
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addDummyBooks() {
  const books = [
    { book_name: 'Introduction to Computer Science', author: 'John Smith', isbn: '978-0123456789', total_copies: 10, available_copies: 8 },
    { book_name: 'Data Structures and Algorithms', author: 'Jane Doe', isbn: '978-0123456790', total_copies: 5, available_copies: 3 },
    { book_name: 'Database Systems', author: 'Robert Johnson', isbn: '978-0123456791', total_copies: 8, available_copies: 6 },
    { book_name: 'Operating Systems', author: 'Emily Williams', isbn: '978-0123456792', total_copies: 6, available_copies: 4 },
    { book_name: 'Computer Networks', author: 'Michael Brown', isbn: '978-0123456793', total_copies: 7, available_copies: 5 },
    { book_name: 'Software Engineering', author: 'Sarah Davis', isbn: '978-0123456794', total_copies: 9, available_copies: 7 },
    { book_name: 'Machine Learning Basics', author: 'David Miller', isbn: '978-0123456795', total_copies: 4, available_copies: 2 },
    { book_name: 'Web Development Guide', author: 'Lisa Wilson', isbn: '978-0123456796', total_copies: 12, available_copies: 10 },
    { book_name: 'Mobile App Development', author: 'James Moore', isbn: '978-0123456797', total_copies: 6, available_copies: 4 },
    { book_name: 'Cloud Computing Fundamentals', author: 'Patricia Taylor', isbn: '978-0123456798', total_copies: 5, available_copies: 3 },
  ];

  for (const book of books) {
    const { data, error } = await supabase
      .from('books')
      .upsert(book, { onConflict: 'isbn' });

    if (error) {
      console.error(`Error adding book ${book.book_name}:`, error);
    } else {
      console.log(`✓ Added book: ${book.book_name}`);
    }
  }
}

async function main() {
  console.log('Adding dummy data...');
  await addDummyBooks();
  console.log('Done!');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { addDummyBooks, dummyDataSQL };

