const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // 요청 크기 제한
app.use(express.static('public'));

// 요청 파싱 오류 처리
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: '잘못된 JSON 형식입니다.' });
  }
  next();
});

// 테스트 API
app.get('/api/test', (req, res) => {
  res.json({ message: '서버가 정상 작동합니다.' });
});

// 디버깅용 미들웨어 추가
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// ✅ [1] DB에서 rooms + equipment 조회
app.get('/api/rooms-with-equipment', async (req, res) => {
  try {
    const [rows] = await pool.query(`
        SELECT 
        rsv.id AS reservation_id,
        rsv.user_name,
        rsv.date,
        rsv.start_time,
        rsv.end_time,
        rm.building_name,
        rm.room_number
      FROM reservations rsv
      JOIN rooms rm ON rsv.room_id = rm.id
      ORDER BY rsv.id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('❌ DB 에러:', err);
    res.status(500).json({ error: '서버 오류', details: err.message });
  }
});

// ✅ [2] 건물별 방 목록 조회 API
app.get('/api/rooms', async (req, res) => {
  const building = req.query.building;
  console.log('요청된 건물:', building);
  
  if (!building) {
    return res.status(400).json({ error: '건물 이름이 필요합니다.' });
  }

  // 건물 이름 검증 (SQL 인젝션 방지 - 기본적으로 prepared statement가 방지하지만 추가 검증)
  if (typeof building !== 'string' || building.length > 50) {
    return res.status(400).json({ error: '유효하지 않은 건물 이름입니다.' });
  }
  
  try {
    const [rows] = await pool.query(
      'SELECT id, room_number, seat_count FROM rooms WHERE building_name = ? ORDER BY room_number',
      [building.trim()]
    );
    
    console.log('조회된 방 개수:', rows.length);
    res.json(rows);
  } catch (err) {
    console.error('❌ 방 조회 실패:', err);
    
    if (err.code === 'ECONNREFUSED' || err.code === 'PROTOCOL_CONNECTION_LOST') {
      return res.status(503).json({ error: '데이터베이스 연결 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
    }
    
    res.status(500).json({ 
      error: '조회 오류', 
      details: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
});

// 입력값 검증 헬퍼 함수
function validateDate(dateString) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return { valid: false, error: '날짜 형식이 올바르지 않습니다. (YYYY-MM-DD 형식 필요)' };
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return { valid: false, error: '유효하지 않은 날짜입니다.' };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) {
    return { valid: false, error: '과거 날짜는 예약할 수 없습니다.' };
  }
  return { valid: true };
}

function validateTime(timeString) {
  const timeRegex = /^\d{2}:\d{2}:\d{2}$/;
  if (!timeRegex.test(timeString)) {
    return { valid: false, error: '시간 형식이 올바르지 않습니다. (HH:MM:SS 형식 필요)' };
  }
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
    return { valid: false, error: '유효하지 않은 시간입니다.' };
  }
  return { valid: true };
}

function validateTimeRange(startTime, endTime) {
  const start = new Date(`2000-01-01 ${startTime}`);
  const end = new Date(`2000-01-01 ${endTime}`);
  if (start >= end) {
    return { valid: false, error: '종료 시간은 시작 시간보다 늦어야 합니다.' };
  }
  return { valid: true };
}

function validateName(name) {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: '이름은 필수입니다.' };
  }
  if (name.trim().length < 2 || name.trim().length > 50) {
    return { valid: false, error: '이름은 2자 이상 50자 이하여야 합니다.' };
  }
  return { valid: true };
}

function validateUniversityNumber(number) {
  if (number && (typeof number !== 'string' || number.trim().length > 20)) {
    return { valid: false, error: '학번은 20자 이하여야 합니다.' };
  }
  return { valid: true };
}

// ✅ [3] 예약 등록 API
app.post('/api/reserve', async (req, res) => {
  console.log('예약 요청 데이터:', req.body);
  const { room_id, user_name, date, start_time, end_time, university_number } = req.body;

  // 필수 필드 확인
  if (!room_id || !user_name || !date || !start_time || !end_time) {
    return res.status(400).json({ 
      error: '모든 필수 필드가 필요합니다.',
      required: ['room_id', 'user_name', 'date', 'start_time', 'end_time'],
      received: { room_id, user_name, date, start_time, end_time, university_number }
    });
  }

  // 입력값 검증
  const dateValidation = validateDate(date);
  if (!dateValidation.valid) {
    return res.status(400).json({ error: dateValidation.error });
  }

  const startTimeValidation = validateTime(start_time);
  if (!startTimeValidation.valid) {
    return res.status(400).json({ error: startTimeValidation.error });
  }

  const endTimeValidation = validateTime(end_time);
  if (!endTimeValidation.valid) {
    return res.status(400).json({ error: endTimeValidation.error });
  }

  const timeRangeValidation = validateTimeRange(start_time, end_time);
  if (!timeRangeValidation.valid) {
    return res.status(400).json({ error: timeRangeValidation.error });
  }

  const nameValidation = validateName(user_name);
  if (!nameValidation.valid) {
    return res.status(400).json({ error: nameValidation.error });
  }

  const numberValidation = validateUniversityNumber(university_number);
  if (!numberValidation.valid) {
    return res.status(400).json({ error: numberValidation.error });
  }

  // room_id 타입 검증
  const roomIdNum = parseInt(room_id);
  if (isNaN(roomIdNum) || roomIdNum <= 0) {
    return res.status(400).json({ error: '유효하지 않은 강의실 ID입니다.' });
  }

  try {
    // room_id 존재 여부 확인
    const [roomCheck] = await pool.query('SELECT id FROM rooms WHERE id = ?', [roomIdNum]);
    if (roomCheck.length === 0) {
      return res.status(404).json({ error: `방 ID ${roomIdNum}가 존재하지 않습니다.` });
    }

    // 시간 겹침 확인
    const [timeCheck] = await pool.query(
      `SELECT id FROM reservations 
       WHERE room_id = ? AND date = ? AND 
       ((start_time <= ? AND end_time > ?) OR
        (start_time < ? AND end_time >= ?) OR
        (start_time >= ? AND end_time <= ?))`,
      [roomIdNum, date, end_time, start_time, end_time, start_time, start_time, end_time]
    );

    if (timeCheck.length > 0) {
      return res.status(409).json({ error: '해당 시간에 이미 예약이 있습니다.' });
    }

    // 예약 추가 - university_number 포함
    const [result] = await pool.query(
      `INSERT INTO reservations (room_id, user_name, date, start_time, end_time, university_number)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [roomIdNum, user_name.trim(), date, start_time, end_time, university_number ? university_number.trim() : null]
    );
    
    console.log('예약 성공:', result);
    res.status(201).json({ 
      message: `${user_name}님(학번: ${university_number || '입력 없음'}) 예약이 완료되었습니다.`,
      reservation_id: result.insertId
    });
  } catch (err) {
    console.error('❌ 예약 실패:', err);
    
    // 데이터베이스 오류 타입별 처리
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: '중복된 예약입니다.' });
    } else if (err.code === 'ECONNREFUSED' || err.code === 'PROTOCOL_CONNECTION_LOST') {
      return res.status(503).json({ error: '데이터베이스 연결 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
    } else {
      return res.status(500).json({ error: '예약 처리 중 오류가 발생했습니다.', details: process.env.NODE_ENV === 'development' ? err.message : undefined });
    }
  }
});

