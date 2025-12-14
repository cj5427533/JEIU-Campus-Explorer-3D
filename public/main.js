// 주요 Three.js 변수
let scene, camera, renderer, controls;
let canvas, canvasContainer;
let rotationMode = false;
let raycaster, mouse;
let buildings = [];
let hoveredBuilding = null;
let selectedBuilding = null;

const buildingData = [
    {
        id: 'A',
        name: '재능관',
        description: '재능대학교의 본관 건물로, 주요 행정부서와 강의실이 위치하고 있습니다.',
        color: 0xFF7F50, // 주황색/오렌지색
        position: { x: 35, y: 0, z: 0 }, // 오른쪽 상단에 위치
        size: { width: 20, height: 20, depth: 35 }, 
        rotation: { x: 0, y: 0, z: 0 },
        details: true,
        image: 'img/talent1.jpg',
        link: 'classroom-info.html?building=A',
        events: [
            {
                title: '스승의 날 감사한 마음, 재능대와 함께',
                description: '고등학교 시절 선생님에게 재능대학교가 직접 방문해 여러분들의 마음을 함께 전달!',
                link: 'https://www.instagram.com/p/DIIFiaCzrxN/?img_index=1'
            }
        ]
    },
    {
        id: 'B',
        name: '혁신관',
        description: '최신 시설을 갖춘 혁신관으로, 다양한 실습실과 강의실이 있습니다.',
        color: 0xD2B48C, // 갈색/베이지색
        position: { x: -5, y: 0, z: -20 }, // 중앙 상단에 위치
        size: { width: 30, height: 12, depth: 20 }, 
        rotation: { x: 0, y: 0, z: 0 },
        details: true,
        image: 'img/itRoom1.jpg',
        link: 'classroom-info.html?building=B'
    },
    {
        id: 'C',
        name: '자율관',
        description: '학생들의 자율적인 학습 공간과 그룹 스터디룸이 마련되어 있습니다.',
        color: 0xA9A9A9, // 회색/은색
        position: { x: -5, y: 0, z: 10 }, // 중앙에 위치
        size: { width: 30, height: 10, depth: 20 }, 
        rotation: { x: 0, y: 0, z: 0 },
        details: true,
        image: 'img/autonomous.png',
        link: 'classroom-info.html?building=C',
        events: [
            {
                title: 'JEIU CAFETERIA 식권 이벤트',
                description: '키오스크에서 발매한 식권에 이름, 연락처 기입하고 응모하면 끝!',
                link: 'https://www.instagram.com/p/DIN5wN8zMFu/'
            }
        ]
    },
    {
        id: 'D',
        name: '창의관',
        description: '창의적인 프로젝트와 협업을 위한 공간이 마련된 건물입니다.',
        color: 0x4682B4, // 청록색
        position: { x: -5, y: 0, z: 45 }, // 중앙 하단에 위치
        size: { width: 35, height: 10, depth: 20 }, 
        rotation: { x: 0, y: 0, z: 0 },
        details: true,
        image: 'img/creative1.jpg',
        link: 'classroom-info.html?building=D'
    },
    {
        id: 'E',
        name: '체육관',
        description: '다양한 체육 활동과 학교 행사가 진행되는 체육관입니다.',
        color: 0x90EE90, // 연두색
        position: { x: -40, y: 0, z: 45 }, // 좌측 하단에 위치
        size: { width: 20, height: 8, depth: 20 }, 
        rotation: { x: 0, y: 0, z: 0 },
        details: true,
        image: 'img/GYM.png',
        link: 'classroom-info.html?building=E'
    },
    {
        id: 'F',
        name: '봉사관',
        description: '학생 봉사 활동 및 어린이집 활동이 이루어지는 공간입니다.',
        color: 0xCD5C5C, // 빨간색
        position: { x: -40, y: 0, z: 10 }, // 좌측 상단에 위치
        size: { width: 20, height: 12, depth: 30 }, 
        rotation: { x: 0, y: 0, z: 0 },
        details: true,
        image: 'img/volunteer1.jpg',
        link: 'classroom-info.html?building=F'
    },
    {
        id: 'G',
        name: '평생교육관',
        description: '최첨단 강의실과 평생 교육 프로그램이 운영되는 건물입니다.',
        color: 0xE17DC6, // 보라색/분홍색
        position: { x: 40, y: 0, z: 35 }, // 우측 하단에 위치
        size: { width: 25, height: 8, depth: 20 }, 
        rotation: { x: 0, y: Math.PI / 6, z: 0 }, // 약간 회전
        details: true,
        image: 'img/lifeEdu1.jpg',
        link: 'classroom-info.html?building=G'
    },
    {
        id: 'I',
        name: '주차장',
        description: '학교 주차장 공간입니다.',
        color: 0x808080, // 회색
        position: { x: 0, y: 0, z: 30 }, // 중앙 하단에 위치
        size: { width: 18, height: 0.5, depth: 12 }, 
        rotation: { x: 0, y: 0, z: 0 },
        details: false,
        image: 'img/carPark2.png',
    },
    {
        id: 'J',
        name: '운동장',
        description: '학생들의 체육 활동 및 야외 행사가 진행되는 운동장입니다.',
        color: 0x3CB371, // 초록색
        position: { x: -5, y: 0, z: -45 }, // B 건물 위쪽에 위치
        size: { width: 30, height: 0.2, depth: 20 },
        rotation: { x: 0, y: 0, z: 0 },
        details: false,
        image: 'img/playground.png',
        link: 'classroom-info.html?building=J'
    }
];

// 이벤트 데이터
const eventData = [
    {
        title: 'JEIU CAFETERIA 식권 이벤트',
        description: '키오스크에서 발매한 식권에 이름, 연락처 기입하고 응모하면 끝!',
        image: 'img/event1.png',
        link: 'https://www.instagram.com/p/DIN5wN8zMFu/'
    },
    {
        title: '2025 비대면 슬리드 특강',
        description: 'LMS통해 슬리드 특강듣고 배민쿠폰 받아가자!!',
        image: 'img/event2.jpg',
        link: 'https://www.jeiu.ac.kr/board/view.asp?sn=55364&page=1&search=&SearchString=&BoardID=00001'
    },
    {
        title: '스승의 날 감사한 마음, 재능대와 함께',
        description: '고등학교 시절 선생님에게 재능대학교가 직접 방문해 여러분들의 마음을 함께 전달!',
        image: 'img/event3.png',
        link: 'https://www.instagram.com/p/DIIFiaCzrxN/?img_index=1'
    },
    {
        title: '인천광역시 스위티 플레이그라운드 모집집',
        description: '인천시 당뇨병 예방 사업에 관심있는 대학생 모두 여기로!',
        image: 'img/event4.png',
        link: 'https://www.jeiu.ac.kr/board/view.asp?sn=55349&page=1&search=&SearchString=&BoardID=00001'
    }
];

// DOM 요소
let buildingPopup, popupTitle, popupImage, popupDescription, popupButton, popupClose, toggleModeButton;

