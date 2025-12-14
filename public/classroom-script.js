    // API 기본 URL
const API_URL = 'http://localhost:3000/api';

// API 호출 함수들
async function fetchRooms(building) {
  try {
    if (!building || typeof building !== 'string') {
      throw new Error('유효하지 않은 건물 이름입니다.');
    }

    const response = await fetch(`${API_URL}/rooms?building=${encodeURIComponent(building)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: '알 수 없는 오류' }));
      throw new Error(errorData.error || `서버 오류: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('방 목록 조회 오류:', error);
    
    // 사용자에게 오류 메시지 표시
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.style.cssText = 'padding: 10px; background: #ffebee; color: #c62828; border-radius: 4px; margin: 10px 0;';
    errorMessage.textContent = `방 목록을 불러오는 중 오류가 발생했습니다: ${error.message}`;
    
    const container = document.querySelector('.building-info') || document.body;
    const existingError = container.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    container.insertBefore(errorMessage, container.firstChild);
    
    // 5초 후 오류 메시지 제거
    setTimeout(() => {
      if (errorMessage.parentNode) {
        errorMessage.remove();
      }
    }, 5000);
    
    return [];
  }
}

async function checkRoomAvailability(roomId, date, startTime, endTime) {
  try {
    // 여기에 예약 가능 여부 확인 API 호출 (아직 백엔드에 없으므로 나중에 추가)
    return true; // 임시로 항상 가능하다고 반환
  } catch (error) {
    console.error('예약 가능 여부 확인 오류:', error);
    return false;
  }
}

async function makeReservation(data) {
  try {
    // 입력 데이터 검증
    if (!data || typeof data !== 'object') {
      throw new Error('유효하지 않은 예약 데이터입니다.');
    }

    const requiredFields = ['room_id', 'user_name', 'date', 'start_time', 'end_time'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`필수 필드가 누락되었습니다: ${missingFields.join(', ')}`);
    }

    const response = await fetch(`${API_URL}/reserve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `서버 오류: ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error('예약 오류:', error);
    
    // 네트워크 오류 확인
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    }
    
    throw error;
  }
}

const buildingData = {
    'A': {
        name: '재능관',
        description: '재능대학교의 본관 건물',
        classrooms: [
            {
                id: 'A101',
                name: '재능관 강의실 A101',
                capacity: 40,
                facilities: '좌석 60개, 화이트보드, 빔프로젝터',
                images: ['img/classroom_a1.jpg', 'img/classroom_a2.jpg', 'img/classroom_a3.jpg']
            }
        ]
    },
    'B': {
        name: '혁신관',
        description: '최신 시설을 갖춘 혁신관',
        classrooms: [
            {
                id: 'B101',
                name: '혁신 강의실 B101',
                capacity: 50,
                facilities: '모둠테이블, 전자칠판, 스탠딩 모니터 6개, 화이트보드 2개, 좌석 35개',
                images: ['img/itRoom1.jpg', 'img/itRoom2.jpg', 'img/itRoom3.jpg']
            }
        ]
    },
    'C': {
        name: '자율관',
        description: '학생들의 자율적인 학습 공간',
        classrooms: [
            {
                id: 'C101',
                name: '스터디룸 C101',
                capacity: 8,
                facilities: '',
                images: ['classroom_c1.jpg', 'classroom_c1_2.jpg', 'classroom_c1_3.jpg']
            }
        ]
    },
    'D': {
        name: '창의관',
        description: '창의적인 프로젝트와 협업을 위한 공간',
        classrooms: [
            {
                id: 'D101',
                name: '메이커스페이스 D101',
                capacity: 25,
                facilities: '이동식 스탠드모니터, 화이트보드, 빔프로젝터, 좌석 40개',
                images: ['img/creative1.jpg', 'img/creative2.jpg', 'img/creative3.jpg']
            }
        ]
    },
    'E': {
        name: '체육관',
        description: '다양한 체육 활동과 행사가 진행되는 체육관',
        classrooms: [
            {
                id: 'E101',
                name: '다목적 체육관',
                capacity: 200,
                facilities: '',
                images: ['classroom_e1.jpg', 'classroom_e1_2.jpg', 'classroom_e1_3.jpg']
            }
        ]
    },
    'F': {
        name: '봉사관',
        description: '학생 봉사 활동 및 동아리 활동 공간',
        classrooms: [
            {
                id: 'F101',
                name: '동아리실 F101',
                capacity: 15,
                facilities: '화이트보드, 빔프로젝터, 좌석 42개',
                images: ['img/volunteer1.jpg', 'img/volunteer2.jpg', 'img/volunteer3.jpg']
            }
        ]
    },
    'G': {
        name: '평생교육관',
        description: '지역 사회를 위한 평생 교육 프로그램 운영',
        classrooms: [
            {
                id: 'G101',
                name: '평생교육실 G101',
                capacity: 30,
                facilities: '컴퓨터 내장 좌석 30개, 화이트보드, 빔프로젝터',
                images: ['img/lifeEdu1.jpg', 'img/lifeEdu2.jpg', 'img/lifeEdu3.jpg']
            }
        ]
    }
};

