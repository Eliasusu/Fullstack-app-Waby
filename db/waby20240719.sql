-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: waby
-- ------------------------------------------------------
-- Server version	8.0.38

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `calisthenics_goals`
--

DROP TABLE IF EXISTS `calisthenics_goals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calisthenics_goals` (
  `idGoal` varchar(12) NOT NULL,
  `userId` varchar(12) NOT NULL,
  `goalType` varchar(15) NOT NULL COMMENT 'objetivo="peso corporal"\\\\nobjetivo="gym"\\\\nobjetivo="calistenia"',
  `startDate` date NOT NULL,
  `deadline` date DEFAULT NULL,
  `idGoalExercise` int NOT NULL,
  `goalExercise` varchar(20) NOT NULL,
  `startingExercise` varchar(45) NOT NULL,
  `numberInitialReps` int DEFAULT NULL,
  `numberInitialSec` int DEFAULT NULL,
  `numberInitialSets` int NOT NULL,
  PRIMARY KEY (`idGoal`),
  KEY `fk_goal_user_idx` (`userId`),
  KEY `fk_goal_exercise_idx` (`idGoalExercise`),
  CONSTRAINT `fk_goalcalisthenics_exercise` FOREIGN KEY (`idGoalExercise`) REFERENCES `calisthenics_exercises` (`idExercise`),
  CONSTRAINT `fk_goalcalisthenics_user` FOREIGN KEY (`userId`) REFERENCES `users` (`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calisthenics_goals`
--

LOCK TABLES `calisthenics_goals` WRITE;
/*!40000 ALTER TABLE `calisthenics_goals` DISABLE KEYS */;
/*!40000 ALTER TABLE `calisthenics_goals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calisthenics_progress`
--

DROP TABLE IF EXISTS `calisthenics_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calisthenics_progress` (
  `idCalisthenicsGoal` varchar(12) NOT NULL,
  `uploadDate` date NOT NULL,
  `idUser` varchar(12) NOT NULL,
  `numberSeconds` int DEFAULT NULL,
  `numberReps` int DEFAULT NULL,
  `numberSets` int NOT NULL,
  PRIMARY KEY (`idCalisthenicsGoal`,`uploadDate`),
  KEY `fk_progress_user_idx` (`idUser`),
  CONSTRAINT `fk_progress_goal` FOREIGN KEY (`idCalisthenicsGoal`) REFERENCES `calisthenics_goals` (`idGoal`),
  CONSTRAINT `fk_progress_user` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calisthenics_progress`
--

LOCK TABLES `calisthenics_progress` WRITE;
/*!40000 ALTER TABLE `calisthenics_progress` DISABLE KEYS */;
/*!40000 ALTER TABLE `calisthenics_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calisthenics_progressions_per_reps`
--

DROP TABLE IF EXISTS `calisthenics_progressions_per_reps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calisthenics_progressions_per_reps` (
  `idcalisthenicsProgressionsPerRep` int NOT NULL AUTO_INCREMENT,
  `idExercise` int NOT NULL,
  `idTraining` int unsigned DEFAULT NULL,
  `nameProgression` varchar(20) NOT NULL,
  `oderProgression` int NOT NULL,
  `numberSeriesNeeded` int NOT NULL,
  `numberRepsNeeded` int NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`idcalisthenicsProgressionsPerRep`,`idExercise`),
  KEY `fk_progression_exercise_idx` (`idExercise`),
  KEY `fk_progression_training_idx` (`idTraining`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calisthenics_progressions_per_reps`
--

LOCK TABLES `calisthenics_progressions_per_reps` WRITE;
/*!40000 ALTER TABLE `calisthenics_progressions_per_reps` DISABLE KEYS */;
/*!40000 ALTER TABLE `calisthenics_progressions_per_reps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calisthenics_progressions_per_sec`
--

DROP TABLE IF EXISTS `calisthenics_progressions_per_sec`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calisthenics_progressions_per_sec` (
  `idcalisthenicsProgressionsPerSec` int NOT NULL AUTO_INCREMENT,
  `idExercise` int NOT NULL,
  `idTraining` int unsigned DEFAULT NULL,
  `nameProgression` varchar(20) NOT NULL,
  `oderProgression` int NOT NULL,
  `numberSeriesNeeded` int NOT NULL,
  `numberSecNeeded` int NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`idcalisthenicsProgressionsPerSec`,`idExercise`),
  KEY `fk_progression_exercise_idx` (`idExercise`),
  KEY `fk_progression_training_idx` (`idTraining`),
  CONSTRAINT `fk_progression_exercise` FOREIGN KEY (`idExercise`) REFERENCES `exercises` (`idExercise`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_progression_training` FOREIGN KEY (`idTraining`) REFERENCES `trainings` (`idTraining`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calisthenics_progressions_per_sec`
--

LOCK TABLES `calisthenics_progressions_per_sec` WRITE;
/*!40000 ALTER TABLE `calisthenics_progressions_per_sec` DISABLE KEYS */;
INSERT INTO `calisthenics_progressions_per_sec` VALUES (1,3,NULL,'Lean planche',1,6,30,NULL);
/*!40000 ALTER TABLE `calisthenics_progressions_per_sec` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercise_training`
--

DROP TABLE IF EXISTS `exercise_training`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercise_training` (
  `idTraining` int unsigned NOT NULL,
  `idExercise` varchar(12) NOT NULL,
  `sets` int NOT NULL,
  `reps` int NOT NULL,
  `weight` float NOT NULL,
  `rest` varchar(5) NOT NULL,
  `comment` varchar(45) NOT NULL,
  `completed` tinyint DEFAULT NULL,
  PRIMARY KEY (`idTraining`,`idExercise`),
  KEY `fk_rutines_trainings_idx` (`idTraining`),
  CONSTRAINT `fk_routines_training` FOREIGN KEY (`idTraining`) REFERENCES `trainings` (`idTraining`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercise_training`
--

LOCK TABLES `exercise_training` WRITE;
/*!40000 ALTER TABLE `exercise_training` DISABLE KEYS */;
/*!40000 ALTER TABLE `exercise_training` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercises`
--

DROP TABLE IF EXISTS `exercises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercises` (
  `idExercise` int NOT NULL AUTO_INCREMENT,
  `idTraining` int unsigned DEFAULT NULL,
  `idTrainingMethod` varchar(12) NOT NULL,
  `name` varchar(45) NOT NULL,
  `description` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `img` json DEFAULT NULL,
  `idMuscleGroup` varchar(45) NOT NULL,
  `exerciseType` varchar(45) NOT NULL,
  `difficulty` varchar(20) DEFAULT NULL,
  `dataCreated` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`idExercise`),
  KEY `fk_exercises_training_idx` (`idTraining`),
  KEY `fk_exercises_method_idx` (`idTrainingMethod`),
  CONSTRAINT `fk_exercises_method` FOREIGN KEY (`idTrainingMethod`) REFERENCES `trainings_methods` (`idMethod`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_exercises_training` FOREIGN KEY (`idTraining`) REFERENCES `trainings` (`idTraining`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercises`
--

LOCK TABLES `exercises` WRITE;
/*!40000 ALTER TABLE `exercises` DISABLE KEYS */;
INSERT INTO `exercises` VALUES (1,NULL,'123456qwerti','Pull up',NULL,NULL,'1','Pull','Hard',NULL),(2,NULL,'123456qwerti','Dips',NULL,NULL,'3','Push','Medium',NULL),(3,NULL,'123456qwerti','Planche',NULL,NULL,'3','Push','Hard',NULL);
/*!40000 ALTER TABLE `exercises` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gym_goals`
--

DROP TABLE IF EXISTS `gym_goals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gym_goals` (
  `idGymGoal` varchar(12) NOT NULL,
  `userId` varchar(12) NOT NULL,
  `goalType` varchar(15) NOT NULL COMMENT 'objetivo="peso corporal"\\\\nobjetivo="gym"\\\\nobjetivo="calistenia"',
  `startDate` date NOT NULL,
  `deadline` date DEFAULT NULL,
  `idExerciseGoal` int NOT NULL,
  `exerciseGoal` varchar(45) NOT NULL,
  `initialPr` float NOT NULL,
  PRIMARY KEY (`idGymGoal`),
  KEY `fk_goal_user_idx` (`userId`),
  KEY `fk_goalgym_exercise` (`idExerciseGoal`),
  CONSTRAINT `fk_goalgym_exercise` FOREIGN KEY (`idExerciseGoal`) REFERENCES `exercises` (`idExercise`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_goalgym_user` FOREIGN KEY (`userId`) REFERENCES `users` (`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gym_goals`
--

LOCK TABLES `gym_goals` WRITE;
/*!40000 ALTER TABLE `gym_goals` DISABLE KEYS */;
/*!40000 ALTER TABLE `gym_goals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gym_progress`
--

DROP TABLE IF EXISTS `gym_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gym_progress` (
  `idGymGoal` varchar(12) NOT NULL,
  `uploadDate` date NOT NULL,
  `newPr` float DEFAULT NULL,
  PRIMARY KEY (`idGymGoal`,`uploadDate`),
  CONSTRAINT `fk_progress_goalgym` FOREIGN KEY (`idGymGoal`) REFERENCES `gym_goals` (`idGymGoal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gym_progress`
--

LOCK TABLES `gym_progress` WRITE;
/*!40000 ALTER TABLE `gym_progress` DISABLE KEYS */;
/*!40000 ALTER TABLE `gym_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mesocycles`
--

DROP TABLE IF EXISTS `mesocycles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mesocycles` (
  `idMesocycle` int NOT NULL AUTO_INCREMENT,
  `mesocycleType` varchar(45) DEFAULT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  PRIMARY KEY (`idMesocycle`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mesocycles`
--

LOCK TABLES `mesocycles` WRITE;
/*!40000 ALTER TABLE `mesocycles` DISABLE KEYS */;
INSERT INTO `mesocycles` VALUES (1,'Hipertrophy','2024-07-15','2024-08-15');
/*!40000 ALTER TABLE `mesocycles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `muscle_groups`
--

DROP TABLE IF EXISTS `muscle_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `muscle_groups` (
  `IdMuscleGroup` int unsigned NOT NULL AUTO_INCREMENT,
  `idExercise` int unsigned DEFAULT NULL,
  `nameMuscleGroup` varchar(20) NOT NULL,
  `descripcion` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`IdMuscleGroup`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `muscle_groups`
--

LOCK TABLES `muscle_groups` WRITE;
/*!40000 ALTER TABLE `muscle_groups` DISABLE KEYS */;
INSERT INTO `muscle_groups` VALUES (1,1,'Back',NULL),(2,2,'Shoulders',NULL),(3,NULL,'Biceps',NULL),(4,NULL,'Triceps',NULL),(5,NULL,'Chest',NULL),(6,NULL,'Cuadriceps',NULL),(7,NULL,'Hamstring',NULL),(8,NULL,'Calf',NULL),(9,NULL,'Abs',NULL),(10,NULL,'Side abs',NULL);
/*!40000 ALTER TABLE `muscle_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trainings`
--

DROP TABLE IF EXISTS `trainings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trainings` (
  `idTraining` int unsigned NOT NULL AUTO_INCREMENT,
  `idMesocycle` int NOT NULL,
  `trainingType` varchar(45) DEFAULT NULL,
  `day` date NOT NULL,
  `idUser` varchar(12) DEFAULT NULL,
  `time` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`idTraining`,`idMesocycle`),
  KEY `fk_entrenamientos_users_idx` (`idUser`),
  KEY `fk_idx` (`idMesocycle`),
  CONSTRAINT `fk_training_mesocycle` FOREIGN KEY (`idMesocycle`) REFERENCES `mesocycles` (`idMesocycle`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainings`
--

LOCK TABLES `trainings` WRITE;
/*!40000 ALTER TABLE `trainings` DISABLE KEYS */;
INSERT INTO `trainings` VALUES (1,1,'Push','2024-07-15','qwerti123456','6:00');
/*!40000 ALTER TABLE `trainings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trainings_methods`
--

DROP TABLE IF EXISTS `trainings_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trainings_methods` (
  `idMethod` varchar(12) NOT NULL,
  `nameMethod` varchar(45) NOT NULL COMMENT 'calistenia o gimnasio',
  `description` varchar(45) NOT NULL,
  PRIMARY KEY (`idMethod`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainings_methods`
--

LOCK TABLES `trainings_methods` WRITE;
/*!40000 ALTER TABLE `trainings_methods` DISABLE KEYS */;
INSERT INTO `trainings_methods` VALUES ('123456qwerti','Calisthenics',''),('dfghj2346d45','Gym','');
/*!40000 ALTER TABLE `trainings_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `idUser` varchar(12) NOT NULL,
  `name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `birthdate` date NOT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `email` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(16) NOT NULL,
  `username` varchar(45) NOT NULL,
  `height` float NOT NULL,
  `bodyWeight` float NOT NULL,
  PRIMARY KEY (`idUser`),
  UNIQUE KEY `birthdate_UNIQUE` (`birthdate`),
  UNIQUE KEY `mail_UNIQUE` (`email`),
  UNIQUE KEY `password_UNIQUE` (`password`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('123456qwerty','Todo Aoi','2000-07-11','1234567890','todochan2000@gmail.com','takadachan123','todoaoi',190,110);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_trainingsmethods`
--

DROP TABLE IF EXISTS `users_trainingsmethods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_trainingsmethods` (
  `idTrainingMethod` varchar(12) NOT NULL,
  `idUser` varchar(12) NOT NULL,
  KEY `idTrainingMethod` (`idTrainingMethod`),
  KEY `users_trainingsmethods_ibfk_1` (`idUser`),
  CONSTRAINT `users_trainingsmethods_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `users_trainingsmethods_ibfk_2` FOREIGN KEY (`idTrainingMethod`) REFERENCES `trainings_methods` (`idMethod`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_trainingsmethods`
--

LOCK TABLES `users_trainingsmethods` WRITE;
/*!40000 ALTER TABLE `users_trainingsmethods` DISABLE KEYS */;
INSERT INTO `users_trainingsmethods` VALUES ('123456qwerti','123456qwerty');
/*!40000 ALTER TABLE `users_trainingsmethods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weight_goals`
--

DROP TABLE IF EXISTS `weight_goals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weight_goals` (
  `idWeightGoal` varchar(12) NOT NULL,
  `userId` varchar(12) NOT NULL,
  `goalType` varchar(15) NOT NULL COMMENT 'objetivo="peso corporal"\\nobjetivo="gym"\\nobjetivo="calistenia"',
  `startDate` date NOT NULL,
  `deadline` date NOT NULL,
  `startingWeigth` float NOT NULL,
  `goalWeigth` float NOT NULL,
  PRIMARY KEY (`idWeightGoal`),
  KEY `fk_goalweight_user_idx` (`userId`),
  CONSTRAINT `fk_goalweight_user` FOREIGN KEY (`userId`) REFERENCES `users` (`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weight_goals`
--

LOCK TABLES `weight_goals` WRITE;
/*!40000 ALTER TABLE `weight_goals` DISABLE KEYS */;
/*!40000 ALTER TABLE `weight_goals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weight_progress`
--

DROP TABLE IF EXISTS `weight_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weight_progress` (
  `idWeightGoal` varchar(12) NOT NULL,
  `fechaCarga` date NOT NULL,
  `newWeight` float DEFAULT NULL,
  PRIMARY KEY (`idWeightGoal`,`fechaCarga`),
  CONSTRAINT `fk_progressweight_goal` FOREIGN KEY (`idWeightGoal`) REFERENCES `weight_goals` (`idWeightGoal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weight_progress`
--

LOCK TABLES `weight_progress` WRITE;
/*!40000 ALTER TABLE `weight_progress` DISABLE KEYS */;
/*!40000 ALTER TABLE `weight_progress` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-19 16:53:34