// 부드러운 스크롤링 설정
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // 부드러운 스크롤 효과
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // 헤더 높이를 고려한 오프셋
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 바닥과 도로 추가 함수
function addGroundAndRoads() {
    // 기본 바닥 추가
    const groundGeometry = new THREE.PlaneGeometry(120, 120);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xF5F5DC, // 베이지색 바닥
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2; // 수평으로 회전
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // 흰색 그리드만 표시
    const gridHelper = new THREE.GridHelper(120, 30, 0xFFFFFF, 0xFFFFFF);
    gridHelper.position.y = 0.01; // 바닥보다 약간 위에 배치
    gridHelper.material.opacity = 0.15; // 더 연하게
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // 도로 생성 함수
    function createRoad(start, end, width, isCurved = false, curveOffset = 0) {
        let roadGeometry;
        let path;
        
        if (isCurved) {
            // 곡선 도로 생성
            path = new THREE.CurvePath();
            
            const curve = new THREE.QuadraticBezierCurve3(
                new THREE.Vector3(start.x, 0.1, start.z),
                new THREE.Vector3(curveOffset.x, 0.1, curveOffset.z),
                new THREE.Vector3(end.x, 0.1, end.z)
            );
            
            path.add(curve);
            
            // 곡선을 따라 도로 형태 생성
            const points = path.getPoints(20);
            const roadShape = new THREE.Shape();
            
            // 도로 폭 설정
            const roadWidth = width;
            const lineWidth = 0.5;
            
            for (let i = 0; i < points.length; i++) {
                const point = points[i];
                const tangent = path.getTangent(i / (points.length - 1));
                const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
                
                if (i === 0) {
                    roadShape.moveTo(
                        point.x + normal.x * roadWidth / 2,
                        point.z + normal.z * roadWidth / 2
                    );
                } else {
                    roadShape.lineTo(
                        point.x + normal.x * roadWidth / 2,
                        point.z + normal.z * roadWidth / 2
                    );
                }
            }
            
            for (let i = points.length - 1; i >= 0; i--) {
                const point = points[i];
                const tangent = path.getTangent(i / (points.length - 1));
                const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
                
                roadShape.lineTo(
                    point.x - normal.x * roadWidth / 2,
                    point.z - normal.z * roadWidth / 2
                );
            }
            
            roadShape.closePath();
            
            const roadExtrudeSettings = {
                steps: 1,
                depth: 0.2,
                bevelEnabled: false
            };
            
            roadGeometry = new THREE.ExtrudeGeometry(roadShape, roadExtrudeSettings);
        } else {
            // 직선 도로 생성
            const length = Math.sqrt(
                Math.pow(end.x - start.x, 2) + 
                Math.pow(end.z - start.z, 2)
            );
            
            roadGeometry = new THREE.PlaneGeometry(width, length);
            
            // 도로 방향 계산
            const angle = Math.atan2(end.z - start.z, end.x - start.x);
            
            const roadMesh = new THREE.Mesh(roadGeometry, roadMaterial);
            roadMesh.position.set(
                (start.x + end.x) / 2,
                0.1, // 바닥보다 약간 위에
                (start.z + end.z) / 2
            );
            
            roadMesh.rotation.x = -Math.PI / 2; // 바닥과 평행하게
            roadMesh.rotation.z = -angle; // 방향에 맞게 회전
            
            roadMesh.receiveShadow = true;
            
            return roadMesh;
        }
        
        // 곡선 도로의 경우
        const roadMesh = new THREE.Mesh(roadGeometry, roadMaterial);
        roadMesh.rotation.x = Math.PI / 2; // 바닥과 평행하게
        roadMesh.receiveShadow = true;
        
        return roadMesh;
    }
    
    // 도로 텍스처 생성
    const roadTexture = createRoadTexture();
    
    // 도로 재질
    const roadMaterial = new THREE.MeshStandardMaterial({
        map: roadTexture,
        roughness: 0.8,
        metalness: 0.2
    });
    
    // 주요 도로 추가 (배치도에 맞게 배치)
    const roads = [
        // 메인 도로 (타원형)
        createRoad(
            { x: -30, z: -40 }, // 좌상단 시작점
            { x: 30, z: -40 },  // 우상단 끝점
            10  // 도로 폭
        ),
        createRoad(
            { x: 30, z: -40 },  // 우상단 시작점
            { x: 30, z: 40 },   // 우하단 끝점
            10  // 도로 폭
        ),
        createRoad(
            { x: 30, z: 40 },   // 우하단 시작점
            { x: -30, z: 40 },  // 좌하단 끝점
            10  // 도로 폭
        ),
        createRoad(
            { x: -30, z: 40 },  // 좌하단 시작점
            { x: -30, z: -40 }, // 좌상단 끝점
            10  // 도로 폭
        ),
        
        // 중앙 연결 도로
        createRoad(
            { x: -30, z: 0 },  // 좌측 시작점
            { x: 30, z: 0 },   // 우측 끝점
            8  // 도로 폭
        ),
        
        // G 건물로 향하는 우측 도로
        createRoad(
            { x: 30, z: 20 },  // 우측 중간 시작점
            { x: 60, z: 30 },  // G 건물 방향 끝점
            8  // 도로 폭
        )
    ];
    
    // 도로 추가
    roads.forEach(road => {
        scene.add(road);
    });
}

// 도로 텍스처 생성
function createRoadTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // 아스팔트 색상
    ctx.fillStyle = '#444444';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 아스팔트 노이즈 추가
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 20 - 10;
        data[i] = Math.max(0, Math.min(255, 68 + noise));     // R
        data[i + 1] = Math.max(0, Math.min(255, 68 + noise)); // G
        data[i + 2] = Math.max(0, Math.min(255, 68 + noise)); // B
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // 도로 중앙선 (흰색 점선)
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    ctx.setLineDash([20, 20]); // 20px 선, 20px 공백
    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    
    return new THREE.CanvasTexture(canvas);
}

function init() {
    try {
        // DOM 요소 초기화
        initDOMElements();
        
        // 컨테이너 설정
        canvasContainer = document.getElementById('canvas-container');
        if (!canvasContainer) {
            throw new Error('canvas-container 요소를 찾을 수 없습니다.');
        }

        // Three.js 지원 확인
        if (typeof THREE === 'undefined') {
            throw new Error('Three.js 라이브러리를 로드할 수 없습니다. 인터넷 연결을 확인해주세요.');
        }
        
        // Scene 생성
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xE8E8E8); // 연한 회색 배경
        
        // Camera 설정
        const containerWidth = canvasContainer.clientWidth;
        const containerHeight = canvasContainer.clientHeight;
        
        if (containerWidth === 0 || containerHeight === 0) {
            throw new Error('캔버스 컨테이너의 크기가 올바르지 않습니다.');
        }
        
        const aspect = containerWidth / containerHeight;
        camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        
        // 카메라 초기 위치 설정
        setupCamera();
        
        // Renderer 설정
        try {
            renderer = new THREE.WebGLRenderer({ antialias: true });
        } catch (err) {
            console.error('WebGL 렌더러 생성 실패:', err);
            // WebGL을 지원하지 않는 경우 폴백 메시지 표시
            canvasContainer.innerHTML = '<div style="padding: 20px; text-align: center;"><h2>WebGL을 지원하지 않는 브라우저입니다.</h2><p>최신 브라우저로 업데이트해주세요.</p></div>';
            return;
        }
        
        renderer.setSize(containerWidth, containerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 부드러운 그림자
        canvasContainer.appendChild(renderer.domElement);
        canvas = renderer.domElement;
        
        // 조명 설정
        setupLights();
        
        // 바닥 추가
        addGroundOnly();
        
        // Controls 설정 (범위 제한 조정)
        if (typeof THREE.OrbitControls === 'undefined') {
            throw new Error('OrbitControls를 로드할 수 없습니다.');
        }
        
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 30;
        controls.maxDistance = 200; // 더 멀리 볼 수 있게
        controls.maxPolarAngle = Math.PI / 2 - 0.1;
        controls.enabled = false; // 초기에는 비활성화
        
        // Raycaster 설정
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();
        
        // 건물 생성
        createBuildings();
        
        // 이벤트 리스너 추가
        setupEventListeners();
        
        // 이벤트 섹션 생성
        createEventSection();
        
        // 애니메이션 시작
        animate();
    } catch (error) {
        console.error('초기화 오류:', error);
        const errorMessage = document.createElement('div');
        errorMessage.style.cssText = 'padding: 20px; text-align: center; color: red;';
        errorMessage.innerHTML = `<h2>초기화 오류</h2><p>${error.message}</p><p>페이지를 새로고침해주세요.</p>`;
        if (canvasContainer) {
            canvasContainer.appendChild(errorMessage);
        } else {
            document.body.appendChild(errorMessage);
        }
    }
}


function setupCamera() {
    
    camera.position.set(0, 130, 130);
    camera.lookAt(0, 0, 0);
}



// DOM 요소 초기화
function initDOMElements() {
    buildingPopup = document.getElementById('building-popup');
    popupTitle = document.getElementById('popup-title');
    popupImage = document.getElementById('popup-image').querySelector('img');
    popupDescription = document.getElementById('popup-description');
    popupButton = document.getElementById('popup-button');
    popupClose = document.getElementById('popup-close');
    toggleModeButton = document.getElementById('toggle-mode');
}