// 예약 가능 시간 (9:00 ~ 17:00)
const openingHour = 9;
const closingHour = 17;

// 현재 선택된 건물 및 강의실
let selectedBuilding = null;
let selectedClassroom = null;
let carouselPosition = 0;
let currentImageIndex = 0;

// 예약 불가 여부 확인 함수
function updateReservationAvailability() {
    const urlParams = new URLSearchParams(window.location.search);
    const buildingId = urlParams.get('building');
    
    // 예약 버튼 요소
    const reserveButton = document.getElementById('reserve-room');
    const verifyButton = document.getElementById('verify-student');
    const reservationForm = document.getElementById('reservation-form');
    
    // 예약 불가능한 건물인 경우
    if (buildingId === 'C' || buildingId === 'E') {
        // 예약 버튼 비활성화
        if (reserveButton) {
            reserveButton.disabled = true;
            reserveButton.textContent = '예약 불가 건물';
        }
        
        if (verifyButton) {
            verifyButton.disabled = true;
        }
        
        // 예약 폼 전체 비활성화
        if (reservationForm) {
            const inputs = reservationForm.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.disabled = true;
            });
        }
        
        // 알림 메시지 표시
        const messageElement = document.getElementById('reservation-message');
        if (!messageElement) {
            // 메시지 요소가 없으면 생성
            const message = document.createElement('div');
            message.id = 'reservation-message';
            message.textContent = '이 건물은 예약이 불가능합니다.';
            message.style.color = 'red';
            message.style.fontWeight = 'bold';
            message.style.margin = '10px 0';
            
            // 예약 폼 위에 메시지 삽입
            if (reservationForm) {
                reservationForm.parentNode.insertBefore(message, reservationForm);
            }
        } else {
            messageElement.textContent = '이 건물은 예약이 불가능합니다.';
            messageElement.style.color = 'red';
        }
    } else {
        // 예약 가능한 건물인 경우 버튼 활성화 (인증 전이면 비활성화 상태 유지)
        if (reserveButton && reserveButton.textContent === '예약 불가 건물') {
            reserveButton.disabled = true; // 인증 전이므로 비활성화 유지
            reserveButton.textContent = '강의실 예약';
        }
        
        if (verifyButton) {
            verifyButton.disabled = false;
        }
        
        // 예약 폼 활성화
        if (reservationForm) {
            const inputs = reservationForm.querySelectorAll('input, select');
            inputs.forEach(input => {
                if (input.id !== 'reserve-room') { // 예약 버튼은 인증 후 활성화
                    input.disabled = false;
                }
            });
        }
        
        // 메시지 제거
        const messageElement = document.getElementById('reservation-message');
        if (messageElement) {
            messageElement.textContent = '';
        }
    }
}

// 오른쪽 오버레이 텍스트 제거 함수
function removeOverlayTexts() {
    // 이미지 영역에서 불필요한 오버레이 텍스트를 찾아 제거
    const overlayElements = document.querySelectorAll('.classroom-info-overlay, .room-overlay-text');
    
    if (overlayElements.length > 0) {
        overlayElements.forEach(element => {
            element.style.display = 'none';
        });
    } else {
        // 클래스가 없는 경우 직접 위치로 찾기
        const mainContent = document.querySelector('.classroom-detail-container');
        if (mainContent) {
            const allElements = mainContent.querySelectorAll('*');
            allElements.forEach(el => {
                // 오른쪽에 위치한 텍스트 요소 찾기 (위치 기반)
                const rect = el.getBoundingClientRect();
                const windowWidth = window.innerWidth;
                if (rect.right > windowWidth * 0.8 && el.textContent.includes('수용인원')) {
                    el.style.display = 'none';
                }
            });
        }
    }
}

