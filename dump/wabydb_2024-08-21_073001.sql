-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: wabydb
-- ------------------------------------------------------
-- Server version	8.0.38

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
-- Table structure for table `calisthenics_progression_per_reps`
--

DROP TABLE IF EXISTS `calisthenics_progression_per_reps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calisthenics_progression_per_reps` (
  `id_progression` int unsigned NOT NULL AUTO_INCREMENT,
  `exercise_id_exercise` int unsigned NOT NULL,
  `name_progression` varchar(255) DEFAULT NULL,
  `order_progression` int DEFAULT NULL,
  `number_sets_needed` int DEFAULT NULL,
  `number_reps_needed` int DEFAULT NULL,
  PRIMARY KEY (`id_progression`),
  UNIQUE KEY `calisthenics_progression_per_reps_name_progression_unique` (`name_progression`),
  KEY `calisthenics_progression_per_reps_exercise_id_exercise_index` (`exercise_id_exercise`),
  CONSTRAINT `calisthenics_progression_per_reps_exercise_id_exercise_foreign` FOREIGN KEY (`exercise_id_exercise`) REFERENCES `exercise` (`id_exercise`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calisthenics_progression_per_reps`
--

/*!40000 ALTER TABLE `calisthenics_progression_per_reps` DISABLE KEYS */;
/*!40000 ALTER TABLE `calisthenics_progression_per_reps` ENABLE KEYS */;

--
-- Table structure for table `calisthenics_progression_per_sec`
--

DROP TABLE IF EXISTS `calisthenics_progression_per_sec`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calisthenics_progression_per_sec` (
  `id_progression` int unsigned NOT NULL AUTO_INCREMENT,
  `exercise_id_exercise` int unsigned NOT NULL,
  `name_progression` varchar(255) NOT NULL,
  `order_progression` int NOT NULL,
  `number_sec_needed` int NOT NULL,
  `number_reps_needed` int NOT NULL,
  PRIMARY KEY (`id_progression`),
  UNIQUE KEY `calisthenics_progression_per_sec_name_progression_unique` (`name_progression`),
  KEY `calisthenics_progression_per_sec_exercise_id_exercise_index` (`exercise_id_exercise`),
  CONSTRAINT `calisthenics_progression_per_sec_exercise_id_exercise_foreign` FOREIGN KEY (`exercise_id_exercise`) REFERENCES `exercise` (`id_exercise`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calisthenics_progression_per_sec`
--

/*!40000 ALTER TABLE `calisthenics_progression_per_sec` DISABLE KEYS */;
/*!40000 ALTER TABLE `calisthenics_progression_per_sec` ENABLE KEYS */;

--
-- Table structure for table `exercise`
--

DROP TABLE IF EXISTS `exercise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercise` (
  `id_exercise` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `training_method_id_method` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `difficulty` varchar(255) NOT NULL,
  `type_exercise` varchar(255) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `image` varchar(255) DEFAULT NULL,
  `user_id_user` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_exercise`),
  UNIQUE KEY `exercise_name_unique` (`name`),
  KEY `exercise_training_method_id_method_index` (`training_method_id_method`),
  KEY `exercise_user_id_user_index` (`user_id_user`),
  CONSTRAINT `exercise_training_method_id_method_foreign` FOREIGN KEY (`training_method_id_method`) REFERENCES `training_method` (`id_method`) ON UPDATE CASCADE,
  CONSTRAINT `exercise_user_id_user_foreign` FOREIGN KEY (`user_id_user`) REFERENCES `user` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercise`
--

/*!40000 ALTER TABLE `exercise` DISABLE KEYS */;
/*!40000 ALTER TABLE `exercise` ENABLE KEYS */;

--
-- Table structure for table `exercise_training`
--

DROP TABLE IF EXISTS `exercise_training`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercise_training` (
  `id_training_exercise` int unsigned NOT NULL AUTO_INCREMENT,
  `sets` int NOT NULL,
  `reps` int NOT NULL,
  `weight` int NOT NULL,
  `rest` int NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `exercise_id_exercise` int unsigned NOT NULL,
  `training_id_training` int unsigned NOT NULL,
  PRIMARY KEY (`id_training_exercise`),
  KEY `exercise_training_exercise_id_exercise_index` (`exercise_id_exercise`),
  KEY `exercise_training_training_id_training_index` (`training_id_training`),
  CONSTRAINT `exercise_training_exercise_id_exercise_foreign` FOREIGN KEY (`exercise_id_exercise`) REFERENCES `exercise` (`id_exercise`) ON UPDATE CASCADE,
  CONSTRAINT `exercise_training_training_id_training_foreign` FOREIGN KEY (`training_id_training`) REFERENCES `training` (`id_training`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercise_training`
--

/*!40000 ALTER TABLE `exercise_training` DISABLE KEYS */;
/*!40000 ALTER TABLE `exercise_training` ENABLE KEYS */;

--
-- Table structure for table `mesocycle`
--

DROP TABLE IF EXISTS `mesocycle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mesocycle` (
  `id_mesocycle` int unsigned NOT NULL AUTO_INCREMENT,
  `type_mesocycle` varchar(255) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  PRIMARY KEY (`id_mesocycle`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mesocycle`
--

/*!40000 ALTER TABLE `mesocycle` DISABLE KEYS */;
INSERT INTO `mesocycle` VALUES (1,'Power','2024-02-29 21:00:00','2024-05-30 21:00:00');
/*!40000 ALTER TABLE `mesocycle` ENABLE KEYS */;

--
-- Table structure for table `muscle_group`
--

DROP TABLE IF EXISTS `muscle_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `muscle_group` (
  `id_muscle_group` int unsigned NOT NULL AUTO_INCREMENT,
  `name_muscle_group` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `image_muscle_group` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_muscle_group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `muscle_group`
--

/*!40000 ALTER TABLE `muscle_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `muscle_group` ENABLE KEYS */;

--
-- Table structure for table `muscle_group_exercises`
--

DROP TABLE IF EXISTS `muscle_group_exercises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `muscle_group_exercises` (
  `muscle_group_id_muscle_group` int unsigned NOT NULL,
  `exercise_id_exercise` int unsigned NOT NULL,
  PRIMARY KEY (`muscle_group_id_muscle_group`,`exercise_id_exercise`),
  KEY `muscle_group_exercises_muscle_group_id_muscle_group_index` (`muscle_group_id_muscle_group`),
  KEY `muscle_group_exercises_exercise_id_exercise_index` (`exercise_id_exercise`),
  CONSTRAINT `muscle_group_exercises_exercise_id_exercise_foreign` FOREIGN KEY (`exercise_id_exercise`) REFERENCES `exercise` (`id_exercise`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `muscle_group_exercises_muscle_group_id_muscle_group_foreign` FOREIGN KEY (`muscle_group_id_muscle_group`) REFERENCES `muscle_group` (`id_muscle_group`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `muscle_group_exercises`
--

/*!40000 ALTER TABLE `muscle_group_exercises` DISABLE KEYS */;
/*!40000 ALTER TABLE `muscle_group_exercises` ENABLE KEYS */;

--
-- Table structure for table `progression_reps`
--

DROP TABLE IF EXISTS `progression_reps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `progression_reps` (
  `id_progression` int unsigned NOT NULL AUTO_INCREMENT,
  `exercise_id_exercise` int unsigned NOT NULL,
  `name_progression` varchar(255) DEFAULT NULL,
  `order_progression` int DEFAULT NULL,
  `number_sets_needed` int DEFAULT NULL,
  `number_reps_needed` int DEFAULT NULL,
  PRIMARY KEY (`id_progression`),
  UNIQUE KEY `progression_reps_name_progression_unique` (`name_progression`),
  KEY `progression_reps_exercise_id_exercise_index` (`exercise_id_exercise`),
  CONSTRAINT `progression_reps_exercise_id_exercise_foreign` FOREIGN KEY (`exercise_id_exercise`) REFERENCES `exercise` (`id_exercise`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progression_reps`
--

/*!40000 ALTER TABLE `progression_reps` DISABLE KEYS */;
/*!40000 ALTER TABLE `progression_reps` ENABLE KEYS */;

--
-- Table structure for table `progression_sec`
--

DROP TABLE IF EXISTS `progression_sec`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `progression_sec` (
  `id_progression` int unsigned NOT NULL AUTO_INCREMENT,
  `exercise_id_exercise` int unsigned NOT NULL,
  `name_progression` varchar(255) NOT NULL,
  `order_progression` int NOT NULL,
  `number_sec_needed` int NOT NULL,
  `number_reps_needed` int NOT NULL,
  PRIMARY KEY (`id_progression`),
  UNIQUE KEY `progression_sec_name_progression_unique` (`name_progression`),
  KEY `progression_sec_exercise_id_exercise_index` (`exercise_id_exercise`),
  CONSTRAINT `progression_sec_exercise_id_exercise_foreign` FOREIGN KEY (`exercise_id_exercise`) REFERENCES `exercise` (`id_exercise`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progression_sec`
--

/*!40000 ALTER TABLE `progression_sec` DISABLE KEYS */;
/*!40000 ALTER TABLE `progression_sec` ENABLE KEYS */;

--
-- Table structure for table `training`
--

DROP TABLE IF EXISTS `training`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `training` (
  `id_training` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id_user` varchar(255) NOT NULL,
  `mesocycle_id_mesocycle` int unsigned NOT NULL,
  `training_name` varchar(255) NOT NULL,
  `training_type` varchar(255) NOT NULL,
  `day` datetime NOT NULL,
  `time` varchar(255) NOT NULL,
  PRIMARY KEY (`id_training`),
  KEY `training_user_id_user_index` (`user_id_user`),
  KEY `training_mesocycle_id_mesocycle_index` (`mesocycle_id_mesocycle`),
  CONSTRAINT `training_mesocycle_id_mesocycle_foreign` FOREIGN KEY (`mesocycle_id_mesocycle`) REFERENCES `mesocycle` (`id_mesocycle`) ON UPDATE CASCADE,
  CONSTRAINT `training_user_id_user_foreign` FOREIGN KEY (`user_id_user`) REFERENCES `user` (`id_user`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `training`
--

/*!40000 ALTER TABLE `training` DISABLE KEYS */;
INSERT INTO `training` VALUES (1,'26d1da4438fd',1,'Front lever day','Pull','2024-07-08 21:00:00','9:00 AM');
/*!40000 ALTER TABLE `training` ENABLE KEYS */;

--
-- Table structure for table `training_method`
--

DROP TABLE IF EXISTS `training_method`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `training_method` (
  `id_method` varchar(255) NOT NULL,
  `name_method` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`id_method`),
  UNIQUE KEY `training_method_name_method_unique` (`name_method`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `training_method`
--

/*!40000 ALTER TABLE `training_method` DISABLE KEYS */;
INSERT INTO `training_method` VALUES ('emr345nrpzde','Calisthenics','Calisthenics promote strength, endurance, flexibility, and coordination and augment the body\'s general well-being by placing controllable, regular demands upon the cardiovascular system.'),('ojjmdeasf32sd','Gym','one\'s ability to execute daily activities with optimal performance, endurance, and strength with the management of disease, fatigue, and stress and reduced sedentary behavior');
/*!40000 ALTER TABLE `training_method` ENABLE KEYS */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id_user` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `birthdate` datetime NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `body_weight` int NOT NULL,
  `height` int NOT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `user_username_unique` (`username`),
  UNIQUE KEY `user_password_unique` (`password`),
  UNIQUE KEY `user_email_unique` (`email`),
  UNIQUE KEY `user_phone_unique` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('26d1da4438fd','narutouzu','$2a$10$juCvWjersB5jNAqfV6pU1u//lCT9j52dd8fynGNLI0wsai/d271/i','narutouzumaki@gmail.com','Naruto Uzumaki','1993-05-13 21:00:00','332562369',70,190),('555e136e68b9','tojizenin','$2a$10$7ig6N/UukthEoIDxrLXhE.Z1xcGXgtEPA0ujGftkaLuH9nKzXk6T.','zenintoji@gmail.com','Toji Zenin','1992-10-05 21:00:00','564357685',90,180),('9ae7b2b0eef8','itadori','$2a$10$26/95auqTpXUw6iooLqqlO0iUlZEFcFoIP9jbbFcPyamlsih8afN.','itadoriyuji@gmail.com','Yuji Itadori','2003-12-13 21:00:00','464579769',80,174);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

--
-- Table structure for table `user_training_methods`
--

DROP TABLE IF EXISTS `user_training_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_training_methods` (
  `user_id_user` varchar(255) NOT NULL,
  `training_method_id_method` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id_user`,`training_method_id_method`),
  KEY `user_training_methods_user_id_user_index` (`user_id_user`),
  KEY `user_training_methods_training_method_id_method_index` (`training_method_id_method`),
  CONSTRAINT `user_training_methods_training_method_id_method_foreign` FOREIGN KEY (`training_method_id_method`) REFERENCES `training_method` (`id_method`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_training_methods_user_id_user_foreign` FOREIGN KEY (`user_id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_training_methods`
--

/*!40000 ALTER TABLE `user_training_methods` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_training_methods` ENABLE KEYS */;

--
-- Dumping routines for database 'wabydb'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-21  7:30:12
