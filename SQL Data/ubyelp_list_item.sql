-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ubyelp
-- ------------------------------------------------------
-- Server version	8.0.28

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
-- Table structure for table `list_item`
--

DROP TABLE IF EXISTS `list_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `list_item` (
  `list_item_id` int NOT NULL,
  `name` text NOT NULL,
  `desc` longtext,
  `rating` int DEFAULT NULL,
  `link` text,
  PRIMARY KEY (`list_item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `list_item`
--

LOCK TABLES `list_item` WRITE;
/*!40000 ALTER TABLE `list_item` DISABLE KEYS */;
INSERT INTO `list_item` VALUES (1,'3rd Apple Store','old apple store',1,'www.yelp.com/asfsdhkgdl'),(2,'Aple','local apple store',4,'www.yelp.com/hash'),(3,'Restaurant','food',5,'www.link.gov/pirate'),(4,'Slider\'s','test',5,'https://www.yelp.com/biz/sliders-burgers-san-jose?adjust_creative=KXoRDRuy2bZOLJnNzJ-JhQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=KXoRDRuy2bZOLJnNzJ-JhQ'),(5,'Jack in a Sewer','test',3,'https://www.yelp.com/biz/jack-in-the-box-san-jose-8?adjust_creative=KXoRDRuy2bZOLJnNzJ-JhQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=KXoRDRuy2bZOLJnNzJ-JhQ'),(6,'Jack in a Sewer','test',3,'https://www.yelp.com/biz/jack-in-the-box-san-jose-8?adjust_creative=KXoRDRuy2bZOLJnNzJ-JhQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=KXoRDRuy2bZOLJnNzJ-JhQ'),(7,'Bad entry','asdf',1,'www.link.com');
/*!40000 ALTER TABLE `list_item` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-04-21 18:26:00