// 페이지 로드 시 초기화
window.addEventListener('DOMContentLoaded', () => {
    // URL에서 건물 파라미터 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const buildingId = urlParams.get('building');
    
    if (buildingId && buildingData[buildingId]) {
        // 해당 건물 데이터 로드
        loadBuildingData(buildingId);
    } else {
        // 기본 건물 (A) 데이터 로드
        loadBuildingData('A');
    }
    
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 현재 날짜를 기본값으로 설정
    setTodayAsDefault();
    
    // 예약 시간 표시 업데이트
    updateSelectedTimeDisplay();
    
    // 예약 가능 여부 확인
    updateReservationAvailability();
    
    // 오른쪽 오버레이 텍스트 제거
    removeOverlayTexts();
    
    // 이미지 로드 후 오버레이 텍스트 다시 체크
    window.setTimeout(removeOverlayTexts, 500);
});

// 날짜 입력 기본값 설정
function setTodayAsDefault() {
    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);
    
    const dateInput = document.getElementById('reservation-date');
    if (dateInput) {
        dateInput.value = formattedDate;
        dateInput.min = formattedDate;
    }
}

// 건물 데이터 로드
async function loadBuildingData(buildingId) {
    try {
        if (!buildingId) {
            throw new Error('건물 ID가 제공되지 않았습니다.');
        }

        // 기존 buildingData 객체는 유지하되, 실제 방 목록은 API에서 가져옴
        selectedBuilding = buildingData[buildingId];
        
        if (!selectedBuilding) {
            console.error('Building not found:', buildingId);
            // 기본 건물로 폴백
            selectedBuilding = buildingData['A'] || null;
            if (!selectedBuilding) {
                throw new Error('건물 데이터를 찾을 수 없습니다.');
            }
        }
        
        // 건물 제목 업데이트
        const buildingTitleElement = document.getElementById('building-title');
        if (buildingTitleElement) {
            buildingTitleElement.textContent = `${selectedBuilding.name} 강의실`;
        }
        
        // API에서 해당 건물의 방 목록 가져오기
        try {
            const rooms = await fetchRooms(selectedBuilding.name);
            if (rooms && rooms.length > 0) {
                // 첫 번째 강의실 선택
                // 기존 데이터와 API 데이터를 합치는 작업 필요
                const firstRoom = selectedBuilding.classrooms.find(
                    room => room.id === rooms[0].room_number
                ) || selectedBuilding.classrooms[0];
                
                if (firstRoom) {
                    loadClassroomData(firstRoom);
                } else {
                    throw new Error('강의실 데이터를 찾을 수 없습니다.');
                }
            } else {
                // API에서 데이터를 못 가져오면 기존 데이터 사용
                if (selectedBuilding.classrooms && selectedBuilding.classrooms.length > 0) {
                    loadClassroomData(selectedBuilding.classrooms[0]);
                } else {
                    throw new Error('사용 가능한 강의실이 없습니다.');
                }
            }
        } catch (error) {
            console.error('방 목록 로드 오류:', error);
            // 오류 시 기존 데이터 사용
            if (selectedBuilding.classrooms && selectedBuilding.classrooms.length > 0) {
                loadClassroomData(selectedBuilding.classrooms[0]);
            } else {
                throw new Error('강의실 정보를 불러올 수 없습니다.');
            }
        }
        
        // 강의실 캐러셀 로드
        loadClassroomCarousel();
    } catch (error) {
        console.error('건물 데이터 로드 오류:', error);
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'padding: 20px; background: #ffebee; color: #c62828; border-radius: 4px; margin: 20px;';
        errorDiv.innerHTML = `<h3>오류 발생</h3><p>${error.message}</p><p>페이지를 새로고침해주세요.</p>`;
        document.body.insertBefore(errorDiv, document.body.firstChild);
    }
}

// 강의실 데이터 로드
function loadClassroomData(classroom) {
    selectedClassroom = classroom;
    currentImageIndex = 0; // 새 강의실 로드할 때 인덱스 초기화
    
    // 강의실 정보 업데이트
    const roomFacilitiesElement = document.getElementById('room-facilities');
    if (roomFacilitiesElement) {
        roomFacilitiesElement.textContent = classroom.facilities;
    }
    
    const roomNameElement = document.getElementById('room-name');
    if (roomNameElement) {
        roomNameElement.textContent = classroom.name;
    }
    
    const roomCapacityElement = document.getElementById('room-capacity');
    if (roomCapacityElement) {
        roomCapacityElement.textContent = `수용 인원: ${classroom.capacity}명`;
    }
    
    // 이미지 업데이트
    updateMainImage();
    renderThumbnails();
    
    // 오버레이 텍스트 제거
    removeOverlayTexts();
}