// 초기 카메라 위치 조정
function setupCamera() {


    camera.position.set(50, 80, 70);
    camera.lookAt(0, 0, 0);
}

function addGroundOnly() {
    // 맵 크기 설정
    const groundGeometry = new THREE.PlaneGeometry(120, 120);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xF5F5DC, // 베이지색 바닥
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2; // 수평으로 회전
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // 흰색 그리드만 표시
    const gridHelper = new THREE.GridHelper(120, 30, 0xFFFFFF, 0xFFFFFF);
    gridHelper.position.y = 0.01; // 바닥보다 약간 위에 배치
    gridHelper.material.opacity = 0.15; // 더 연하게
    gridHelper.material.transparent = true;
    scene.add(gridHelper);
}

function setupLights() {
    // 주변광
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // 주변광 더 밝게
    scene.add(ambientLight);
    
    // 메인 직사광 (태양)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 30);
    directionalLight.castShadow = true;
    
    // 그림자 품질 향상
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -75;
    directionalLight.shadow.camera.right = 75;
    directionalLight.shadow.camera.top = 75;
    directionalLight.shadow.camera.bottom = -75;
    
    scene.add(directionalLight);
    
    // 반대 방향에서 오는 채움광
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4); // 채움광 더 밝게
    fillLight.position.set(-50, 50, -30);
    scene.add(fillLight);
}

function addGround() {
    // 맵 크기 설정
    const groundGeometry = new THREE.PlaneGeometry(120, 120);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xF5F5DC, // 베이지색 바닥
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2; // 수평으로 회전
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // 흰색 그리드만 표시
    const gridHelper = new THREE.GridHelper(120, 30, 0xFFFFFF, 0xFFFFFF);
    gridHelper.position.y = 0.01; // 바닥보다 약간 위에 배치
    gridHelper.material.opacity = 0.15; // 더 연하게
    gridHelper.material.transparent = true;
    scene.add(gridHelper);
}

// 컨트롤 설정
function setupControls() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 20;
    controls.maxDistance = 100;
    controls.maxPolarAngle = Math.PI / 2 - 0.1; // 바닥 아래로 카메라가 내려가지 않도록
    controls.enabled = false; // 초기에는 비활성화
}

// 이벤트 리스너 설정
function setupEventListeners() {
    window.addEventListener('resize', onWindowResize);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('click', onMouseClick);
    toggleModeButton.addEventListener('click', toggleMode);
    popupClose.addEventListener('click', closePopup);
    popupButton.addEventListener('click', navigateToBuilding);
}

// 창 크기 변경 시 처리
function onWindowResize() {
    camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    // 컨트롤 업데이트
    if (controls.enabled) {
        controls.update();
    }
    
    // 마커 업데이트는 createFixedSizeMarker에서 sizeAttenuation: false로 설정하여 자동 처리
    
    renderer.render(scene, camera);
}

// G 건물(평생교육관) 곡선 형태 생성 함수
function createCurvedBuilding(data) {
    // 반원 형태의 건물 그룹
    const buildingGroup = new THREE.Group();
    
    // 기본 직사각형 몸체
    const baseGeometry = new THREE.BoxGeometry(
        data.size.width, 
        data.size.height, 
        data.size.depth
    );
    
    // 텍스처 생성
    const textures = createProceduralTexture(data.id, data.color);
    
    // 각 면에 다른 텍스처 적용
    const materials = [
        new THREE.MeshStandardMaterial({ map: textures.side, roughness: 0.7 }), // right
        new THREE.MeshStandardMaterial({ map: textures.side, roughness: 0.7 }), // left
        new THREE.MeshStandardMaterial({ map: textures.top, roughness: 0.8 }), // top
        new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.7 }), // bottom
        new THREE.MeshStandardMaterial({ map: textures.front, roughness: 0.7 }), // front
        new THREE.MeshStandardMaterial({ map: textures.side, roughness: 0.7 }) // back
    ];
    
    // 재질에 원래 색상 정보 저장 (호버 효과용)
    materials.forEach(material => {
        material.userData = { originalColor: data.color };
    });
    
    const baseMesh = new THREE.Mesh(baseGeometry, materials);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    
    buildingGroup.add(baseMesh);
    
    // 반원 부분 추가
    const radius = data.size.width * 0.7;
    const arcSegments = 12; // 반원의 조각 수
    const arcAngle = Math.PI; // 반원(180도)
    
    // 원통형 지오메트리 (반원 형태)
    const cylinderGeometry = new THREE.CylinderGeometry(
        radius, // 상단 반지름
        radius, // 하단 반지름
        data.size.height, // 높이
        arcSegments, // 둘레 세그먼트 수
        1, // 높이 세그먼트 수
        true, // 열린 실린더
        0, // 시작 각도
        arcAngle // 끝 각도 (반원)
    );
    
    const cylinderMaterial = new THREE.MeshStandardMaterial({
        color: data.color,
        map: textures.side,
        roughness: 0.7
    });
    cylinderMaterial.userData = { originalColor: data.color };
    
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    
    // 반원 위치 및 회전 조정
    cylinder.position.set(data.size.width * 0.3, 0, 0);
    cylinder.rotation.y = Math.PI * 1.5; // 적절한 방향으로 회전
    
    buildingGroup.add(cylinder);
    
    // 그룹 위치 설정
    buildingGroup.position.set(
        data.position.x, 
        data.position.y + data.size.height / 2, 
        data.position.z
    );
    
    // 전체 그룹 회전
    buildingGroup.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
    
    // 그룹 전체에 사용자 데이터 추가
    buildingGroup.userData = {
        id: data.id,
        name: data.name,
        description: data.description,
        image: data.image,
        link: data.link,
        originalColor: data.color,
        isBuilding: true,
        events: data.events
    };
    
    return buildingGroup;
}

// createEnhancedBuilding 함수 수정 (G 건물에 대한 특수 처리 추가)
function createEnhancedBuilding(data) {
    // G 건물(평생교육관)은 곡선 형태로 처리
    if (data.id === 'G') {
        return createCurvedBuilding(data);
    }
    
    let geometry, mesh, materials;
    
    // 주차장(I)는 직사각형으로 변경
    if (data.id === 'I') {
        geometry = new THREE.BoxGeometry(
            data.size.width, 
            data.size.height, 
            data.size.depth
        );
    
        // 주차장 텍스처 적용
        const parkingTexture = createParkingTexture();
        const material = new THREE.MeshStandardMaterial({
            color: data.color,
            map: parkingTexture,
            roughness: 0.9
        });
        
        mesh = new THREE.Mesh(geometry, material);
    }
    // 운동장(J)은 평평한 직사각형으로
    else if (data.id === 'J') {
        geometry = new THREE.BoxGeometry(
            data.size.width, 
            data.size.height, 
            data.size.depth
        );
        
        // 운동장 텍스처 생성
        const fieldTexture = createFieldTexture();
        
        const material = new THREE.MeshStandardMaterial({
            color: data.color,
            map: fieldTexture,
            roughness: 0.8
        });
        
        mesh = new THREE.Mesh(geometry, material);
    }
    // 나머지 건물
    else {
        if (data.details) {
            // 세부 디테일이 있는 건물 - 여러 부분으로 구성
            const buildingGroup = new THREE.Group();
            
            // 기본 건물 몸체
            const baseGeometry = new THREE.BoxGeometry(
                data.size.width, 
                data.size.height, 
                data.size.depth
            );
            
            // 텍스처 생성
            const textures = createProceduralTexture(data.id, data.color);
            
            // 각 면에 다른 텍스처 적용
            const materials = [
                new THREE.MeshStandardMaterial({ map: textures.side, roughness: 0.7 }), // right
                new THREE.MeshStandardMaterial({ map: textures.side, roughness: 0.7 }), // left
                new THREE.MeshStandardMaterial({ map: textures.top, roughness: 0.8 }), // top
                new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.7 }), // bottom
                new THREE.MeshStandardMaterial({ map: textures.front, roughness: 0.7 }), // front
                new THREE.MeshStandardMaterial({ map: textures.side, roughness: 0.7 }) // back
            ];
            
            // 재질에 원래 색상 정보 저장 (호버 효과용)
            materials.forEach(material => {
                material.userData = { originalColor: data.color };
            });
            
            const baseMesh = new THREE.Mesh(baseGeometry, materials);
            baseMesh.castShadow = true;
            baseMesh.receiveShadow = true;
            
            buildingGroup.add(baseMesh);
            
            // 건물별 추가 디테일
            addBuildingDetailsModel(buildingGroup, data);
            
            // 그룹 위치 설정
            buildingGroup.position.set(
                data.position.x, 
                data.position.y + data.size.height / 2, 
                data.position.z
            );
            
            buildingGroup.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
            
            // 그룹 전체에 사용자 데이터 추가 - events 속성 추가
            buildingGroup.userData = {
                id: data.id,
                name: data.name,
                description: data.description,
                image: data.image,
                link: data.link,
                originalColor: data.color,
                isBuilding: true,
                events: data.events // 이벤트 정보 추가
            };
            
            return buildingGroup;
        } else {
            // 기본 건물 (디테일 없음)
            geometry = new THREE.BoxGeometry(
                data.size.width, 
                data.size.height, 
                data.size.depth
            );
            
            // 텍스처 생성
            const textures = createProceduralTexture(data.id, data.color);
            
            // 각 면에 다른 텍스처 적용
            materials = [
                new THREE.MeshStandardMaterial({ map: textures.side, roughness: 0.7 }), // right
                new THREE.MeshStandardMaterial({ map: textures.side, roughness: 0.7 }), // left
                new THREE.MeshStandardMaterial({ map: textures.top, roughness: 0.8 }), // top
                new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.7 }), // bottom
                new THREE.MeshStandardMaterial({ map: textures.front, roughness: 0.7 }), // front
                new THREE.MeshStandardMaterial({ map: textures.side, roughness: 0.7 }) // back
            ];
            
            // 재질에 원래 색상 정보 저장 (호버 효과용)
            materials.forEach(material => {
                material.userData = { originalColor: data.color };
            });
            
            mesh = new THREE.Mesh(geometry, materials);
        }
    }
    
    // 위치 및 회전 설정
    if (mesh) {
        mesh.position.set(
            data.position.x, 
            data.position.y + data.size.height / 2, 
            data.position.z
        );
        
        mesh.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
        
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        // 건물 데이터 연결 - events 속성 추가
        mesh.userData = {
            id: data.id,
            name: data.name,
            description: data.description,
            image: data.image,
            link: data.link,
            originalColor: data.color,
            isBuilding: true,
            events: data.events // 이벤트 정보 추가
        };
    }
    
    return mesh;
}

