import { Pool } from 'pg';
import { parse } from 'pg-connection-string';

const isProduction = process.env.NODE_ENV === 'production';

let pool;

if (isProduction) {
  // Use DATABASE_URL from environment variable for production
  const config = parse(process.env.DATABASE_URL || '');
  pool = new Pool({
    user: config.user,
    host: config.host,
    database: config.database,
    password: config.password,
    port: parseInt(config.port || '5432'),
    ssl: {
      rejectUnauthorized: false, // Disable SSL certificate validation (use appropriate validation in production)
    },
  });
} else {
  // Local development settings
  pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'job_board',
    password: process.env.DB_PASSWORD || 'shiv7722',
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: {
      rejectUnauthorized: false, // Disable SSL validation for local development (you can adjust this if needed)
    },
  });
}

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Successfully connected to database');
    console.log(process.env.DATABASE_URL);
    release();
  }
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to Neon DB:', err);
  } else {
    console.log('Connected to Neon DB:', res.rows);
  }
});

export { pool };
