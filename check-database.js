// Quick database check script
// Paste this in your browser console while on the app to check if tables exist

import { supabase } from './src/config/supabaseClient.js';

async function checkDatabase() {
  console.log('Checking Supabase setup...');
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  console.log('User authenticated:', user ? 'Yes' : 'No');
  if (user) console.log('User ID:', user.id);
  
  // Try to query classes table
  const { data: classes, error: classError } = await supabase
    .from('classes')
    .select('count');
  
  if (classError) {
    console.error('❌ Classes table error:', classError.message);
    if (classError.message.includes('does not exist')) {
      console.error('🚨 TABLES NOT CREATED! You need to run supabase-schema.sql');
    }
  } else {
    console.log('✅ Classes table exists');
  }
  
  // Try to query tasks table
  const { data: tasks, error: taskError } = await supabase
    .from('tasks')
    .select('count');
  
  if (taskError) {
    console.error('❌ Tasks table error:', taskError.message);
  } else {
    console.log('✅ Tasks table exists');
  }
  
  // Try to query documents table
  const { data: docs, error: docError } = await supabase
    .from('documents')
    .select('count');
  
  if (docError) {
    console.error('❌ Documents table error:', docError.message);
  } else {
    console.log('✅ Documents table exists');
  }
}

// Run the check
checkDatabase();
