-- MySQL dump 10.13  Distrib 8.4.10, for Linux (x86_64)
--
-- Host: localhost    Database: employee_management
-- ------------------------------------------------------
-- Server version	8.4.10-0ubuntu0.26.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `employeeDetails`
--

DROP TABLE IF EXISTS `employeeDetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employeeDetails` (
  `employeeId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `officeDays` int DEFAULT NULL,
  `salary` int DEFAULT NULL,
  PRIMARY KEY (`employeeId`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employeeDetails`
--

LOCK TABLES `employeeDetails` WRITE;
/*!40000 ALTER TABLE `employeeDetails` DISABLE KEYS */;
INSERT INTO `employeeDetails` VALUES (17,'John Doe',30,'Developer','john.doe@example.com',22,17600),(18,'Jane Smith',28,'Designer','jane.smith@example.com',20,16000),(19,'Bob Wilson',35,'Manager','bob.wilson@example.com',24,19200),(20,'John Doe',30,'Developer','john.doe@example.com',22,17600),(21,'Jane Smith',28,'Designer','jane.smith@example.com',20,16000),(22,'Bob Wilson',35,'Manager','bob.wilson@example.com',24,19200),(23,'John Doe',30,'Developer','john.doe@example.com',22,17600),(24,'Jane Smith',28,'Designer','jane.smith@example.com',20,16000),(25,'Bob Wilson',35,'Manager','bob.wilson@example.com',24,19200),(26,'John Doe',30,'Developer','john.doe@example.com',22,17600),(27,'Jane Smith',28,'Designer','jane.smith@example.com',20,16000),(28,'Bob Wilson',35,'Manager','bob.wilson@example.com',24,19200),(29,'John Doe',30,'Developer','john.doe@example.com',22,17600),(30,'Jane Smith',28,'Designer','jane.smith@example.com',20,16000),(31,'Bob Wilson',35,'Manager','bob.wilson@example.com',24,19200);
/*!40000 ALTER TABLE `employeeDetails` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-13 10:55:32
