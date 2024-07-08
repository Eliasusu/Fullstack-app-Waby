-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: waby_db
-- ------------------------------------------------------
-- Server version	8.0.37

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
-- Table structure for table `calisthenics_exercises`
--

DROP TABLE IF EXISTS `calisthenics_exercises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calisthenics_exercises` (
  `idExercise` int NOT NULL,
  `idTraining` int unsigned DEFAULT NULL,
  `name` varchar(45) NOT NULL,
  `description` varchar(45) NOT NULL,
  `idTrainingMethod` varchar(12) NOT NULL,
  `exerciseType` varchar(45) NOT NULL,
  `difficulty` varchar(45) NOT NULL,
  PRIMARY KEY (`idExercise`),
  KEY `fk_training_method_idx` (`idTrainingMethod`),
  KEY `fk_training_method` (`idTrainingMethod`),
  KEY `fk_exercise_training_idx` (`idTraining`),
  CONSTRAINT `fk_exercise_method` FOREIGN KEY (`idTrainingMethod`) REFERENCES `trainings_methods` (`idMethod`) ON UPDATE CASCADE,
  CONSTRAINT `fk_exercise_training` FOREIGN KEY (`idTraining`) REFERENCES `trainings` (`idTraining`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calisthenics_exercises`
--

LOCK TABLES `calisthenics_exercises` WRITE;
/*!40000 ALTER TABLE `calisthenics_exercises` DISABLE KEYS */;
/*!40000 ALTER TABLE `calisthenics_exercises` ENABLE KEYS */;
UNLOCK TABLES;

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
  CONSTRAINT `fk_progression_exercise` FOREIGN KEY (`idExercise`) REFERENCES `calisthenics_exercises` (`idExercise`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_progression_training` FOREIGN KEY (`idTraining`) REFERENCES `trainings` (`idTraining`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calisthenics_progressions_per_sec`
--

LOCK TABLES `calisthenics_progressions_per_sec` WRITE;
/*!40000 ALTER TABLE `calisthenics_progressions_per_sec` DISABLE KEYS */;
/*!40000 ALTER TABLE `calisthenics_progressions_per_sec` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercises`
--

DROP TABLE IF EXISTS `exercises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercises` (
  `idExercises` int NOT NULL AUTO_INCREMENT,
  `idTraining` int unsigned DEFAULT NULL,
  `name` varchar(45) NOT NULL,
  `description` varchar(45) NOT NULL,
  `idTrainingMethod` varchar(12) NOT NULL,
  `img` json DEFAULT NULL,
  `idMuscleGroup` varchar(45) NOT NULL,
  `exerciseType` varchar(45) NOT NULL,
  PRIMARY KEY (`idExercises`),
  KEY `fk_exercises_training_idx` (`idTraining`),
  KEY `fk_exercises_method_idx` (`idTrainingMethod`),
  CONSTRAINT `fk_exercises_method` FOREIGN KEY (`idTrainingMethod`) REFERENCES `trainings_methods` (`idMethod`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_exercises_training` FOREIGN KEY (`idTraining`) REFERENCES `trainings` (`idTraining`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercises`
--

LOCK TABLES `exercises` WRITE;
/*!40000 ALTER TABLE `exercises` DISABLE KEYS */;
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
  `idTraining` int unsigned NOT NULL,
  `numberDays` int NOT NULL,
  PRIMARY KEY (`idMesocycle`),
  KEY `fk_training_idx` (`idTraining`),
  CONSTRAINT `fk_mesocycles_training` FOREIGN KEY (`idTraining`) REFERENCES `trainings` (`idTraining`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mesocycles`
--

LOCK TABLES `mesocycles` WRITE;
/*!40000 ALTER TABLE `mesocycles` DISABLE KEYS */;
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
  `idExercise` int unsigned NOT NULL,
  `nameMuscleGroup` varchar(20) NOT NULL,
  `descripcion` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`IdMuscleGroup`,`idExercise`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `muscle_groups`
--

LOCK TABLES `muscle_groups` WRITE;
/*!40000 ALTER TABLE `muscle_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `muscle_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `routines`
--

DROP TABLE IF EXISTS `routines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `routines` (
  `idExercise` varchar(12) NOT NULL,
  `idTraining` int unsigned NOT NULL,
  `sets` int NOT NULL,
  `reps` int NOT NULL,
  `weight` float NOT NULL,
  `rest` varchar(5) NOT NULL,
  `comment` varchar(45) NOT NULL,
  PRIMARY KEY (`idExercise`,`idTraining`),
  KEY `fk_rutines_trainings_idx` (`idTraining`),
  CONSTRAINT `fk_routines_training` FOREIGN KEY (`idTraining`) REFERENCES `trainings` (`idTraining`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routines`
--

LOCK TABLES `routines` WRITE;
/*!40000 ALTER TABLE `routines` DISABLE KEYS */;
/*!40000 ALTER TABLE `routines` ENABLE KEYS */;
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
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`idTraining`,`idMesocycle`),
  KEY `fk_entrenamientos_users_idx` (`userId`),
  KEY `fk_idx` (`idMesocycle`),
  CONSTRAINT `fk_training_mesocycle` FOREIGN KEY (`idMesocycle`) REFERENCES `mesocycles` (`idMesocycle`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainings`
--

LOCK TABLES `trainings` WRITE;
/*!40000 ALTER TABLE `trainings` DISABLE KEYS */;
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
  `fullname` varchar(45) NOT NULL,
  `birthdate` date NOT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `mail` varchar(45) NOT NULL,
  `password` varchar(16) NOT NULL,
  `username` varchar(45) NOT NULL,
  `height` float NOT NULL,
  `weigth` float NOT NULL,
  PRIMARY KEY (`idUser`),
  UNIQUE KEY `birthdate_UNIQUE` (`birthdate`),
  UNIQUE KEY `mail_UNIQUE` (`mail`),
  UNIQUE KEY `password_UNIQUE` (`password`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
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

-- Dump completed on 2024-06-21 17:16:01
