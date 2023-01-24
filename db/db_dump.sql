-- MySQL dump 10.13  Distrib 8.0.31, for Linux (x86_64)
--
-- Host: localhost    Database: wooberly_handyman_v_1_2_2
-- ------------------------------------------------------
-- Server version	8.0.31-0ubuntu0.22.04.1

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
-- Table structure for table `AdminPrivileges`
--

DROP TABLE IF EXISTS `AdminPrivileges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AdminPrivileges` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roleId` int NOT NULL,
  `previlegeId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roleId` (`roleId`),
  CONSTRAINT `AdminPrivileges_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `AdminRoles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AdminPrivileges`
--

LOCK TABLES `AdminPrivileges` WRITE;
/*!40000 ALTER TABLE `AdminPrivileges` DISABLE KEYS */;
/*!40000 ALTER TABLE `AdminPrivileges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AdminRoles`
--

DROP TABLE IF EXISTS `AdminRoles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AdminRoles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AdminRoles`
--

LOCK TABLES `AdminRoles` WRITE;
/*!40000 ALTER TABLE `AdminRoles` DISABLE KEYS */;
/*!40000 ALTER TABLE `AdminRoles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AdminUser`
--

DROP TABLE IF EXISTS `AdminUser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AdminUser` (
  `id` char(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `isSuperAdmin` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `roleId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `admin_user_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AdminUser`
--

LOCK TABLES `AdminUser` WRITE;
/*!40000 ALTER TABLE `AdminUser` DISABLE KEYS */;
INSERT INTO `AdminUser` VALUES ('cd1cc030-1bdc-11ea-9e8f-179abe411c92','admin@radicalstart.com','$2b$08$Hf8WeQ3Lz5htKmZpjq.aR.f1SXre4suv1H.xIF98VdZw5ez9qoTsm',1,'2019-12-11 06:09:33','2022-02-28 10:14:53',NULL);
/*!40000 ALTER TABLE `AdminUser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Booking`
--

DROP TABLE IF EXISTS `Booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Booking` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) NOT NULL,
  `partnerId` varchar(255) DEFAULT NULL,
  `orderId` int NOT NULL,
  `categoryId` int NOT NULL,
  `status` enum('created','declined','approved','arrived','reviewed','started','cancelledByUser','cancelledByPartner','completed','expired','scheduled') NOT NULL,
  `userLocation` varchar(255) DEFAULT NULL,
  `userLocationLat` float NOT NULL,
  `userLocationLng` float NOT NULL,
  `startLocation` varchar(255) NOT NULL,
  `startLat` float NOT NULL,
  `startLng` float NOT NULL,
  `startedAt` datetime DEFAULT NULL,
  `endLocation` varchar(255) NOT NULL,
  `endLat` float NOT NULL,
  `endLng` float NOT NULL,
  `completedAt` datetime DEFAULT NULL,
  `currency` varchar(255) NOT NULL DEFAULT 'USD',
  `pricingType` enum('fixed','hourly') NOT NULL,
  `travellingPrice` float DEFAULT '0',
  `discountAmount` float DEFAULT '0',
  `totalRideDistance` float DEFAULT '0',
  `estimatedTotalFare` float NOT NULL DEFAULT '0',
  `totalFare` float NOT NULL DEFAULT '0',
  `additionalFee` float NOT NULL DEFAULT '0',
  `userServiceFeeType` enum('fixed','percentage') NOT NULL DEFAULT 'percentage',
  `userServiceFeeValue` float NOT NULL DEFAULT '0',
  `partnerServiceFeeType` enum('fixed','percentage') NOT NULL DEFAULT 'percentage',
  `partnerServiceFeeValue` float NOT NULL DEFAULT '0',
  `userServiceFee` float NOT NULL DEFAULT '0',
  `partnerServiceFee` float NOT NULL DEFAULT '0',
  `userTotalFare` float NOT NULL DEFAULT '0',
  `partnerTotalFare` float NOT NULL DEFAULT '0',
  `paymentStatus` enum('pending','completed') NOT NULL DEFAULT 'pending',
  `paymentType` int NOT NULL DEFAULT '1',
  `transactionId` varchar(255) DEFAULT NULL,
  `isBanStatus` tinyint(1) NOT NULL DEFAULT '0',
  `isPayoutPaid` tinyint(1) NOT NULL DEFAULT '0',
  `reviewDescription` longtext,
  `additionalDescription` longtext,
  `tipsAmount` float DEFAULT '0',
  `notes` mediumtext,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `specialBookingFare` float DEFAULT '0',
  `isTipGiven` tinyint(1) DEFAULT '0',
  `tipsPartnerTotalFare` float DEFAULT '0',
  `tipsTotalFare` float DEFAULT '0',
  `userPayableFare` float DEFAULT '0',
  `bookingType` tinyint(1) DEFAULT '1',
  `isMailSent` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Booking`
--

LOCK TABLES `Booking` WRITE;
/*!40000 ALTER TABLE `Booking` DISABLE KEYS */;
/*!40000 ALTER TABLE `Booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BookingCancelReason`
--

DROP TABLE IF EXISTS `BookingCancelReason`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BookingCancelReason` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bookingId` int NOT NULL,
  `userId` char(36) NOT NULL,
  `partnerId` char(36) NOT NULL,
  `cancelStatus` enum('cancelledByPartner','cancelledByUser') DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BookingCancelReason`
--

LOCK TABLES `BookingCancelReason` WRITE;
/*!40000 ALTER TABLE `BookingCancelReason` DISABLE KEYS */;
/*!40000 ALTER TABLE `BookingCancelReason` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BookingHistory`
--

DROP TABLE IF EXISTS `BookingHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BookingHistory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bookingId` int NOT NULL,
  `userId` char(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `partnerId` char(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
  `status` enum('created','declined','approved','arrived','reviewed','started','cancelledByUser','cancelledByPartner','completed','expired','scheduled') NOT NULL,
  `pausedAt` datetime DEFAULT NULL,
  `resumedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BookingHistory`
--

LOCK TABLES `BookingHistory` WRITE;
/*!40000 ALTER TABLE `BookingHistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `BookingHistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BookingPromoCode`
--

DROP TABLE IF EXISTS `BookingPromoCode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BookingPromoCode` (
  `id` int NOT NULL AUTO_INCREMENT,
  `promoId` int NOT NULL,
  `bookingId` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `code` varchar(255) NOT NULL,
  `type` tinyint DEFAULT '1',
  `promoValue` float NOT NULL DEFAULT '0',
  `currency` varchar(255) DEFAULT NULL,
  `expiryDate` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BookingPromoCode`
--

LOCK TABLES `BookingPromoCode` WRITE;
/*!40000 ALTER TABLE `BookingPromoCode` DISABLE KEYS */;
/*!40000 ALTER TABLE `BookingPromoCode` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BookingReviewImage`
--

DROP TABLE IF EXISTS `BookingReviewImage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BookingReviewImage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderId` int NOT NULL,
  `imageName` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BookingReviewImage`
--

LOCK TABLES `BookingReviewImage` WRITE;
/*!40000 ALTER TABLE `BookingReviewImage` DISABLE KEYS */;
/*!40000 ALTER TABLE `BookingReviewImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BookingTips`
--

DROP TABLE IF EXISTS `BookingTips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BookingTips` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bookingId` int NOT NULL,
  `userId` char(36) NOT NULL,
  `partnerId` char(36) NOT NULL,
  `paymentType` int DEFAULT NULL,
  `amount` float NOT NULL,
  `userCurrency` varchar(255) NOT NULL,
  `partnerCurrency` varchar(255) NOT NULL,
  `transactionId` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BookingTips`
--

LOCK TABLES `BookingTips` WRITE;
/*!40000 ALTER TABLE `BookingTips` DISABLE KEYS */;
/*!40000 ALTER TABLE `BookingTips` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CancelReason`
--

DROP TABLE IF EXISTS `CancelReason`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CancelReason` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userType` int NOT NULL,
  `reason` varchar(255) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CancelReason`
--

LOCK TABLES `CancelReason` WRITE;
/*!40000 ALTER TABLE `CancelReason` DISABLE KEYS */;
/*!40000 ALTER TABLE `CancelReason` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CancelReasonList`
--

DROP TABLE IF EXISTS `CancelReasonList`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CancelReasonList` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reasonto` int NOT NULL,
  `reason` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CancelReasonList`
--

LOCK TABLES `CancelReasonList` WRITE;
/*!40000 ALTER TABLE `CancelReasonList` DISABLE KEYS */;
/*!40000 ALTER TABLE `CancelReasonList` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Category`
--

DROP TABLE IF EXISTS `Category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` mediumtext,
  `logoImage` varchar(255) DEFAULT NULL,
  `bannerImage` varchar(255) DEFAULT NULL,
  `isPopular` tinyint(1) NOT NULL DEFAULT '0',
  `isJobPhotoRequired` tinyint(1) NOT NULL DEFAULT '0',
  `userServiceFeeType` enum('fixed','percentage') NOT NULL DEFAULT 'percentage',
  `userServiceFeeValue` float NOT NULL DEFAULT '0',
  `partnerServiceFeeType` enum('fixed','percentage') NOT NULL DEFAULT 'percentage',
  `partnerServiceFeeValue` float NOT NULL DEFAULT '0',
  `pricingType` enum('fixed','hourly') NOT NULL DEFAULT 'fixed',
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `travellingPrice` float DEFAULT '0',
  `currency` varchar(255) NOT NULL DEFAULT 'USD',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Category`
--

LOCK TABLES `Category` WRITE;
/*!40000 ALTER TABLE `Category` DISABLE KEYS */;
INSERT INTO `Category` VALUES (1,'Electricians','Get help from professional electricians to plan, install and maintain electrical wiring systems across a wide variety of environments. We connect you with the best electricians in your locality. ','7dd99201b4ff3e7e1461582046fce33c.png','48ffab71590304b2b15749b9d67f3444.png',1,1,'percentage',10,'percentage',20,'hourly','active',5,'USD','2022-03-14 07:07:33','2022-03-15 14:08:23'),(2,'Plumbers','Get help from professional plumbers to fix a problem with the plumbing, which can range from a minor leaking tap to major piping problems. We connect you with the best plumbers in your locality. ','182415408c1083ee53414e027f42aee2.png','6e39fb0d56dcf8f2852c891269c440e9.png',1,1,'percentage',20,'percentage',10,'fixed','active',100,'USD','2022-03-14 07:09:35','2022-03-15 14:08:20'),(3,'Beauticians','Get help from professional beauticians to get beauty services from the comfort of your home without having to go to the salon. We connect you with the best beauticians in your locality. ','03038295db87f04bc7a7f66aef5d8704.png','292aedf660fcfbbb8e17ead6d5d49158.png',1,1,'percentage',30,'percentage',10,'fixed','active',100,'USD','2022-03-14 07:24:20','2022-03-15 14:08:16'),(4,'Cleaning ','Get help from professionals to clean your kitchen, sofas, mattresses, bathrooms, etc. We connect you with the best cleaning professionals in your locality. ','83f4bdf546a21372c42e3576a7ab6aaf.png','911f512bbedf78f8d34969286227761b.png',1,0,'percentage',2,'percentage',3,'fixed','active',5,'USD','2022-03-14 07:37:32','2022-03-15 14:08:14'),(5,'Painting','Get help from professional painters to paint your home with beautiful colors inside out. We connect you with the best painters in your locality. ','bc90bfb473c69c71fa54e1e522c26565.png','eafcf6f94e1dde33e1cb04ef46174ba4.png',1,1,'percentage',2,'percentage',2,'fixed','active',2,'USD','2022-03-15 06:43:31','2022-03-15 14:08:09'),(6,'Air Conditioning','Get help from AC service professionals to clean, repair, and install AC in your home. We connect you with the AC mechanics in your locality. ','d93682415d25b5496fbbc08bc633b21d.png','0e776d7653a30bfd440e84fb504125ed.png',1,1,'percentage',2,'percentage',2,'fixed','active',2,'USD','2022-03-15 07:36:59','2022-03-15 14:08:05'),(7,'Men Salon','Get help from professional stylists to get beauty services from the comfort of your home. We connect you with the best stylists in your locality. ','4f5ea8ee70484232f8add10aaf73ed6c.png','1e49a8d3f793d755df256fb5236d0ac6.png',1,1,'percentage',2,'percentage',2,'fixed','active',2,'USD','2022-03-15 07:37:46','2022-03-15 14:08:01'),(8,'Appliances repair','Get help from our service professionals to clean, install and repair appliances in your home. We connect you with the best service professionals in your locality. ','636f7bd0221779d60784617fd8415aac.png','1be527d8a942276d4779ebdcb16b1488.png',1,1,'percentage',2,'percentage',2,'hourly','active',2,'USD','2022-03-15 07:40:23','2022-03-15 14:07:55');
/*!40000 ALTER TABLE `Category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ContentPageDetails`
--

DROP TABLE IF EXISTS `ContentPageDetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ContentPageDetails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pageTitle` varchar(255) NOT NULL,
  `metaTitle` varchar(255) NOT NULL,
  `metaDescription` mediumtext NOT NULL,
  `pageUrl` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `isEnable` tinyint(1) NOT NULL DEFAULT '1',
  `pageBanner` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ContentPageDetails`
--

LOCK TABLES `ContentPageDetails` WRITE;
/*!40000 ALTER TABLE `ContentPageDetails` DISABLE KEYS */;
/*!40000 ALTER TABLE `ContentPageDetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Country`
--

DROP TABLE IF EXISTS `Country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Country` (
  `id` int NOT NULL AUTO_INCREMENT,
  `countryCode` varchar(255) NOT NULL,
  `countryName` varchar(255) NOT NULL,
  `isEnable` tinyint(1) NOT NULL DEFAULT '1',
  `dialCode` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=242 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Country`
--

LOCK TABLES `Country` WRITE;
/*!40000 ALTER TABLE `Country` DISABLE KEYS */;
INSERT INTO `Country` VALUES (1,'AF','Afghanistan',1,'+93','2019-10-08 10:01:44','2019-10-08 10:01:44'),(2,'AL','Albania',1,'+355','2019-10-08 10:01:44','2019-10-08 10:01:44'),(3,'DZ','Algeria',1,'+213','2019-10-08 10:01:44','2019-10-08 10:01:44'),(4,'AS','AmericanSamoa',1,'+1 684','2019-10-08 10:01:44','2019-10-08 10:01:44'),(5,'AD','Andorra',1,'+376','2019-10-08 10:01:44','2019-10-08 10:01:44'),(6,'AO','Angola',1,'+244','2019-10-08 10:01:44','2019-10-08 10:01:44'),(7,'AI','Anguilla',1,'+1 264','2019-10-08 10:01:44','2019-10-08 10:01:44'),(8,'AQ','Antarctica',1,'+672','2019-10-08 10:01:44','2019-10-08 10:01:44'),(9,'AG','Antigua and Barbuda',1,'+1268','2019-10-08 10:01:44','2019-10-08 10:01:44'),(10,'AR','Argentina',1,'+54','2019-10-08 10:01:44','2019-10-08 10:01:44'),(11,'AM','Armenia',1,'+374','2019-10-08 10:01:44','2019-10-08 10:01:44'),(12,'AW','Aruba',1,'+297','2019-10-08 10:01:44','2019-10-08 10:01:44'),(13,'AU','Australia',1,'+61','2019-10-08 10:01:44','2019-10-08 10:01:44'),(14,'AT','Austria',1,'+43','2019-10-08 10:01:44','2019-10-08 10:01:44'),(15,'AZ','Azerbaijan',1,'+994','2019-10-08 10:01:44','2019-10-08 10:01:44'),(16,'BS','Bahamas',1,'+1 242','2019-10-08 10:01:44','2019-10-08 10:01:44'),(17,'BH','Bahrain',1,'+973','2019-10-08 10:01:44','2019-10-08 10:01:44'),(18,'BD','Bangladesh',1,'+880','2019-10-08 10:01:44','2019-10-08 10:01:44'),(19,'BB','Barbados',1,'+1 246','2019-10-08 10:01:44','2019-10-08 10:01:44'),(20,'BY','Belarus',1,'+375','2019-10-08 10:01:44','2019-10-08 10:01:44'),(21,'BE','Belgium',1,'+32','2019-10-08 10:01:44','2019-10-08 10:01:44'),(22,'BZ','Belize',1,'+501','2019-10-08 10:01:44','2019-10-08 10:01:44'),(23,'BJ','Benin',1,'+229','2019-10-08 10:01:44','2019-10-08 10:01:44'),(24,'BM','Bermuda',1,'+1 441','2019-10-08 10:01:44','2019-10-08 10:01:44'),(25,'BT','Bhutan',1,'+975','2019-10-08 10:01:44','2019-10-08 10:01:44'),(26,'BO','Bolivia, Plurinational State of',1,'+591','2019-10-08 10:01:44','2019-10-08 10:01:44'),(27,'BA','Bosnia and Herzegovina',1,'+387','2019-10-08 10:01:44','2019-10-08 10:01:44'),(28,'BW','Botswana',1,'+267','2019-10-08 10:01:44','2019-10-08 10:01:44'),(29,'BR','Brazil',1,'+55','2019-10-08 10:01:44','2019-10-08 10:01:44'),(30,'IO','British Indian Ocean Territory',1,'+246','2019-10-08 10:01:44','2019-10-08 10:01:44'),(31,'BN','Brunei Darussalam',1,'+673','2019-10-08 10:01:44','2019-10-08 10:01:44'),(32,'BG','Bulgaria',1,'+359','2019-10-08 10:01:44','2019-10-08 10:01:44'),(33,'BF','Burkina Faso',1,'+226','2019-10-08 10:01:44','2019-10-08 10:01:44'),(34,'BI','Burundi',1,'+257','2019-10-08 10:01:44','2019-10-08 10:01:44'),(35,'KH','Cambodia',1,'+855','2019-10-08 10:01:44','2019-10-08 10:01:44'),(36,'CM','Cameroon',1,'+237','2019-10-08 10:01:44','2019-10-08 10:01:44'),(37,'CA','Canada',1,'+1','2019-10-08 10:01:44','2019-10-08 10:01:44'),(38,'CV','Cape Verde',1,'+238','2019-10-08 10:01:44','2019-10-08 10:01:44'),(39,'KY','Cayman Islands',1,'+ 345','2019-10-08 10:01:44','2019-10-08 10:01:44'),(40,'CF','Central African Republic',1,'+236','2019-10-08 10:01:44','2019-10-08 10:01:44'),(41,'TD','Chad',1,'+235','2019-10-08 10:01:44','2019-10-08 10:01:44'),(42,'CL','Chile',1,'+56','2019-10-08 10:01:44','2019-10-08 10:01:44'),(43,'CN','China',1,'+86','2019-10-08 10:01:44','2019-10-08 10:01:44'),(44,'CX','Christmas Island',1,'+61','2019-10-08 10:01:44','2019-10-08 10:01:44'),(45,'CC','Cocos (Keeling) Islands',1,'+61','2019-10-08 10:01:44','2019-10-08 10:01:44'),(46,'CO','Colombia',1,'+57','2019-10-08 10:01:44','2019-10-08 10:01:44'),(47,'KM','Comoros',1,'+269','2019-10-08 10:01:44','2019-10-08 10:01:44'),(48,'CG','Congo',1,'+242','2019-10-08 10:01:44','2019-10-08 10:01:44'),(49,'CD','Congo, The Democratic Republic of the',1,'+243','2019-10-08 10:01:44','2019-10-08 10:01:44'),(50,'CK','Cook Islands',1,'+682','2019-10-08 10:01:44','2019-10-08 10:01:44'),(51,'CR','Costa Rica',1,'+506','2019-10-08 10:01:44','2019-10-08 10:01:44'),(52,'CI','Cote d\'Ivoire',1,'+225','2019-10-08 10:01:44','2019-10-08 10:01:44'),(53,'HR','Croatia',1,'+385','2019-10-08 10:01:44','2019-10-08 10:01:44'),(54,'CU','Cuba',1,'+53','2019-10-08 10:01:44','2019-10-08 10:01:44'),(55,'CY','Cyprus',1,'+537','2019-10-08 10:01:44','2019-10-08 10:01:44'),(56,'CZ','Czech Republic',1,'+420','2019-10-08 10:01:44','2019-10-08 10:01:44'),(57,'DK','Denmark',1,'+45','2019-10-08 10:01:44','2019-10-08 10:01:44'),(58,'DJ','Djibouti',1,'+253','2019-10-08 10:01:44','2019-10-08 10:01:44'),(59,'DM','Dominica',1,'+1 767','2019-10-08 10:01:44','2019-10-08 10:01:44'),(60,'DO','Dominican Republic',1,'+1 849','2019-10-08 10:01:44','2019-10-08 10:01:44'),(61,'EC','Ecuador',1,'+593','2019-10-08 10:01:44','2019-10-08 10:01:44'),(62,'EG','Egypt',1,'+20','2019-10-08 10:01:44','2019-10-08 10:01:44'),(63,'SV','El Salvador',1,'+503','2019-10-08 10:01:44','2019-10-08 10:01:44'),(64,'GQ','Equatorial Guinea',1,'+240','2019-10-08 10:01:44','2019-10-08 10:01:44'),(65,'ER','Eritrea',1,'+291','2019-10-08 10:01:44','2019-10-08 10:01:44'),(66,'EE','Estonia',1,'+372','2019-10-08 10:01:44','2019-10-08 10:01:44'),(67,'ET','Ethiopia',1,'+251','2019-10-08 10:01:44','2019-10-08 10:01:44'),(68,'FK','Falkland Islands (Malvinas)',1,'+500','2019-10-08 10:01:44','2019-10-08 10:01:44'),(69,'FO','Faroe Islands',1,'+298','2019-10-08 10:01:44','2019-10-08 10:01:44'),(70,'FJ','Fiji',1,'+679','2019-10-08 10:01:44','2019-10-08 10:01:44'),(71,'FI','Finland',1,'+358','2019-10-08 10:01:44','2019-10-08 10:01:44'),(72,'FR','France',1,'+33','2019-10-08 10:01:44','2019-10-08 10:01:44'),(73,'GF','French Guiana',1,'+594','2019-10-08 10:01:44','2019-10-08 10:01:44'),(74,'PF','French Polynesia',1,'+689','2019-10-08 10:01:44','2019-10-08 10:01:44'),(75,'GA','Gabon',1,'+241','2019-10-08 10:01:44','2019-10-08 10:01:44'),(76,'GM','Gambia',1,'+220','2019-10-08 10:01:44','2019-10-08 10:01:44'),(77,'GE','Georgia',1,'+995','2019-10-08 10:01:44','2019-10-08 10:01:44'),(78,'DE','Germany',1,'+49','2019-10-08 10:01:44','2019-10-08 10:01:44'),(79,'GH','Ghana',1,'+233','2019-10-08 10:01:44','2019-10-08 10:01:44'),(80,'GI','Gibraltar',1,'+350','2019-10-08 10:01:44','2019-10-08 10:01:44'),(81,'GR','Greece',1,'+30','2019-10-08 10:01:44','2019-10-08 10:01:44'),(82,'GL','Greenland',1,'+299','2019-10-08 10:01:44','2019-10-08 10:01:44'),(83,'GD','Grenada',1,'+1 473','2019-10-08 10:01:44','2019-10-08 10:01:44'),(84,'GP','Guadeloupe',1,'+590','2019-10-08 10:01:44','2019-10-08 10:01:44'),(85,'GU','Guam',1,'+1 671','2019-10-08 10:01:44','2019-10-08 10:01:44'),(86,'GT','Guatemala',1,'+502','2019-10-08 10:01:44','2019-10-08 10:01:44'),(87,'GG','Guernsey',1,'+44','2019-10-08 10:01:44','2019-10-08 10:01:44'),(88,'GN','Guinea',1,'+224','2019-10-08 10:01:44','2019-10-08 10:01:44'),(89,'GW','Guinea-Bissau',1,'+245','2019-10-08 10:01:44','2019-10-08 10:01:44'),(90,'GY','Guyana',1,'+595','2019-10-08 10:01:44','2019-10-08 10:01:44'),(91,'HT','Haiti',1,'+509','2019-10-08 10:01:44','2019-10-08 10:01:44'),(92,'VA','Holy See (Vatican City State)',1,'+379','2019-10-08 10:01:44','2019-10-08 10:01:44'),(93,'HN','Honduras',1,'+504','2019-10-08 10:01:44','2019-10-08 10:01:44'),(94,'HK','Hong Kong',1,'+852','2019-10-08 10:01:44','2019-10-08 10:01:44'),(95,'HU','Hungary',1,'+36','2019-10-08 10:01:44','2019-10-08 10:01:44'),(96,'IS','Iceland',1,'+354','2019-10-08 10:01:44','2019-10-08 10:01:44'),(97,'IN','India',1,'+91','2019-10-08 10:01:44','2019-10-08 10:01:44'),(98,'ID','Indonesia',1,'+62','2019-10-08 10:01:44','2019-10-08 10:01:44'),(99,'IR','Iran, Islamic Republic of',1,'+98','2019-10-08 10:01:44','2019-10-08 10:01:44'),(100,'IQ','Iraq',1,'+964','2019-10-08 10:01:44','2019-10-08 10:01:44'),(101,'IE','Ireland',1,'+353','2019-10-08 10:01:44','2019-10-08 10:01:44'),(102,'IM','Isle of Man',1,'+44','2019-10-08 10:01:44','2019-10-08 10:01:44'),(103,'IL','Israel',1,'+972','2019-10-08 10:01:44','2019-10-08 10:01:44'),(104,'IT','Italy',1,'+39','2019-10-08 10:01:44','2019-10-08 10:01:44'),(105,'JM','Jamaica',1,'+1 876','2019-10-08 10:01:44','2019-10-08 10:01:44'),(106,'JP','Japan',1,'+81','2019-10-08 10:01:44','2019-10-08 10:01:44'),(107,'JE','Jersey',1,'+44','2019-10-08 10:01:44','2019-10-08 10:01:44'),(108,'JO','Jordan',1,'+962','2019-10-08 10:01:44','2019-10-08 10:01:44'),(109,'KZ','Kazakhstan',1,'+7 7','2019-10-08 10:01:44','2019-10-08 10:01:44'),(110,'KE','Kenya',1,'+254','2019-10-08 10:01:44','2019-10-08 10:01:44'),(111,'KI','Kiribati',1,'+686','2019-10-08 10:01:44','2019-10-08 10:01:44'),(112,'KP','Korea, Democratic People\'s Republic of',1,'+850','2019-10-08 10:01:44','2019-10-08 10:01:44'),(113,'KR','Korea, Republic of',1,'+82','2019-10-08 10:01:44','2019-10-08 10:01:44'),(114,'KW','Kuwait',1,'+965','2019-10-08 10:01:44','2019-10-08 10:01:44'),(115,'KG','Kyrgyzstan',1,'+996','2019-10-08 10:01:44','2019-10-08 10:01:44'),(116,'LA','Lao People\'s Democratic Republic',1,'+856','2019-10-08 10:01:44','2019-10-08 10:01:44'),(117,'LV','Latvia',1,'+371','2019-10-08 10:01:44','2019-10-08 10:01:44'),(118,'LB','Lebanon',1,'+961','2019-10-08 10:01:44','2019-10-08 10:01:44'),(119,'LS','Lesotho',1,'+266','2019-10-08 10:01:44','2019-10-08 10:01:44'),(120,'LR','Liberia',1,'+231','2019-10-08 10:01:44','2019-10-08 10:01:44'),(121,'LY','Libyan Arab Jamahiriya',1,'+218','2019-10-08 10:01:44','2019-10-08 10:01:44'),(122,'LI','Liechtenstein',1,'+423','2019-10-08 10:01:44','2019-10-08 10:01:44'),(123,'LT','Lithuania',1,'+370','2019-10-08 10:01:44','2019-10-08 10:01:44'),(124,'LU','Luxembourg',1,'+352','2019-10-08 10:01:44','2019-10-08 10:01:44'),(125,'MO','Macao',1,'+853','2019-10-08 10:01:44','2019-10-08 10:01:44'),(126,'MK','Macedonia, The Former Yugoslav Republic of',1,'+389','2019-10-08 10:01:44','2019-10-08 10:01:44'),(127,'MG','Madagascar',1,'+261','2019-10-08 10:01:44','2019-10-08 10:01:44'),(128,'MW','Malawi',1,'+265','2019-10-08 10:01:44','2019-10-08 10:01:44'),(129,'MY','Malaysia',1,'+60','2019-10-08 10:01:44','2019-10-08 10:01:44'),(130,'MV','Maldives',1,'+960','2019-10-08 10:01:44','2019-10-08 10:01:44'),(131,'ML','Mali',1,'+223','2019-10-08 10:01:44','2019-10-08 10:01:44'),(132,'MT','Malta',1,'+356','2019-10-08 10:01:44','2019-10-08 10:01:44'),(133,'MH','Marshall Islands',1,'+692','2019-10-08 10:01:44','2019-10-08 10:01:44'),(134,'MQ','Martinique',1,'+596','2019-10-08 10:01:44','2019-10-08 10:01:44'),(135,'MR','Mauritania',1,'+222','2019-10-08 10:01:44','2019-10-08 10:01:44'),(136,'MU','Mauritius',1,'+230','2019-10-08 10:01:44','2019-10-08 10:01:44'),(137,'YT','Mayotte',1,'+262','2019-10-08 10:01:44','2019-10-08 10:01:44'),(138,'MX','Mexico',1,'+52','2019-10-08 10:01:44','2019-10-08 10:01:44'),(139,'FM','Micronesia, Federated States of',1,'+691','2019-10-08 10:01:44','2019-10-08 10:01:44'),(140,'MD','Moldova, Republic of',1,'+373','2019-10-08 10:01:44','2019-10-08 10:01:44'),(141,'MC','Monaco',1,'+377','2019-10-08 10:01:44','2019-10-08 10:01:44'),(142,'MN','Mongolia',1,'+976','2019-10-08 10:01:44','2019-10-08 10:01:44'),(143,'ME','Montenegro',1,'+382','2019-10-08 10:01:44','2019-10-08 10:01:44'),(144,'MS','Montserrat',1,'+1664','2019-10-08 10:01:44','2019-10-08 10:01:44'),(145,'MA','Morocco',1,'+212','2019-10-08 10:01:44','2019-10-08 10:01:44'),(146,'MZ','Mozambique',1,'+258','2019-10-08 10:01:44','2019-10-08 10:01:44'),(147,'MM','Myanmar',1,'+95','2019-10-08 10:01:44','2019-10-08 10:01:44'),(148,'NA','Namibia',1,'+264','2019-10-08 10:01:44','2019-10-08 10:01:44'),(149,'NR','Nauru',1,'+674','2019-10-08 10:01:44','2019-10-08 10:01:44'),(150,'NP','Nepal',1,'+977','2019-10-08 10:01:44','2019-10-08 10:01:44'),(151,'NL','Netherlands',1,'+31','2019-10-08 10:01:44','2019-10-08 10:01:44'),(152,'AN','Netherlands Antilles',1,'+599','2019-10-08 10:01:44','2019-10-08 10:01:44'),(153,'NC','New Caledonia',1,'+687','2019-10-08 10:01:44','2019-10-08 10:01:44'),(154,'NZ','New Zealand',1,'+64','2019-10-08 10:01:44','2019-10-08 10:01:44'),(155,'NI','Nicaragua',1,'+505','2019-10-08 10:01:44','2019-10-08 10:01:44'),(156,'NE','Niger',1,'+227','2019-10-08 10:01:44','2019-10-08 10:01:44'),(157,'NG','Nigeria',1,'+234','2019-10-08 10:01:44','2019-10-08 10:01:44'),(158,'NU','Niue',1,'+683','2019-10-08 10:01:44','2019-10-08 10:01:44'),(159,'NF','Norfolk Island',1,'+672','2019-10-08 10:01:44','2019-10-08 10:01:44'),(160,'NO','Norway',1,'+47','2019-10-08 10:01:44','2019-10-08 10:01:44'),(161,'OM','Oman',1,'+968','2019-10-08 10:01:44','2019-10-08 10:01:44'),(162,'MP','Northern Mariana Islands',1,'+1 670','2019-10-08 10:01:44','2019-10-08 10:01:44'),(163,'PK','Pakistan',1,'+92','2019-10-08 10:01:44','2019-10-08 10:01:44'),(164,'PW','Palau',1,'+680','2019-10-08 10:01:44','2019-10-08 10:01:44'),(165,'PS','Palestinian Territory, Occupied',1,'+970','2019-10-08 10:01:44','2019-10-08 10:01:44'),(166,'PA','Panama',1,'+507','2019-10-08 10:01:44','2019-10-08 10:01:44'),(167,'PG','Papua New Guinea',1,'+675','2019-10-08 10:01:44','2019-10-08 10:01:44'),(168,'PY','Paraguay',1,'+595','2019-10-08 10:01:44','2019-10-08 10:01:44'),(169,'PE','Peru',1,'+51','2019-10-08 10:01:44','2019-10-08 10:01:44'),(170,'PH','Philippines',1,'+63','2019-10-08 10:01:44','2019-10-08 10:01:44'),(171,'PN','Pitcairn',1,'+872','2019-10-08 10:01:44','2019-10-08 10:01:44'),(172,'PL','Poland',1,'+48','2019-10-08 10:01:44','2019-10-08 10:01:44'),(173,'PT','Portugal',1,'+351','2019-10-08 10:01:44','2019-10-08 10:01:44'),(174,'PR','Puerto Rico',1,'+1 939','2019-10-08 10:01:44','2019-10-08 10:01:44'),(175,'QA','Qatar',1,'+974','2019-10-08 10:01:44','2019-10-08 10:01:44'),(176,'RO','Romania',1,'+40','2019-10-08 10:01:44','2019-10-08 10:01:44'),(177,'RU','Russia',1,'+7','2019-10-08 10:01:44','2019-10-08 10:01:44'),(178,'RW','Rwanda',1,'+250','2019-10-08 10:01:44','2019-10-08 10:01:44'),(179,'RE','R√©union',1,'+262','2019-10-08 10:01:44','2019-10-08 10:01:44'),(180,'BL','Saint Barth√©lemy',1,'+590','2019-10-08 10:01:44','2019-10-08 10:01:44'),(181,'SH','Saint Helena, Ascension and Tristan Da Cunha',1,'+290','2019-10-08 10:01:44','2019-10-08 10:01:44'),(182,'KN','Saint Kitts and Nevis',1,'+1 869','2019-10-08 10:01:44','2019-10-08 10:01:44'),(183,'LC','Saint Lucia',1,'+1 758','2019-10-08 10:01:44','2019-10-08 10:01:44'),(184,'MF','Saint Martin',1,'+590','2019-10-08 10:01:44','2019-10-08 10:01:44'),(185,'PM','Saint Pierre and Miquelon',1,'+508','2019-10-08 10:01:44','2019-10-08 10:01:44'),(186,'VC','Saint Vincent and the Grenadines',1,'+1 784','2019-10-08 10:01:44','2019-10-08 10:01:44'),(187,'WS','Samoa',1,'+685','2019-10-08 10:01:44','2019-10-08 10:01:44'),(188,'SM','San Marino',1,'+378','2019-10-08 10:01:44','2019-10-08 10:01:44'),(189,'ST','Sao Tome and Principe',1,'+239','2019-10-08 10:01:44','2019-10-08 10:01:44'),(190,'SA','Saudi Arabia',1,'+966','2019-10-08 10:01:44','2019-10-08 10:01:44'),(191,'SN','Senegal',1,'+221','2019-10-08 10:01:44','2019-10-08 10:01:44'),(192,'RS','Serbia',1,'+381','2019-10-08 10:01:44','2019-10-08 10:01:44'),(193,'SC','Seychelles',1,'+248','2019-10-08 10:01:44','2019-10-08 10:01:44'),(194,'SL','Sierra Leone',1,'+232','2019-10-08 10:01:44','2019-10-08 10:01:44'),(195,'SG','Singapore',1,'+65','2019-10-08 10:01:44','2019-10-08 10:01:44'),(196,'SK','Slovakia',1,'+421','2019-10-08 10:01:44','2019-10-08 10:01:44'),(197,'SI','Slovenia',1,'+386','2019-10-08 10:01:44','2019-10-08 10:01:44'),(198,'SB','Solomon Islands',1,'+677','2019-10-08 10:01:44','2019-10-08 10:01:44'),(199,'SO','Somalia',1,'+252','2019-10-08 10:01:44','2019-10-08 10:01:44'),(200,'ZA','South Africa',1,'+27','2019-10-08 10:01:44','2019-10-08 10:01:44'),(201,'GS','South Georgia and the South Sandwich Islands',1,'+500','2019-10-08 10:01:44','2019-10-08 10:01:44'),(202,'ES','Spain',1,'+34','2019-10-08 10:01:44','2019-10-08 10:01:44'),(203,'LK','Sri Lanka',1,'+94','2019-10-08 10:01:44','2019-10-08 10:01:44'),(204,'SD','Sudan',1,'+249','2019-10-08 10:01:44','2019-10-08 10:01:44'),(205,'SR','Suriname',1,'+597','2019-10-08 10:01:44','2019-10-08 10:01:44'),(206,'SJ','Svalbard and Jan Mayen',1,'+47','2019-10-08 10:01:44','2019-10-08 10:01:44'),(207,'SZ','Swaziland',1,'+268','2019-10-08 10:01:44','2019-10-08 10:01:44'),(208,'SE','Sweden',1,'+46','2019-10-08 10:01:44','2019-10-08 10:01:44'),(209,'CH','Switzerland',1,'+41','2019-10-08 10:01:44','2019-10-08 10:01:44'),(210,'SY','Syrian Arab Republic',1,'+963','2019-10-08 10:01:44','2019-10-08 10:01:44'),(211,'TW','Taiwan, Province of China',1,'+886','2019-10-08 10:01:44','2019-10-08 10:01:44'),(212,'TJ','Tajikistan',1,'+992','2019-10-08 10:01:44','2019-10-08 10:01:44'),(213,'TZ','Tanzania, United Republic of',1,'+255','2019-10-08 10:01:44','2019-10-08 10:01:44'),(214,'TH','Thailand',1,'+66','2019-10-08 10:01:44','2019-10-08 10:01:44'),(215,'TL','Timor-Leste',1,'+670','2019-10-08 10:01:44','2019-10-08 10:01:44'),(216,'TG','Togo',1,'+228','2019-10-08 10:01:44','2019-10-08 10:01:44'),(217,'TK','Tokelau',1,'+690','2019-10-08 10:01:44','2019-10-08 10:01:44'),(218,'TO','Tonga',1,'+676','2019-10-08 10:01:44','2019-10-08 10:01:44'),(219,'TT','Trinidad and Tobago',1,'+1 868','2019-10-08 10:01:44','2019-10-08 10:01:44'),(220,'TN','Tunisia',1,'+216','2019-10-08 10:01:44','2019-10-08 10:01:44'),(221,'TR','Turkey',1,'+90','2019-10-08 10:01:44','2019-10-08 10:01:44'),(222,'TM','Turkmenistan',1,'+993','2019-10-08 10:01:44','2019-10-08 10:01:44'),(223,'TC','Turks and Caicos Islands',1,'+1 649','2019-10-08 10:01:44','2019-10-08 10:01:44'),(224,'TV','Tuvalu',1,'+688','2019-10-08 10:01:44','2019-10-08 10:01:44'),(225,'UG','Uganda',1,'+256','2019-10-08 10:01:44','2019-10-08 10:01:44'),(226,'UA','Ukraine',1,'+380','2019-10-08 10:01:44','2019-10-08 10:01:44'),(227,'AE','United Arab Emirates',1,'+971','2019-10-08 10:01:44','2019-10-08 10:01:44'),(228,'GB','United Kingdom',1,'+44','2019-10-08 10:01:44','2019-10-08 10:01:44'),(229,'US','United States',1,'+1','2019-10-08 10:01:44','2019-10-08 10:01:44'),(230,'UY','Uruguay',1,'+598','2019-10-08 10:01:44','2019-10-08 10:01:44'),(231,'UZ','Uzbekistan',1,'+998','2019-10-08 10:01:44','2019-10-08 10:01:44'),(232,'VU','Vanuatu',1,'+678','2019-10-08 10:01:44','2019-10-08 10:01:44'),(233,'VE','Venezuela, Bolivarian Republic of',1,'+58','2019-10-08 10:01:44','2019-10-08 10:01:44'),(234,'VN','Viet Nam',1,'+84','2019-10-08 10:01:44','2019-10-08 10:01:44'),(235,'VG','Virgin Islands, British',1,'+1 284','2019-10-08 10:01:44','2019-10-08 10:01:44'),(236,'VI','Virgin Islands, U.S.',1,'+1 340','2019-10-08 10:01:44','2019-10-08 10:01:44'),(237,'WF','Wallis and Futuna',1,'+681','2019-10-08 10:01:44','2019-10-08 10:01:44'),(238,'YE','Yemen',1,'+967','2019-10-08 10:01:44','2019-10-08 10:01:44'),(239,'ZM','Zambia',1,'+260','2019-10-08 10:01:44','2019-10-08 10:01:44'),(240,'ZW','Zimbabwe',1,'+263','2019-10-08 10:01:44','2019-10-08 10:01:44'),(241,'AX','√Öland Islands',1,'+358','2019-10-08 10:01:44','2019-10-08 10:01:44');
/*!40000 ALTER TABLE `Country` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Currencies`
--

DROP TABLE IF EXISTS `Currencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Currencies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `symbol` varchar(255) NOT NULL,
  `isEnable` tinyint(1) NOT NULL DEFAULT '1',
  `isBaseCurrency` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=179 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Currencies`
--

LOCK TABLES `Currencies` WRITE;
/*!40000 ALTER TABLE `Currencies` DISABLE KEYS */;
INSERT INTO `Currencies` VALUES (1,'BRL',0,0,'2019-10-08 10:01:44','2022-02-15 08:49:27'),(2,'AUD',1,0,'2019-10-08 10:01:44','2022-02-28 07:50:32'),(3,'CAD',1,0,'2019-10-08 10:01:44','2022-03-15 11:11:15'),(4,'BGN',0,0,'2019-10-08 10:01:44','2022-02-15 08:43:57'),(5,'CHF',1,0,'2019-10-08 10:01:44','2022-02-15 08:48:35'),(6,'CNY',0,0,'2019-10-08 10:01:44','2022-02-15 08:49:41'),(7,'CZK',1,0,'2019-10-08 10:01:44','2020-04-01 07:22:12'),(8,'DKK',1,0,'2019-10-08 10:01:44','2020-04-01 07:22:12'),(9,'EUR',1,0,'2019-10-08 10:01:44','2022-03-10 13:01:47'),(10,'GBP',1,0,'2019-10-08 10:01:44','2022-02-22 07:20:52'),(11,'HKD',1,0,'2019-10-08 10:01:44','2020-04-01 07:22:12'),(12,'HRK',0,0,'2019-10-08 10:01:44','2022-02-15 08:49:32'),(13,'HUF',1,0,'2019-10-08 10:01:44','2020-04-01 07:22:12'),(14,'IDR',1,0,'2019-10-08 10:01:44','2020-04-01 07:22:12'),(15,'ILS',1,0,'2019-10-08 10:01:44','2020-04-01 07:22:12'),(16,'INR',1,0,'2019-10-08 10:01:44','2020-07-06 06:24:06'),(17,'JPY',1,0,'2019-10-08 10:01:44','2020-04-01 07:22:12'),(18,'KRW',1,0,'2019-10-08 10:01:44','2020-04-01 07:22:12'),(19,'MXN',1,0,'2019-10-08 10:01:44','2020-04-01 07:22:12'),(20,'MYR',1,0,'2019-10-08 10:01:44','2020-04-01 07:22:12'),(21,'NOK',1,0,'2019-10-08 10:01:44','2020-04-01 07:22:12'),(22,'NZD',1,0,'2019-10-08 10:01:44','2020-04-01 07:22:12'),(23,'PHP',0,0,'2019-10-08 10:01:44','2022-02-17 07:13:48'),(24,'PLN',1,0,'2019-10-08 10:01:44','2022-02-22 07:19:48'),(25,'RON',1,0,'2019-10-08 10:01:44','2020-04-01 07:22:12'),(26,'RUB',0,0,'2019-10-08 10:01:44','2022-02-15 08:49:21'),(27,'SEK',1,0,'2019-10-08 10:01:44','2020-04-01 07:22:12'),(28,'SGD',1,0,'2019-10-08 10:01:44','2020-04-01 07:22:12'),(29,'THB',1,0,'2019-10-08 10:01:44','2020-04-01 07:22:12'),(30,'TRY',1,0,'2019-10-08 10:01:44','2022-02-15 08:44:52'),(31,'USD',1,0,'2019-10-08 10:01:44','2022-11-28 05:21:20'),(32,'ZAR',0,0,'2019-10-08 10:01:44','2022-02-15 08:49:15'),(40,'Cent',0,0,'2022-02-17 07:16:49','2022-02-17 07:18:48'),(43,'NPK',1,0,'2022-02-22 07:29:02','2022-02-22 07:29:02'),(46,'AFN',1,0,'2022-03-09 09:59:23','2022-03-16 12:17:15'),(47,'CRC',1,0,'2022-03-09 09:59:43','2022-03-16 09:51:38'),(48,'AED',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(49,'ALL',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(50,'AMD',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(51,'ANG',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(52,'AOA',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(53,'ARS',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(54,'AWG',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(55,'AZN',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(56,'BAM',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(57,'BBD',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(58,'BDT',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(59,'BHD',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(60,'BIF',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(61,'BMD',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(62,'BND',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(63,'BOB',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(64,'BSD',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(65,'BTN',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(66,'BWP',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(67,'BYN',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(68,'BYR',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(69,'BZD',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(70,'CDF',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(71,'CLF',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(72,'CLP',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(73,'CNH',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(74,'COP',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(75,'CUC',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(76,'CVE',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(77,'DJF',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(78,'DOP',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(79,'DZD',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(80,'EGP',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(81,'ETB',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(82,'FJD',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(83,'FKP',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(84,'GBX',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(85,'GEL',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(86,'GGP',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(87,'GHS',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(88,'GIP',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(89,'GMD',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(90,'GNF',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(91,'GTQ',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(92,'GYD',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(93,'HNL',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(94,'HTG',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(95,'IMP',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(96,'IQD',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(97,'ISK',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(98,'JEP',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(99,'JMD',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(100,'JOD',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(101,'KES',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(102,'KGS',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(103,'KHR',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(104,'KMF',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(105,'KWD',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(106,'KYD',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(107,'KZT',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(108,'LAK',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(109,'LBP',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(110,'LKR',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(111,'LRD',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(112,'LSL',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(113,'LTL',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(114,'LYD',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(115,'MAD',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(116,'MDL',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(117,'MGA',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(118,'MKD',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(119,'MMK',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(120,'MNT',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(121,'MOP',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(122,'MUR',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(123,'MVR',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(124,'MWK',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(125,'MZN',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(126,'NAD',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(127,'NGN',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(128,'NIO',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(129,'NPR',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(130,'OMR',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(131,'PAB',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(132,'PEN',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(133,'PGK',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(134,'PKR',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(135,'PYG',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(136,'QAR',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(137,'RSD',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(138,'RWF',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(139,'SAR',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(140,'SBD',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(141,'SCR',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(142,'SHP',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(143,'SLL',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(144,'SRD',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(145,'SSP',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(146,'STD',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(147,'SVC',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(148,'SZL',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(149,'TJS',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(150,'TMT',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(151,'TND',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(152,'TOP',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(153,'TTD',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(154,'TWD',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(155,'TZS',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(156,'UAH',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(157,'UGX',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(158,'UYU',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(159,'UZS',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(160,'VEF',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(161,'VES',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(162,'VND',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(163,'VUV',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(164,'WST',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(165,'XAF',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(166,'XAG',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(167,'XAU',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(168,'XCD',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(169,'XDR',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(170,'XOF',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(171,'XPD',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(172,'XPF',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(173,'XPT',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(174,'XTS',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(175,'YER',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(176,'ZMW',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(177,'ZWD',1,0,'2022-11-28 05:20:55','2022-11-28 05:20:55'),(178,'ZWL',1,1,'2022-11-28 05:20:55','2022-11-28 05:21:42');
/*!40000 ALTER TABLE `Currencies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CurrencyRates`
--

DROP TABLE IF EXISTS `CurrencyRates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CurrencyRates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `currencyCode` varchar(255) NOT NULL,
  `rate` float NOT NULL,
  `isBase` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1219 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CurrencyRates`
--

LOCK TABLES `CurrencyRates` WRITE;
/*!40000 ALTER TABLE `CurrencyRates` DISABLE KEYS */;
INSERT INTO `CurrencyRates` VALUES (1,'AED',0.0114071,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(2,'AFN',0.278212,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(3,'ALL',0.350387,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(4,'AMD',1.22673,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(5,'ANG',0.00561611,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(6,'AOA',1.58951,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(7,'ARS',0.514897,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(8,'AWG',0.00558989,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(9,'AZN',0.0052795,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(10,'BAM',0.00586991,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(11,'BBD',0.00629636,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(12,'BDT',0.317602,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(13,'BGN',0.00584177,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(14,'BHD',0.00117647,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(15,'BIF',6.45384,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(16,'BMD',0.00310559,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(17,'BND',0.00429053,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(18,'BOB',0.0215308,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(19,'BRL',0.0168028,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(20,'BSD',0.00311832,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(21,'BTN',0.25454,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(22,'BWP',0.0402367,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(23,'BYN',0.00786045,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(24,'BYR',78.6045,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(25,'BZD',0.00628197,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(26,'CAD',0.00417627,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(27,'CDF',6.40724,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(28,'CHF',0.00293826,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(29,'CLF',0.000103797,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(30,'CLP',2.87555,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(31,'CNY',0.022373,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(32,'COP',15.2985,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(33,'CRC',1.89198,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(34,'CUC',0.00310559,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(35,'CVE',0.330935,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(36,'CZK',0.0730453,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(37,'DJF',0.555144,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(38,'DKK',0.0223054,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(39,'DOP',0.170292,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(40,'DZD',0.431889,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(41,'EGP',0.076637,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(42,'ETB',0.166613,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(43,'EUR',0.00299801,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(44,'FJD',0.00687696,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(45,'FKP',0.00257579,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(46,'GBP',0.00257579,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(47,'GEL',0.00847826,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(48,'GHS',0.0452157,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(49,'GIP',0.00257579,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(50,'GMD',0.182682,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(51,'GNF',26.865,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(52,'GTQ',0.0243396,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(53,'GYD',0.651025,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(54,'HKD',0.0242782,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(55,'HNL',0.0770178,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(56,'HRK',0.0226409,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(57,'HTG',0.42868,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(58,'HUF',1.22805,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(59,'IDR',48.8162,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(60,'ILS',0.0106434,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(61,'INR',0.25373,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(62,'IQD',4.55117,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(63,'ISK',0.43941,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(64,'JMD',0.480428,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(65,'JOD',0.00220186,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(66,'JPY',0.429866,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(67,'KES',0.379658,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(68,'KGS',0.261097,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(69,'KHR',12.8863,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(70,'KMF',1.47081,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(71,'KRW',4.1602,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(72,'KWD',0.000955,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(73,'KYD',0.00259703,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(74,'KZT',1.45134,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(75,'LAK',54.1299,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(76,'LBP',4.71559,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(77,'LKR',1.14596,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(78,'LRD',0.478261,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(79,'LSL',0.0534475,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(80,'LYD',0.0152153,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(81,'MAD',0.03329,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(82,'MDL',0.0598639,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(83,'MGA',13.5304,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(84,'MKD',0.184869,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(85,'MMK',6.54773,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(86,'MNT',10.5806,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(87,'MOP',0.0251007,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(88,'MUR',0.135488,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(89,'MVR',0.047764,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(90,'MWK',3.20032,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(91,'MXN',0.0601113,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(92,'MYR',0.013913,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(93,'MZN',0.198271,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(94,'NAD',0.052764,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(95,'NGN',1.37976,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(96,'NIO',0.112222,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(97,'NOK',0.0308916,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(98,'NPR',0.407194,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(99,'NZD',0.00500393,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(100,'OMR',0.00120154,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(101,'PAB',0.00311829,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(102,'PEN',0.0120191,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(103,'PGK',0.0109877,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(104,'PHP',0.176287,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(105,'PKR',0.699916,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(106,'PLN',0.0140804,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(107,'PYG',22.4717,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(108,'QAR',0.0113075,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(109,'RON',0.0147528,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(110,'RSD',0.352069,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(111,'RUB',0.188556,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(112,'RWF',3.37198,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(113,'SAR',0.0116705,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(114,'SBD',0.0255608,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(115,'SCR',0.0416988,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(116,'SEK',0.0325848,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(117,'SHP',0.00257579,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(118,'SLL',56.5994,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(119,'SRD',0.0959108,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(120,'SSP',0.404534,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(121,'STD',70.882,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(122,'SVC',0.0272647,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(123,'SZL',0.0534467,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(124,'THB',0.111118,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(125,'TJS',0.0313395,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(126,'TMT',0.0108696,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(127,'TND',0.0100699,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(128,'TOP',0.00732796,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(129,'TRY',0.0578398,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(130,'TTD',0.0211631,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(131,'TWD',0.096305,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(132,'TZS',7.24534,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(133,'UAH',0.115093,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(134,'UGX',11.6625,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(135,'UYU',0.121645,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(136,'UZS',34.8943,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(137,'VES',0.0317453,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(138,'VND',77.6398,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(139,'VUV',0.379686,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(140,'WST',0.00867657,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(141,'XAF',1.96657,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(142,'XAG',0.000146314,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(143,'XAU',0.00000177306,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(144,'XCD',0.00839317,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(145,'XDR',0.00238238,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(146,'XOF',1.9687,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(147,'XPD',0.00000167553,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(148,'XPF',0.35908,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(149,'XPT',0.00000310559,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(150,'XTS',6.08283,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(151,'YER',0.777019,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(152,'ZAR',0.0531722,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(153,'ZMW',0.0527782,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(154,'JEP',0.00257579,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(155,'GGP',0.00257579,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(156,'IMP',0.00257579,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(157,'GBX',0.662094,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(158,'CNH',0.0224268,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(159,'LTL',0,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(160,'ZWD',1.50478,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(161,'ZWL',1,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(162,'VEF',3174.53,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(163,'SGD',0.00427814,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(164,'AUD',0.00464398,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(165,'USD',0.00310559,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(166,'BTC',0.000000192181,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(167,'BCH',0.0000286917,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(168,'BSV',0.0000779956,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(169,'ETH',0.00000265787,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(170,'ETH2',0.00000265787,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(171,'ETC',0.000164928,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(172,'LTC',0.0000434531,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(173,'ZRX',0.0168908,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(174,'USDC',0.00310559,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(175,'BAT',0.0140052,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(176,'LOOM',0.063901,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(177,'MANA',0.00802997,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(178,'KNC',0.00497292,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(179,'LINK',0.000461626,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(180,'DNT',0.155669,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(181,'MKR',0.00000490611,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(182,'CVC',0.0315128,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(183,'OMG',0.00275905,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(184,'GNT',0.0223197,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(185,'DAI',0.00310606,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(186,'SNT',0.142262,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(187,'ZEC',0.0000790729,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(188,'XRP',0.00812221,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(189,'REP',0.000561082,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(190,'XLM',0.0355268,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(191,'EOS',0.00346683,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(192,'XTZ',0.00320991,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(193,'ALGO',0.0133891,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(194,'DASH',0.0000794065,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(195,'ATOM',0.000320329,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(196,'OXT',0.0397643,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(197,'COMP',0.0000855181,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(198,'ENJ',0.0106174,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(199,'REPV2',0.000561082,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(200,'BAND',0.00167237,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(201,'NMR',0.000282841,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(202,'CGLD',0.00477783,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(203,'UMA',0.00188104,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(204,'LRC',0.0134528,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(205,'YFI',0.00000050585,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(206,'UNI',0.000591428,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(207,'BAL',0.00053087,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(208,'REN',0.0273379,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(209,'WBTC',0.000000192714,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(210,'NU',0.0317383,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(211,'YFII',0.00000299867,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(212,'FIL',0.000741102,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(213,'AAVE',0.0000516136,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(214,'BNT',0.00867483,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(215,'GRT',0.0512897,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(216,'SNX',0.00185741,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(217,'STORJ',0.00970649,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(218,'SUSHI',0.00231053,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(219,'MATIC',0.003791,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(220,'SKL',0.120605,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(221,'ADA',0.0101756,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(222,'ANKR',0.143214,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(223,'CRV',0.00485818,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(224,'ICP',0.000804974,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(225,'NKN',0.0397134,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(226,'OGN',0.0308737,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(227,'1INCH',0.00607748,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(228,'USDT',0.00310725,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(229,'FORTH',0.00104919,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(230,'CTSI',0.0292704,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(231,'TRB',0.000247359,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(232,'POLY',0.0144952,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(233,'MIR',0.0245501,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(234,'RLC',0.00289471,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(235,'DOT',0.000605851,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(236,'SOL',0.000231501,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(237,'DOGE',0.0328408,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(238,'MLN',0.000156729,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(239,'GTC',0.00189365,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(240,'AMP',0.922909,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(241,'SHIB',344.874,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(242,'CHZ',0.0191644,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(243,'KEEP',0.0371038,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(244,'LPT',0.000423682,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(245,'QNT',0.0000273031,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(246,'BOND',0.000812982,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(247,'RLY',0.310559,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(248,'CLV',0.0483737,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(249,'FARM',0.0000984183,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(250,'MASK',0.00107833,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(251,'FET',0.0518896,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(252,'PAX',0.00310994,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(253,'ACH',0.342629,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(254,'ASM',0.258047,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(255,'PLA',0.0157484,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(256,'RAI',0.00109932,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(257,'TRIBE',0.0156145,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(258,'ORN',0.00354925,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(259,'IOTX',0.118331,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(260,'UST',0.159261,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(261,'QUICK',0.0000594998,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(262,'AXS',0.000475224,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(263,'REQ',0.0355738,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(264,'WLUNA',19.9051,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(265,'TRU',0.084621,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(266,'RAD',0.00199076,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(267,'COTI',0.0437099,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(268,'DDX',0.00607569,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(269,'SUKU',0.06168,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(270,'RGT',0.00765661,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(271,'XYO',0.712291,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(272,'ZEN',0.000334294,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(273,'AST',0.0330206,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(274,'AUCTION',0.000660062,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(275,'BUSD',0.00310714,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(276,'JASMY',0.831483,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(277,'WCFG',0.0143115,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(278,'BTRST',0.00321323,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(279,'AGLD',0.0122629,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(280,'AVAX',0.000253932,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(281,'FX',0.0188446,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(282,'TRAC',0.0191881,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(283,'LCX',0.0804557,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(284,'ARPA',0.114597,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(285,'BADGER',0.00121076,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(286,'KRL',0.0101159,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(287,'PERP',0.0075351,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(288,'RARI',0.00151124,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(289,'DESO',0.000356759,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(290,'API3',0.00211121,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(291,'NCT',0.421097,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(292,'SHPING',0.57623,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(293,'UPI',1.0604,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(294,'CRO',0.049889,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(295,'MTL',0.00424841,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(296,'ABT',0.032066,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(297,'CVX',0.000763326,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(298,'AVT',0.00220255,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(299,'MDT',0.131148,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(300,'VGX',0.00762202,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(301,'ALCX',0.000182467,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(302,'COVAL',0.308247,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(303,'FOX',0.104919,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(304,'MUSD',0.00313356,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(305,'CELR',0.263521,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(306,'GALA',0.126914,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(307,'POWR',0.0215591,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(308,'GYEN',0.432082,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(309,'ALICE',0.00257192,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(310,'INV',0.0000584527,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(311,'LQTY',0.00530326,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(312,'PRO',0.00754883,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(313,'SPELL',5.12897,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(314,'ENS',0.000240371,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(315,'DIA',0.00992645,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(316,'BLZ',0.0509949,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(317,'CTX',0.00138642,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(318,'ERN',0.00173013,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(319,'IDEX',0.0675128,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(320,'MCO2',0.00141808,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(321,'POLS',0.00888835,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(322,'SUPER',0.0322692,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(323,'UNFI',0.000747434,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(324,'STX',0.0129184,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(325,'KSM',0.00012363,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(326,'GODS',0.0137321,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(327,'IMX',0.00736183,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(328,'RBN',0.0133433,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(329,'BICO',0.0111053,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(330,'GFI',0.00481898,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(331,'ATA',0.0293812,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(332,'GLM',0.0146732,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(333,'MPL',0.000385309,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(334,'PLU',0.00036472,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(335,'SWFTC',2.79657,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(336,'SAND',0.00568113,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(337,'OCEAN',0.0233152,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(338,'GNO',0.0000378016,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(339,'FIDA',0.0066902,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(340,'ORCA',0.00750777,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(341,'CRPT',0.0388199,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(342,'QSP',0.25035,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(343,'RNDR',0.00642248,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(344,'NEST',0.126321,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(345,'PRQ',0.0391379,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(346,'HOPR',0.0540573,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(347,'JUP',0.766623,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(348,'MATH',0.0243671,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(349,'SYN',0.00494915,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(350,'AIOZ',0.0770618,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(351,'WAMPL',0.000965969,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(352,'AERGO',0.0283098,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(353,'INDEX',0.00160911,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(354,'TONE',0.163366,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(355,'HIGH',0.00272181,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(356,'GUSD',0.00310559,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(357,'FLOW',0.00283616,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(358,'ROSE',0.0693444,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(359,'OP',0.00361536,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(360,'APE',0.000813301,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(361,'MINA',0.0056775,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(362,'MUSE',0.000431632,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(363,'SYLO',1.47709,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(364,'CBETH',0.00000273793,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(365,'DREP',0.0103831,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(366,'ELA',0.00282583,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(367,'FORT',0.0199716,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(368,'ALEPH',0.0438024,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(369,'DEXT',0.0267262,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(370,'FIS',0.0109179,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(371,'BIT',0.010759,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(372,'GMT',0.00831261,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(373,'GST',0.141549,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(374,'MEDIA',0.000142983,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(375,'C98',0.0137659,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(376,'00',0.0166119,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(377,'APT',0.000697102,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(378,'AURORA',0.00730727,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(379,'BOBA',0.0155591,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(380,'DAR',0.0234384,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(381,'DYP',0.0138683,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(382,'GAL',0.002144,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(383,'HBAR',0.0646931,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(384,'HFT',0.00612845,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(385,'ILV',0.0000806333,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(386,'INJ',0.00202121,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(387,'LDO',0.00300784,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(388,'LOKA',0.00943948,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(389,'METIS',0.000172055,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(390,'MNDE',0.0307987,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(391,'MONA',0.00000700412,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(392,'MSOL',0.000215891,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(393,'MXC',0.0943518,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(394,'NEAR',0.00202781,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(395,'OOKI',0.802789,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(396,'PNG',0.0695385,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(397,'POND',0.380354,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(398,'PUNDIX',0.00806961,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(399,'QI',0.374528,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(400,'RARE',0.0263297,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(401,'STG',0.00744389,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(402,'TIME',0.0000306211,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(403,'WAXL',0.00579996,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(404,'XCN',0.0799483,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(405,'XMON',0.000000246337,0,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(406,'ZWL',1,1,'2022-11-28 05:21:36','2022-11-28 05:21:36'),(407,'AED',0.0114071,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(408,'AFN',0.278212,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(409,'ALL',0.350387,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(410,'AMD',1.22673,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(411,'ANG',0.00561611,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(412,'AOA',1.58951,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(413,'ARS',0.514897,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(414,'AWG',0.00558989,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(415,'AZN',0.0052795,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(416,'BAM',0.00586991,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(417,'BBD',0.00629636,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(418,'BDT',0.317602,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(419,'BGN',0.00584177,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(420,'BHD',0.00117647,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(421,'BIF',6.45384,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(422,'BMD',0.00310559,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(423,'BND',0.00429053,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(424,'BOB',0.0215308,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(425,'BRL',0.0168028,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(426,'BSD',0.00311832,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(427,'BTN',0.25454,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(428,'BWP',0.0402367,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(429,'BYN',0.00786045,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(430,'BYR',78.6045,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(431,'BZD',0.00628197,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(432,'CAD',0.00417627,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(433,'CDF',6.40724,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(434,'CHF',0.00293826,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(435,'CLF',0.000103797,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(436,'CLP',2.87555,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(437,'CNY',0.022373,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(438,'COP',15.2985,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(439,'CRC',1.89198,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(440,'CUC',0.00310559,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(441,'CVE',0.330935,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(442,'CZK',0.0730453,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(443,'DJF',0.555144,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(444,'DKK',0.0223054,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(445,'DOP',0.170292,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(446,'DZD',0.431889,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(447,'EGP',0.076637,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(448,'ETB',0.166613,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(449,'EUR',0.00299801,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(450,'FJD',0.00687696,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(451,'FKP',0.00257579,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(452,'GBP',0.00257579,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(453,'GEL',0.00847826,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(454,'GHS',0.0452157,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(455,'GIP',0.00257579,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(456,'GMD',0.182682,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(457,'GNF',26.865,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(458,'GTQ',0.0243396,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(459,'GYD',0.651025,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(460,'HKD',0.0242782,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(461,'HNL',0.0770178,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(462,'HRK',0.0226409,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(463,'HTG',0.42868,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(464,'HUF',1.22805,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(465,'IDR',48.8162,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(466,'ILS',0.0106434,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(467,'INR',0.25373,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(468,'IQD',4.55117,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(469,'ISK',0.43941,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(470,'JMD',0.480428,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(471,'JOD',0.00220186,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(472,'JPY',0.429866,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(473,'KES',0.379658,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(474,'KGS',0.261097,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(475,'KHR',12.8863,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(476,'KMF',1.47081,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(477,'KRW',4.1602,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(478,'KWD',0.000955,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(479,'KYD',0.00259703,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(480,'KZT',1.45134,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(481,'LAK',54.1299,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(482,'LBP',4.71559,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(483,'LKR',1.14596,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(484,'LRD',0.478261,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(485,'LSL',0.0534475,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(486,'LYD',0.0152153,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(487,'MAD',0.03329,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(488,'MDL',0.0598639,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(489,'MGA',13.5304,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(490,'MKD',0.184869,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(491,'MMK',6.54773,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(492,'MNT',10.5806,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(493,'MOP',0.0251007,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(494,'MUR',0.135488,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(495,'MVR',0.047764,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(496,'MWK',3.20032,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(497,'MXN',0.0601113,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(498,'MYR',0.013913,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(499,'MZN',0.198271,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(500,'NAD',0.052764,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(501,'NGN',1.37976,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(502,'NIO',0.112222,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(503,'NOK',0.0308916,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(504,'NPR',0.407194,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(505,'NZD',0.00500393,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(506,'OMR',0.00120154,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(507,'PAB',0.00311829,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(508,'PEN',0.0120191,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(509,'PGK',0.0109877,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(510,'PHP',0.176287,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(511,'PKR',0.699916,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(512,'PLN',0.0140804,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(513,'PYG',22.4717,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(514,'QAR',0.0113075,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(515,'RON',0.0147528,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(516,'RSD',0.352069,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(517,'RUB',0.188556,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(518,'RWF',3.37198,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(519,'SAR',0.0116705,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(520,'SBD',0.0255608,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(521,'SCR',0.0416988,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(522,'SEK',0.0325848,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(523,'SHP',0.00257579,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(524,'SLL',56.5994,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(525,'SRD',0.0959108,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(526,'SSP',0.404534,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(527,'STD',70.882,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(528,'SVC',0.0272647,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(529,'SZL',0.0534467,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(530,'THB',0.111118,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(531,'TJS',0.0313395,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(532,'TMT',0.0108696,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(533,'TND',0.0100699,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(534,'TOP',0.00732796,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(535,'TRY',0.0578398,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(536,'TTD',0.0211631,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(537,'TWD',0.096305,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(538,'TZS',7.24534,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(539,'UAH',0.115093,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(540,'UGX',11.6625,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(541,'UYU',0.121645,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(542,'UZS',34.8943,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(543,'VES',0.0317453,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(544,'VND',77.6398,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(545,'VUV',0.379686,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(546,'WST',0.00867657,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(547,'XAF',1.96657,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(548,'XAG',0.000146314,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(549,'XAU',0.00000177306,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(550,'XCD',0.00839317,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(551,'XDR',0.00238238,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(552,'XOF',1.9687,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(553,'XPD',0.00000167553,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(554,'XPF',0.35908,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(555,'XPT',0.00000310559,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(556,'XTS',6.08283,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(557,'YER',0.777019,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(558,'ZAR',0.0531722,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(559,'ZMW',0.0527782,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(560,'JEP',0.00257579,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(561,'GGP',0.00257579,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(562,'IMP',0.00257579,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(563,'GBX',0.662094,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(564,'CNH',0.0224268,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(565,'LTL',0,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(566,'ZWD',1.50478,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(567,'ZWL',1,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(568,'VEF',3174.53,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(569,'SGD',0.00427814,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(570,'AUD',0.00464398,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(571,'USD',0.00310559,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(572,'BTC',0.000000192181,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(573,'BCH',0.0000286917,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(574,'BSV',0.0000779956,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(575,'ETH',0.00000265787,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(576,'ETH2',0.00000265787,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(577,'ETC',0.000164928,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(578,'LTC',0.0000434531,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(579,'ZRX',0.0168908,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(580,'USDC',0.00310559,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(581,'BAT',0.0140052,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(582,'LOOM',0.063901,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(583,'MANA',0.00802997,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(584,'KNC',0.00497292,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(585,'LINK',0.000461626,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(586,'DNT',0.155669,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(587,'MKR',0.00000490611,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(588,'CVC',0.0315128,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(589,'OMG',0.00275905,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(590,'GNT',0.0223197,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(591,'DAI',0.00310606,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(592,'SNT',0.142262,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(593,'ZEC',0.0000790729,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(594,'XRP',0.00812221,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(595,'REP',0.000561082,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(596,'XLM',0.0355268,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(597,'EOS',0.00346683,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(598,'XTZ',0.00320991,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(599,'ALGO',0.0133891,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(600,'DASH',0.0000794065,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(601,'ATOM',0.000320329,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(602,'OXT',0.0397643,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(603,'COMP',0.0000855181,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(604,'ENJ',0.0106174,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(605,'REPV2',0.000561082,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(606,'BAND',0.00167237,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(607,'NMR',0.000282841,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(608,'CGLD',0.00477783,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(609,'UMA',0.00188104,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(610,'LRC',0.0134528,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(611,'YFI',0.00000050585,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(612,'UNI',0.000591428,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(613,'BAL',0.00053087,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(614,'REN',0.0273379,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(615,'WBTC',0.000000192714,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(616,'NU',0.0317383,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(617,'YFII',0.00000299867,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(618,'FIL',0.000741102,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(619,'AAVE',0.0000516136,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(620,'BNT',0.00867483,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(621,'GRT',0.0512897,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(622,'SNX',0.00185741,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(623,'STORJ',0.00970649,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(624,'SUSHI',0.00231053,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(625,'MATIC',0.003791,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(626,'SKL',0.120605,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(627,'ADA',0.0101756,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(628,'ANKR',0.143214,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(629,'CRV',0.00485818,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(630,'ICP',0.000804974,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(631,'NKN',0.0397134,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(632,'OGN',0.0308737,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(633,'1INCH',0.00607748,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(634,'USDT',0.00310725,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(635,'FORTH',0.00104919,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(636,'CTSI',0.0292704,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(637,'TRB',0.000247359,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(638,'POLY',0.0144952,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(639,'MIR',0.0245501,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(640,'RLC',0.00289471,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(641,'DOT',0.000605851,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(642,'SOL',0.000231501,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(643,'DOGE',0.0328408,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(644,'MLN',0.000156729,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(645,'GTC',0.00189365,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(646,'AMP',0.922909,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(647,'SHIB',344.874,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(648,'CHZ',0.0191644,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(649,'KEEP',0.0371038,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(650,'LPT',0.000423682,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(651,'QNT',0.0000273031,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(652,'BOND',0.000812982,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(653,'RLY',0.310559,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(654,'CLV',0.0483737,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(655,'FARM',0.0000984183,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(656,'MASK',0.00107833,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(657,'FET',0.0518896,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(658,'PAX',0.00310994,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(659,'ACH',0.342629,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(660,'ASM',0.258047,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(661,'PLA',0.0157484,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(662,'RAI',0.00109932,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(663,'TRIBE',0.0156145,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(664,'ORN',0.00354925,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(665,'IOTX',0.118331,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(666,'UST',0.159261,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(667,'QUICK',0.0000594998,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(668,'AXS',0.000475224,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(669,'REQ',0.0355738,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(670,'WLUNA',19.9051,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(671,'TRU',0.084621,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(672,'RAD',0.00199076,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(673,'COTI',0.0437099,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(674,'DDX',0.00607569,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(675,'SUKU',0.06168,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(676,'RGT',0.00765661,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(677,'XYO',0.712291,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(678,'ZEN',0.000334294,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(679,'AST',0.0330206,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(680,'AUCTION',0.000660062,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(681,'BUSD',0.00310714,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(682,'JASMY',0.831483,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(683,'WCFG',0.0143115,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(684,'BTRST',0.00321323,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(685,'AGLD',0.0122629,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(686,'AVAX',0.000253932,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(687,'FX',0.0188446,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(688,'TRAC',0.0191881,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(689,'LCX',0.0804557,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(690,'ARPA',0.114597,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(691,'BADGER',0.00121076,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(692,'KRL',0.0101159,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(693,'PERP',0.0075351,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(694,'RARI',0.00151124,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(695,'DESO',0.000356759,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(696,'API3',0.00211121,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(697,'NCT',0.421097,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(698,'SHPING',0.57623,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(699,'UPI',1.0604,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(700,'CRO',0.049889,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(701,'MTL',0.00424841,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(702,'ABT',0.032066,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(703,'CVX',0.000763326,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(704,'AVT',0.00220255,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(705,'MDT',0.131148,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(706,'VGX',0.00762202,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(707,'ALCX',0.000182467,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(708,'COVAL',0.308247,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(709,'FOX',0.104919,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(710,'MUSD',0.00313356,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(711,'CELR',0.263521,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(712,'GALA',0.126914,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(713,'POWR',0.0215591,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(714,'GYEN',0.432082,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(715,'ALICE',0.00257192,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(716,'INV',0.0000584527,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(717,'LQTY',0.00530326,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(718,'PRO',0.00754883,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(719,'SPELL',5.12897,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(720,'ENS',0.000240371,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(721,'DIA',0.00992645,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(722,'BLZ',0.0509949,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(723,'CTX',0.00138642,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(724,'ERN',0.00173013,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(725,'IDEX',0.0675128,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(726,'MCO2',0.00141808,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(727,'POLS',0.00888835,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(728,'SUPER',0.0322692,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(729,'UNFI',0.000747434,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(730,'STX',0.0129184,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(731,'KSM',0.00012363,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(732,'GODS',0.0137321,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(733,'IMX',0.00736183,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(734,'RBN',0.0133433,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(735,'BICO',0.0111053,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(736,'GFI',0.00481898,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(737,'ATA',0.0293812,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(738,'GLM',0.0146732,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(739,'MPL',0.000385309,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(740,'PLU',0.00036472,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(741,'SWFTC',2.79657,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(742,'SAND',0.00568113,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(743,'OCEAN',0.0233152,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(744,'GNO',0.0000378016,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(745,'FIDA',0.0066902,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(746,'ORCA',0.00750777,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(747,'CRPT',0.0388199,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(748,'QSP',0.25035,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(749,'RNDR',0.00642248,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(750,'NEST',0.126321,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(751,'PRQ',0.0391379,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(752,'HOPR',0.0540573,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(753,'JUP',0.766623,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(754,'MATH',0.0243671,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(755,'SYN',0.00494915,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(756,'AIOZ',0.0770618,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(757,'WAMPL',0.000965969,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(758,'AERGO',0.0283098,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(759,'INDEX',0.00160911,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(760,'TONE',0.163366,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(761,'HIGH',0.00272181,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(762,'GUSD',0.00310559,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(763,'FLOW',0.00283616,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(764,'ROSE',0.0693444,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(765,'OP',0.00361536,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(766,'APE',0.000813301,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(767,'MINA',0.0056775,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(768,'MUSE',0.000431632,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(769,'SYLO',1.47709,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(770,'CBETH',0.00000273793,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(771,'DREP',0.0103831,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(772,'ELA',0.00282583,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(773,'FORT',0.0199716,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(774,'ALEPH',0.0438024,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(775,'DEXT',0.0267262,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(776,'FIS',0.0109179,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(777,'BIT',0.010759,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(778,'GMT',0.00831261,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(779,'GST',0.141549,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(780,'MEDIA',0.000142983,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(781,'C98',0.0137659,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(782,'00',0.0166119,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(783,'APT',0.000697102,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(784,'AURORA',0.00730727,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(785,'BOBA',0.0155591,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(786,'DAR',0.0234384,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(787,'DYP',0.0138683,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(788,'GAL',0.002144,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(789,'HBAR',0.0646931,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(790,'HFT',0.00612845,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(791,'ILV',0.0000806333,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(792,'INJ',0.00202121,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(793,'LDO',0.00300784,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(794,'LOKA',0.00943948,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(795,'METIS',0.000172055,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(796,'MNDE',0.0307987,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(797,'MONA',0.00000700412,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(798,'MSOL',0.000215891,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(799,'MXC',0.0943518,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(800,'NEAR',0.00202781,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(801,'OOKI',0.802789,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(802,'PNG',0.0695385,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(803,'POND',0.380354,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(804,'PUNDIX',0.00806961,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(805,'QI',0.374528,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(806,'RARE',0.0263297,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(807,'STG',0.00744389,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(808,'TIME',0.0000306211,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(809,'WAXL',0.00579996,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(810,'XCN',0.0799483,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(811,'XMON',0.000000246337,0,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(812,'ZWL',1,1,'2022-11-28 05:21:51','2022-11-28 05:21:51'),(813,'AED',0.0114071,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(814,'AFN',0.278212,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(815,'ALL',0.350387,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(816,'AMD',1.22673,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(817,'ANG',0.00561611,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(818,'AOA',1.58951,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(819,'ARS',0.514897,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(820,'AWG',0.00558989,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(821,'AZN',0.0052795,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(822,'BAM',0.00586991,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(823,'BBD',0.00629636,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(824,'BDT',0.317602,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(825,'BGN',0.00584177,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(826,'BHD',0.00117647,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(827,'BIF',6.45384,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(828,'BMD',0.00310559,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(829,'BND',0.00429053,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(830,'BOB',0.0215308,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(831,'BRL',0.0168028,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(832,'BSD',0.00311832,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(833,'BTN',0.25454,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(834,'BWP',0.0402367,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(835,'BYN',0.00786045,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(836,'BYR',78.6045,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(837,'BZD',0.00628197,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(838,'CAD',0.00417627,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(839,'CDF',6.40724,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(840,'CHF',0.00293826,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(841,'CLF',0.000103797,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(842,'CLP',2.87555,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(843,'CNY',0.022373,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(844,'COP',15.2985,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(845,'CRC',1.89198,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(846,'CUC',0.00310559,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(847,'CVE',0.330935,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(848,'CZK',0.0730453,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(849,'DJF',0.555144,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(850,'DKK',0.0223054,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(851,'DOP',0.170292,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(852,'DZD',0.431889,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(853,'EGP',0.076637,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(854,'ETB',0.166613,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(855,'EUR',0.00299801,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(856,'FJD',0.00687696,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(857,'FKP',0.00257579,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(858,'GBP',0.00257579,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(859,'GEL',0.00847826,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(860,'GHS',0.0452157,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(861,'GIP',0.00257579,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(862,'GMD',0.182682,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(863,'GNF',26.865,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(864,'GTQ',0.0243396,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(865,'GYD',0.651025,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(866,'HKD',0.0242782,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(867,'HNL',0.0770178,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(868,'HRK',0.0226409,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(869,'HTG',0.42868,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(870,'HUF',1.22805,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(871,'IDR',48.8162,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(872,'ILS',0.0106434,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(873,'INR',0.25373,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(874,'IQD',4.55117,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(875,'ISK',0.43941,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(876,'JMD',0.480428,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(877,'JOD',0.00220186,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(878,'JPY',0.429866,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(879,'KES',0.379658,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(880,'KGS',0.261097,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(881,'KHR',12.8863,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(882,'KMF',1.47081,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(883,'KRW',4.1602,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(884,'KWD',0.000955,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(885,'KYD',0.00259703,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(886,'KZT',1.45134,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(887,'LAK',54.1299,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(888,'LBP',4.71559,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(889,'LKR',1.14596,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(890,'LRD',0.478261,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(891,'LSL',0.0534475,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(892,'LYD',0.0152153,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(893,'MAD',0.03329,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(894,'MDL',0.0598639,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(895,'MGA',13.5304,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(896,'MKD',0.184869,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(897,'MMK',6.54773,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(898,'MNT',10.5806,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(899,'MOP',0.0251007,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(900,'MUR',0.135488,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(901,'MVR',0.047764,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(902,'MWK',3.20032,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(903,'MXN',0.0601113,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(904,'MYR',0.013913,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(905,'MZN',0.198271,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(906,'NAD',0.052764,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(907,'NGN',1.37976,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(908,'NIO',0.112222,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(909,'NOK',0.0308916,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(910,'NPR',0.407194,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(911,'NZD',0.00500393,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(912,'OMR',0.00120154,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(913,'PAB',0.00311829,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(914,'PEN',0.0120191,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(915,'PGK',0.0109877,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(916,'PHP',0.176287,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(917,'PKR',0.699916,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(918,'PLN',0.0140804,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(919,'PYG',22.4717,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(920,'QAR',0.0113075,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(921,'RON',0.0147528,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(922,'RSD',0.352069,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(923,'RUB',0.188556,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(924,'RWF',3.37198,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(925,'SAR',0.0116705,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(926,'SBD',0.0255608,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(927,'SCR',0.0416988,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(928,'SEK',0.0325848,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(929,'SHP',0.00257579,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(930,'SLL',56.5994,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(931,'SRD',0.0959108,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(932,'SSP',0.404534,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(933,'STD',70.882,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(934,'SVC',0.0272647,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(935,'SZL',0.0534467,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(936,'THB',0.111118,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(937,'TJS',0.0313395,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(938,'TMT',0.0108696,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(939,'TND',0.0100699,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(940,'TOP',0.00732796,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(941,'TRY',0.0578398,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(942,'TTD',0.0211631,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(943,'TWD',0.096305,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(944,'TZS',7.24534,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(945,'UAH',0.115093,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(946,'UGX',11.6625,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(947,'UYU',0.121645,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(948,'UZS',34.8943,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(949,'VES',0.0317453,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(950,'VND',77.6398,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(951,'VUV',0.379686,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(952,'WST',0.00867657,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(953,'XAF',1.96657,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(954,'XAG',0.000146314,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(955,'XAU',0.00000177306,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(956,'XCD',0.00839317,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(957,'XDR',0.00238238,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(958,'XOF',1.9687,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(959,'XPD',0.00000167553,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(960,'XPF',0.35908,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(961,'XPT',0.00000310559,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(962,'XTS',6.08283,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(963,'YER',0.777019,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(964,'ZAR',0.0531722,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(965,'ZMW',0.0527782,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(966,'JEP',0.00257579,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(967,'GGP',0.00257579,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(968,'IMP',0.00257579,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(969,'GBX',0.662094,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(970,'CNH',0.0224268,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(971,'LTL',0,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(972,'ZWD',1.50478,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(973,'ZWL',1,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(974,'VEF',3174.53,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(975,'SGD',0.00427814,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(976,'AUD',0.00464398,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(977,'USD',0.00310559,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(978,'BTC',0.000000192181,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(979,'BCH',0.0000286917,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(980,'BSV',0.0000779956,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(981,'ETH',0.00000265787,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(982,'ETH2',0.00000265787,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(983,'ETC',0.000164928,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(984,'LTC',0.0000434531,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(985,'ZRX',0.0168908,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(986,'USDC',0.00310559,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(987,'BAT',0.0140052,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(988,'LOOM',0.063901,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(989,'MANA',0.00802997,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(990,'KNC',0.00497292,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(991,'LINK',0.000461626,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(992,'DNT',0.155669,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(993,'MKR',0.00000490611,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(994,'CVC',0.0315128,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(995,'OMG',0.00275905,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(996,'GNT',0.0223197,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(997,'DAI',0.00310606,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(998,'SNT',0.142262,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(999,'ZEC',0.0000790729,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1000,'XRP',0.00812221,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1001,'REP',0.000561082,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1002,'XLM',0.0355268,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1003,'EOS',0.00346683,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1004,'XTZ',0.00320991,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1005,'ALGO',0.0133891,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1006,'DASH',0.0000794065,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1007,'ATOM',0.000320329,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1008,'OXT',0.0397643,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1009,'COMP',0.0000855181,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1010,'ENJ',0.0106174,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1011,'REPV2',0.000561082,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1012,'BAND',0.00167237,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1013,'NMR',0.000282841,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1014,'CGLD',0.00477783,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1015,'UMA',0.00188104,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1016,'LRC',0.0134528,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1017,'YFI',0.00000050585,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1018,'UNI',0.000591428,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1019,'BAL',0.00053087,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1020,'REN',0.0273379,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1021,'WBTC',0.000000192714,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1022,'NU',0.0317383,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1023,'YFII',0.00000299867,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1024,'FIL',0.000741102,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1025,'AAVE',0.0000516136,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1026,'BNT',0.00867483,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1027,'GRT',0.0512897,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1028,'SNX',0.00185741,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1029,'STORJ',0.00970649,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1030,'SUSHI',0.00231053,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1031,'MATIC',0.003791,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1032,'SKL',0.120605,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1033,'ADA',0.0101756,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1034,'ANKR',0.143214,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1035,'CRV',0.00485818,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1036,'ICP',0.000804974,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1037,'NKN',0.0397134,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1038,'OGN',0.0308737,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1039,'1INCH',0.00607748,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1040,'USDT',0.00310725,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1041,'FORTH',0.00104919,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1042,'CTSI',0.0292704,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1043,'TRB',0.000247359,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1044,'POLY',0.0144952,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1045,'MIR',0.0245501,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1046,'RLC',0.00289471,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1047,'DOT',0.000605851,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1048,'SOL',0.000231501,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1049,'DOGE',0.0328408,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1050,'MLN',0.000156729,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1051,'GTC',0.00189365,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1052,'AMP',0.922909,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1053,'SHIB',344.874,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1054,'CHZ',0.0191644,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1055,'KEEP',0.0371038,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1056,'LPT',0.000423682,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1057,'QNT',0.0000273031,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1058,'BOND',0.000812982,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1059,'RLY',0.310559,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1060,'CLV',0.0483737,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1061,'FARM',0.0000984183,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1062,'MASK',0.00107833,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1063,'FET',0.0518896,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1064,'PAX',0.00310994,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1065,'ACH',0.342629,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1066,'ASM',0.258047,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1067,'PLA',0.0157484,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1068,'RAI',0.00109932,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1069,'TRIBE',0.0156145,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1070,'ORN',0.00354925,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1071,'IOTX',0.118331,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1072,'UST',0.159261,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1073,'QUICK',0.0000594998,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1074,'AXS',0.000475224,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1075,'REQ',0.0355738,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1076,'WLUNA',19.9051,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1077,'TRU',0.084621,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1078,'RAD',0.00199076,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1079,'COTI',0.0437099,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1080,'DDX',0.00607569,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1081,'SUKU',0.06168,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1082,'RGT',0.00765661,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1083,'XYO',0.712291,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1084,'ZEN',0.000334294,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1085,'AST',0.0330206,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1086,'AUCTION',0.000660062,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1087,'BUSD',0.00310714,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1088,'JASMY',0.831483,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1089,'WCFG',0.0143115,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1090,'BTRST',0.00321323,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1091,'AGLD',0.0122629,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1092,'AVAX',0.000253932,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1093,'FX',0.0188446,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1094,'TRAC',0.0191881,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1095,'LCX',0.0804557,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1096,'ARPA',0.114597,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1097,'BADGER',0.00121076,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1098,'KRL',0.0101159,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1099,'PERP',0.0075351,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1100,'RARI',0.00151124,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1101,'DESO',0.000356759,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1102,'API3',0.00211121,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1103,'NCT',0.421097,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1104,'SHPING',0.57623,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1105,'UPI',1.0604,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1106,'CRO',0.049889,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1107,'MTL',0.00424841,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1108,'ABT',0.032066,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1109,'CVX',0.000763326,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1110,'AVT',0.00220255,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1111,'MDT',0.131148,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1112,'VGX',0.00762202,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1113,'ALCX',0.000182467,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1114,'COVAL',0.308247,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1115,'FOX',0.104919,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1116,'MUSD',0.00313356,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1117,'CELR',0.263521,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1118,'GALA',0.126914,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1119,'POWR',0.0215591,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1120,'GYEN',0.432082,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1121,'ALICE',0.00257192,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1122,'INV',0.0000584527,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1123,'LQTY',0.00530326,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1124,'PRO',0.00754883,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1125,'SPELL',5.12897,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1126,'ENS',0.000240371,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1127,'DIA',0.00992645,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1128,'BLZ',0.0509949,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1129,'CTX',0.00138642,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1130,'ERN',0.00173013,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1131,'IDEX',0.0675128,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1132,'MCO2',0.00141808,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1133,'POLS',0.00888835,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1134,'SUPER',0.0322692,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1135,'UNFI',0.000747434,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1136,'STX',0.0129184,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1137,'KSM',0.00012363,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1138,'GODS',0.0137321,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1139,'IMX',0.00736183,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1140,'RBN',0.0133433,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1141,'BICO',0.0111053,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1142,'GFI',0.00481898,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1143,'ATA',0.0293812,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1144,'GLM',0.0146732,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1145,'MPL',0.000385309,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1146,'PLU',0.00036472,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1147,'SWFTC',2.79657,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1148,'SAND',0.00568113,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1149,'OCEAN',0.0233152,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1150,'GNO',0.0000378016,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1151,'FIDA',0.0066902,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1152,'ORCA',0.00750777,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1153,'CRPT',0.0388199,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1154,'QSP',0.25035,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1155,'RNDR',0.00642248,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1156,'NEST',0.126321,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1157,'PRQ',0.0391379,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1158,'HOPR',0.0540573,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1159,'JUP',0.766623,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1160,'MATH',0.0243671,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1161,'SYN',0.00494915,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1162,'AIOZ',0.0770618,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1163,'WAMPL',0.000965969,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1164,'AERGO',0.0283098,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1165,'INDEX',0.00160911,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1166,'TONE',0.163366,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1167,'HIGH',0.00272181,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1168,'GUSD',0.00310559,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1169,'FLOW',0.00283616,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1170,'ROSE',0.0693444,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1171,'OP',0.00361536,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1172,'APE',0.000813301,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1173,'MINA',0.0056775,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1174,'MUSE',0.000431632,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1175,'SYLO',1.47709,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1176,'CBETH',0.00000273793,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1177,'DREP',0.0103831,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1178,'ELA',0.00282583,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1179,'FORT',0.0199716,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1180,'ALEPH',0.0438024,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1181,'DEXT',0.0267262,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1182,'FIS',0.0109179,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1183,'BIT',0.010759,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1184,'GMT',0.00831261,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1185,'GST',0.141549,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1186,'MEDIA',0.000142983,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1187,'C98',0.0137659,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1188,'00',0.0166119,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1189,'APT',0.000697102,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1190,'AURORA',0.00730727,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1191,'BOBA',0.0155591,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1192,'DAR',0.0234384,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1193,'DYP',0.0138683,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1194,'GAL',0.002144,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1195,'HBAR',0.0646931,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1196,'HFT',0.00612845,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1197,'ILV',0.0000806333,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1198,'INJ',0.00202121,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1199,'LDO',0.00300784,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1200,'LOKA',0.00943948,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1201,'METIS',0.000172055,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1202,'MNDE',0.0307987,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1203,'MONA',0.00000700412,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1204,'MSOL',0.000215891,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1205,'MXC',0.0943518,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1206,'NEAR',0.00202781,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1207,'OOKI',0.802789,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1208,'PNG',0.0695385,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1209,'POND',0.380354,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1210,'PUNDIX',0.00806961,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1211,'QI',0.374528,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1212,'RARE',0.0263297,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1213,'STG',0.00744389,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1214,'TIME',0.0000306211,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1215,'WAXL',0.00579996,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1216,'XCN',0.0799483,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1217,'XMON',0.000000246337,0,'2022-11-28 05:22:00','2022-11-28 05:22:00'),(1218,'ZWL',1,1,'2022-11-28 05:22:00','2022-11-28 05:22:00');
/*!40000 ALTER TABLE `CurrencyRates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EmergencyContact`
--

DROP TABLE IF EXISTS `EmergencyContact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EmergencyContact` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` char(36) NOT NULL,
  `phoneNumber` varchar(255) NOT NULL,
  `contactName` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EmergencyContact`
--

LOCK TABLES `EmergencyContact` WRITE;
/*!40000 ALTER TABLE `EmergencyContact` DISABLE KEYS */;
/*!40000 ALTER TABLE `EmergencyContact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FailedTransactionHistory`
--

DROP TABLE IF EXISTS `FailedTransactionHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FailedTransactionHistory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bookingId` int NOT NULL,
  `userId` char(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `partnerId` char(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `amount` float NOT NULL,
  `currency` varchar(255) NOT NULL,
  `reason` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FailedTransactionHistory`
--

LOCK TABLES `FailedTransactionHistory` WRITE;
/*!40000 ALTER TABLE `FailedTransactionHistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `FailedTransactionHistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HomePage`
--

DROP TABLE IF EXISTS `HomePage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HomePage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HomePage`
--

LOCK TABLES `HomePage` WRITE;
/*!40000 ALTER TABLE `HomePage` DISABLE KEYS */;
INSERT INTO `HomePage` VALUES (1,'Home Section Image 3','homeSectionImage3','bd919f193ee5409494fdb713e2414ff7.png','2020-02-21 11:21:17','2022-03-16 10:05:31'),(2,'Home Section Image 4','homeSectionImage4','a1b7563963eb2f88f149a610dda1a669.png','2020-02-21 11:21:17','2022-03-16 10:05:31'),(3,'Home Section Image 1','homeSectionImage1','8ce6edd3f2c2ba73332a54edbb319000.png','2020-02-21 11:21:17','2022-03-16 10:05:31'),(4,'Home Section Image 2','homeSectionImage2','990e79b2d05b29948d23d334a7204d4a.png','2020-02-21 11:21:17','2022-03-16 10:05:31'),(5,'Home Section Image 5','homeSectionImage5','0d7538283fb75d637ade59b213bece4b.png','2020-02-21 11:21:17','2022-03-16 10:05:31'),(6,'Home Section Image 6','homeSectionImage6','5a23b52d838a08ff3d4079dbfacd945e.png','2020-02-21 11:21:17','2022-03-16 10:05:31'),(7,'Home Section Button 1','homeSectionButton1','GET IT','2020-02-21 11:21:17','2022-03-16 10:05:31'),(8,'Home Section Title 1','homeSectionTitle1','Get your daily chores done with WooberlyHandy','2020-02-21 11:21:17','2022-03-16 10:05:31'),(9,'City Section Title 1','citySectionTitle1','Services we offer','2020-02-21 11:21:17','2022-03-20 06:12:40'),(10,'City Section Content 1','citySectionContent1','Percipit repudiandae an eum, enim case eos no. Percipit tractatos pertinacia cum id, ad eos facete malorum','2020-02-21 11:21:17','2022-03-20 06:12:40'),(11,'About Grid Image 1','aboutGridImage1','f895573fe04af06262d319efc5e51c12.png','2020-02-21 11:21:17','2021-06-15 13:48:10'),(12,'About Grid Image 2','aboutGridImage2','7cb5a8af8436c5c09116018f41d3a617.png','2020-02-21 11:21:17','2021-06-15 13:48:10'),(13,'About Grid Title 1','aboutGridTitle1',' Lorem Ipsum','2020-02-21 11:21:17','2021-06-15 13:48:10'),(14,'About Grid Title 2','aboutGridTitle2','Lorem Ipsum.','2020-02-21 11:21:17','2021-06-15 13:48:10'),(15,'About Grid Title 3','aboutGridTitle3','Lorem Ipsum ','2020-02-21 11:21:17','2021-06-15 13:48:10'),(16,'About Grid Title 4','aboutGridTitle4','Lorem Ipsum','2020-02-21 11:21:17','2021-06-15 13:48:10'),(17,'About Grid Title 5','aboutGridTitle5','Lorem Ipsum','2020-02-21 11:21:17','2021-06-15 13:48:10'),(18,'About Grid Title 6','aboutGridTitle6','Lorem Ipsum','2020-02-21 11:21:17','2021-06-15 13:48:10'),(19,'About Grid Content 1','aboutGridContent1','  Id per gloriatur tincidunt. Vim odio unum atomorum at. Ut essent dicunt dolorum mei.','2020-02-21 11:21:17','2021-06-15 13:48:10'),(20,'About Grid Content 2','aboutGridContent2','  Id per gloriatur tincidunt. Vim odio unum atomorum at. Ut essent dicunt dolorum mei.   Id per gloriat','2020-02-21 11:21:17','2021-06-15 13:48:10'),(21,'About Grid Content 3','aboutGridContent3','  Id per gloriatur tincidunt. Vim odio unum atomorum at. Ut essent dicunt dolorum mei.','2020-02-21 11:21:17','2021-06-15 13:48:10'),(22,'About Grid Content 4','aboutGridContent4','   Id per gloriatur tincidunt. Vim odio unum atomorum at. Ut essent dicunt dolorum mein.','2020-02-21 11:21:17','2021-06-15 13:48:10'),(23,'About Grid Content 5','aboutGridContent5','Id per gloriatur tincidunt. Vim odio unum atomorum at. Ut essent dicunt dolorum mei.','2020-02-21 11:21:17','2021-06-15 13:48:10'),(24,'About Grid Content 6','aboutGridContent6','Id per gloriatur tincidunt. Vim odio unum atomorum at. Ut essent dicunt dolorum mei.','2020-02-21 11:21:17','2021-06-15 13:48:10'),(25,'Safety Grid Title 1','safetyGridTitle1','Get our user app!','2020-02-21 11:21:17','2022-11-28 05:10:08'),(26,'Safety Grid Content 1','safetyGridContent1','Download and install our handyman app on your smartphone to explore the services we offer. ','2020-02-21 11:21:17','2022-11-28 05:10:10'),(27,'Safety Grid Image 1','safetyGridImage1','9b3ad292a53c23b52a53f46c30ac2081.png','2020-02-21 11:21:17','2022-11-28 05:10:03'),(28,'Safety Grid Image 2','safetyGridImage2','49e90a163de0be51f3752d6725974178.png','2020-02-21 11:21:17','2022-11-28 05:10:05'),(29,'Safety Grid Image 3','safetyGridImage3','0acadcb64936621a1d873f4db788409b.png','2020-02-21 11:21:17','2022-11-28 05:10:07'),(30,'Signup Grid Image 1','signupGridImage1','647765c8850e2b39c1caa4c5c5611df3.png','2020-02-21 11:21:17','2022-03-31 12:13:54'),(31,'Signup Grid Image 2','signupGridImage2','a9887a9fb8450e3593ac73a73317bde0.png','2020-02-21 11:21:17','2022-03-31 12:13:54'),(32,'Signup Grid Image 3','signupGridImage3','a031666f4b33381ceb0f68038eaf3657.png','2020-02-21 11:21:17','2022-03-31 12:13:54'),(33,'Signup Grid Title 1','signupGridTitle1','Get our service provider app!','2020-02-21 11:21:17','2022-03-31 12:13:54'),(34,'Signup Grid Content 1','signupGridContent1','Download and install our app on your smartphone to get service requests and earn passive income. ','2020-02-21 11:21:17','2022-03-31 12:13:54'),(35,'Footer Title 1','footerTitle1','About','2020-02-21 11:21:17','2022-03-31 12:14:10'),(36,'Footer Content 1','footerContent1','Your Website app helps you book services and get your job done by professionals.','2020-02-21 11:21:17','2022-03-31 12:14:10'),(37,'Footer Logo 1','footerLogo1','a6d9dbdad40ad207afd99c88eaf33da5.png','2020-02-21 11:21:17','2022-03-31 12:14:10'),(38,'Footer Logo 2','footerLogo2','e52e62c5c11d3a4b2711d2b426376d98.png','2020-02-21 11:21:17','2022-03-31 12:14:10'),(39,'Footer Logo 3','footerLogo3','aec52c8db28d4525c4e893930f5bc638.png','2020-02-21 11:21:17','2022-03-31 12:14:10'),(40,'Footer Logo 4','footerLogo4','a9ccb43857e83eaaa94b04ad02228b0c.png','2020-02-21 11:21:17','2022-03-31 12:14:10'),(41,'Footer Link 1','footerLink1','https://www.facebook.com/','2020-02-21 11:21:17','2022-03-31 12:14:10'),(42,'Footer Link 2','footerLink2','https://www.linkedin.com/','2020-02-21 11:21:17','2022-03-31 12:14:10'),(43,'Footer Link 3','footerLink3','https://demo.wooberly.com/3','2020-02-21 11:21:17','2022-03-31 12:14:10'),(44,'Footer Link 4','footerLink4','https://demo.wooberly.com/4','2020-02-21 11:21:17','2022-03-31 12:14:10'),(45,'Safety Grid Link 1','safetyGridLink1','https://play.google.com/store/apps','2020-02-24 10:53:11','2022-11-28 05:10:12'),(46,'Safety Grid Link 2','safetyGridLink2','https://apps.apple.com/us/app','2020-02-24 10:53:11','2022-11-28 05:10:13'),(47,'Signup Grid Link 1','signupGridLink1','https://play.google.com/store/apps','2020-02-24 10:53:11','2022-03-31 12:13:54'),(48,'Signup Grid Link 2','signupGridLink2','https://apps.apple.com/us/app','2020-02-24 10:53:11','2022-03-31 12:13:54'),(49,'Footer Link Name 1','footerLinkName1','Start Riding.','2020-02-24 10:53:11','2022-03-31 12:14:10'),(50,'Footer Link Name 2','footerLinkName2','Start Driving','2020-02-24 10:53:11','2022-03-31 12:14:10'),(51,'Footer Link Name 3','footerLinkName3','Contact Us','2020-02-24 10:53:11','2022-03-31 12:14:10'),(52,'Footer Link Title','footerLinkTitle','Useful links','2020-02-24 10:53:11','2022-03-31 12:14:10'),(53,'Footer Bottom','footerBottom','Your Website 2022. All Rights Reserved','2020-02-24 10:53:11','2022-03-31 12:14:10'),(54,'Footer Link Name 4','footerLinkName4','Privacy Policy','2020-02-24 10:53:11','2022-03-31 12:14:10'),(55,'Home Section Image 7','homeSectionImage7','71f8af0c92ff4727418788327ea86617.png','2020-05-29 07:24:04','2022-03-16 10:05:31'),(56,'Home Section Image 8','homeSectionImage8','223aa74e291502beaaf6c35d16948c09.png','2020-05-29 07:24:04','2022-03-16 10:05:31'),(57,'safety Grid Image4','safetyGridImage4','05048b6a74e504bf09bc4ff54ce544f7.png','2021-12-01 02:39:21','2022-11-28 05:10:16'),(58,'signup Grid Image4','signupGridImage4','4ff43eb9845b8dcf71b829533a546934.png','2021-12-01 02:39:21','2022-03-31 12:13:54');
/*!40000 ALTER TABLE `HomePage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HomePageCategory`
--

DROP TABLE IF EXISTS `HomePageCategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HomePageCategory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `description` mediumtext,
  `logo` varchar(255) DEFAULT NULL,
  `banner` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HomePageCategory`
--

LOCK TABLES `HomePageCategory` WRITE;
/*!40000 ALTER TABLE `HomePageCategory` DISABLE KEYS */;
INSERT INTO `HomePageCategory` VALUES (1,'Plumbers','Get help from professional plumbers to fix a problem with the plumbing, which can range from a minor leaking tap to major piping problems. We connect you with the best plumbers in your locality.','1b8009a6a2084184b6cf7b37605686c1.png','236716f8b004dec2401f7a9d534a76f9.png','2022-03-16 07:30:42','2022-03-16 07:30:42'),(2,'Beauticians','Get help from professional beauticians to get beauty services from the comfort of your home without having to go to the salon. We connect you with the best beauticians in your locality.','06bb5da7c81fb35454d7bf088207ca9a.png','562deddcd16f891f6ec5318d16cec7f9.png','2022-03-16 07:30:42','2022-03-16 07:30:42'),(3,'Painting','Get help from professional painters to paint your home with beautiful colors inside out. We connect you with the best painters in your locality.','5e06a3989aba3fb309a2e522a2f3334a.png','3ea0985d37159a5b7f353db45352e46b.png','2022-03-16 07:30:42','2022-03-16 07:30:42'),(4,'Electricians','Get help from professional electricians to plan, install and maintain electrical wiring systems across a wide variety of environments. We connect you with the best electricians in your locality. ','ddf021375bf73408c84afaabcb6af6b5.png','fdd547cb0f6ccae039afab298fe8af0e.png','2022-03-16 07:30:42','2022-03-16 07:30:42');
/*!40000 ALTER TABLE `HomePageCategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Location`
--

DROP TABLE IF EXISTS `Location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Location` (
  `id` int NOT NULL AUTO_INCREMENT,
  `locationName` varchar(255) NOT NULL,
  `coordinates` mediumtext NOT NULL,
  `geometryCoordinates` polygon DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Location`
--

LOCK TABLES `Location` WRITE;
/*!40000 ALTER TABLE `Location` DISABLE KEYS */;
INSERT INTO `Location` VALUES (1,'Entire World','[{\"lat\":30.030644695878436,\"lng\":61.356752541485164},{\"lat\":33.46771219785385,\"lng\":104.59894004148516},{\"lat\":6.008987426497113,\"lng\":101.43487754148516},{\"lat\":5.834144204683877,\"lng\":72.07940879148516}]',_binary '\0\0\0\0\0\0\0\0\0\0\0\0\0\0òÆT\ÿ>@\ 89™≠N@}\‹H˛›ª@@eúúU&Z@nÖ˚ˇ3	@eúú\’[Y@å˝\Â)V@eúúR@\0òÆT\ÿ>@\ 89™≠N@','Entire World',1,'2022-03-14 07:14:48','2022-03-31 12:15:25');
/*!40000 ALTER TABLE `Location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OrderCategory`
--

DROP TABLE IF EXISTS `OrderCategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OrderCategory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderId` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `logoImage` varchar(255) DEFAULT NULL,
  `bannerImage` varchar(255) DEFAULT NULL,
  `isJobPhotoRequired` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OrderCategory`
--

LOCK TABLES `OrderCategory` WRITE;
/*!40000 ALTER TABLE `OrderCategory` DISABLE KEYS */;
/*!40000 ALTER TABLE `OrderCategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OrderItems`
--

DROP TABLE IF EXISTS `OrderItems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OrderItems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categoryId` int NOT NULL,
  `subCategoryId` int NOT NULL,
  `orderId` int NOT NULL,
  `baseFare` float NOT NULL DEFAULT '0',
  `minimumHours` float DEFAULT '0',
  `currency` varchar(255) NOT NULL DEFAULT 'USD',
  `totalQuantity` int DEFAULT '0',
  `workedDuration` float DEFAULT '0',
  `pausedDuration` float DEFAULT '0',
  `startedAt` datetime DEFAULT NULL,
  `completedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `pricingId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orderId` (`orderId`),
  CONSTRAINT `OrderItems_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `Orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OrderItems`
--

LOCK TABLES `OrderItems` WRITE;
/*!40000 ALTER TABLE `OrderItems` DISABLE KEYS */;
/*!40000 ALTER TABLE `OrderItems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OrderSubCategory`
--

DROP TABLE IF EXISTS `OrderSubCategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OrderSubCategory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderId` int DEFAULT NULL,
  `categoryId` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `subCategoryId` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OrderSubCategory`
--

LOCK TABLES `OrderSubCategory` WRITE;
/*!40000 ALTER TABLE `OrderSubCategory` DISABLE KEYS */;
/*!40000 ALTER TABLE `OrderSubCategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Orders`
--

DROP TABLE IF EXISTS `Orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `promoId` int DEFAULT NULL,
  `userId` char(36) NOT NULL,
  `status` enum('pending','processing','completed','cancelled') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Orders`
--

LOCK TABLES `Orders` WRITE;
/*!40000 ALTER TABLE `Orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `Orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PaymentMethods`
--

DROP TABLE IF EXISTS `PaymentMethods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PaymentMethods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `processedIn` varchar(255) DEFAULT NULL,
  `fees` varchar(255) DEFAULT NULL,
  `currency` varchar(255) DEFAULT NULL,
  `details` text,
  `isEnable` tinyint(1) NOT NULL DEFAULT '1',
  `paymentType` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PaymentMethods`
--

LOCK TABLES `PaymentMethods` WRITE;
/*!40000 ALTER TABLE `PaymentMethods` DISABLE KEYS */;
/*!40000 ALTER TABLE `PaymentMethods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Payout`
--

DROP TABLE IF EXISTS `Payout`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Payout` (
  `id` int NOT NULL AUTO_INCREMENT,
  `methodId` int NOT NULL,
  `userId` char(36) NOT NULL,
  `payEmail` varchar(255) NOT NULL,
  `address1` mediumtext,
  `address2` mediumtext,
  `city` varchar(255) NOT NULL,
  `zipcode` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `currency` varchar(255) NOT NULL,
  `isDefault` tinyint(1) NOT NULL DEFAULT '0',
  `last4Digits` int DEFAULT NULL,
  `isVerified` tinyint(1) DEFAULT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `payout_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Payout`
--

LOCK TABLES `Payout` WRITE;
/*!40000 ALTER TABLE `Payout` DISABLE KEYS */;
/*!40000 ALTER TABLE `Payout` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PrecautionNotification`
--

DROP TABLE IF EXISTS `PrecautionNotification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PrecautionNotification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `isEnabled` tinyint(1) NOT NULL DEFAULT '1',
  `imageName` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PrecautionNotification`
--

LOCK TABLES `PrecautionNotification` WRITE;
/*!40000 ALTER TABLE `PrecautionNotification` DISABLE KEYS */;
INSERT INTO `PrecautionNotification` VALUES (1,'Attention!','<p><strong>Secure your children -&nbsp;</strong>Children may get lost in the excitement of a new visitor which could add to further chaos or delays in the completion of the job.</p><p><strong>Move your furniture -&nbsp;</strong>Move furniture or other items away from where the handyman is going to be working before they arrive. </p><p><strong>Keep your pets away -&nbsp;</strong>Consider leaving them with a friend or relative if possible.</p><p><br></p>',1,'7b239685d5ab9363ee48a34844cbb152.png','2022-03-14 07:04:36','2022-03-31 12:20:12');
/*!40000 ALTER TABLE `PrecautionNotification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Pricing`
--

DROP TABLE IF EXISTS `Pricing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Pricing` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categoryId` int NOT NULL,
  `subCategoryId` int NOT NULL,
  `locationId` int NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `currency` varchar(255) NOT NULL DEFAULT 'USD',
  `basePrice` float NOT NULL DEFAULT '0',
  `multiplierValue` float NOT NULL DEFAULT '0',
  `isPriceEditable` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Pricing`
--

LOCK TABLES `Pricing` WRITE;
/*!40000 ALTER TABLE `Pricing` DISABLE KEYS */;
INSERT INTO `Pricing` VALUES (1,1,2,1,1,'USD',15,5,0,'2022-03-14 07:15:08','2022-03-16 10:03:09'),(2,2,1,1,1,'USD',500,5,1,'2022-03-14 07:15:59','2022-03-16 10:03:13'),(3,2,3,1,1,'USD',1000,5,1,'2022-03-14 07:16:51','2022-03-14 07:16:51'),(4,3,4,1,1,'USD',5000,3,0,'2022-03-14 07:28:29','2022-03-14 08:57:05'),(5,3,5,1,1,'USD',1000,1,1,'2022-03-14 07:28:44','2022-03-16 10:03:18'),(6,1,6,1,1,'USD',25,10,0,'2022-03-14 09:37:18','2022-03-14 09:37:18'),(7,1,7,1,1,'USD',5,1,0,'2022-03-14 09:37:35','2022-03-14 09:37:35'),(8,1,8,1,1,'USD',35,15,1,'2022-03-14 09:38:07','2022-03-16 12:38:07'),(9,1,11,1,1,'USD',5,5,0,'2022-03-15 05:43:12','2022-03-15 05:43:12'),(10,1,9,1,1,'USD',5,5,0,'2022-03-15 07:05:26','2022-03-15 07:05:26'),(11,1,10,1,1,'USD',5,5,0,'2022-03-15 07:05:51','2022-03-15 07:05:51'),(12,1,12,1,1,'USD',5,5,0,'2022-03-15 07:06:19','2022-03-15 07:06:19'),(13,2,13,1,1,'USD',2,5,0,'2022-03-15 14:10:14','2022-03-15 14:10:14'),(14,2,14,1,1,'USD',2,5,0,'2022-03-15 14:10:29','2022-03-15 14:10:29'),(15,2,15,1,1,'USD',3,5,0,'2022-03-15 14:10:46','2022-03-15 14:10:46'),(16,2,16,1,1,'USD',2,5,0,'2022-03-15 14:11:00','2022-03-15 14:11:00'),(17,3,17,1,1,'USD',5,5,0,'2022-03-15 14:12:44','2022-03-15 14:12:44'),(18,3,18,1,1,'USD',2,5,0,'2022-03-15 14:12:53','2022-03-15 14:12:53'),(19,3,19,1,1,'USD',3,5,0,'2022-03-15 14:13:03','2022-03-15 14:13:03'),(20,3,20,1,1,'USD',2,5,0,'2022-03-15 14:13:12','2022-03-15 14:13:12'),(21,4,21,1,1,'USD',5,5,0,'2022-03-15 14:13:35','2022-03-15 14:13:35'),(22,4,22,1,1,'USD',2,5,0,'2022-03-15 14:13:46','2022-03-15 14:13:46'),(23,4,23,1,1,'USD',5,5,0,'2022-03-15 14:13:54','2022-03-15 14:13:54'),(24,4,24,1,1,'USD',3,5,0,'2022-03-15 14:14:06','2022-03-15 14:14:06'),(25,5,33,1,1,'USD',5,5,0,'2022-03-15 14:14:34','2022-03-15 14:14:34'),(26,5,34,1,1,'USD',5,5,0,'2022-03-15 14:15:35','2022-03-15 14:15:35'),(27,5,35,1,1,'USD',2,5,0,'2022-03-15 14:15:45','2022-03-15 14:15:45'),(28,6,25,1,1,'USD',5,5,0,'2022-03-15 14:16:07','2022-03-15 14:16:07'),(29,6,26,1,1,'USD',2,5,0,'2022-03-15 14:16:19','2022-03-15 14:16:19'),(30,6,27,1,1,'USD',3,5,0,'2022-03-15 14:16:30','2022-03-15 14:16:30'),(31,6,28,1,1,'USD',5,5,0,'2022-03-15 14:16:40','2022-03-15 14:16:40'),(32,7,36,1,1,'USD',5,5,0,'2022-03-15 14:17:05','2022-03-15 14:17:05'),(33,7,37,1,1,'USD',2,5,0,'2022-03-15 14:17:14','2022-03-15 14:17:14'),(34,7,28,1,1,'USD',3,5,0,'2022-03-15 14:17:29','2022-03-15 14:17:29'),(35,7,38,1,1,'USD',3,5,0,'2022-03-15 14:17:53','2022-03-15 14:17:53'),(36,8,29,1,1,'USD',5,5,0,'2022-03-15 14:19:00','2022-03-15 14:19:00'),(37,8,30,1,1,'USD',2,5,0,'2022-03-15 14:19:09','2022-03-15 14:19:09'),(38,8,31,1,1,'USD',3,5,0,'2022-03-15 14:19:18','2022-03-15 14:19:18'),(39,8,32,1,1,'USD',5,5,0,'2022-03-15 14:19:28','2022-03-15 14:19:28');
/*!40000 ALTER TABLE `Pricing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Privileges`
--

DROP TABLE IF EXISTS `Privileges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Privileges` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Privileges`
--

LOCK TABLES `Privileges` WRITE;
/*!40000 ALTER TABLE `Privileges` DISABLE KEYS */;
INSERT INTO `Privileges` VALUES (1,'Manage Site and Mobile App Settings','2021-12-28 06:51:19','2021-12-28 06:51:19'),(2,'Manage Homepage Settings','2021-12-28 06:51:19','2021-12-28 06:51:19'),(3,'Manage Users','2021-12-28 06:51:19','2021-12-28 06:51:19'),(4,'Manage Service Providers','2021-12-28 06:51:19','2021-12-28 06:51:19'),(5,'Manage Categories','2021-12-28 06:51:19','2021-12-28 06:51:19'),(6,'Manage SubCategories','2021-12-28 06:51:19','2021-12-28 06:51:19'),(7,'Manage Location','2021-12-28 06:51:19','2021-12-28 06:51:19'),(8,'Manage Fare','2021-12-28 06:51:19','2021-12-28 06:51:19'),(9,'Manage Jobs','2021-12-28 06:51:19','2021-12-28 06:51:19'),(11,'Manage Ratings','2021-12-28 06:51:19','2021-12-28 06:51:19'),(12,'Manage Promo Code','2021-12-28 06:51:19','2021-12-28 06:51:19'),(13,'Manage Notifications','2021-12-28 06:51:19','2021-12-28 06:51:19'),(14,'Cancel Reason','2021-12-28 06:51:19','2021-12-28 06:51:19'),(15,'Manage Payout','2021-12-28 06:51:19','2021-12-28 06:51:19'),(16,'Manage Static Content','2021-12-28 06:51:19','2021-12-28 06:51:19'),(17,'Manage CMS Pages','2021-12-28 06:51:19','2021-12-28 06:51:19'),(18,'Precaution Notification','2021-12-28 06:51:19','2021-12-28 06:51:19'),(19,'Manage SMS Methods','2022-04-12 12:04:49','2022-04-12 12:04:49');
/*!40000 ALTER TABLE `Privileges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PrivilegesLink`
--

DROP TABLE IF EXISTS `PrivilegesLink`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PrivilegesLink` (
  `id` int NOT NULL AUTO_INCREMENT,
  `privilegeId` int NOT NULL,
  `url` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PrivilegesLink`
--

LOCK TABLES `PrivilegesLink` WRITE;
/*!40000 ALTER TABLE `PrivilegesLink` DISABLE KEYS */;
INSERT INTO `PrivilegesLink` VALUES (1,1,'/siteadmin/settings/site','2021-12-28 06:51:19','2021-12-28 06:51:19'),(2,1,'/siteadmin/settings/mobile-app','2021-12-28 06:51:19','2021-12-28 06:51:19'),(3,2,'/siteadmin/homepage/banner','2021-12-28 06:51:19','2021-12-28 06:51:19'),(4,2,'/siteadmin/homepage/category','2021-12-28 06:51:19','2021-12-28 06:51:19'),(5,2,'/siteadmin/homepage/topfeature','2021-12-28 06:51:19','2021-12-28 06:51:19'),(6,2,'/siteadmin/homepage/user','2021-12-28 06:51:19','2021-12-28 06:51:19'),(7,2,'/siteadmin/homepage/partner','2021-12-28 06:51:19','2021-12-28 06:51:19'),(8,2,'/siteadmin/homepage/footer','2021-12-28 06:51:19','2021-12-28 06:51:19'),(9,3,'/siteadmin/users','2021-12-28 06:51:19','2021-12-28 06:51:19'),(10,4,'/siteadmin/partners','2021-12-28 06:51:19','2021-12-28 06:51:19'),(11,5,'/siteadmin/category','2021-12-28 06:51:19','2021-12-28 06:51:19'),(12,6,'/siteadmin/sub-category','2021-12-28 06:51:19','2021-12-28 06:51:19'),(13,7,'/siteadmin/location','2021-12-28 06:51:19','2021-12-28 06:51:19'),(14,7,'/siteadmin/add-location','2021-12-28 06:51:19','2021-12-28 06:51:19'),(15,7,'/siteadmin/edit-location','2021-12-28 06:51:19','2021-12-28 06:51:19'),(16,8,'/siteadmin/pricing/','2021-12-28 06:51:19','2021-12-28 06:51:19'),(17,9,'/siteadmin/jobs','2021-12-28 06:51:19','2021-12-28 06:51:19'),(18,9,'/siteadmin/completed-jobs','2021-12-28 06:51:19','2021-12-28 06:51:19'),(19,9,'/siteadmin/cancelled-jobs','2021-12-28 06:51:19','2021-12-28 06:51:19'),(22,11,'/siteadmin/ratings','2021-12-28 06:51:19','2021-12-28 06:51:19'),(23,12,'/siteadmin/promo-code/','2021-12-28 06:51:19','2021-12-28 06:51:19'),(24,13,'/siteadmin/notifications','2021-12-28 06:51:19','2021-12-28 06:51:19'),(25,14,'/siteadmin/cancel-reasons','2021-12-28 06:51:19','2021-12-28 06:51:19'),(26,15,'/siteadmin/payout','2021-12-28 06:51:19','2021-12-28 06:51:19'),(27,15,'/siteadmin/failed-payout/','2021-12-28 06:51:19','2021-12-28 06:51:19'),(28,16,'/siteadmin/staticpage/','2021-12-28 06:51:19','2021-12-28 06:51:19'),(29,17,'/siteadmin/contentpage/','2021-12-28 06:51:19','2021-12-28 06:51:19'),(30,18,'/siteadmin/precaution-notification','2021-12-28 06:51:19','2021-12-28 06:51:19'),(31,19,'/siteadmin/sms-methods','2022-04-12 12:04:49','2022-04-12 12:04:49'),(32,9,'/siteadmin/schedule-jobs','2022-05-20 11:20:06','2022-05-20 11:20:06');
/*!40000 ALTER TABLE `PrivilegesLink` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PromoCode`
--

DROP TABLE IF EXISTS `PromoCode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PromoCode` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `type` tinyint NOT NULL DEFAULT '1',
  `promoValue` float NOT NULL DEFAULT '0',
  `currency` varchar(255) DEFAULT NULL,
  `expiryDate` datetime DEFAULT NULL,
  `isEnable` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `imageName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PromoCode`
--

LOCK TABLES `PromoCode` WRITE;
/*!40000 ALTER TABLE `PromoCode` DISABLE KEYS */;
INSERT INTO `PromoCode` VALUES (1,'Welcome Offer','Welcome Offer with 50% discount for new users.','WELCOME50',1,50,'USD','2022-03-31 06:30:00',1,'2022-03-14 06:58:31','2022-03-30 11:51:57','5abc87e9ec20dca22ceb6b6f877ad292.png');
/*!40000 ALTER TABLE `PromoCode` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Reviews`
--

DROP TABLE IF EXISTS `Reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) NOT NULL,
  `bookingId` int NOT NULL,
  `authorId` varchar(255) DEFAULT NULL,
  `ratings` float DEFAULT NULL,
  `reviewContent` longtext NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Reviews`
--

LOCK TABLES `Reviews` WRITE;
/*!40000 ALTER TABLE `Reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `Reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SMSVerification`
--

DROP TABLE IF EXISTS `SMSVerification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SMSVerification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `phoneNumber` varchar(255) NOT NULL,
  `phoneDialCode` varchar(255) NOT NULL,
  `userId` char(36) DEFAULT NULL,
  `deviceId` mediumtext,
  `deviceType` mediumtext,
  `otp` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userType` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SMSVerification`
--

LOCK TABLES `SMSVerification` WRITE;
/*!40000 ALTER TABLE `SMSVerification` DISABLE KEYS */;
/*!40000 ALTER TABLE `SMSVerification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SavedLocations`
--

DROP TABLE IF EXISTS `SavedLocations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SavedLocations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `lat` float DEFAULT NULL,
  `lng` float DEFAULT NULL,
  `locationType` enum('home','work','other') DEFAULT NULL,
  `locationName` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SavedLocations`
--

LOCK TABLES `SavedLocations` WRITE;
/*!40000 ALTER TABLE `SavedLocations` DISABLE KEYS */;
/*!40000 ALTER TABLE `SavedLocations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ScheduleBooking`
--

DROP TABLE IF EXISTS `ScheduleBooking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ScheduleBooking` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bookingId` int NOT NULL,
  `status` enum('scheduled','completed','failed') DEFAULT NULL,
  `scheduleFrom` datetime DEFAULT NULL,
  `scheduleTo` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ScheduleBooking`
--

LOCK TABLES `ScheduleBooking` WRITE;
/*!40000 ALTER TABLE `ScheduleBooking` DISABLE KEYS */;
/*!40000 ALTER TABLE `ScheduleBooking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ScheduleBookingHistory`
--

DROP TABLE IF EXISTS `ScheduleBookingHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ScheduleBookingHistory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bookingId` int DEFAULT NULL,
  `scheduleId` int DEFAULT NULL,
  `status` enum('scheduled','completed','failed','updated') DEFAULT NULL,
  `scheduleFrom` datetime DEFAULT NULL,
  `scheduleTo` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `cancelledByAdminId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ScheduleBookingHistory`
--

LOCK TABLES `ScheduleBookingHistory` WRITE;
/*!40000 ALTER TABLE `ScheduleBookingHistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `ScheduleBookingHistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
INSERT INTO `SequelizeMeta` VALUES ('20190926052943-addStripeFieldToProfile.js'),('20190927072518-addServiceFeeSettings.js'),('20191008070900-addCountriesTable.js'),('20191008073524-addCurrenciesTable.js'),('20191017094012-addactiveStatusFieldtoUser.js'),('20191029065327-updateBookingDatesFieldTypes.js'),('20191030065343-addCurrencyToBookingTable.js'),('20191030071733-addOverallRatingToUserTable.js'),('20191030074152-allowNullForTransactionIdToBookingTable.js'),('20191107055240-addRiderDriverTotalFareToBooking.js'),('20191114073847-addNotesColumnToBooking.js'),('20191202162352-addMinutePriceOnCategory.js'),('20191202170507-addMinutePriceToBooking.js'),('20191207141027-addVehicleIdToBooking.js'),('20191218055441-addCapacityColumn.js'),('20191227055513-addPhoneCountryCode.js'),('20200110151340-addRoleIdToAdminUser.js'),('20200113092830-deletedAtUser.js'),('20200116084426-deletedAtColumnAddedToUser.js'),('20200116122021-addWalletColumnsToUserProfile.js'),('20200122104428-addPromoCodeFieldsToBooking.js'),('20200203043316-addColumnsTips.js'),('20200204091208-addColumnsDriverTotalTips.js'),('20200205131034-paymentIntentColumns.js'),('20200207125112-removeUnwantedStripePaymentIntentColumns.js'),('20200208115100-addColumnIsActiveAtCancelReason.js'),('20200213080259-addColumnstollFee.js'),('20200219073437-addColumnLocation.js'),('20200219074738-addHomePageSettings.js'),('20200220064353-addColumnBooking.js'),('20200220080129-addPayoutColumn.js'),('20200224073822-addHomePageSettingExtraValues.js'),('20200305060009-isVerifiedAtPayoutTable.js'),('20200306064335-changeColumnReasonAtFailedTransactionHistory.js'),('20200309132008-changeIsVerifiedAtPayout.js'),('20200312105450-addPayoutHolderNames.js'),('20200313071146-insertStaticPageSupport.js'),('20200316115834-pageBannerAtStaticPage.js'),('20200316120223-insertStaticPageRiderAndDriver.js'),('20200406073458-changeCategoryColumnsAcceptNull.js'),('20200407045029-addPageBanner.js'),('20200407121624-changeVehicleStatus.js'),('20200407144649-changeVehicleStatus.js'),('20200409104455-changeCharacterSetContentPage.js'),('20200422091657-addPolygonColumnToLocation.js'),('20200429145337-addPricingIdToBooking.js'),('20200529054910-addExtraHomepageSettings.js'),('20201126073032-addVoipIdToModels.js'),('20201210051721-androidAndIosVersion.js'),('20201228070317-addRiderPayableFareInBooking.js'),('20201228071503-alterBookingTableDriverIdToNull.js'),('20201229094606-addNewEnumInBookingTable.js'),('20201230095552-addColumnBookingTypeInBooking.js'),('20210109101511-removeUnwatedVoipDeviceId.js'),('20210112074659-addRiderIdToScheduleBooking.js'),('20210121071549-addDriverPrivacyPolicyPage.js'),('20210201135022-changeDescriptionDataType.js'),('20210202084509-updateBookingTripStatusColumn.js'),('20210327135821-removeColumnThread.js'),('20210327135827-removeColumnThreadItems.js'),('20210327135836-addColumnThread.js'),('20210413134445-addStripeKeySiteSettings.js'),('20210719071103-multiStopTImeSlot.js'),('20210812055126-changePreviousLocationField.js'),('20210812101223-chnageColumn.js'),('20210921131110-manualDispatchColumnChanges.js'),('20210921131126-cancelledByAdminId.js'),('20210921131139-utf8UnicodeCharSet.js'),('20210922085700-appSettings.js'),('20210922102147-tripRequestWindow.js'),('20210927150306-siteSettingslogotype.js'),('20210928085137-favIcon.js'),('20210929121742-addContact.js'),('20211025081341-addInsuranceFee.js'),('20211029151743-changeRiderServiceFeeToPercentage.js'),('20211117032154-changeDbSchemaDropTable.js'),('20211117115452-addLegal.js'),('20211118122217-appBackgroundImage.js'),('20211118181635-modifySiteSettings.js'),('20211130093946-modifySiteSettings.js'),('20211205145355-jobLocationColumnAdd.js'),('20211206091123-removePartnerId.js'),('20211210095740-renameBookingStatus.js'),('20211211134617-emergencyContactSiteSettings.js'),('20211213085918-addAddress.js'),('20211219072508-addPromoCodeImageColumn.js'),('20211221123733-bookingReviewImage.js'),('20211227180356-privileges.js'),('20211227182000-privilegesURL.js'),('20211228110706-addPreferredtype.js'),('20220110132511-addIdDocumentUploaded.js'),('20220207070349-changeBookingHistoryStatus.js'),('20220208042826-workHistory.js'),('20220208120958-addBasePrice.js'),('20220215122033-jobRequestWindow.js'),('20220216060554-changePrivileges.js'),('20220222130405-removeTracking.js'),('20220304092610-specialBooking.js'),('20220309073513-addTips.js'),('20220309082303-addUserCategoryCurrency.js'),('20220309090028-unnamed-migration.js'),('20220314051621-add.js'),('20220317052430-userFare.js'),('20220329084921-addTripTone.js'),('20220401071930-addSms.js'),('20220401071935-addSmsURL.js'),('20220404054319-smsMethod.js'),('20220406135516-cancelTable.js'),('20220419113313-changeSchedule.js'),('20220421062116-addPRivilege.js'),('20220425045634-addScheduleInterval.js'),('20220427112327-addPricing.js'),('20220512100437-emailCron.js'),('20220613135536-deleteuser.js'),('20220629112036-usertypeSMS.js');
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SiteSettings`
--

DROP TABLE IF EXISTS `SiteSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SiteSettings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` text,
  `type` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SiteSettings`
--

LOCK TABLES `SiteSettings` WRITE;
/*!40000 ALTER TABLE `SiteSettings` DISABLE KEYS */;
INSERT INTO `SiteSettings` VALUES (1,'Site Name','siteName','YOUR SITE NAME','site_settings','2020-02-11 09:42:27','2022-03-31 12:11:47'),(2,'Logo Height','logoHeight','90','site_settings','2020-02-11 09:42:27','2022-03-31 12:11:47'),(3,'Logo Width','logoWidth','90','site_settings','2020-02-11 09:42:27','2022-03-31 12:11:47'),(4,'Site Title','siteTitle','YOUR SITE NAME','site_settings','2020-02-11 09:42:27','2022-03-31 12:11:47'),(5,'Meta Description','metaDescription','YOUR SITE NAME','site_settings','2020-02-11 09:42:27','2022-03-31 12:11:47'),(6,'Facebook Link','facebookLink','https://www.facebook.com/','site_settings','2020-02-11 09:42:27','2022-03-31 12:11:47'),(7,'Twitter Link','twitterLink','https://www.twitter.com/','site_settings','2020-02-11 09:42:27','2022-03-31 12:11:47'),(8,'Youtube Link','youtubeLink','https://www.youtube.com/','site_settings','2020-02-11 09:42:27','2022-03-31 12:11:47'),(9,'Instagram Link','instagramLink','https://www.instagram.com/','site_settings','2020-02-11 09:42:27','2022-03-31 12:11:47'),(10,'Meta Keyword','metaKeyword','YOUR SITE NAME','site_settings','2020-02-11 09:42:27','2022-03-31 12:11:47'),(11,'Home Logo','homeLogo','827416542c4759dec9bab9eceb611ef2.png','site_settings','2020-02-11 09:42:27','2022-03-31 12:11:47'),(12,'App Force Update','appForceUpdate','true','appSettings','2020-12-10 14:58:05','2022-11-28 05:12:52'),(13,'User Android Version','userAndroidVersion','1.2.2','appSettings','2020-12-10 14:58:05','2022-11-28 05:12:52'),(14,'User iOS Version','userIosVersion','1.2.2','appSettings','2020-12-10 14:58:05','2022-11-28 05:12:52'),(15,'Partner Android Version','partnerAndroidVersion','1.2.2','appSettings','2020-12-10 14:58:05','2022-11-28 05:12:52'),(16,'Partner iOS Version','partnerIosVersion','1.2.2','appSettings','2020-12-10 14:58:05','2022-11-28 05:12:52'),(17,'Stripe Publishable Key','stripePublishableKey','pk_test_C5ukBJM7qr5P1F8dY4XKhdyp','appSettings','2021-04-15 12:59:59','2022-11-28 05:12:52'),(18,'Maximum Allowable distance','allowableDistace','100','appSettings','2021-07-31 06:23:09','2022-11-28 05:12:52'),(19,'Maximum Allowed Services for booking','allowedServices','5','appSettings','2021-07-31 06:23:09','2022-11-28 05:12:52'),(20,'Job request notification Interval','notificationInterval','1','appSettings','2021-09-22 16:30:21','2022-11-28 05:12:52'),(25,'Partner Android App','sleepPartnerAndroid','1','appSettings','2021-09-22 16:30:21','2022-11-28 05:12:52'),(26,'Partner iOS App','sleepPartnerios','1','appSettings','2021-09-22 16:30:21','2022-11-28 05:12:52'),(27,'Favicon','favicon','64284f9b8f3b3651ad1e1460a5a642c1.png','site_settings','2021-09-28 14:34:06','2022-03-31 12:11:47'),(28,'Contact Phone Number','contactPhoneNumber','+1 000000000','appSettings','2021-09-30 09:10:23','2022-11-28 05:12:52'),(29,'Contact Email','contactEmail','support@yoursite.com','appSettings','2021-09-30 09:10:23','2022-11-28 05:12:52'),(30,'Skype','skype','yourwebsite','appSettings','2021-09-30 09:10:23','2022-11-28 05:12:52'),(31,'Maximum Emergency Contact','maximumEmergencyContact','100','appSettings','2021-12-14 11:04:17','2022-11-28 05:12:52'),(32,'Job','job','1','appSettings','2022-02-16 07:08:22','2022-11-28 05:12:52'),(33,'Duration','duration','1','appSettings','2022-02-16 07:08:22','2022-11-28 05:12:52'),(34,'Estimated Price','estimatedPrice','1','appSettings','2022-02-16 07:08:22','2022-11-28 05:12:52'),(35,'Job Description','description','1','appSettings','2022-02-16 07:08:22','2022-11-28 05:12:52'),(36,'Job Photo','photo','1','appSettings','2022-02-16 07:08:22','2022-11-28 05:12:52'),(37,'Job Location','location','1','appSettings','2022-02-16 07:08:22','2022-11-28 05:12:52'),(38,'Request Timer Tone','requestTimeTone','6cf28fb38c4c8d0f04caa33db121289e.mp3','appSettings','2022-04-12 12:04:48','2022-11-28 05:12:52'),(39,'Request Timer Tone Use','isRequestTimerToneEnable','1','appSettings','2022-04-12 12:04:48','2022-11-28 05:12:52'),(40,'Open App on  Request','openAppOnRequest','1','appSettings','2022-04-12 12:04:48','2022-11-28 05:12:52'),(41,'Timer Tone File','requestToneFile','ringtone.mp3','appSettings','2022-04-12 12:04:48','2022-11-28 05:12:52'),(42,'Schedule Default Interval','defaultScheduleInterval','20','appSettings','2022-05-20 11:20:06','2022-11-28 05:12:52');
/*!40000 ALTER TABLE `SiteSettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SmsMethods`
--

DROP TABLE IF EXISTS `SmsMethods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SmsMethods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `accountId` varchar(255) NOT NULL,
  `securityId` varchar(255) NOT NULL,
  `phoneNumber` varchar(255) NOT NULL,
  `phoneDialCode` varchar(255) NOT NULL,
  `phoneCountryCode` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SmsMethods`
--

LOCK TABLES `SmsMethods` WRITE;
/*!40000 ALTER TABLE `SmsMethods` DISABLE KEYS */;
INSERT INTO `SmsMethods` VALUES (1,'Twilio',1,'ACcd400137b32ab6a7243cc324929c51fd','599880fe92a1e012e74b7f1ceb036fe0','5103984916','','','2022-04-12 12:08:46','2022-07-04 13:34:30'),(2,'Nexmo',0,'','','','','','2022-04-12 12:08:46','2022-04-12 12:12:47');
/*!40000 ALTER TABLE `SmsMethods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `StaticPage`
--

DROP TABLE IF EXISTS `StaticPage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `StaticPage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pageName` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `metaTitle` varchar(255) NOT NULL,
  `metaDescription` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `pageBanner` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `StaticPage`
--

LOCK TABLES `StaticPage` WRITE;
/*!40000 ALTER TABLE `StaticPage` DISABLE KEYS */;
INSERT INTO `StaticPage` VALUES (1,'Support','<p>Email: support@yourwebsite.com</p><p>Skype: yourwebsite</p><p>Phone Number:&nbsp;+1 000-000-000</p>','support','Support','2020-03-14 07:01:31','2022-03-31 12:17:35','090c15a35db6fa2f0fdd0468869deedb.png'),(2,'Rider','<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut purus a purus rutrum volutpat. Nam sed scelerisque metus. Suspendisse consectetur dolor sit amet dapibus congue. Aenean erat mi, tincidunt a erat non, malesuada tempor augue. Maecenas ornare, dolor ut vehicula posuere, dui metus cursus libero, pharetra aliquam massa libero vehicula nulla. Vivamus eleifend enim non erat varius aliquam. Pellentesque quis justo finibus, convallis dolor maximus, viverra arcu. Donec vitae neque mi. Aliquam in quam et ligula gravida egestas. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla id interdum turpis. Nunc sollicitudin tristique dictum. Morbi viverra lobortis eros sed congue. Sed eget pretium leo.</p><p>Quisque hendrerit, arcu non tincidunt rhoncus, turpis ipsum auctor arcu, sed varius augue odio ac ipsum. Pellentesque aliquam eros ac massa sodales commodo. Nam finibus nibh id ipsum blandit varius. Nulla quis lorem lectus. Phasellus vehicula magna sed ligula feugiat, tempus lobortis tortor fringilla. Pellentesque bibendum lectus purus, et vulputate erat porttitor fermentum. Nulla malesuada dui ut erat tempor, id hendrerit velit venenatis. Proin sodales ullamcorper fermentum. Vestibulum facilisis sagittis tincidunt.</p><p>Cras tempor eleifend laoreet. Sed pulvinar nisl eu metus bibendum semper. Donec non ullamcorper ante, id pretium turpis. Vestibulum feugiat, tortor sit amet fringilla interdum, quam dolor ultricies dui, non vestibulum massa libero ac quam. Mauris placerat molestie ex non maximus. Curabitur nec mollis augue, varius maximus sem. Mauris vitae dolor nec sem vulputate luctus at ut est. Maecenas quam justo, pretium vel consequat ac, venenatis ut risus. Phasellus eu magna in magna ultrices iaculis auctor in mauris. Phasellus quis orci turpis. Nullam eget justo a massa suscipit ullamcorper.</p><p>Mauris ornare elit at felis molestie, a pharetra velit pharetra. Integer id enim augue. Nam vehicula, odio imperdiet lacinia molestie, lectus quam tincidunt arcu, quis finibus orci dolor rutrum quam. Duis tempus blandit diam, sit amet tincidunt orci semper commodo. Vivamus efficitur fringilla iaculis. Praesent pellentesque molestie velit, a ultricies quam lobortis eu. Fusce bibendum, elit sed sagittis luctus, purus diam auctor justo, sed cursus nisi leo molestie massa. Nulla consequat justo id convallis dictum. Aliquam ullamcorper posuere ornare. Nulla laoreet rhoncus magna eu aliquam. Nullam justo arcu, tincidunt non dapibus vel, tristique ac odio.</p>','User','User','2020-03-18 14:13:56','2022-03-15 15:04:42','b9c6c8e253ff6aaae773da4a0319f662.png'),(3,'Driver','<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut purus a purus rutrum volutpat. Nam sed scelerisque metus. Suspendisse consectetur dolor sit amet dapibus congue. Aenean erat mi, tincidunt a erat non, malesuada tempor augue. Maecenas ornare, dolor ut vehicula posuere, dui metus cursus libero, pharetra aliquam massa libero vehicula nulla. Vivamus eleifend enim non erat varius aliquam. Pellentesque quis justo finibus, convallis dolor maximus, viverra arcu. Donec vitae neque mi. Aliquam in quam et ligula gravida egestas. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla id interdum turpis. Nunc sollicitudin tristique dictum. Morbi viverra lobortis eros sed congue. Sed eget pretium leo.</p><p>Quisque hendrerit, arcu non tincidunt rhoncus, turpis ipsum auctor arcu, sed varius augue odio ac ipsum. Pellentesque aliquam eros ac massa sodales commodo. Nam finibus nibh id ipsum blandit varius. Nulla quis lorem lectus. Phasellus vehicula magna sed ligula feugiat, tempus lobortis tortor fringilla. Pellentesque bibendum lectus purus, et vulputate erat porttitor fermentum. Nulla malesuada dui ut erat tempor, id hendrerit velit venenatis. Proin sodales ullamcorper fermentum. Vestibulum facilisis sagittis tincidunt.</p><p>Cras tempor eleifend laoreet. Sed pulvinar nisl eu metus bibendum semper. Donec non ullamcorper ante, id pretium turpis. Vestibulum feugiat, tortor sit amet fringilla interdum, quam dolor ultricies dui, non vestibulum massa libero ac quam. Mauris placerat molestie ex non maximus. Curabitur nec mollis augue, varius maximus sem. Mauris vitae dolor nec sem vulputate luctus at ut est. Maecenas quam justo, pretium vel consequat ac, venenatis ut risus. Phasellus eu magna in magna ultrices iaculis auctor in mauris. Phasellus quis orci turpis. Nullam eget justo a massa suscipit ullamcorper.</p><p>Mauris ornare elit at felis molestie, a pharetra velit pharetra. Integer id enim augue. Nam vehicula, odio imperdiet lacinia molestie, lectus quam tincidunt arcu, quis finibus orci dolor rutrum quam. Duis tempus blandit diam, sit amet tincidunt orci semper commodo. Vivamus efficitur fringilla iaculis. Praesent pellentesque molestie velit, a ultricies quam lobortis eu. Fusce bibendum, elit sed sagittis luctus, purus diam auctor justo, sed cursus nisi leo molestie massa. Nulla consequat justo id convallis dictum. Aliquam ullamcorper posuere ornare. Nulla laoreet rhoncus magna eu aliquam. Nullam justo arcu, tincidunt non dapibus vel, tristique ac odio.</p><p><br></p>','Service Provider','Service Provider','2020-03-18 14:13:56','2022-03-15 15:04:54','44625b9c13f070c877e846bd913ccb21.png'),(4,'Driver Privacy Policy','<p>This Privacy Policy describes how your personal information is collected, used, and shared when you use our YOUR-WEBSITE application.</p><p>YOUR-COMPANY built the Wooberly Handyman app as a Free app. This SERVICE is provided by YOUR-COMPANY at no cost and is intended for use as is.</p><p>This page is used to inform visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service.</p><p>If you choose to use our Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that we collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.</p><p><strong>&nbsp;</strong></p><p><strong>Information Collection and Use</strong></p><p>For a better experience, while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to Users live location, email address, and phone number. The information that we request will be retained by us and used as described in this privacy policy.</p><p>This app collects location data to enable \"live location tracking\" and \"receive service requests\" even when the app is closed(Android app) or not in use(Android app). We collect your live location for better communication with the user.</p><p><strong>&nbsp;</strong></p><p>We don\'t share your live location with any third-party services.</p><p><strong>&nbsp;</strong></p><p><strong>Log Data</strong></p><p>We want to inform you that whenever you use our Service, in case of an error in the app we collect data and information (through third-party products) on your phone called Log Data. This Log Data may include information such as your device Internet Protocol (‚ÄúIP‚Äù) address, device name, operating system version, the configuration of the app when utilizing our Service, the time and date of your use of the Service, and other statistics.</p><p><strong>&nbsp;</strong></p><p><strong>Cookies</strong></p><p>Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device\'s internal memory.</p><p>This Service does not use these ‚Äúcookies‚Äù explicitly. However, the app may use third party code and libraries that use ‚Äúcookies‚Äù to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service.</p><p><strong>&nbsp;</strong></p><p><strong>Service Providers</strong></p><p>We may employ third-party companies and individuals due to the following reasons:</p><ul><li>To facilitate our Service;</li><li>To provide the Service on our behalf;</li><li>To perform Service-related services; or</li></ul><p>To assist us in analyzing how our Service is used.</p><p>We want to inform users of this Service that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.</p><p><strong>&nbsp;</strong></p><p><strong>Security</strong></p><p>We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.</p><p><strong>&nbsp;</strong></p><p><strong>Changes to This Privacy Policy</strong></p><p>We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page.</p><p><strong>&nbsp;</strong></p><p><strong>Contact Us</strong></p><p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at&nbsp;<a href=\"mailto:support@radicalstart.com\" rel=\"noopener noreferrer\" target=\"_blank\">support@</a>yourwebsite.com.</p><p><br></p>','Privacy Policy ','Privacy Policy','2021-01-21 08:42:33','2022-03-31 12:18:43','7a02a006247bab59e096a9b78b3f45cd.png'),(5,'Legal','<p>This Privacy Policy describes how your personal information is collected, used, and shared when you use our YOUR-WEBSITE application.</p><p>YOUR-COMPANY built the WooberlyHandyman app as a Free app. This SERVICE is provided by YOUR-COMPANY at no cost and is intended for use as it is.</p><p>This page is used to inform visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service.</p><p>If you choose to use our Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that we collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.</p><p><strong>Information Collection and Use</strong></p><p>For a better experience, while using our Service, we may require you to provide us with certain personally identifiable information, including email address, profile picture and first name. The information that we request will be retained by us and used as described in this privacy policy.</p><p>This app collects the user‚Äôs identifiable information such as email address, first name and profile picture from the third party social websites when the user tries to register an account with third party social websites such as ‚ÄúGoogle‚Äù and ‚ÄúFacebook‚Äù.</p><p><br></p><p>We don\'t share your information with any third-party services.</p><p>We are collecting this information to operate, maintain, and provide to you the features and functionality of the service, as well as to communicate directly with you, such as to send you email messages.</p><p>The categories with respect to our business purposes for using information include:</p><p>1. Operate and manage our Service, including your registration and account.</p><p>2. Perform services requested by you, such as respond to your comments, questions, and requests, and provide customer service.</p><p>3. Sending you technical notices, updates, security alerts, information regarding changes to our policies, and support and administrative messages.</p><p>4. Preventing and addressing fraud, breach of policies or terms, and threats or harm.</p><p>5. Monitoring and analyzing trends, usage, and activities.</p><p>6. Conducting research, including focus groups and surveys.</p><p><br></p><p><strong>Your Rights and Choices of your information:(Data Deletion Instructions)</strong></p><p>You have rights and choices with respect to information that relates to you and you can contact \"support@yourwebsite.com‚Äù to disable or remove your information from the platform that is related to you and our team will support you within 5 to 7 business days.</p><p>&nbsp;<strong>Log Data</strong></p><p>We want to inform you that whenever you use our Service, in case of an error in the app we collect data and information (through third-party products) on your phone called Log Data. This Log Data may include information such as your device Internet Protocol (‚ÄúIP‚Äù) address, device name, operating system version, the configuration of the app when utilizing our Service, the time and date of your use of the Service, and other statistics.</p><p><strong>Cookies</strong></p><p>Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device\'s internal memory.</p><p>This Service does not use these ‚Äúcookies‚Äù explicitly. However, the app may use a third party code and libraries that use ‚Äúcookies‚Äù to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service.</p><p><strong>Security</strong></p><p>We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.</p><p><strong>Changes to This Privacy Policy</strong></p><p>We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page.</p><p><strong>Contact Us</strong></p><p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at support@yourwebsite.com.</p>','Legal','Legal','2021-12-01 02:39:21','2022-03-31 12:19:52','0e0b676f2453d6e745ec2254be448a54.png');
/*!40000 ALTER TABLE `StaticPage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SubCategory`
--

DROP TABLE IF EXISTS `SubCategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SubCategory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categoryId` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` mediumtext,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SubCategory`
--

LOCK TABLES `SubCategory` WRITE;
/*!40000 ALTER TABLE `SubCategory` DISABLE KEYS */;
INSERT INTO `SubCategory` VALUES (1,2,'Clogged Drains','A potable water system service helps the people to use water within a building. This system is comprised of various pipes that‚Äôs connected to a single system. A valve can be located on this system, which is used to cut off the water supply. Furthermore, there is also usually a meter that tells you how much water is being used throughout the building.','7535141c2b725ede1ac2948071a9d77a.jpeg','active','2022-03-14 07:13:16','2022-03-16 13:44:18'),(2,1,'Home Electrician','Home Electrician','715aadf2bc36c22108273f1896fec831.jpeg','active','2022-03-14 07:13:34','2022-03-14 07:13:34'),(3,2,'Sanitary Drainage','Plumbing fixtures from sewage to a public sewer or private sewage disposal system.','27f0ed2f17240a8c17b0e9104d428b22.jpeg','active','2022-03-14 07:15:39','2022-03-14 07:15:39'),(4,3,'Threading & Facial','Threading is much kinder to the skin and is considerably less painful than other methods of hair removal. ','f311f85bb5645575f19affa7831191df.jpeg','active','2022-03-14 07:25:30','2022-03-14 07:25:30'),(5,3,'Facial','A skin care treatments for the face, including steam, exfoliation (physical and chemical), extraction, creams, lotions, facial masks','85c3d2cb87c182ec6fdfdfbc7f3c5d7a.jpeg','active','2022-03-14 07:27:21','2022-03-14 07:27:21'),(6,1,'Electrician 2','Electrician 2','283563988ba1aa69c6a1e044782dd98c.jpeg','active','2022-03-14 09:36:27','2022-03-14 09:36:27'),(7,1,'Electrician 3','Electrician 3','c7f5f103ecec2e23a3a362c4225116b3.jpeg','active','2022-03-14 09:36:42','2022-03-14 09:36:42'),(8,1,'Electrician 4','Electrician 4','dc1c55982379b675ddddf07a20bf8721.jpeg','active','2022-03-14 09:37:00','2022-03-14 09:37:00'),(9,1,'Switch Replacement','We replace and repair your switches at a low cost. We do not cover the spare parts cost. ','8468ad1b50720177aa3f486f2c9a8663.png','active','2022-03-14 11:46:05','2022-03-15 13:53:02'),(10,1,'Fan Repair','We replace and repair ceiling, exhaust, and wall fans at a low cost. We do not cover the spare parts cost. ','6fa9a53f2228133249c6a1d88b7b1d2f.png','active','2022-03-14 11:50:20','2022-03-15 13:52:42'),(11,1,'Light Repair','We replace and repair lights at a low cost. We do not cover the spare parts cost.','6ebbb48a60df39e6b2e41d111a88a710.png','active','2022-03-14 11:54:19','2022-03-15 13:52:15'),(12,1,'TV Installation','We install and service televisions at a low cost. We do not cover the spare parts cost. ','edca8ce2aa8fa9d90a5bce5a968c12d4.png','active','2022-03-14 12:00:39','2022-03-15 13:51:43'),(13,2,'Pipe Leakage','We replace and repair water pipe leakages at a low cost. We do not cover the spare parts cost. ','c876352a82f31c57e29cad2850427d96.png','active','2022-03-14 12:03:35','2022-03-16 13:44:55'),(14,2,'Tap Leakages','We replace and repair water tap leakages at a low cost. We do not cover the spare parts cost. ','8582f829ea3530b88b2f4e0f68d56a10.png','active','2022-03-14 12:05:13','2022-03-15 13:50:48'),(15,2,'Shower Mount ','We replace and repair shower mounts at a low cost. We do not cover the spare parts cost. ','f41b93ca62d9ac8b29b88845f6df8cba.png','active','2022-03-14 12:10:28','2022-03-15 13:50:11'),(16,2,'Wash Basin','We replace and install wash basins at a low cost. We do not cover the spare parts cost. ','77f61b8eb39bf1fb199ced12947c5889.png','active','2022-03-14 12:15:42','2022-03-15 14:12:06'),(17,3,'Face & Head Massage','We provide best-in-class massage services from the comfort of your home. Salon at home services!','46ad19e7aa44bc250f1f66e9e3a60ad8.png','active','2022-03-14 12:24:36','2022-03-15 13:46:37'),(18,3,'Facial','We provide best-in-class facial services from the comfort of your home. Salon at home services!','3bf29625f6c37080292125ce6535f723.png','active','2022-03-14 12:25:10','2022-03-15 13:46:25'),(19,3,'Manicure','We provide best-in-class manicure services from the comfort of your home. Salon at home services!','a9c946a2a4a6d01fc506e49a5b746223.png','active','2022-03-14 12:26:30','2022-03-15 13:46:12'),(20,3,'Pedicure','We provide best-in-class complete foot care services from the comfort of your home. Salon at home services!','a09e943cbafdf48d9a012a471096af9f.png','active','2022-03-14 12:28:22','2022-03-15 13:45:58'),(21,4,'Home Cleaning','Our expert professionals provide the best-in-class full-service home cleaning.','976262c59b156096d4b792147d87195a.png','active','2022-03-14 12:41:14','2022-03-15 13:45:44'),(22,4,'Kitchen Cleaning ','Our expert professionals provide the best-in-class kitchen cleaning service like sink cleaning, dirt removal, and chimney cleaning.','a77d57f01e1fb1fb958274eaa51c8096.png','active','2022-03-14 12:41:40','2022-03-15 13:45:25'),(23,4,'Pest Control ','Our expert professionals provide the best-in-class pest control service like cockroaches, bed bugs, and ant control. ','7f26b47ed074a4d268a6b4c0864cacc7.png','active','2022-03-14 12:45:12','2022-03-15 13:45:14'),(24,4,'Bathroom Cleaning','Our expert professionals provide the best-in-class bathroom cleaning service like sink cleaning, dirt & stain removal, and tiles cleaning.','159c505a12efcf7677036a4bf071f983.png','active','2022-03-14 12:45:47','2022-03-15 13:45:01'),(25,6,'Installation','Our professionals provide the best-in-class AC installation services. Rest assured!','4194a36787f8a26b4d1fed3a0e5c771e.png','active','2022-03-15 13:56:18','2022-03-15 13:56:18'),(26,6,'Removal','Our professionals provide the best-in-class AC un-installation services. Rest assured!','b40bb583fb9176668f42fcf1f3946685.png','active','2022-03-15 13:56:48','2022-03-15 13:56:48'),(27,6,'Repair','Our professionals provide the best-in-class AC repair services. Rest assured!','c743a063b52b5c4d3bc81144d8496203.png','active','2022-03-15 13:57:17','2022-03-15 13:57:17'),(28,6,'Cleaning','Our professionals provide the best-in-class AC deep cleaning services. Rest assured!','b2d5fcd00edadb2761e0eae008393dc4.png','active','2022-03-15 13:57:44','2022-03-15 13:57:44'),(29,8,'Refrigerator','Our professionals provide the best-in-class refrigerator repair services. Rest assured! ','fb6e69369463741604279ab997ea7d58.png','active','2022-03-15 13:58:31','2022-03-15 13:58:31'),(30,8,'Washing machine','Our professionals provide the best-in-class washing machine installation and repair services. Rest assured! ','82eee26cc477a2669731b4538eaaeded.png','active','2022-03-15 13:58:56','2022-03-15 13:58:56'),(31,8,'Water purifier','Our professionals provide the best-in-class water purifier installation and repair services. Rest assured! ','12dda32d937508bf91c4e4168d41ce67.png','active','2022-03-15 13:59:25','2022-03-15 13:59:25'),(32,8,'Chimneys','Our professionals provide the best-in-class Chimneys installation, deep cleaning, and repair services. Rest assured! ','0a948b3ca79dd128d1cc50f41a4c95e5.png','active','2022-03-15 13:59:46','2022-03-15 13:59:46'),(33,5,'Full home painting','We provide best-in-class internal wall painting services with certified professionals. ','816a587521a4c4ae462b66f50a247dd1.png','active','2022-03-15 14:00:14','2022-03-15 14:00:14'),(34,5,'Waterproofing','We provide best-in-class waterproof painting services with certified professionals. ','268072d039b1bf5ad87acea45817d4fc.png','active','2022-03-15 14:00:40','2022-03-15 14:00:40'),(35,5,'Roof painting','We provide best-in-class roof painting services with certified professionals. ','fffd98ddc7e5273b4a1f44b64659c2cc.png','active','2022-03-15 14:01:02','2022-03-15 14:01:02'),(36,7,'Hair cut','Our professionals provide the best-in-class hair cut services. Happy styling!','ccc137c920f2059f211c869cd462a785.png','active','2022-03-15 14:02:46','2022-03-15 14:02:46'),(37,7,'Hair cut + Beard gro','Our professionals provide the best-in-class hair cut and beard grooming services. Happy styling! ','2e181d4cf4d48d79c81153731fc03520.png','active','2022-03-15 14:03:09','2022-03-15 14:03:09'),(38,7,'Face care','Our professionals provide the best-in-class face care services like tan removal and dust cleanup. Happy styling! ','fa9b1bbec60bf64237ad9b40a014ff05.png','active','2022-03-15 14:03:32','2022-03-15 14:03:32');
/*!40000 ALTER TABLE `SubCategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TempImages`
--

DROP TABLE IF EXISTS `TempImages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TempImages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tableName` varchar(255) DEFAULT NULL,
  `fieldName` varchar(255) DEFAULT NULL,
  `fileName` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TempImages`
--

LOCK TABLES `TempImages` WRITE;
/*!40000 ALTER TABLE `TempImages` DISABLE KEYS */;
INSERT INTO `TempImages` VALUES (1,'Homepage','safetyGridImage3',NULL,'2022-11-28 05:09:55','2022-11-28 05:10:19');
/*!40000 ALTER TABLE `TempImages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TestingNumber`
--

DROP TABLE IF EXISTS `TestingNumber`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TestingNumber` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dialCode` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TestingNumber`
--

LOCK TABLES `TestingNumber` WRITE;
/*!40000 ALTER TABLE `TestingNumber` DISABLE KEYS */;
/*!40000 ALTER TABLE `TestingNumber` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ThreadItems`
--

DROP TABLE IF EXISTS `ThreadItems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ThreadItems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `threadId` int NOT NULL,
  `isRead` tinyint(1) DEFAULT '0',
  `authorId` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `message` mediumtext,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `threadId` (`threadId`),
  CONSTRAINT `threaditems_ibfk_1` FOREIGN KEY (`threadId`) REFERENCES `Threads` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ThreadItems`
--

LOCK TABLES `ThreadItems` WRITE;
/*!40000 ALTER TABLE `ThreadItems` DISABLE KEYS */;
/*!40000 ALTER TABLE `ThreadItems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Threads`
--

DROP TABLE IF EXISTS `Threads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Threads` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bookingId` int NOT NULL,
  `userId` char(36) NOT NULL,
  `partnerId` char(36) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Threads`
--

LOCK TABLES `Threads` WRITE;
/*!40000 ALTER TABLE `Threads` DISABLE KEYS */;
/*!40000 ALTER TABLE `Threads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TransactionHistory`
--

DROP TABLE IF EXISTS `TransactionHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TransactionHistory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bookingId` int NOT NULL,
  `userId` char(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `partnerId` char(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `amount` float NOT NULL,
  `currency` varchar(255) NOT NULL,
  `transactionId` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TransactionHistory`
--

LOCK TABLES `TransactionHistory` WRITE;
/*!40000 ALTER TABLE `TransactionHistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `TransactionHistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` char(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phoneNumber` varchar(255) NOT NULL,
  `phoneDialCode` varchar(255) NOT NULL,
  `phoneCountryCode` varchar(255) DEFAULT NULL,
  `lat` float DEFAULT NULL,
  `lng` float DEFAULT NULL,
  `userStatus` enum('pending','active','inactive') DEFAULT 'pending',
  `isActive` tinyint(1) NOT NULL DEFAULT '0',
  `isBan` tinyint(1) NOT NULL DEFAULT '0',
  `userType` tinyint DEFAULT '1',
  `activeStatus` enum('active','inactive') DEFAULT NULL,
  `overallRating` float DEFAULT '0',
  `deletedAt` datetime DEFAULT NULL,
  `userTypeUpdatedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserCategory`
--

DROP TABLE IF EXISTS `UserCategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserCategory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` char(36) NOT NULL,
  `mainCategoryId` int NOT NULL,
  `subCategoryId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `basePrice` float DEFAULT '0',
  `currency` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserCategory`
--

LOCK TABLES `UserCategory` WRITE;
/*!40000 ALTER TABLE `UserCategory` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserCategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserDocument`
--

DROP TABLE IF EXISTS `UserDocument`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserDocument` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` char(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `imageName` varchar(255) NOT NULL,
  `type` enum('identity','experience') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserDocument`
--

LOCK TABLES `UserDocument` WRITE;
/*!40000 ALTER TABLE `UserDocument` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserDocument` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserLogin`
--

DROP TABLE IF EXISTS `UserLogin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserLogin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key` mediumtext,
  `userId` char(36) DEFAULT NULL,
  `deviceType` varchar(255) DEFAULT NULL,
  `deviceDetail` mediumtext,
  `deviceId` varchar(255) DEFAULT NULL,
  `userType` tinyint DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `userlogin_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserLogin`
--

LOCK TABLES `UserLogin` WRITE;
/*!40000 ALTER TABLE `UserLogin` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserLogin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserProfile`
--

DROP TABLE IF EXISTS `UserProfile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserProfile` (
  `profileId` int NOT NULL AUTO_INCREMENT,
  `userId` char(36) DEFAULT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `lat` float DEFAULT NULL,
  `lng` float DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `zipcode` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `preferredCurrency` varchar(255) DEFAULT 'USD',
  `preferredLanguage` varchar(255) DEFAULT 'en',
  `preferredPaymentMethod` tinyint(1) DEFAULT '1',
  `paymentCustomerId` varchar(255) DEFAULT NULL,
  `cardLastFour` int DEFAULT NULL,
  `cardToken` varchar(255) DEFAULT NULL,
  `walletBalance` float DEFAULT '0',
  `walletUsed` float DEFAULT '0',
  `paymentMethodId` varchar(255) DEFAULT '0',
  `experienceDescription` longtext,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `preferredLat` float DEFAULT NULL,
  `preferredLng` float DEFAULT NULL,
  `preferredLocation` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `preferredType` varchar(255) DEFAULT NULL,
  `isDocumentUploaded` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`profileId`),
  UNIQUE KEY `profileId` (`profileId`),
  KEY `userId` (`userId`),
  CONSTRAINT `userprofile_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserProfile`
--

LOCK TABLES `UserProfile` WRITE;
/*!40000 ALTER TABLE `UserProfile` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserProfile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WalletHistory`
--

DROP TABLE IF EXISTS `WalletHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WalletHistory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) NOT NULL,
  `transactionId` varchar(255) NOT NULL,
  `cardLast4Digits` varchar(255) DEFAULT NULL,
  `customerId` varchar(255) DEFAULT NULL,
  `amount` float NOT NULL DEFAULT '0',
  `currency` varchar(255) NOT NULL DEFAULT 'USD',
  `paidBy` tinyint DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WalletHistory`
--

LOCK TABLES `WalletHistory` WRITE;
/*!40000 ALTER TABLE `WalletHistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `WalletHistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WorkHistory`
--

DROP TABLE IF EXISTS `WorkHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WorkHistory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `orderId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `orderItemId` int NOT NULL,
  `status` enum('started','paused','resumed','completed') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `bookingId` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WorkHistory`
--

LOCK TABLES `WorkHistory` WRITE;
/*!40000 ALTER TABLE `WorkHistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `WorkHistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WorkLogHistory`
--

DROP TABLE IF EXISTS `WorkLogHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WorkLogHistory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `bookingId` int NOT NULL,
  `orderId` int NOT NULL,
  `orderItemId` int NOT NULL,
  `startedAt` datetime DEFAULT NULL,
  `closedAt` datetime DEFAULT NULL,
  `status` enum('paused','completed') DEFAULT NULL,
  `totalDuration` float DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WorkLogHistory`
--

LOCK TABLES `WorkLogHistory` WRITE;
/*!40000 ALTER TABLE `WorkLogHistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `WorkLogHistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WorkingHistory`
--

DROP TABLE IF EXISTS `WorkingHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WorkingHistory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `partnerId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `orderId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `orderItemId` int NOT NULL,
  `status` enum('started','paused','resumed','completed') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WorkingHistory`
--

LOCK TABLES `WorkingHistory` WRITE;
/*!40000 ALTER TABLE `WorkingHistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `WorkingHistory` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-11-28 10:55:23
