const mysql = require('mysql2/promise');
require('dotenv').config();

// 배포 플랫폼별 환경변수 지원 (Railway, Render, Heroku 등)
const dbConfig = {
  host: process.env.DB_HOST || process.env.MYSQLHOST || process.env.MYSQL_HOST,
  user: process.env.DB_USER || process.env.MYSQLUSER || process.env.MYSQL_USER,
  password: process.env.DB_PASS || process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD,
  database: process.env.DB_NAME || process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE,
  port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT || process.env.MYSQL_PORT || '3306')
};

// 필수 환경 변수 검증
const missingVars = [];
if (!dbConfig.host) missingVars.push('DB_HOST 또는 MYSQLHOST');
if (!dbConfig.user) missingVars.push('DB_USER 또는 MYSQLUSER');
if (!dbConfig.password) missingVars.push('DB_PASS 또는 MYSQLPASSWORD');
if (!dbConfig.database) missingVars.push('DB_NAME 또는 MYSQLDATABASE');

if (missingVars.length > 0) {
  console.error('❌ 필수 환경 변수가 누락되었습니다:', missingVars.join(', '));
  console.error('💡 .env 파일 또는 배포 플랫폼의 환경변수 설정을 확인해주세요.');
  console.error('💡 사용 가능한 환경변수 이름:');
  console.error('   - DB_HOST, MYSQLHOST, MYSQL_HOST');
  console.error('   - DB_USER, MYSQLUSER, MYSQL_USER');
  console.error('   - DB_PASS, DB_PASSWORD, MYSQLPASSWORD, MYSQL_PASSWORD');
  console.error('   - DB_NAME, MYSQLDATABASE, MYSQL_DATABASE');
  console.error('   - DB_PORT, MYSQLPORT, MYSQL_PORT (기본값: 3306)');
  process.exit(1);
}

// 데이터베이스 연결 풀 생성
const pool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  port: dbConfig.port,
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

