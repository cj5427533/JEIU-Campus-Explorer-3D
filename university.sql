-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        11.4.5-MariaDB - mariadb.org binary distribution
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- university 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `university` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `university`;

-- 테이블 university.equipment 구조 내보내기
CREATE TABLE IF NOT EXISTS `equipment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `room_id` int(11) NOT NULL DEFAULT 0,
  `name` varchar(100) NOT NULL DEFAULT '0',
  `quantity` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_equipment_rooms` (`room_id`),
  CONSTRAINT `FK_equipment_rooms` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 university.equipment:~13 rows (대략적) 내보내기
INSERT INTO `equipment` (`id`, `room_id`, `name`, `quantity`) VALUES
	(1, 1, '제단기 머신', 1),
	(2, 1, '프린터기', 4),
	(3, 1, '아이맥', 8),
	(4, 2, '화이트보드', 2),
	(5, 2, '전자칠판', 1),
	(6, 2, '스탠딩모니터', 6),
	(7, 3, '화이트보드', 1),
	(8, 4, '화이트보드', 1),
	(9, 4, '컴퓨터내장 책상', 30),
	(10, 5, '화이트보드', 1),
	(11, 5, '이동식 스탠드 모니터', 1),
	(12, 5, '빔프로젝터', 1),
	(13, 6, '화이트보드', 1);

-- 테이블 university.reservations 구조 내보내기
CREATE TABLE IF NOT EXISTS `reservations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `room_id` int(11) DEFAULT NULL,
  `user_name` varchar(50) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_reservations_rooms` (`room_id`),
  CONSTRAINT `FK_reservations_rooms` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 university.reservations:~0 rows (대략적) 내보내기

-- 테이블 university.rooms 구조 내보내기
CREATE TABLE IF NOT EXISTS `rooms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `building_name` varchar(200) NOT NULL,
  `room_number` varchar(10) NOT NULL DEFAULT '101',
  `seat_count` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 university.rooms:~6 rows (대략적) 내보내기
INSERT INTO `rooms` (`id`, `building_name`, `room_number`, `seat_count`) VALUES
	(1, '자율관', '101', 100),
	(2, 'IT관', '101', 34),
	(3, '본관', '101', 60),
	(4, '평생 교육관', '101', 30),
	(5, '창의관', '101', 40),
	(6, '봉사관', '101', 42);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
