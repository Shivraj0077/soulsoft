import { Pool } from 'pg';

export const pool = new Pool({
  user: 'postgres',          
  host: 'localhost',         
  database: 'job_board',      
  password: 'shiv7722',  
  port: 5432,                
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else{
    release();
  }
});