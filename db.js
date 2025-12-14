const mysql = require('mysql2/promise');
require('dotenv').config();

// 환경 변수 검증
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME', 'DB_PORT'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ 필수 환경 변수가 누락되었습니다:', missingVars.join(', '));
  console.error('💡 .env 파일을 확인하고 필요한 환경 변수를 설정해주세요.');
  process.exit(1);
}

// 데이터베이스 연결 풀 생성
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// 데이터베이스 연결 테스트
pool.getConnection()
  .then(connection => {
    console.log('✅ 데이터베이스 연결 성공');
    connection.release();
  })
  .catch(err => {
    console.error('❌ 데이터베이스 연결 실패:', err.message);
    console.error('💡 데이터베이스 서버가 실행 중인지, 환경 변수가 올바른지 확인해주세요.');
    // 서버는 계속 실행하되, 연결 재시도는 pool이 자동으로 처리
  });

// 연결 오류 처리
pool.on('error', (err) => {
  console.error('❌ 데이터베이스 연결 오류:', err.message);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('💡 데이터베이스 연결이 끊어졌습니다. 재연결을 시도합니다...');
  } else {
    throw err;
  }
});

module.exports = pool;

