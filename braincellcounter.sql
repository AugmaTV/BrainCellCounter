-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mar. 07 déc. 2021 à 17:29
-- Version du serveur :  5.7.31
-- Version de PHP : 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `braincellcounter`
--

-- --------------------------------------------------------

--
-- Structure de la table `braincell`
--

DROP TABLE IF EXISTS `braincell`;
CREATE TABLE IF NOT EXISTS `braincell` (
  `idbraincell` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `updated` datetime DEFAULT CURRENT_TIMESTAMP,
  `count` float NOT NULL,
  `debilus` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`idbraincell`),
  KEY `fk_braincell_debilus` (`debilus`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Structure de la table `debilus`
--

DROP TABLE IF EXISTS `debilus`;
CREATE TABLE IF NOT EXISTS `debilus` (
  `iddebilus` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `pseudo` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `registered` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`iddebilus`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `braincell`
--
ALTER TABLE `braincell`
  ADD CONSTRAINT `fk_braincell_debilus` FOREIGN KEY (`debilus`) REFERENCES `debilus` (`iddebilus`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
