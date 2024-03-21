-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 15, 2024 at 08:37 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tch099`
--

DROP TABLE groupes;
DROP TABLE listes;
DROP TABLE listes_elements;
DROP TABLE reunions;
DROP TABLE utilisateurs;
DROP TABLE utilisateurs_groupes;
DROP TABLE utilisateurs_reunions;
-- --------------------------------------------------------

--
-- Table structure for table `groupes`
--

CREATE TABLE `groupes` (
  `id_groupes` int(10) NOT NULL,
  `courriel_enseignant` varchar(255) NOT NULL,
  `nom` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `listes`
--

CREATE TABLE `listes` (
  `id_listes` int(10) NOT NULL,
  `id_elements` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `listes_elements`
--

CREATE TABLE `listes_elements` (
  `id_elements` int(10) NOT NULL,
  `message` varchar(255) NOT NULL,
  `complete` tinyint(1) NOT NULL,
  `id_listes` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reunions`
--

CREATE TABLE `reunions` (
  `id_reunions` int(10) NOT NULL,
  `titre` varchar(30) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `heure_debut` time NOT NULL,
  `heure_fin` time NOT NULL,
  `date` date NOT NULL,
  `notes_publiques` text DEFAULT NULL,
  `courriel_createur` varchar(255) NOT NULL,
  `id_groupes` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `courriel_utilisateurs` text NOT NULL,
  `nom` varchar(25) NOT NULL DEFAULT 'Nom d''utilisateur',
  `photo` longblob DEFAULT NULL,
  `type` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `utilisateurs_groupes`
--

CREATE TABLE `utilisateurs_groupes` (
  `courriel_etudiants` varchar(255) NOT NULL,
  `id_groupes` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `utilisateurs_reunions`
--

CREATE TABLE `utilisateurs_reunions` (
  `courriel_utilisateurs` text NOT NULL,
  `id_reunions` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `groupes`
--
ALTER TABLE `groupes`
  ADD PRIMARY KEY (`id_groupes`);

--
-- Indexes for table `reunions`
--
ALTER TABLE `reunions`
  ADD PRIMARY KEY (`id_reunions`);

--
-- AUTO_INCREMENT for table `reunions`
--
ALTER TABLE `reunions`
  MODIFY `id_reunions` int(10) NOT NULL AUTO_INCREMENT;
COMMIT;


--
-- Indexes for table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD UNIQUE KEY `courriel_utilisateurs` (`courriel_utilisateurs`) USING HASH;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;



INSERT INTO `groupes` (`id_groupes`, `courriel_enseignant`, `nom`) VALUES
(20, 'william.lavoie.3@ens.etsmtl.ca', 'will'),
(21, 'william.lavoie.3@ens.etsmtl.ca', 'will'),
(22, 'william.lavoie.3@ens.etsmtl.ca', 'William Lavoie'),
(23, 'william.lavoie.3@ens.etsmtl.ca', 'William Lavoie'),
(24, 'william.lavoie.3@ens.etsmtl.ca', 'wefwef wefefwef');


INSERT INTO `reunions` (`id_reunions`, `titre`, `description`, `heure_debut`, `heure_fin`, `date`, `notes_publiques`, `courriel_createur`, `id_groupes`) VALUES
(1, 'eeeee', '', '22:26:00', '23:26:00', '2024-03-20', NULL, 'william.lavoie.3@ens.etsmtl.ca', NULL),
(2, 'aaaa', '', '22:16:00', '23:16:00', '2024-03-28', NULL, 'william.lavoie.3@ens.etsmtl.ca', NULL),
(3, 'e', '', '22:17:00', '23:17:00', '2024-03-27', NULL, 'william.lavoie.3@ens.etsmtl.ca', NULL),
(4, 'efef', '', '22:18:00', '23:18:00', '2024-03-26', NULL, 'william.lavoie.3@ens.etsmtl.ca', NULL),
(5, 'titre', '', '02:19:00', '03:19:00', '2024-03-27', NULL, 'william.lavoie.3@ens.etsmtl.ca', NULL),
(6, 'test', '', '03:22:00', '05:22:00', '2024-03-31', NULL, 'william.lavoie.3@ens.etsmtl.ca', NULL),
(7, 'ttt', '', '00:03:00', '22:08:00', '2024-03-27', NULL, 'william.lavoie.3@ens.etsmtl.ca', NULL),
(30, 'a', 'aa', '12:45:00', '12:47:00', '2024-02-28', NULL, 'william.lavoie.3@ens.etsmtl.ca', NULL),
(31, 'titre', '', '01:34:00', '03:34:00', '2024-04-03', NULL, 'william.lavoie.3@ens.etsmtl.ca', NULL),
(35, 'test', NULL, '55:41:51', '32:41:51', '2024-02-28', NULL, 'will', NULL),
(36, 'ttt', '', '00:03:00', '22:08:00', '2024-03-27', NULL, 'william.lavoie.3@ens.etsmtl.ca', NULL),
(37, 'The fellowship', '', '16:40:00', '19:40:00', '2024-03-29', NULL, 'william.lavoie.3@ens.etsmtl.ca', NULL),
(38, 'test', '', '13:13:00', '15:13:00', '2024-04-02', NULL, 'william.lavoie.3@ens.etsmtl.ca', NULL),
(39, 'Test', '', '13:47:00', '15:47:00', '2024-03-23', NULL, 'william.lavoie.3@ens.etsmtl.ca', NULL),
(40, 'aa', '', '13:48:00', '15:48:00', '2024-03-28', NULL, 'william.lavoie.3@ens.etsmtl.ca', NULL),
(41, 'ee', '', '12:48:00', '14:48:00', '2024-03-30', NULL, 'william.lavoie.3@ens.etsmtl.ca', NULL),
(42, 'a', 'aa', '12:45:00', '12:47:00', '2024-04-05', NULL, 'william.lavoie.3@ens.etsmtl.ca', NULL),
(43, 'ee', '', '20:35:00', '22:35:00', '2024-03-24', NULL, 'william.lavoie.3@ens.etsmtl.ca', NULL),
(44, 'eee', '', '20:44:00', '22:44:00', '2024-03-20', NULL, 'william.lavoie.3@ens.etsmtl.ca', NULL),
(45, 'test', '', '15:47:00', '17:47:00', '2024-03-27', NULL, 'william.lavoie.3@ens.etsmtl.ca', NULL),
(46, 'jjj', '', '14:56:00', '18:56:00', '2024-03-27', NULL, 'william.lavoie.3@ens.etsmtl.ca', NULL),
(47, 'hf', '', '16:56:00', '17:56:00', '2024-03-27', NULL, 'william.lavoie.3@ens.etsmtl.ca', NULL),
(48, 'eee', '', '17:41:00', '20:41:00', '2024-03-22', NULL, 'william.lavoie.3@ens.etsmtl.ca', NULL),
(49, 'efef', '', '21:46:00', '23:46:00', '2024-03-25', NULL, 'william.lavoie.3@ens.etsmtl.ca', NULL);


INSERT INTO `utilisateurs` (`courriel_utilisateurs`, `nom`, `photo`, `type`) VALUES
('will@hotmail.ca', 'Will', NULL, '');



INSERT INTO `utilisateurs_groupes` (`courriel_etudiants`, `id_groupes`) VALUES
('will@hotmail.ca', 21),
('will@hotmail.ca', 22),
('wii@hro.ca', 22),
('william.lavoie.3@ens.etsmtl.ca', 22),
('will@hotmail.ca', 23),
('william.lavoie.3@ens.etsmtl.ca', 20),
('will@hotmail.ca', 24);

INSERT INTO `utilisateurs_reunions` (`courriel_utilisateurs`, `id_reunions`) VALUES
('will@hotmail.ca', 5),
('william.lavoie.3@ens.etsmtl.ca', 6),
('will@hotmail.ca', 6),
('william.lavoie.3@ens.etsmtl.ca', 7),
('william.lavoie.3@ens.etsmtl.ca', 30),
('william.lavoie.3@ens.etsmtl.ca', 31),
('will@hotmail.ca', 31),
('william.lavoie.3@ens.etsmtl.ca', 35),
('eeee', 30),
('will@hotmail.ca', 30),
('test@hotmail.ca', 30),
('william.lavoie.3@ens.etsmtl.ca', 36),
('william.lavoie.3@ens.etsmtl.ca', 36),
('william.lavoie.3@ens.etsmtl.ca', 37),
('will@hotmail.ca', 37),
('william.lavoie.3@ens.etsmtl.ca', 38),
('william.lavoie.3@ens.etsmtl.ca', 39),
('will@hotmail.ca', 39),
('william.lavoie.3@ens.etsmtl.ca', 40),
('will@hotmail.ca', 40),
('william.lavoie.3@ens.etsmtl.ca', 41),
('william.lavoie.3@ens.etsmtl.ca', 42),
('william.lavoie.3@ens.etsmtl.ca', 43),
('william.lavoie.3@ens.etsmtl.ca', 44),
('william.lavoie.3@ens.etsmtl.ca', 45),
('william.lavoie.3@ens.etsmtl.ca', 46),
('william.lavoie.3@ens.etsmtl.ca', 47),
('william.lavoie.3@ens.etsmtl.ca', 48),
('william.lavoie.3@ens.etsmtl.ca', 49);




UPDATE groupes
SET courriel_enseignant = 'etienne.barriere@outlook.com'
WHERE courriel_enseignant = 'william.lavoie.3@ens.etsmtl.ca';

UPDATE utilisateurs
SET courriel_enseignant = 'etienne.barriere@outlook.com'
WHERE courriel_enseignant = 'william.lavoie.3@ens.etsmtl.ca';

UPDATE utilisateurs_groupes
SET courriel_etudiants = 'etienne.barriere@outlook.com'
WHERE courriel_etudiants = 'william.lavoie.3@ens.etsmtl.ca';

UPDATE utilisateurs_reunions
SET courriel_utilisateurs = 'etienne.barriere@outlook.com'
WHERE courriel_utilisateurs = 'william.lavoie.3@ens.etsmtl.ca';

UPDATE reunions
SET courriel_createur = 'etienne.barriere@outlook.com'
WHERE courriel_createur = 'william.lavoie.3@ens.etsmtl.ca';
