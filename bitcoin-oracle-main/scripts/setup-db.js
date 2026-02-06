const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { Client } = require('pg');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ENV_PATH = path.join(__dirname, '..', '.env');
const SCHEMA_PATH = path.join(__dirname, '..', 'supabase', 'schema.sql');

async function setup() {
    console.log('\x1b[36m%s\x1b[0m', '\n--- BitPredict Supabase TOTAL Automation ---\n');

    // 1. Check/Create .env
    let envContent = '';
    if (fs.existsSync(ENV_PATH)) {
        envContent = fs.readFileSync(ENV_PATH, 'utf8');
    }

    const hasUrl = envContent.includes('VITE_SUPABASE_URL=') && !envContent.includes('YOUR_SUPABASE_URL') && envContent.includes('supabase.co');
    const hasKey = envContent.includes('VITE_SUPABASE_ANON_KEY=') && !envContent.includes('YOUR_SUPABASE_ANON_KEY');

    if (!hasUrl || !hasKey) {
        console.log('Step 1: Configuring your .env file...');
        const url = await new Promise(resolve => rl.question('Enter your Supabase Project URL: ', resolve));
        const key = await new Promise(resolve => rl.question('Enter your Supabase Anon Key: ', resolve));

        const newEnv = `VITE_SUPABASE_URL=${url}\nVITE_SUPABASE_ANON_KEY=${key}\n`;
        fs.writeFileSync(ENV_PATH, newEnv);
        console.log('\x1b[32m%s\x1b[0m', '✅ .env file updated successfully!');
    } else {
        console.log('\x1b[32m%s\x1b[0m', '✅ .env file is already configured.');
    }

    // 2. Automate SQL Execution
    console.log('\x1b[33m%s\x1b[0m', '\nStep 2: Automating Database Schema Setup...');
    const connectionString = await new Promise(resolve => rl.question('\nEnter your Supabase Database Connection String (URI):\n(e.g., postgresql://postgres:[password]@db.[id].supabase.co:5432/postgres)\n> ', resolve));

    if (!connectionString) {
        console.log('Skipping SQL automation. You will need to apply schema manually.');
        rl.close();
        return;
    }

    const client = new Client({ connectionString });

    try {
        console.log('Connecting to Supabase Database...');
        await client.connect();
        console.log('Connected! Reading schema...');

        const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');

        console.log('Applying SQL Schema...');
        await client.query(schema);

        console.log('\x1b[32m%s\x1b[0m', '✅ Database schema applied successfully!');
    } catch (err) {
        console.error('\x1b[31m%s\x1b[0m', '❌ Failed to apply schema automatically.');
        console.error('Error:', err.message);
        console.log('\nFallback: You can still manually paste the code in supabase/schema.sql into the Supabase SQL Editor.');
    } finally {
        await client.end();
    }

    console.log('\x1b[36m%s\x1b[0m', '\n--- Setup Complete! ---\n');
    console.log('You can now run "npm run dev" to start predicting.');
    rl.close();
}

setup().catch(err => {
    console.error('Setup encountered an unexpected error:', err);
    rl.close();
});
