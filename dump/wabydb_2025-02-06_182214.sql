-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
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
  `user_id_user` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_exercise`),
  UNIQUE KEY `exercise_name_unique` (`name`),
  KEY `exercise_training_method_id_method_index` (`training_method_id_method`),
  KEY `exercise_user_id_user_index` (`user_id_user`),
  CONSTRAINT `exercise_training_method_id_method_foreign` FOREIGN KEY (`training_method_id_method`) REFERENCES `training_method` (`id_method`) ON UPDATE CASCADE,
  CONSTRAINT `exercise_user_id_user_foreign` FOREIGN KEY (`user_id_user`) REFERENCES `user` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercise`
--

/*!40000 ALTER TABLE `exercise` DISABLE KEYS */;
INSERT INTO `exercise` VALUES (1,'Press plano','ojjmdeasf32sd','.','Medium','Push','2024-09-29 18:53:35',NULL,'c3cf6fd48800'),(4,'Push up','emr345nrpzde','','Easy','Push','2024-10-05 17:30:41',NULL,'c3cf6fd48800'),(5,'Pull up weighted','ojjmdeasf32sd','.','Hard','Pull','2024-10-05 17:42:54',NULL,'c3cf6fd48800'),(7,'Kroc Row','ojjmdeasf32sd','.','Easy','Pull','2024-10-06 18:04:33',NULL,'c3cf6fd48800'),(8,'Press militar','ojjmdeasf32sd','.','Medium','Push','2024-10-06 18:14:37',NULL,'c3cf6fd48800'),(9,'Sit up','emr345nrpzde','.','Easy','Isometric','2024-10-07 16:09:02',NULL,'c3cf6fd48800'),(10,'Curl biceps','ojjmdeasf32sd','','Hard','Pull','2024-10-07 16:10:59',NULL,'c3cf6fd48800'),(11,'Squat','ojjmdeasf32sd','','Medium','Legs','2024-10-16 07:59:13',NULL,'c3cf6fd48800'),(12,'Deadlift','ojjmdeasf32sd','','Hard','Pull','2024-10-16 08:14:20',NULL,'c3cf6fd48800'),(13,'Pull ups','emr345nrpzde','','Hard','Strength','2024-11-13 08:56:30',NULL,'4a1ab4720575'),(14,'L-sit','emr345nrpzde','','Hard','Isometric','2024-11-15 09:29:35',NULL,'c3cf6fd48800');
/*!40000 ALTER TABLE `exercise` ENABLE KEYS */;

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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `muscle_group`
--

/*!40000 ALTER TABLE `muscle_group` DISABLE KEYS */;
INSERT INTO `muscle_group` VALUES (1,'Back','.',NULL),(2,'Chest','.',NULL),(3,'Arms','.',NULL),(4,'Shoulders','.',NULL),(5,'Legs','.',NULL),(6,'Core','.',NULL);
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
INSERT INTO `muscle_group_exercises` VALUES (1,4),(1,5),(1,7),(1,13),(2,1),(3,10),(4,8),(5,11),(5,12),(6,9),(6,14);
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
  `number_sets_needed` int NOT NULL,
  `number_sec_needed` int NOT NULL,
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
-- Table structure for table `progressive_overload`
--