// 개선된 텍스처 생성 함수
function createProceduralTexture(buildingId, baseColor) {
    // 캔버스 생성 (더 높은 해상도로 변경)
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // 배경색 (건물 기본 색상)
    const color = new THREE.Color(baseColor);
    ctx.fillStyle = `rgb(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 건물별 질감 추가 (벽돌, 콘크리트 등)
    addBuildingTexture(ctx, buildingId, baseColor);
    
    // 창문 패턴 생성 (건물별로 다르게)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    
    // 다양한 창문 패턴
    switch(buildingId) {
        case 'A': // 재능관
            drawModernWindows(ctx, 8, 16);
            break;
        case 'B': // 혁신관 
            drawWideWindows(ctx, 5, 10);
            break;
        case 'C': // 자율관
            drawGridWindows(ctx, 12, 20);
            break;
        case 'D': // 창의관 
            drawGridWindows(ctx, 10, 14);
            break;
        case 'E': // 체육관
            drawGridWindows(ctx, 10, 14);
            break;
        case 'F': // 봉사관
            drawGridWindows(ctx, 10, 14);
            break;
        case 'G': // 평생교육관
            drawCurvedBuildingWindows(ctx, 12, 8);
            break;
        case 'H': // 재능중학교
            drawSchoolWindows(ctx, 8, 15);
            break;
        default:
            // 기본 패턴
            drawGridWindows(ctx, 10, 15);
    }
    
    // 건물 디테일 추가 (코너, 에지, 장식 등)
    addBuildingDetails(ctx, buildingId);
    
    // 텍스처 생성
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    // 다른 면에 대한 텍스처 (각 면마다 다른 텍스처)
    const sideTexture = createSideTexture(buildingId, baseColor);
    const topTexture = createTopTexture(buildingId, baseColor);
    
    return {
        front: texture,
        side: sideTexture,
        top: topTexture
    };
}

// 각 면별 텍스처 생성 함수들
function createSideTexture(buildingId, baseColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // 기본 색상
    const color = new THREE.Color(baseColor);
    ctx.fillStyle = `rgb(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 건물 질감 추가
    addBuildingTexture(ctx, buildingId, baseColor);
    
    // 측면 창문 (앞면보다 좀 더 적게)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    switch(buildingId) {
        case 'A': // 재능관
            drawGridWindows(ctx, 6, 16);
            break;
        case 'B': // 혁신관
            drawWideWindows(ctx, 3, 10);
            break;
        case 'C': // 자율관
            drawGridWindows(ctx, 8, 20);
            break;
        default:
            drawGridWindows(ctx, 5, 10);
    }
    
    // 디테일 추가
    addBuildingDetails(ctx, buildingId);
    
    return new THREE.CanvasTexture(canvas);
}