// ✅ [4] 최근 예약 1건 삭제 API
app.delete('/api/reserve/latest', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id FROM reservations ORDER BY id DESC LIMIT 1'
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: '최근 예약이 없습니다.' });
    }

    const latestId = rows[0].id;
    await pool.query('DELETE FROM reservations WHERE id = ?', [latestId]);

    res.json({ message: `최근 예약(id: ${latestId})이 삭제되었습니다.` });
  } catch (err) {
    console.error('❌ 삭제 실패:', err);
    res.status(500).json({ error: '삭제 중 오류 발생', details: err.message });
  }
});

// ✅ [5] 예약 가능 여부 확인 API (추가)
app.get('/api/check-availability', async (req, res) => {
  const { room_id, date, start_time, end_time } = req.query;
  
  if (!room_id || !date || !start_time || !end_time) {
    return res.status(400).json({ error: '모든 매개변수가 필요합니다.' });
  }

  // 입력값 검증
  const roomIdNum = parseInt(room_id);
  if (isNaN(roomIdNum) || roomIdNum <= 0) {
    return res.status(400).json({ error: '유효하지 않은 강의실 ID입니다.' });
  }

  const dateValidation = validateDate(date);
  if (!dateValidation.valid) {
    return res.status(400).json({ error: dateValidation.error });
  }

  const startTimeValidation = validateTime(start_time);
  if (!startTimeValidation.valid) {
    return res.status(400).json({ error: startTimeValidation.error });
  }

  const endTimeValidation = validateTime(end_time);
  if (!endTimeValidation.valid) {
    return res.status(400).json({ error: endTimeValidation.error });
  }

  const timeRangeValidation = validateTimeRange(start_time, end_time);
  if (!timeRangeValidation.valid) {
    return res.status(400).json({ error: timeRangeValidation.error });
  }
  
  try {
    // 해당 시간에 예약이 있는지 확인
    const [rows] = await pool.query(
      `SELECT * FROM reservations 
       WHERE room_id = ? AND date = ? AND 
       ((start_time <= ? AND end_time > ?) OR
        (start_time < ? AND end_time >= ?) OR
        (start_time >= ? AND end_time <= ?))`,
      [roomIdNum, date, end_time, start_time, end_time, start_time, start_time, end_time]
    );
    
    // 겹치는 예약이 없으면 가능
    const isAvailable = rows.length === 0;
    res.json({ available: isAvailable });
  } catch (err) {
    console.error('❌ 가용성 확인 실패:', err);
    
    if (err.code === 'ECONNREFUSED' || err.code === 'PROTOCOL_CONNECTION_LOST') {
      return res.status(503).json({ error: '데이터베이스 연결 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
    }
    
    res.status(500).json({ 
      error: '서버 오류', 
      details: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
});

// ✅ [6] 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error('서버 오류:', err);
  res.status(500).json({ error: '서버 오류가 발생했습니다.', details: err.message });
});

// 404 핸들러 (알 수 없는 라우트)
app.use((req, res) => {
  res.status(404).json({ error: '요청한 리소스를 찾을 수 없습니다.', path: req.path });
});

// ✅ 서버 실행
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});

// 서버 오류 처리
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ 포트 ${PORT}가 이미 사용 중입니다. 다른 포트를 사용하거나 해당 프로세스를 종료해주세요.`);
    process.exit(1);
  } else {
    console.error('❌ 서버 오류:', err);
    process.exit(1);
  }
});

// 프로세스 종료 시 정리
process.on('SIGTERM', () => {
  console.log('SIGTERM 신호 수신. 서버를 종료합니다...');
  server.close(() => {
    console.log('서버가 종료되었습니다.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT 신호 수신. 서버를 종료합니다...');
  server.close(() => {
    console.log('서버가 종료되었습니다.');
    process.exit(0);
  });
});

// 처리되지 않은 예외 처리
process.on('uncaughtException', (err) => {
  console.error('❌ 처리되지 않은 예외:', err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ 처리되지 않은 Promise 거부:', reason);
  // 서버는 계속 실행
});