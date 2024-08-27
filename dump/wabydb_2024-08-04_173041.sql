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
  `exercises_trainings_id_training` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id_exercise`),
  KEY `exercise_training_method_id_method_index` (`training_method_id_method`),
  KEY `exercise_exercises_trainings_id_training_index` (`exercises_trainings_id_training`),
  CONSTRAINT `exercise_exercises_trainings_id_training_foreign` FOREIGN KEY (`exercises_trainings_id_training`) REFERENCES `exercise_training` (`id_training`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `exercise_training_method_id_method_foreign` FOREIGN KEY (`training_method_id_method`) REFERENCES `training_method` (`id_method`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `exercise_training`
--

DROP TABLE IF EXISTS `exercise_training`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercise_training` (
  `id_training` int unsigned NOT NULL AUTO_INCREMENT,
  `sets` int NOT NULL,
  `reps` int NOT NULL,
  `weight` int NOT NULL,
  `rest` int NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_training`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `exercises_trainings_id_training` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id_training`),
  KEY `training_user_id_user_index` (`user_id_user`),
  KEY `training_mesocycle_id_mesocycle_index` (`mesocycle_id_mesocycle`),
  KEY `training_exercises_trainings_id_training_index` (`exercises_trainings_id_training`),
  CONSTRAINT `training_exercises_trainings_id_training_foreign` FOREIGN KEY (`exercises_trainings_id_training`) REFERENCES `exercise_training` (`id_training`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `training_mesocycle_id_mesocycle_foreign` FOREIGN KEY (`mesocycle_id_mesocycle`) REFERENCES `mesocycle` (`id_mesocycle`) ON UPDATE CASCADE,
  CONSTRAINT `training_user_id_user_foreign` FOREIGN KEY (`user_id_user`) REFERENCES `user` (`id_user`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `training_exercises`
--

DROP TABLE IF EXISTS `training_exercises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `training_exercises` (
  `training_id_training` int unsigned NOT NULL,
  `exercise_id_exercise` int unsigned NOT NULL,
  PRIMARY KEY (`training_id_training`,`exercise_id_exercise`),
  KEY `training_exercises_training_id_training_index` (`training_id_training`),
  KEY `training_exercises_exercise_id_exercise_index` (`exercise_id_exercise`),
  CONSTRAINT `training_exercises_exercise_id_exercise_foreign` FOREIGN KEY (`exercise_id_exercise`) REFERENCES `exercise` (`id_exercise`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `training_exercises_training_id_training_foreign` FOREIGN KEY (`training_id_training`) REFERENCES `training` (`id_training`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `phone` varchar(255) NOT NULL,
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

-- Dump completed on 2024-08-04 17:30:46