function renderThumbnails() {
    const thumbnailContainer = document.getElementById('image-thumbnails');
    if (!thumbnailContainer) return;
    
    thumbnailContainer.innerHTML = '';

    selectedClassroom.images.forEach((src, index) => {
        const thumb = document.createElement('img');
        thumb.src = src;
        thumb.classList.add('thumbnail');
        if (index === currentImageIndex) thumb.classList.add('active');
        thumb.addEventListener('click', () => {
            currentImageIndex = index;
            updateMainImage();
        });
        thumbnailContainer.appendChild(thumb);
    });
}

function updateMainImage() {
    try {
        const mainImage = document.getElementById('classroom-image');
        if (!mainImage) {
            console.warn('메인 이미지 요소를 찾을 수 없습니다.');
            return;
        }

        if (!selectedClassroom || !selectedClassroom.images || !selectedClassroom.images.length) {
            console.warn('강의실 이미지가 없습니다.');
            mainImage.src = 'img/placeholder.jpg';
            return;
        }

        const imageIndex = Math.max(0, Math.min(currentImageIndex, selectedClassroom.images.length - 1));
        const imageSrc = selectedClassroom.images[imageIndex] || 'img/placeholder.jpg';
        
        // 이미지 로드 오류 처리
        mainImage.onerror = function() {
            console.warn('이미지 로드 실패:', imageSrc);
            this.src = 'img/placeholder.jpg';
        };
        
        mainImage.src = imageSrc;

        document.querySelectorAll('.thumbnail').forEach((el, i) => {
            el.classList.toggle('active', i === currentImageIndex);
        });
    } catch (error) {
        console.error('이미지 업데이트 오류:', error);
    }
}

function setupSlideButtons() {
    const prevButton = document.getElementById('prev-slide');
    const nextButton = document.getElementById('next-slide');
    
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (currentImageIndex > 0) {
                currentImageIndex--;
                updateMainImage();
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (currentImageIndex < selectedClassroom.images.length - 1) {
                currentImageIndex++;
                updateMainImage();
            }
        });
    }
}


// 이벤트 리스너 설정
function setupEventListeners() {
    // 시작 시간 변경 이벤트
    const startTimeElement = document.getElementById('start-time');
    if (startTimeElement) {
        startTimeElement.addEventListener('change', updateSelectedTimeDisplay);
    }
    
    // 이용 시간 변경 이벤트
    const durationElement = document.getElementById('duration');
    if (durationElement) {
        durationElement.addEventListener('change', updateSelectedTimeDisplay);
    }
    
    // 예약 가능 여부 확인 버튼
    const checkAvailabilityButton = document.getElementById('check-availability');
    if (checkAvailabilityButton) {
        checkAvailabilityButton.addEventListener('click', checkAvailability);
    }
    
    // 학생 인증 버튼
    const verifyStudentButton = document.getElementById('verify-student');
    if (verifyStudentButton) {
        verifyStudentButton.addEventListener('click', verifyStudent);
    }
    
    // 강의실 예약 버튼
    const reserveRoomButton = document.getElementById('reserve-room');
    if (reserveRoomButton) {
        reserveRoomButton.addEventListener('click', reserveClassroom);
    }
    
    // 슬라이드 버튼 이벤트 리스너 설정
    setupSlideButtons();
}

// 선택된 시간 표시 업데이트
function updateSelectedTimeDisplay() {
    const startTimeSelect = document.getElementById('start-time');
    const durationSelect = document.getElementById('duration');
    const selectedTimeDisplay = document.getElementById('selected-time-display');
    
    if (!startTimeSelect || !durationSelect || !selectedTimeDisplay) return;
    
    const startHour = parseInt(startTimeSelect.value);
    const duration = parseInt(durationSelect.value);
    
    const endHour = startHour + duration;
    
    // 종료 시간이 운영 시간을 초과하는지 검사
    if (endHour > closingHour) {
        alert(`운영 시간(${openingHour}:00~${closingHour}:00)을 초과합니다. 다시 선택해주세요.`);
        
        // 기본값으로 재설정
        startTimeSelect.value = openingHour;
        durationSelect.value = 1;
        
        // 재귀 호출로 표시 업데이트
        updateSelectedTimeDisplay();
        return;
    }
    
    // 선택된 시간대 표시 업데이트
    const displayText = `선택된 시간: ${startHour < 10 ? '0' + startHour : startHour}:00 - ${endHour < 10 ? '0' + endHour : endHour}:00`;
    selectedTimeDisplay.textContent = displayText;
}