DROP TABLE IF EXISTS `progressive_overload`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `progressive_overload` (
  `id_progressive_overload` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `log_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `exercise_id_exercise` int unsigned NOT NULL,
  `user_id_user` varchar(255) NOT NULL,
  `type_po` varchar(255) NOT NULL,
  `done` int NOT NULL,
  `goal` int NOT NULL,
  PRIMARY KEY (`id_progressive_overload`),
  KEY `progressive_overload_exercise_id_exercise_index` (`exercise_id_exercise`),
  KEY `progressive_overload_user_id_user_index` (`user_id_user`),
  CONSTRAINT `progressive_overload_exercise_id_exercise_foreign` FOREIGN KEY (`exercise_id_exercise`) REFERENCES `exercise` (`id_exercise`) ON UPDATE CASCADE,
  CONSTRAINT `progressive_overload_user_id_user_foreign` FOREIGN KEY (`user_id_user`) REFERENCES `user` (`id_user`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progressive_overload`
--

/*!40000 ALTER TABLE `progressive_overload` DISABLE KEYS */;
INSERT INTO `progressive_overload` VALUES (2,'Pull up','2025-02-04 20:30:18',5,'c3cf6fd48800','Reps',8,20);
/*!40000 ALTER TABLE `progressive_overload` ENABLE KEYS */;

--
-- Table structure for table `training`
--

DROP TABLE IF EXISTS `training`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `training` (
  `id_training` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id_user` varchar(255) NOT NULL,
  `training_name` varchar(255) NOT NULL,
  `training_type` varchar(255) NOT NULL,
  `day` date NOT NULL,
  `start_hour` varchar(255) NOT NULL,
  `end_hour` varchar(255) NOT NULL,
  `completed` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id_training`),
  KEY `training_user_id_user_index` (`user_id_user`),
  CONSTRAINT `training_user_id_user_foreign` FOREIGN KEY (`user_id_user`) REFERENCES `user` (`id_user`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=201 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `training`
--

/*!40000 ALTER TABLE `training` DISABLE KEYS */;
INSERT INTO `training` VALUES (178,'c3cf6fd48800','Leg day','Quads, hamstrings','2024-10-14','18:00','19:00',0),(180,'c3cf6fd48800','Pull training','Streght training','2024-10-28','19:00','19:30',1),(181,'c3cf6fd48800','Pull training','Streght training','2024-11-04','18:00','19:30',0),(182,'c3cf6fd48800','Pull training','Streght training','2024-11-11','18:00','19:30',0),(183,'c3cf6fd48800','Pull training','Streght training','2024-11-18','18:00','19:30',0),(184,'c3cf6fd48800','Pull training','Streght training','2024-11-25','18:00','19:30',0),(185,'c3cf6fd48800','Training test','Test','2024-10-29','09:00','11:00',1),(187,'4a1ab4720575','Pull day','Fuerza','2024-11-13','18:00','20:00',0),(188,'4a1ab4720575','Pull day','Fuerza','2024-11-20','18:00','20:00',0),(189,'4a1ab4720575','Pull day','Fuerza','2024-11-27','18:00','20:00',0),(190,'4a1ab4720575','Pull day','Fuerza','2024-12-04','18:00','20:00',0),(191,'4a1ab4720575','Pull day','Fuerza','2024-12-11','18:00','20:00',0),(192,'4a1ab4720575','Pull day','Fuerza','2024-12-25','18:00','20:00',0),(193,'4a1ab4720575','Pull day','Fuerza','2024-12-18','18:00','20:00',0),(194,'c3cf6fd48800','Leg day','Hypertropy','2024-11-15','17:00','19:00',1),(195,'c3cf6fd48800','Leg day','Hypertropy','2024-11-22','17:00','19:00',0),(196,'c3cf6fd48800','Leg day','Hypertropy','2024-11-29','17:00','19:00',0),(197,'c3cf6fd48800','Push day','Fuerza','2024-11-14','05:00','07:00',1),(198,'c3cf6fd48800','Push day','Fuerza','2024-11-28','05:00','07:00',0),(199,'c3cf6fd48800','Push day','Fuerza','2024-11-21','05:00','07:00',0),(200,'c3cf6fd48800','Empuje y Tiron','Fuerza','2025-02-04','19:00','21:00',0);
/*!40000 ALTER TABLE `training` ENABLE KEYS */;

--
-- Table structure for table `training_item`
--

DROP TABLE IF EXISTS `training_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `training_item` (
  `id_training_item` int unsigned NOT NULL AUTO_INCREMENT,
  `sets` int NOT NULL,
  `reps` int NOT NULL,
  `weight` varchar(255) NOT NULL,
  `rest` varchar(255) NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `exercise_id_exercise` int unsigned NOT NULL,
  `training_id_training` int unsigned NOT NULL,
  `complete_exercise` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id_training_item`),
  KEY `training_item_exercise_id_exercise_index` (`exercise_id_exercise`),
  KEY `training_item_training_id_training_index` (`training_id_training`),
  CONSTRAINT `training_item_exercise_id_exercise_foreign` FOREIGN KEY (`exercise_id_exercise`) REFERENCES `exercise` (`id_exercise`) ON UPDATE CASCADE,
  CONSTRAINT `training_item_training_id_training_foreign` FOREIGN KEY (`training_id_training`) REFERENCES `training` (`id_training`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `training_item`
--

/*!40000 ALTER TABLE `training_item` DISABLE KEYS */;
INSERT INTO `training_item` VALUES (35,4,5,'7.5','5\'','',5,180,1),(36,4,5,'100%','5\'','RPE 8',11,185,1),(38,4,12,'30','2\'','',11,194,NULL),(39,4,12,'20','2\'','',12,194,NULL),(40,4,12,'0','3\'','',4,197,NULL),(41,4,6,'0','2\'','',5,200,0);
/*!40000 ALTER TABLE `training_item` ENABLE KEYS */;

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
INSERT INTO `training_method` VALUES ('emr345nrpzde','Calistenia','Conjunto de ejercicios que conducen al desarrollo de la agilidad y fuerza física.'),('ojjmdeasf32sd','Gimnasio',' lugar especialmente diseñado y equipado para que acudas a realizar una actividad física en diversas intensidades');
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
INSERT INTO `user` VALUES ('4a1ab4720575','usertest1','$2a$10$hWs21zfN8m0LlzxpQK/iUuQWCrY.TIhSGk.3L8BeMF05wy0BaBy.W','usertest1@gmail.com','user test1','1993-11-04 21:00:00','',60,160),('c3cf6fd48800','tojizenin','$2a$10$RzbOJz7eXMo.lI5x.nN3cO7NCk7LXwSnPW7K3bBMa8eqnfTo9JG6y','zenintoji@gmail.com','Toji Fushiguro','1992-10-05 21:00:00','564357685',88,183);
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

-- Dump completed on 2025-02-06 18:22:19