function createTopTexture(buildingId, baseColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // 지붕 색상 (약간 더 어둡게)
    const color = new THREE.Color(baseColor).multiplyScalar(0.8);
    ctx.fillStyle = `rgb(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 지붕 질감 추가
    switch(buildingId) {
        case 'A': // 재능관 - 특수 지붕
            drawRoofPattern(ctx, 'grid', color);
            break;
        default:
            drawRoofPattern(ctx, 'flat', color);
    }
    
    return new THREE.CanvasTexture(canvas);
}

// 건물 벽면 텍스처 추가 (벽돌, 콘크리트 등)
function addBuildingTexture(ctx, buildingId, baseColor) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    switch(buildingId) {
        case 'A': // 재능관 - 벽돌 패턴
            drawBrickPattern(ctx, 100, 40, baseColor);
            break;
        case 'B': // 혁신관 - 현대적 패널
            drawModernPanels(ctx, 8, 20, baseColor);
            break;
        case 'C': // 자율관 - 콘크리트 질감
            drawConcreteTexture(ctx, baseColor);
            break;
        case 'G': // 평생교육관 - 둥근 형태
            drawCurvedTexture(ctx, baseColor);
            break;
        default:
            // 미세한 노이즈 추가 (모든 건물에 적용)
            addTextureNoise(ctx, 0.05, baseColor);
    }
}

// 건물 디테일 추가 (코너, 에지, 기둥 등)
function addBuildingDetails(ctx, buildingId) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // 건물 에지 (테두리)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = width * 0.01;
    ctx.strokeRect(0, 0, width, height);
    
    // 건물별 특수 디테일
    switch(buildingId) {
        case 'A': // 재능관 - 기둥 장식
            drawPillars(ctx, 8);
            break;
        case 'B': // 혁신관 - 장식 라인
            drawDecorativeLines(ctx, 5);
            break;
        case 'G': // 평생교육관 - 원형 요소
            drawCircularElements(ctx, 6);
            break;
    }
}

// 창문 패턴 함수들
function drawModernWindows(ctx, cols, rows) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    const windowWidth = width / cols * 0.8;
    const windowHeight = height / rows * 0.7;
    const spacingX = width / cols;
    const spacingY = height / rows;
    
    // 창문 격자 그리드
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            // 주 창문
            ctx.fillRect(
                x * spacingX + (spacingX - windowWidth) / 2,
                y * spacingY + (spacingY - windowHeight) / 2,
                windowWidth,
                windowHeight
            );
            
            // 창문 내부 디테일
            ctx.fillStyle = 'rgba(200, 230, 255, 0.7)';
            ctx.fillRect(
                x * spacingX + (spacingX - windowWidth) / 2 + windowWidth * 0.1,
                y * spacingY + (spacingY - windowHeight) / 2 + windowHeight * 0.1,
                windowWidth * 0.8,
                windowHeight * 0.8
            );
            
            // 원래 색상으로 복구
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        }
    }
}

function drawWideWindows(ctx, cols, rows) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    const windowWidth = width / cols * 0.9;
    const windowHeight = height / rows * 0.6;
    const spacingX = width / cols;
    const spacingY = height / rows;
    
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            // 메인 창문 프레임
            ctx.fillRect(
                x * spacingX + (spacingX - windowWidth) / 2,
                y * spacingY + (spacingY - windowHeight) / 2,
                windowWidth,
                windowHeight
            );
            
            // 창문 내부 분할선
            ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
            ctx.fillRect(
                x * spacingX + (spacingX - windowWidth) / 2 + windowWidth / 2,
                y * spacingY + (spacingY - windowHeight) / 2,
                2,
                windowHeight
            );
            
            // 원래 색상으로 복구
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        }
    }
}

function drawGridWindows(ctx, cols, rows) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    const windowWidth = width / cols * 0.7;
    const windowHeight = height / rows * 0.7;
    const spacingX = width / cols;
    const spacingY = height / rows;
    
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            ctx.fillRect(
                x * spacingX + (spacingX - windowWidth) / 2,
                y * spacingY + (spacingY - windowHeight) / 2,
                windowWidth,
                windowHeight
            );
        }
    }
}

function drawCreativeWindows(ctx, count) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // 다양한 크기와 형태의 창문
    for (let i = 0; i < count; i++) {
        const windowType = Math.floor(Math.random() * 3);
        const windowWidth = width * (0.1 + Math.random() * 0.2);
        const windowHeight = height * (0.05 + Math.random() * 0.15);
        const x = Math.random() * (width - windowWidth);
        const y = Math.random() * (height - windowHeight);
        
        if (windowType === 0) {
            // 직사각형 창문
            ctx.fillRect(x, y, windowWidth, windowHeight);
        } else if (windowType === 1) {
            // 원형 창문
            const radius = Math.min(windowWidth, windowHeight) / 2;
            ctx.beginPath();
            ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // 이중 창문
            ctx.fillRect(x, y, windowWidth, windowHeight);
            ctx.fillStyle = 'rgba(200, 230, 255, 0.7)';
            ctx.fillRect(x + windowWidth * 0.1, y + windowHeight * 0.1, 
                         windowWidth * 0.8, windowHeight * 0.8);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        }
    }
}

function drawLargeWindows(ctx, cols, rows) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    const windowWidth = width / cols * 0.85;
    const windowHeight = height / rows * 0.85;
    const spacingX = width / cols;
    const spacingY = height / rows;
    
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            // 큰 창문
            ctx.fillRect(
                x * spacingX + (spacingX - windowWidth) / 2,
                y * spacingY + (spacingY - windowHeight) / 2,
                windowWidth,
                windowHeight
            );
            
            // 창문 격자 패턴
            ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
            const gridSize = 4;
            const gridWidth = windowWidth / gridSize;
            const gridHeight = windowHeight / gridSize;
            
            for (let i = 1; i < gridSize; i++) {
                // 수직선
                ctx.fillRect(
                    x * spacingX + (spacingX - windowWidth) / 2 + i * gridWidth,
                    y * spacingY + (spacingY - windowHeight) / 2,
                    2,
                    windowHeight
                );
                
                // 수평선
                ctx.fillRect(
                    x * spacingX + (spacingX - windowWidth) / 2,
                    y * spacingY + (spacingY - windowHeight) / 2 + i * gridHeight,
                    windowWidth,
                    2
                );
            }
            
            // 원래 색상으로 복구
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        }
    }
}

function drawCurvedBuildingWindows(ctx, cols, rows) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // 곡선형 건물에 맞는 창문 (아치형)
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const windowWidth = width / cols * 0.7;
            const windowHeight = height / rows * 0.7;
            const centerX = x * (width / cols) + (width / cols) / 2;
            const centerY = y * (height / rows) + (height / rows) / 2;
            
            // 아치형 창문 상단
            ctx.beginPath();
            ctx.arc(centerX, centerY, windowWidth / 2, 0, Math.PI);
            ctx.fill();
            
            // 창문 하단 직사각형
            ctx.fillRect(
                centerX - windowWidth / 2,
                centerY,
                windowWidth,
                windowHeight / 2
            );
        }
    }
}

function drawSchoolWindows(ctx, cols, rows) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // 학교 스타일 창문 (격자 + 아치)
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const windowWidth = width / cols * 0.75;
            const windowHeight = height / rows * 0.8;
            const posX = x * (width / cols) + ((width / cols) - windowWidth) / 2;
            const posY = y * (height / rows) + ((height / rows) - windowHeight) / 2;
            
            // 기본 창문 형태
            ctx.fillRect(posX, posY, windowWidth, windowHeight);
            
            // 창문 격자 추가
            ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
            ctx.fillRect(posX + windowWidth / 2, posY, 2, windowHeight);
            ctx.fillRect(posX, posY + windowHeight / 2, windowWidth, 2);
            
            // 창문 아치 장식
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.beginPath();
            ctx.arc(posX + windowWidth / 2, posY - windowHeight * 0.05, windowWidth / 3, Math.PI, Math.PI * 2);
            ctx.fill();
        }
    }
}

// 벽면 질감 패턴 함수들
function drawBrickPattern(ctx, brickRows, brickCols, baseColor) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    const color = new THREE.Color(baseColor);
    const darker = color.clone().multiplyScalar(0.85);
    const darkerColor = `rgb(${Math.floor(darker.r * 255)}, ${Math.floor(darker.g * 255)}, ${Math.floor(darker.b * 255)})`;
    
    const brickWidth = width / brickCols;
    const brickHeight = height / brickRows;
    
    ctx.fillStyle = darkerColor;
    
    // 벽돌 패턴
    for (let y = 0; y < brickRows; y++) {
        for (let x = 0; x < brickCols; x++) {
            // 벽돌 간격 조정 (홀수/짝수 행마다 다르게)
            const offsetX = (y % 2 === 0) ? 0 : brickWidth / 2;
            
            ctx.fillRect(
                offsetX + x * brickWidth + 1,
                y * brickHeight + 1,
                brickWidth - 2,
                brickHeight - 2
            );
        }
    }
}

function drawModernPanels(ctx, panelRows, panelCols, baseColor) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    const color = new THREE.Color(baseColor);
    const lighter = color.clone().multiplyScalar(1.1);
    const lighterColor = `rgb(${Math.floor(lighter.r * 255)}, ${Math.floor(lighter.g * 255)}, ${Math.floor(lighter.b * 255)})`;
    
    ctx.fillStyle = lighterColor;
    
    const panelWidth = width / panelCols;
    const panelHeight = height / panelRows;
    
    // 현대적인 패널 디자인
    for (let y = 0; y < panelRows; y++) {
        for (let x = 0; x < panelCols; x++) {
            ctx.fillRect(
                x * panelWidth + 5,
                y * panelHeight + 5,
                panelWidth - 10,
                panelHeight - 10
            );
        }
    }
}

function drawConcreteTexture(ctx, baseColor) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // 콘크리트 질감을 위한 노이즈 추가
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    const color = new THREE.Color(baseColor);
    const baseR = Math.floor(color.r * 255);
    const baseG = Math.floor(color.g * 255);
    const baseB = Math.floor(color.b * 255);
    
    for (let i = 0; i < data.length; i += 4) {
        // 각 픽셀마다 약간의 노이즈 추가
        const noise = Math.random() * 20 - 10;
        data[i] = Math.max(0, Math.min(255, baseR + noise));     // R
        data[i + 1] = Math.max(0, Math.min(255, baseG + noise)); // G
        data[i + 2] = Math.max(0, Math.min(255, baseB + noise)); // B
        // Alpha는 그대로 유지
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // 콘크리트 균열 추가
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 10; i++) {
        const startX = Math.random() * width;
        const startY = Math.random() * height;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        
        // 균열 곡선 만들기
        let currentX = startX;
        let currentY = startY;
        
        for (let j = 0; j < 5; j++) {
            const nextX = currentX + (Math.random() * 50 - 25);
            const nextY = currentY + (Math.random() * 50 - 25);
            
            ctx.lineTo(nextX, nextY);
            
            currentX = nextX;
            currentY = nextY;
        }
        
        ctx.stroke();
    }
}

function drawCurvedTexture(ctx, baseColor) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    const color = new THREE.Color(baseColor);
    const lighter = color.clone().multiplyScalar(1.1);
    const darker = color.clone().multiplyScalar(0.9);
    
    // 그라데이션 효과
    const gradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, width / 2
    );
    
    gradient.addColorStop(0, `rgb(${Math.floor(lighter.r * 255)}, ${Math.floor(lighter.g * 255)}, ${Math.floor(lighter.b * 255)})`);
    gradient.addColorStop(1, `rgb(${Math.floor(darker.r * 255)}, ${Math.floor(darker.g * 255)}, ${Math.floor(darker.b * 255)})`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // 원형 패턴 추가
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 5; i++) {
        const radius = (i + 1) * width / 10;
        
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
        ctx.stroke();
    }
}

function addTextureNoise(ctx, intensity, baseColor) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    const color = new THREE.Color(baseColor);
    const baseR = Math.floor(color.r * 255);
    const baseG = Math.floor(color.g * 255);
    const baseB = Math.floor(color.b * 255);
    
    for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * intensity * 255;
        data[i] = Math.max(0, Math.min(255, baseR + noise - (intensity * 255 / 2)));
        data[i + 1] = Math.max(0, Math.min(255, baseG + noise - (intensity * 255 / 2)));
        data[i + 2] = Math.max(0, Math.min(255, baseB + noise - (intensity * 255 / 2)));
    }
    
    ctx.putImageData(imageData, 0, 0);
}

// 건물 디테일 함수들
function drawPillars(ctx, count) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    
    const pillarWidth = width / (count * 2);
    
    for (let i = 0; i < count; i++) {
        const x = (width / count) * i + (width / count - pillarWidth) / 2;
        
        // 기둥
        ctx.fillRect(x, 0, pillarWidth, height);
        
        // 기둥 상단/하단 장식
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(x - pillarWidth * 0.2, 0, pillarWidth * 1.4, height * 0.05);
        ctx.fillRect(x - pillarWidth * 0.2, height * 0.95, pillarWidth * 1.4, height * 0.05);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    }
}

function drawDecorativeLines(ctx, count) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = width * 0.005;
    
    const lineSpacing = height / (count + 1);
    
    for (let i = 1; i <= count; i++) {
        const y = lineSpacing * i;
        
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
}

function drawCircularElements(ctx, count) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    
    for (let i = 0; i < count; i++) {
        const radius = width * 0.08;
        const x = width * (0.2 + Math.random() * 0.6);
        const y = height * (0.2 + Math.random() * 0.6);
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // 원 테두리
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

function drawRoofPattern(ctx, type, color) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    switch(type) {
        case 'grid':
            // 격자형 지붕
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.lineWidth = 2;
            
            for (let i = 0; i < 10; i++) {
                // 가로선
                ctx.beginPath();
                ctx.moveTo(0, i * height / 10);
                ctx.lineTo(width, i * height / 10);
                ctx.stroke();
                
                // 세로선
                ctx.beginPath();
                ctx.moveTo(i * width / 10, 0);
                ctx.lineTo(i * width / 10, height);
                ctx.stroke();
            }
            break;
            
        case 'dome':
            // 돔형 지붕 (그라데이션)
            const gradient = ctx.createRadialGradient(
                width / 2, height / 2, 0,
                width / 2, height / 2, width / 2
            );
            
            const lighterColor = new THREE.Color(color.r, color.g, color.b).multiplyScalar(1.2);
            gradient.addColorStop(0, `rgb(${Math.floor(lighterColor.r * 255)}, ${Math.floor(lighterColor.g * 255)}, ${Math.floor(lighterColor.b * 255)})`);
            gradient.addColorStop(1, `rgb(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)})`);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            
            // 원형 패턴
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.lineWidth = 2;
            
            for (let i = 1; i <= 5; i++) {
                ctx.beginPath();
                ctx.arc(width / 2, height / 2, i * width / 12, 0, Math.PI * 2);
                ctx.stroke();
            }
            break;
            
        case 'flat':
        default:
            addTextureNoise(ctx, 0.03, color); // 노이즈 약하게 설정
            
            break;
    }
}

function createEnhancedBuilding(data) {
    let geometry, mesh, materials;
    
    // 주차장(I)는 직사각형으로 변경
    if (data.id === 'I') {
        geometry = new THREE.BoxGeometry(
            data.size.width, 
            data.size.height, 
            data.size.depth
        );
    
        // 주차장 텍스처 적용
        const parkingTexture = createParkingTexture();
        const material = new THREE.MeshStandardMaterial({
            color: data.color,
            map: parkingTexture,
            roughness: 0.9
        });
        
        mesh = new THREE.Mesh(geometry, material);
    }
    // 운동장(J)은 평평한 직사각형으로
    else if (data.id === 'J') {
        geometry = new THREE.BoxGeometry(
            data.size.width, 
            data.size.height, 
            data.size.depth
        );
        
        // 운동장 텍스처 생성
        const fieldTexture = createFieldTexture();
        
        const material = new THREE.MeshStandardMaterial({
            color: data.color,
            map: fieldTexture,
            roughness: 0.8
        });
        
        mesh = new THREE.Mesh(geometry, material);
    }
    // 나머지 건물
    else {
        if (data.details) {
            // 세부 디테일이 있는 건물 - 여러 부분으로 구성
            const buildingGroup = new THREE.Group();
            
            // 기본 건물 몸체
            const baseGeometry = new THREE.BoxGeometry(
                data.size.width, 
                data.size.height, 
                data.size.depth
            );
            
            // 텍스처 생성
            const textures = createProceduralTexture(data.id, data.color);
            
            // 각 면에 다른 텍스처 적용
            const materials = [
                new THREE.MeshStandardMaterial({ map: textures.side, roughness: 0.7 }), // right
                new THREE.MeshStandardMaterial({ map: textures.side, roughness: 0.7 }), // left
                new THREE.MeshStandardMaterial({ map: textures.top, roughness: 0.8 }), // top
                new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.7 }), // bottom
                new THREE.MeshStandardMaterial({ map: textures.front, roughness: 0.7 }), // front
                new THREE.MeshStandardMaterial({ map: textures.side, roughness: 0.7 }) // back
            ];
            
            // 재질에 원래 색상 정보 저장 (호버 효과용)
            materials.forEach(material => {
                material.userData = { originalColor: data.color };
            });
            
            const baseMesh = new THREE.Mesh(baseGeometry, materials);
            baseMesh.castShadow = true;
            baseMesh.receiveShadow = true;
            
            buildingGroup.add(baseMesh);
            
            // 건물별 추가 디테일
            addBuildingDetailsModel(buildingGroup, data);
            
            // 그룹 위치 설정
            buildingGroup.position.set(
                data.position.x, 
                data.position.y + data.size.height / 2, 
                data.position.z
            );
            
            buildingGroup.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
            
            // 그룹 전체에 사용자 데이터 추가 - events 속성 추가
            buildingGroup.userData = {
                id: data.id,
                name: data.name,
                description: data.description,
                image: data.image,
                link: data.link,
                originalColor: data.color,
                isBuilding: true,
                events: data.events // 이벤트 정보 추가
            };
            
            return buildingGroup;
        } else {
            // 기본 건물 (디테일 없음)
            geometry = new THREE.BoxGeometry(
                data.size.width, 
                data.size.height, 
                data.size.depth
            );
            
            // 텍스처 생성
            const textures = createProceduralTexture(data.id, data.color);
            
            // 각 면에 다른 텍스처 적용
            materials = [
                new THREE.MeshStandardMaterial({ map: textures.side, roughness: 0.7 }), // right
                new THREE.MeshStandardMaterial({ map: textures.side, roughness: 0.7 }), // left
                new THREE.MeshStandardMaterial({ map: textures.top, roughness: 0.8 }), // top
                new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.7 }), // bottom
                new THREE.MeshStandardMaterial({ map: textures.front, roughness: 0.7 }), // front
                new THREE.MeshStandardMaterial({ map: textures.side, roughness: 0.7 }) // back
            ];
            
            // 재질에 원래 색상 정보 저장 (호버 효과용)
            materials.forEach(material => {
                material.userData = { originalColor: data.color };
            });
            
            mesh = new THREE.Mesh(geometry, materials);
        }
    }
    
    // 위치 및 회전 설정
    if (mesh) {
        mesh.position.set(
            data.position.x, 
            data.position.y + data.size.height / 2, 
            data.position.z
        );
        
        mesh.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
        
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        // 건물 데이터 연결 - events 속성 추가
        mesh.userData = {
            id: data.id,
            name: data.name,
            description: data.description,
            image: data.image,
            link: data.link,
            originalColor: data.color,
            isBuilding: true,
            events: data.events // 이벤트 정보 추가
        };
    }
    
    return mesh;
}

function addBuildingDetailsModel(group, data) {
    switch(data.id) {
        case 'A': // 재능관
            addRoofStructure(group, data);
            break;
            
        case 'B': // 혁신관
            addBalconies(group, data);
            break;
            
        case 'E': // 체육관
            break;
            
        case 'G': // 평생교육관
            addCurvedElements(group, data);
            break;
    }
}

function addRoofStructure(group, data) {
    // 지붕 위 작은 구조물
    const roofStructureGeometry = new THREE.BoxGeometry(
        data.size.width * 0.3, 
        data.size.height * 0.1, 
        data.size.depth * 0.3
    );
    
    const roofMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        roughness: 0.8
    });
    
    const roofStructure = new THREE.Mesh(roofStructureGeometry, roofMaterial);
    roofStructure.position.set(0, data.size.height * 0.55, 0);
    
    group.children[0].add(roofStructure);
}

function addBalconies(group, data) {
    // 발코니 추가 (전면)
    const balconyGeometry = new THREE.BoxGeometry(
        data.size.width * 0.8, 
        data.size.height * 0.05, 
        data.size.depth * 0.2
    );
    
    const balconyMaterial = new THREE.MeshStandardMaterial({
        color: 0xCCCCCC,
        roughness: 0.7
    });
    
    // 여러 층의 발코니
    for (let i = 1; i <= 3; i++) {
        const balcony = new THREE.Mesh(balconyGeometry, balconyMaterial);
        balcony.position.set(0, data.size.height * (0.2 * i - 0.5), data.size.depth * 0.6);
        
        group.children[0].add(balcony);
        
        // 발코니 난간
        const railingGeometry = new THREE.BoxGeometry(
            data.size.width * 0.8, 
            data.size.height * 0.05, 
            data.size.depth * 0.02
        );
        
        const railing = new THREE.Mesh(railingGeometry, balconyMaterial);
        railing.position.set(0, data.size.height * 0.05, data.size.depth * 0.1);
        
        balcony.add(railing);
    }
}

function addDomeRoof(group, data) {
    // 돔형 지붕
    const domeGeometry = new THREE.SphereGeometry(
        Math.min(data.size.width, data.size.depth) * 0.5,
        32, 16, 0, Math.PI * 2, 0, Math.PI / 2
    );
    
    const domeMaterial = new THREE.MeshStandardMaterial({
        color: 0x6495ED,
        roughness: 0.6,
        metalness: 0.2
    });
    
    const dome = new THREE.Mesh(domeGeometry, domeMaterial);
    dome.position.set(0, data.size.height * 0.5, 0);
    
    group.children[0].add(dome);
}

function addCurvedElements(group, data) {
    // 곡선형 요소 (원통형 기둥)
    const cylinderGeometry = new THREE.CylinderGeometry(
        data.size.width * 0.1,
        data.size.width * 0.1,
        data.size.height,
        32
    );
    
    const cylinderMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(data.color).multiplyScalar(1.2),
        roughness: 0.7
    });
    
    // 코너에 원통형 기둥 배치
    const positions = [
        [data.size.width * 0.5, 0, data.size.depth * 0.5],
        [data.size.width * 0.5, 0, -data.size.depth * 0.5],
        [-data.size.width * 0.5, 0, data.size.depth * 0.5],
        [-data.size.width * 0.5, 0, -data.size.depth * 0.5]
    ];
    
    positions.forEach(pos => {
        const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        cylinder.position.set(pos[0], pos[1], pos[2]);
        
        group.children[0].add(cylinder);
    });
}

// 주차장
function createParkingTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // 배경색 (아스팔트)
    ctx.fillStyle = '#444444';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 주차 공간 구획 (하얀선)
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 6; // 선 두께 증가
    
    // 주차 라인 간격 및 크기 설정
    const parkingSpotWidth = canvas.width / 12;
    const parkingSpotHeight = canvas.height / 6;
    
    // 가로 주차 공간 (하얀선)
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 12; col++) {
            const x = col * parkingSpotWidth;
            const y = row * parkingSpotHeight;
            
            // 주차 공간 테두리
            ctx.strokeRect(
                x + 5, 
                y + 5, 
                parkingSpotWidth - 10, 
                parkingSpotHeight - 10
            );
        }
    }
    
    // 중앙 도로 노란선 (가로)
    ctx.strokeStyle = '#FFFF00';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    
    // 세로 도로 노란선 (중앙)
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    
    // 점선 효과
    ctx.setLineDash([20, 20]); // 20px 선, 20px 공백
    
    // 추가 노란 도로선 (가로)
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 4);
    ctx.lineTo(canvas.width, canvas.height / 4);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 3/4);
    ctx.lineTo(canvas.width, canvas.height * 3/4);
    ctx.stroke();
    
    return new THREE.CanvasTexture(canvas);
}

// 운동장 텍스처 생성
function createFieldTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // 운동장 기본색
    ctx.fillStyle = '#CD5C5C';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 운동장 선 (축구장/농구장 등의 라인)
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    
    // 외곽선
    ctx.strokeRect(canvas.width * 0.1, canvas.height * 0.1, 
                 canvas.width * 0.8, canvas.height * 0.8);
    
    // 중앙선
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height * 0.1);
    ctx.lineTo(canvas.width / 2, canvas.height * 0.9);
    ctx.stroke();
    
    // 중앙원
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 
            canvas.width * 0.15, 0, Math.PI * 2);
    ctx.stroke();
    
    return new THREE.CanvasTexture(canvas);
}

function createFixedSizeMarker(id) {
    // 마커 텍스처 생성
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    // 배경 원
    ctx.beginPath();
    ctx.arc(64, 64, 64, 0, Math.PI * 2);
    ctx.fillStyle = '#000000';
    ctx.fill();
    
    // 텍스트
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(id, 64, 64);
    
    const texture = new THREE.CanvasTexture(canvas);
    
    // 스프라이트 재질 (항상 카메라를 향함)
    const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        sizeAttenuation: false // 거리에 따른
    });
    
    // 스프라이트 생성 (크기가 일정하게 유지됨)
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(0.05, 0.05, 1); // 작은 크기로 조정
    
    return sprite;
}

function addEnhancedBuildingMarker(data, buildingMesh) {
    // 스프라이트 마커 생성
    const marker = createFixedSizeMarker(data.id);
    
    // 마커 위치 설정
    let markerY;
    if (data.id === 'I') { 
        markerY = 10; 
    } else if (data.id === 'J') { // 운동장
        markerY = 3;
    } else if (data.id === 'A') { 
        markerY = 20;
    }else {
        markerY = data.size.height + 1.5; // 건물 위에 마커 배치
    }
    
    marker.position.set(0, markerY, 0);
    
    // 건물 메쉬에 마커 추가
    buildingMesh.add(marker);
}


function createBuildings() {
    // 기존 건물 제거 (재생성 시)
    buildings.forEach(building => {
        scene.remove(building);
    });
    buildings = [];
    
    buildingData.forEach(data => {
        // 향상된 건물 생성 함수 사용
        const building = createEnhancedBuilding(data);
        
        // Scene에 추가
        scene.add(building);
        buildings.push(building);
        
        // 건물 ID 마커 추가 (향상된 마커)
        addEnhancedBuildingMarker(data, building);
    });
}

// 개선된 onMouseMove 함수 (다중 재질 처리)
function onMouseMove(event) {
    // 회전 모드일 때는 호버 효과 비활성화
    if (rotationMode) return;
    
    // 마우스 위치 계산
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / canvas.clientHeight) * 2 + 1;
    
    // Raycaster 업데이트
    raycaster.setFromCamera(mouse, camera);
    
    // 건물과의 교차 확인
    const intersects = raycaster.intersectObjects(buildings, true);
    
    // 이전에 호버된 건물이 있으면 원래 색상으로 되돌리기
    if (hoveredBuilding && (!intersects.length || intersects[0].object.userData.id !== hoveredBuilding.userData.id)) {
        resetHoveredBuilding();
    }
    
    // 새로운 건물 호버 처리
    if (intersects.length > 0) {
        // 교차된 객체가 건물 그룹의 일부인 경우 부모 객체(그룹)를 찾음
        let building = intersects[0].object;
        while (building.parent && !building.userData.isBuilding) {
            building = building.parent;
        }
        
        if (building.userData && building.userData.isBuilding) {
            // 이미 호버된 건물이 아니면 호버 효과 적용
            if (hoveredBuilding !== building) {
                hoveredBuilding = building;
                
                // 호버 효과: 크기 확대 및 밝기 증가
                building.scale.set(1.05, 1.05, 1.05);
                
                // 재질 처리 (단일 재질 또는 재질 배열)
                applyHoverEffect(building);
                
                // 커서 변경
                canvas.style.cursor = 'pointer';
            }
        }
    } else {
        // 호버된 건물이 없으면 커서 원래대로
        canvas.style.cursor = 'default';
    }
}

function applyHoverEffect(object) {
    // 크기만 확대하고 색상은 변경하지 않음
    object.scale.set(1.05, 1.05, 1.05);
    
    // 커서 변경
    canvas.style.cursor = 'pointer';
}

// 호버된 건물 리셋 함수 개선
function resetHoveredBuilding() {
    if (hoveredBuilding) {
        // 크기만 원래대로 복원
        hoveredBuilding.scale.set(1, 1, 1);
        
        hoveredBuilding = null;
        
        // 커서 원래대로
        canvas.style.cursor = 'default';
    }
}

// 마우스 클릭 처리 함수 개선
function onMouseClick(event) {
    // 회전 모드일 때는 클릭 이벤트 무시
    if (rotationMode) return;
    
    // 마우스 위치 계산
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / canvas.clientHeight) * 2 + 1;
    
    // Raycaster 업데이트
    raycaster.setFromCamera(mouse, camera);
    
    // 건물과의 교차 확인
    const intersects = raycaster.intersectObjects(buildings, true);
    
    // 팝업창 닫기 (다른 곳 클릭 시)
    if (intersects.length === 0) {
        closePopup();
        return;
    }
    
    // 교차된 객체가 건물 그룹의 일부인 경우 부모 객체(그룹)를 찾음
    let building = intersects[0].object;
    while (building.parent && !building.userData.isBuilding) {
        building = building.parent;
    }
    
    // 건물 클릭 처리
    if (building.userData && building.userData.isBuilding) {
        selectedBuilding = building;
        showBuildingPopup(building, event.clientX, event.clientY);
    }
}

// 건물 팝업창 표시
function showBuildingPopup(building, clientX, clientY) {
    try {
        if (!building || !building.userData) {
            console.error('유효하지 않은 건물 데이터입니다.');
            return;
        }

        // 팝업 요소 확인
        if (!popupTitle || !popupDescription || !popupImage) {
            console.error('팝업 요소를 찾을 수 없습니다.');
            return;
        }

        // 팝업 내용 설정
        popupTitle.textContent = building.userData.name || '건물 이름 없음';
        popupDescription.textContent = building.userData.description || '설명 없음';
        
        // 이미지 로드 오류 처리
        const img = popupImage;
        img.onerror = function() {
            console.warn('이미지 로드 실패:', building.userData.image);
            this.src = 'img/placeholder.jpg'; // 기본 이미지로 대체
        };
        img.src = building.userData.image || 'img/placeholder.jpg';
    
    // 이벤트 섹션 설정
    const popupEvents = document.getElementById('popup-events');
    const eventsTitle = document.getElementById('events-title');
    const eventsContent = document.getElementById('events-content');
    
    // 이벤트 컨텐츠 초기화
    eventsContent.innerHTML = '';
    
    // 이벤트가 있는지 확인
    if (building.userData.events && building.userData.events.length > 0) {
        // 이벤트 제목 설정
        eventsTitle.textContent = `${building.userData.name}에서 진행중인 이벤트 및 캠페인`;
        
        // 이벤트 내용 추가
        building.userData.events.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';
            
            const eventLink = document.createElement('a');
            eventLink.href = event.link;
            eventLink.target = "_blank"; // 새 탭에서 열기
            eventLink.textContent = event.title;
            eventLink.title = event.description; // 툴팁으로 설명 표시
            
            eventItem.appendChild(eventLink);
            eventsContent.appendChild(eventItem);
        });
        
        // 이벤트 섹션 표시
        popupEvents.classList.remove('hidden');
    } else {
        // 이벤트가 없으면 섹션 숨기기
        popupEvents.classList.add('hidden');
    }
    
    // 운동장(J)과 주차장(I)의 경우 예약 버튼 숨기기
    if (building.userData.id === 'I' || building.userData.id === 'J' 
        || building.userData.id === 'C' || building.userData.id === 'E') {
        popupButton.style.display = 'none'; // 버튼 숨기기
    } else {
        popupButton.style.display = 'inline-block'; // 다른 건물에서는 버튼 표시
        popupButton.textContent = '강의실 정보 및 예약'; // 버튼 텍스트 설정
    }
    
    // 팝업 위치 계산
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    // 팝업 표시
    buildingPopup.style.left = x + 'px';
    buildingPopup.style.top = y - 200 + 'px'; // 약간 위에 표시
    buildingPopup.classList.remove('hidden');

        // 이벤트가 있는지 확인
        console.log("Building events:", building.userData.events); // 디버깅용 로그 추가
        if (building.userData.events && building.userData.events.length > 0) {
            // 이벤트 섹션 표시 코드
            popupEvents.classList.remove('hidden');
        } else {
            // 이벤트 섹션 숨김 코드
            popupEvents.classList.add('hidden');
        }
    } catch (error) {
        console.error('팝업 표시 오류:', error);
        alert('건물 정보를 표시하는 중 오류가 발생했습니다.');
    }
}

// 팝업창 닫기
function closePopup() {
    buildingPopup.classList.add('hidden');
    selectedBuilding = null;
}

// 건물 페이지로 이동
function navigateToBuilding() {
    if (selectedBuilding) {
        window.location.href = selectedBuilding.userData.link;
    }
}

// 모드 전환 (회전 모드 <-> 정보 보기 모드)
function toggleMode() {
    rotationMode = !rotationMode;
    controls.enabled = rotationMode;
    
    // 버튼 텍스트 및 스타일 변경
    if (rotationMode) {
        toggleModeButton.textContent = '정보 보기 모드';
        toggleModeButton.classList.add('active');
        canvas.style.cursor = 'move';
        closePopup();
    } else {
        toggleModeButton.textContent = '3D 뷰 조작';
        toggleModeButton.classList.remove('active');
        canvas.style.cursor = 'default';
    }
}

// 이벤트 섹션 생성
function createEventSection() {
    const eventsGrid = document.querySelector('.events-grid');
    
    // 기존 내용 제거
    eventsGrid.innerHTML = '';
    
    eventData.forEach(event => {
        // 이벤트 카드 생성
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        
        // 이벤트 이미지
        const eventImage = document.createElement('img');
        eventImage.className = 'event-image';
        eventImage.src = event.image;
        eventImage.alt = event.title;
        
        // 이벤트 정보
        const eventInfo = document.createElement('div');
        eventInfo.className = 'event-info';
        
        const eventTitle = document.createElement('h3');
        eventTitle.textContent = event.title;
        
        const eventDescription = document.createElement('p');
        eventDescription.textContent = event.description;
        
        // 요소 조합
        eventInfo.appendChild(eventTitle);
        eventInfo.appendChild(eventDescription);
        
        eventCard.appendChild(eventImage);
        eventCard.appendChild(eventInfo);
        
        // 클릭 이벤트 추가
        eventCard.addEventListener('click', function() {
            window.location.href = event.link;
        });
        
        // 그리드에 추가
        eventsGrid.appendChild(eventCard);
    });
}

// 페이지 로드 시 초기화
window.addEventListener('load', init);