// 예약 가능 여부 확인
function checkAvailability() {
    const dateInput = document.getElementById('reservation-date');
    const startTimeSelect = document.getElementById('start-time');
    const durationSelect = document.getElementById('duration');
    
    if (!dateInput || !startTimeSelect || !durationSelect) return;
    
    const selectedDate = dateInput.value;
    const startHour = parseInt(startTimeSelect.value);
    const duration = parseInt(durationSelect.value);
    
    if (!selectedDate) {
        alert('날짜를 선택해주세요.');
        return;
    }
    
    // 실제로는 서버에 예약 가능 여부를 확인하는 API 호출이 필요합니다.
    // 프로토타입에서는 임의로 가능하다고 가정합니다.
    
    // 예약 가능 여부 표시 (실제 구현에서는 서버 응답에 따라 결정)
    const isAvailable = Math.random() > 0.3; // 70% 확률로 가능
    
    if (isAvailable) {
        alert(`${selectedDate} ${startHour}:00부터 ${duration}시간 예약 가능합니다.`);
    } else {
        alert(`해당 시간에는 이미 예약이 있습니다. 다른 시간을 선택해주세요.`);
    }
}

// 학생 인증
function verifyStudent() {
    const studentId = document.getElementById('student-id');
    const studentName = document.getElementById('student-name');
    const verifyStudentButton = document.getElementById('verify-student');
    const reserveRoomButton = document.getElementById('reserve-room');
    
    if (!studentId || !studentName || !verifyStudentButton || !reserveRoomButton) return;
    
    if (!studentId.value || !studentName.value) {
        alert('학번과 이름을 모두 입력해주세요.');
        return;
    }
    
    // 실제로는 서버에 학생 정보를 확인하는 API 호출이 필요합니다.
    // 프로토타입에서는 임의로 인증 성공으로 처리합니다.
    
    alert(`${studentName.value} (${studentId.value}) 학생 인증이 완료되었습니다.`);
    
    // 인증 성공 시 예약 버튼 활성화
    reserveRoomButton.disabled = false;
    
    // 인증 완료 표시
    verifyStudentButton.textContent = '인증 완료';
    verifyStudentButton.classList.add('verified');
    verifyStudentButton.disabled = true;
}

