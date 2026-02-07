import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function test() {
  const { data, error } = await supabase
    .from('projects')
    .select('count');

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success! Projects:', data);
  }
}

test();