// 강의실 예약
async function reserveClassroom() {
    try {
        const dateInput = document.getElementById('reservation-date');
        const startTimeSelect = document.getElementById('start-time');
        const durationSelect = document.getElementById('duration');
        const studentId = document.getElementById('student-id');
        const studentName = document.getElementById('student-name');
        
        // 필수 요소 확인
        if (!dateInput || !startTimeSelect || !durationSelect || !studentId || !studentName) {
            throw new Error('예약 폼 요소를 찾을 수 없습니다. 페이지를 새로고침해주세요.');
        }
        
        if (!selectedClassroom) {
            alert('강의실을 선택해주세요.');
            return;
        }
        
        // 입력값 검증
        if (!studentName.value.trim()) {
            alert('이름을 입력해주세요.');
            studentName.focus();
            return;
        }

        if (!studentId.value.trim()) {
            alert('학번을 입력해주세요.');
            studentId.focus();
            return;
        }

        if (!dateInput.value) {
            alert('날짜를 선택해주세요.');
            dateInput.focus();
            return;
        }

        // 시작 시간과 종료 시간 계산
        const startHour = parseInt(startTimeSelect.value);
        const duration = parseInt(durationSelect.value);
        
        if (isNaN(startHour) || isNaN(duration) || startHour < 9 || startHour > 17 || duration < 1 || duration > 8) {
            alert('유효하지 않은 시간입니다.');
            return;
        }

        const endHour = startHour + duration;
        
        if (endHour > 17) {
            alert('운영 시간(09:00~17:00)을 초과할 수 없습니다.');
            return;
        }
        
        // 건물 ID를 기반으로 room_id 결정
        let roomId;
        
        // URL에서 건물 파라미터 가져오기
        const urlParams = new URLSearchParams(window.location.search);
        const buildingId = urlParams.get('building');
        
        // 건물별 room_id 매핑
        switch(buildingId) {
            case 'A': roomId = 3; break; // 본관 (실제 ID: 3)
            case 'B': roomId = 2; break; // IT관 (실제 ID: 2)
            case 'D': roomId = 5; break; // 창의관 (실제 ID: 5)
            case 'F': roomId = 6; break; // 봉사관 (실제 ID: 6)
            case 'G': roomId = 4; break; // 평생교육관 (실제 ID: 4)
            default: 
                alert('유효하지 않은 건물입니다.');
                return;
        }
        
        // API 호출을 위한 데이터 준비
        const reservationData = {
            room_id: roomId,
            user_name: studentName.value.trim(),
            date: dateInput.value,
            start_time: `${startHour.toString().padStart(2, '0')}:00:00`,
            end_time: `${endHour.toString().padStart(2, '0')}:00:00`,
            university_number: studentId.value.trim()
        };
        
        console.log('예약 데이터:', reservationData); // 디버깅용 출력
        
        // 예약 버튼 비활성화 (중복 요청 방지)
        const reserveButton = document.getElementById('reserve-room');
        if (reserveButton) {
            reserveButton.disabled = true;
            reserveButton.textContent = '예약 처리 중...';
        }
        
        // API 호출
        const response = await fetch(`${API_URL}/reserve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reservationData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert(result.message || '예약이 완료되었습니다!');
            // 메인 페이지로 이동
            window.location.href = 'index.html';
        } else {
            throw new Error(result.error || '서버에서 오류가 발생했습니다.');
        }
    } catch (error) {
        console.error('예약 오류:', error);
        
        // 네트워크 오류 확인
        let errorMessage = error.message;
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage = '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.';
        }
        
        alert('예약 중 오류가 발생했습니다: ' + errorMessage);
        
        // 예약 버튼 다시 활성화
        const reserveButton = document.getElementById('reserve-room');
        if (reserveButton) {
            reserveButton.disabled = false;
            reserveButton.textContent = '강의실 예약';
        }
    }
}

// 자동 슬라이드 기능 (5초마다)
let autoSlideInterval;

function startAutoSlide() {
    // 기존 타이머 정리
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
    
    // 5초마다 다음 슬라이드로 이동
    autoSlideInterval = setInterval(() => {
        if (selectedClassroom && selectedClassroom.images && selectedClassroom.images.length > 1) {
            currentImageIndex = (currentImageIndex + 1) % selectedClassroom.images.length;
            updateMainImage();
        }
        
        // 또한 캐러셀도 자동으로 넘어가도록
        if (selectedBuilding && selectedBuilding.classrooms && selectedBuilding.classrooms.length > 1) {
            nextCarouselItem();
        }
    }, 5000);
}

// 페이지 가시성 변경 시 자동 슬라이드 제어
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // 페이지가 보이지 않으면 자동 슬라이드 중지
        clearInterval(autoSlideInterval);
    } else {
        // 페이지가 다시 보이면 자동 슬라이드 시작
        startAutoSlide();
    }
});

// 중복 DOM 이벤트 리스너 제거
let domContentLoadedFired = false;
window.addEventListener('DOMContentLoaded', (event) => {
    if (domContentLoadedFired) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const buildingKey = urlParams.get('building') || 'A';

    selectedBuilding = buildingData[buildingKey];
    selectedClassroom = selectedBuilding.classrooms[0];
    currentImageIndex = 0;

    const buildingTitleElement = document.getElementById('building-title');
    const roomFacilitiesElement = document.getElementById('room-facilities');
    const roomNameElement = document.getElementById('room-name');
    const roomCapacityElement = document.getElementById('room-capacity');
    
    if (buildingTitleElement) {
        buildingTitleElement.textContent = selectedBuilding.name + ' 강의실';
    }
    
    if (roomFacilitiesElement) {
        roomFacilitiesElement.textContent = selectedClassroom.facilities;
    }
    
    if (roomNameElement) {
        roomNameElement.textContent = selectedClassroom.name;
    }
    
    if (roomCapacityElement) {
        roomCapacityElement.textContent = `수용 인원: ${selectedClassroom.capacity}명`;
    }

    updateMainImage();
    renderThumbnails();
    setupSlideButtons();
    
    // 자동 슬라이드 시작
    startAutoSlide();
    
    // 예약 가능 여부 확인
    updateReservationAvailability();
    
    // 오른쪽 오버레이 텍스트 제거
    removeOverlayTexts();
    
    domContentLoadedFired = true;
});