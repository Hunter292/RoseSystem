-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 16, 2026 at 01:00 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ro_ksiegowa`
--

-- --------------------------------------------------------

--
-- Table structure for table `email_client`
--

CREATE TABLE `email_client` (
  `email_id` int(11) NOT NULL,
  `client_nip` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `email_client`
--

INSERT INTO `email_client` (`email_id`, `client_nip`, `email`) VALUES
(1, '9371030253', 'energo@test.com'),
(2, '9371030253', 'energo@test.com'),
(3, '9371030253', 'energo2@test.com'),
(4, '9371030253', 'energo3@test.com'),
(5, '1180253469', 'wisniew@test.com'),
(6, '9371030253', 'energo4@test.com'),
(7, '9371030253', 'energo5@test.com'),
(8, '1080028106', 'jadawel@jad.com'),
(9, '1080028106', 'jadawel2@test.com'),
(10, '5273165607', 'kacper05112004@gmail.com'),
(11, '5273165607', 'kacpercwiek@tutamail.com');

-- --------------------------------------------------------

--
-- Table structure for table `email_report`
--

CREATE TABLE `email_report` (
  `report_id` int(11) NOT NULL,
  `email_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `email_report`
--

INSERT INTO `email_report` (`report_id`, `email_id`) VALUES
(1, 1),
(2, 2),
(6, 1),
(8, 1),
(11, 10),
(11, 11);

-- --------------------------------------------------------

--
-- Table structure for table `faktura`
--

CREATE TABLE `faktura` (
  `faktura_id` int(11) NOT NULL,
  `client_nip` varchar(50) NOT NULL,
  `amount` float NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faktura`
--

INSERT INTO `faktura` (`faktura_id`, `client_nip`, `amount`, `date`) VALUES
(1, '7010868991', 866.67, '2026-05-04'),
(2, '7922073637', 1500, '2026-05-28'),
(3, '7010868991', 15000, '2026-05-28'),
(4, '5252900987', 15000, '2026-05-28'),
(5, '9371030253', 16000, '2026-05-28'),
(6, '5270103698', 7920, '2026-05-28'),
(7, '5252280013', 2155, '2026-05-28'),
(8, '5273165607', 1000, '2026-05-28'),
(9, '5214088466', 1050, '2026-05-28'),
(10, '8133940893', 3705, '2026-05-28'),
(11, '5242816452', 2250, '2026-05-28'),
(12, '1133129101', 200, '2026-05-28'),
(13, '1133129101', 5284.55, '2026-05-28'),
(14, 'PL 5252877998', 1000, '2026-05-28'),
(15, '1133179889', 1589.74, '2026-05-28'),
(16, 'PL 5252877998', 1000, '2026-05-28'),
(17, '5273164594', 1000, '2026-05-28'),
(18, '5214145655', 500, '2026-05-28'),
(19, '1132995888', 5150, '2026-05-28'),
(20, '5322109202', 14062.5, '2026-05-28'),
(21, 'PL 5342590705', 5050, '2026-05-28'),
(22, 'PL 5252877998', -1000, '2026-05-28'),
(23, 'PL 5252877998', -1000, '2026-05-28'),
(24, '5214004707', 7455, '2026-05-29'),
(25, '1080028106', 500, '2026-05-29'),
(26, '1251329146', 2930, '2026-05-29'),
(27, '5223048182', 11395, '2026-05-29'),
(28, '5223048182', 1000, '2026-05-29'),
(29, '9512359097', 2965, '2026-05-29'),
(30, '5252926946', 1000, '2026-05-29'),
(31, '5252733710', 1000, '2026-05-29'),
(32, '5252912714', 3055, '2026-05-29'),
(33, '5252866859', 300, '2026-05-29'),
(34, '5252731415', 300, '2026-05-29'),
(35, '1180253469', 81.3, '2026-05-29'),
(36, '5223050078', 800, '2026-05-29'),
(37, '5271523936', 991, '2026-05-29'),
(38, '5213445409', 3650, '2026-05-29'),
(39, '1133001878', 4200, '2026-05-29'),
(40, '8341903291', 1165, '2026-05-29'),
(41, '5211022567', 375, '2026-05-29'),
(42, '7011273277', 500, '2026-05-29'),
(43, '5253031200', 1000, '2026-05-29'),
(44, '5223128389', 7270, '2026-05-29'),
(45, '5210124544', 6960, '2026-05-29'),
(46, '8371875903', 500, '2026-05-29'),
(47, '1132003579', 700, '2026-05-29'),
(48, '5242388387', 2750, '2026-05-29'),
(49, '5272625691', 900, '2026-05-29'),
(50, '5272654617', 3500, '2026-05-29'),
(51, 'PL 5273176976', 1239, '2026-05-29'),
(52, '7010665779', 700, '2026-05-29'),
(53, 'PL 5253077277', 1700, '2026-05-29'),
(54, '8371875978', 2127.5, '2026-05-29'),
(55, '7011278369', 500, '2026-05-29'),
(56, 'PL 5253083579', 1360, '2026-05-29'),
(57, '7011276494', 4800, '2026-05-29'),
(58, '5243070687', 1000, '2026-05-29'),
(59, '7922073637', 3615, '2026-06-09'),
(60, '7010868991', 866.67, '2026-05-04'),
(61, '7922073637', 1500, '2026-05-28'),
(62, '7010868991', 15000, '2026-05-28'),
(63, '5252900987', 15000, '2026-05-28'),
(65, '5270103698', 7920, '2026-05-28'),
(66, '5252280013', 2155, '2026-05-28'),
(67, '5273165607', 1000, '2026-05-28'),
(68, '5214088466', 1050, '2026-05-28'),
(69, '8133940893', 3705, '2026-05-28'),
(70, '5242816452', 2250, '2026-05-28'),
(71, '1133129101', 200, '2026-05-28'),
(72, '1133129101', 5284.55, '2026-05-28'),
(73, 'PL 5252877998', 1000, '2026-05-28'),
(74, '1133179889', 1589.74, '2026-05-28'),
(75, 'PL 5252877998', 1000, '2026-05-28'),
(76, '5273164594', 1000, '2026-05-28'),
(77, '5214145655', 500, '2026-05-28'),
(78, '1132995888', 5150, '2026-05-28'),
(79, '5322109202', 14062.5, '2026-05-28'),
(80, 'PL 5342590705', 5050, '2026-05-28'),
(81, 'PL 5252877998', -1000, '2026-05-28'),
(82, 'PL 5252877998', -1000, '2026-05-28'),
(83, '5214004707', 7455, '2026-05-29'),
(84, '1080028106', 500, '2026-05-29'),
(85, '1251329146', 2930, '2026-05-29'),
(86, '5223048182', 11395, '2026-05-29'),
(87, '5223048182', 1000, '2026-05-29'),
(88, '9512359097', 2965, '2026-05-29'),
(89, '5252926946', 1000, '2026-05-29'),
(90, '5252733710', 1000, '2026-05-29'),
(91, '5252912714', 3055, '2026-05-29'),
(92, '5252866859', 300, '2026-05-29'),
(93, '5252731415', 300, '2026-05-29'),
(94, '1180253469', 81.3, '2026-05-29'),
(95, '5223050078', 800, '2026-05-29'),
(96, '5271523936', 991, '2026-05-29'),
(97, '5213445409', 3650, '2026-05-29'),
(98, '1133001878', 4200, '2026-05-29'),
(99, '8341903291', 1165, '2026-05-29'),
(100, '5211022567', 375, '2026-05-29'),
(101, '7011273277', 500, '2026-05-29'),
(102, '5253031200', 1000, '2026-05-29'),
(103, '5223128389', 7270, '2026-05-29'),
(104, '5210124544', 6960, '2026-05-29'),
(105, '8371875903', 500, '2026-05-29'),
(106, '1132003579', 700, '2026-05-29'),
(107, '5242388387', 2750, '2026-05-29'),
(108, '5272625691', 900, '2026-05-29'),
(109, '5272654617', 3500, '2026-05-29'),
(110, 'PL 5273176976', 1239, '2026-05-29'),
(111, '7010665779', 700, '2026-05-29'),
(112, 'PL 5253077277', 1700, '2026-05-29'),
(113, '8371875978', 2127.5, '2026-05-29'),
(114, '7011278369', 500, '2026-05-29'),
(115, 'PL 5253083579', 1360, '2026-05-29'),
(116, '7011276494', 4800, '2026-05-29'),
(117, '5243070687', 1000, '2026-05-29'),
(118, '7922073637', 3615, '2026-06-09');

-- --------------------------------------------------------

--
-- Table structure for table `klient`
--

CREATE TABLE `klient` (
  `client_nip` varchar(50) NOT NULL,
  `name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `klient`
--

INSERT INTO `klient` (`client_nip`, `name`) VALUES
('0', 'wewnętrzne'),
('1', 'klient1'),
('1080028106', 'JADAWEL UNITED COMPANY FOR MILITARY SUPPLIES SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ ODDZIAŁ W POLSCE'),
('1132003579', 'La Maison KATARZYNA KOSSACKA'),
('1132995888', 'FEUTECHNIK SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('1133001878', 'GALAPAGOS FILMS SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('1133129101', 'FUNDACJA W STRONĘ JUTRA'),
('1133179889', 'HANDEL MATERIAŁAMI SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('1180253469', 'ZDZISŁAW WIŚNIEWSKI \"Z.W.\" - FIRMA WIŚNIEWSKI; Zdzisław Wiśniewski CENTRUM DETEKTYWISTYCZNE INFORMACJI JAWNEJ'),
('1251329146', 'ZAKŁAD POLIGRAFICZNY KOSSACKI PACK SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('2', 'klient2'),
('3', 'klient3'),
('5210124544', '\"SABUR\" - SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('5211022567', 'NASH CONCEPT GROUP Piotr Augustyniak'),
('5213445409', 'GALAPAGOS SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('5214004707', 'SHOOTME SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('5214088466', 'ASPERITAS SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('5214145655', 'FUNDACJA SZTUKA WRAŻLIWOŚCI'),
('5223048182', 'COLUMBUS INDUSTRIES SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('5223050078', 'AMZ PROPERTIES SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('5223128389', 'HYBRID ADTECH SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('5242388387', 'KAMEN POLSKA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('5242816452', 'NOT BAD SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('5243070687', 'MILLENNIUM INVEST SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('5252280013', 'IMPLANTCAST POLSKA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('5252731415', 'RG BUD SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('5252733710', 'RG BUD SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ SPÓŁKA KOMANDYTOWA'),
('5252866859', 'SPACE CHANGER SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('5252900987', 'WSZYSTKO TO JEDNO SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('5252912714', 'GL BUD SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('5252926946', 'GM MYJNIE SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('5253031200', 'MYFACE AR SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('5270103698', 'BIUROMAX SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('5271523936', 'TOMASZ PARDO CENTRUM SZKOLENIOWO DORADCZE I ZARZĄDZANIA NIERUCHOMOŚCIAMI'),
('5272625691', 'ART HAIR DESIGN SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('5272654617', 'ART HAIR DESIGN SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ SPÓŁKA KOMANDYTOWA'),
('5273164594', 'ZUMI CAFE SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('5273165607', 'ALEGA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('5322109202', 'RISEVO SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('7010665779', 'GO4CONTROL SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('7010868991', 'FUNDACJA PRZEKRÓJ'),
('7011273277', 'MCPC SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('7011276494', 'TERIOS SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('7011278369', 'ELITE SECURITY SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('7922073637', '\"Różowa Księgowa\" Justyna Kozłowska'),
('8133940893', 'KORDIA LEGAL KRZYWAŃSKI ŚWISTAK SPÓŁKA KOMANDYTOWA'),
('8341903291', 'WIGOR SPECJALISTYKA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('8371875903', 'WD PESTIGO SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('8371875978', 'INVEST SERVICE 24 SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('9371030253', '\"ENERGOPOL-TRADE-OPOLE\" SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('9512359097', 'KORZYBSKI WOJCIŃSKI KANCELARIA RADCÓW PRAWNYCH SPÓŁKA KOMANDYTOWA'),
('PL 5252877998', 'GOŁASZEWSKI AGRO SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('PL 5253077277', 'CRSEL SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('PL 5253083579', 'MIEJSCE DOBRA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('PL 5273176976', 'VICOSAFE SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ'),
('PL 5342590705', 'COOKIE PRINTERS SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ');

-- --------------------------------------------------------

--
-- Table structure for table `praca`
--

CREATE TABLE `praca` (
  `work_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `client_nip` varchar(50) NOT NULL,
  `work_type` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `time_start` time NOT NULL,
  `time_finish` time NOT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `praca`
--

INSERT INTO `praca` (`work_id`, `employee_id`, `client_nip`, `work_type`, `date`, `time_start`, `time_finish`, `notes`) VALUES
(1, 1, '1', 'wyliczenia', '2026-05-15', '12:00:00', '13:10:00', ''),
(2, 1, '1', 'spotkanie', '2026-05-16', '11:00:00', '13:30:00', ''),
(3, 3, '1', 'spotkanie', '2026-06-16', '11:00:00', '13:30:00', ''),
(4, 3, '2', 'wyliczenia', '2026-07-16', '11:10:00', '13:30:00', ''),
(7, 3, '1', 'spotkanie', '2026-07-08', '22:00:00', '23:00:00', ''),
(8, 6, '1', 'Księgowanie faktur', '2026-07-18', '13:00:00', '14:00:00', ''),
(9, 6, '2', 'Księgowanie WB', '2026-07-17', '14:00:00', '15:00:00', ''),
(13, 6, '1', 'Analizy', '2026-07-19', '13:00:00', '14:30:00', ''),
(14, 6, '1080028106', 'Księgowanie faktur', '2026-05-19', '12:00:00', '14:00:00', ''),
(15, 6, '1132003579', 'Księgowanie WB', '2026-05-19', '14:00:00', '15:20:00', ''),
(17, 6, '9371030253', 'Usługi kadrowe', '2026-05-21', '12:00:00', '14:00:00', ''),
(18, 6, '5242388387', 'Analizy', '2026-07-26', '12:00:00', '13:00:00', ''),
(19, 6, '7922073637', 'Analizy', '2026-07-27', '12:00:00', '13:00:00', 'Ipsa non dolorem eum reiciendis expedita. Officiis id accusantium sed. Iusto tempora eligendi rerum aut odit incidunt hic'),
(20, 6, '9371030253', 'Podatki', '2026-07-27', '10:00:00', '14:00:00', ''),
(21, 6, '9371030253', 'Księgowanie faktur', '2026-08-05', '12:00:00', '13:00:00', 'test'),
(24, 6, '5273165607', 'Księgowanie WB', '2026-08-12', '00:12:00', '05:00:00', '');

-- --------------------------------------------------------

--
-- Table structure for table `pracownik`
--

CREATE TABLE `pracownik` (
  `employee_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `admin` tinyint(1) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pracownik`
--

INSERT INTO `pracownik` (`employee_id`, `name`, `email`, `password`, `admin`, `updated`) VALUES
(1, 'test', 'test_new', '$argon2id$v=19$m=65536,t=4,p=1$T1liRGdkaUFvSTJEdC5EVw$povXwOBi+E2PbDMe0X5Xe2XQP87UJLqZdr4c56afgDU', 2, '0000-00-00 00:00:00'),
(3, 'anna', 'test@roz.com', '$argon2id$v=19$m=65536,t=4,p=1$T1liRGdkaUFvSTJEdC5EVw$povXwOBi+E2PbDMe0X5Xe2XQP87UJLqZdr4c56afgDU', 0, '0000-00-00 00:00:00'),
(4, 'hanna', 'test2_new', '$argon2id$v=19$m=65536,t=4,p=1$T1liRGdkaUFvSTJEdC5EVw$povXwOBi+E2PbDMe0X5Xe2XQP87UJLqZdr4c56afgDU', 0, '0000-00-00 00:00:00'),
(6, 'admin', 'admin@admin.com', '$argon2id$v=19$m=65536,t=4,p=1$RDZiWXhoY3AzNXRsNWpVYw$5O03CPfpRztK/RLqUZVp0TN9NDhKlIR57b0w4wXEtBQ', 2, '2026-08-15 13:59:32');

-- --------------------------------------------------------

--
-- Table structure for table `rachunek`
--

CREATE TABLE `rachunek` (
  `acc_number` varchar(255) NOT NULL,
  `client_nip` varchar(255) NOT NULL,
  `ZUS` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rachunek`
--

INSERT INTO `rachunek` (`acc_number`, `client_nip`, `ZUS`) VALUES
('1111', '9371030253', 1),
('1234', '9371030253', 0);

-- --------------------------------------------------------

--
-- Table structure for table `raport`
--

CREATE TABLE `raport` (
  `report_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `client_nip` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `content` text NOT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `raport`
--

INSERT INTO `raport` (`report_id`, `employee_id`, `client_nip`, `date`, `content`, `notes`) VALUES
(1, 6, '9371030253', '2026-08-12', 'VAT7: 123 okres: 2025;\nVAT7K: 1111 okres: 12-2025;\n', ''),
(2, 6, '9371030253', '2026-08-12', 'VAT8: 123 okres: 2025;\nCIT 10Z: 555 okres: 11-2026;', NULL),
(6, 6, '9371030253', '2026-08-12', 'VAT7: 100 okres: 2025;\nVAT7K: 1000.00 okres: 11-2025;\nCIT8: 200.95 okres: 12-2025;\n\n', ''),
(8, 6, '9371030253', '2026-08-12', 'VAT7: 123 okres: 2025;ZUS: 200.00 rachunek: 1111 okres: 12-2025;', 'test spacji'),
(11, 6, '5273165607', '2026-08-15', 'VAT7 - 123.00 zł termin płatności:2026-08-31;VAT8 - 1000.29 zł termin płatności:2026-09-30;PIT36 - 200.68 zł termin płatności:2026-08-31;', 'test notatki');

-- --------------------------------------------------------

--
-- Table structure for table `task_worker`
--

CREATE TABLE `task_worker` (
  `task_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `task_worker`
--

INSERT INTO `task_worker` (`task_id`, `employee_id`, `status`) VALUES
(5, 3, 1),
(5, 6, 3),
(6, 3, 0),
(6, 6, 0),
(7, 3, 0),
(8, 6, 3),
(9, 3, 0),
(10, 3, 0),
(10, 4, 0),
(10, 6, 0);

-- --------------------------------------------------------

--
-- Table structure for table `zadanie`
--

CREATE TABLE `zadanie` (
  `task_id` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `deadline` date DEFAULT NULL,
  `employee_id` int(11) NOT NULL,
  `client_nip` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `priority` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `zadanie`
--

INSERT INTO `zadanie` (`task_id`, `date`, `deadline`, `employee_id`, `client_nip`, `description`, `priority`) VALUES
(5, '2026-08-11 19:03:32', '2026-08-12', 6, '9371030253', 'test', 0),
(6, '2026-08-11 19:08:32', '2026-08-13', 6, '7922073637', 'testse rrjroej dmwaomd awopekor fepsf', 0),
(8, '2026-08-11 21:02:02', '2026-08-29', 6, '5210124544', 'with his cooking, he&amp;#039;s raising the worlds healthiest kid knowing everything he makes is homemade to the fullest, Congratulations, man!', 0),
(10, '2026-08-11 22:38:23', '0000-00-00', 6, '5273165607', 'test czy w obu się pojawi', 0);

-- --------------------------------------------------------

--
-- Table structure for table `zmiana_hasla`
--

CREATE TABLE `zmiana_hasla` (
  `reset_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `PIN` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `used` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `zmiana_hasla`
--

INSERT INTO `zmiana_hasla` (`reset_id`, `employee_id`, `PIN`, `date`, `used`) VALUES
(1, 1, 123456, '2026-08-01 15:45:00', 0),
(2, 1, 123456, '2026-07-08 15:46:40', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `email_client`
--
ALTER TABLE `email_client`
  ADD PRIMARY KEY (`email_id`) USING BTREE,
  ADD KEY `client_nip` (`client_nip`);

--
-- Indexes for table `email_report`
--
ALTER TABLE `email_report`
  ADD PRIMARY KEY (`report_id`,`email_id`),
  ADD KEY `email_id` (`email_id`);

--
-- Indexes for table `faktura`
--
ALTER TABLE `faktura`
  ADD PRIMARY KEY (`faktura_id`),
  ADD KEY `client_nip` (`client_nip`);

--
-- Indexes for table `klient`
--
ALTER TABLE `klient`
  ADD PRIMARY KEY (`client_nip`);

--
-- Indexes for table `praca`
--
ALTER TABLE `praca`
  ADD PRIMARY KEY (`work_id`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `client_nip` (`client_nip`);

--
-- Indexes for table `pracownik`
--
ALTER TABLE `pracownik`
  ADD PRIMARY KEY (`employee_id`);

--
-- Indexes for table `rachunek`
--
ALTER TABLE `rachunek`
  ADD PRIMARY KEY (`acc_number`),
  ADD KEY `client_nip` (`client_nip`);

--
-- Indexes for table `raport`
--
ALTER TABLE `raport`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `client_nip` (`client_nip`);

--
-- Indexes for table `task_worker`
--
ALTER TABLE `task_worker`
  ADD PRIMARY KEY (`task_id`,`employee_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `zadanie`
--
ALTER TABLE `zadanie`
  ADD PRIMARY KEY (`task_id`);

--
-- Indexes for table `zmiana_hasla`
--
ALTER TABLE `zmiana_hasla`
  ADD PRIMARY KEY (`reset_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `email_client`
--
ALTER TABLE `email_client`
  MODIFY `email_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `faktura`
--
ALTER TABLE `faktura`
  MODIFY `faktura_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=119;

--
-- AUTO_INCREMENT for table `praca`
--
ALTER TABLE `praca`
  MODIFY `work_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `pracownik`
--
ALTER TABLE `pracownik`
  MODIFY `employee_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `raport`
--
ALTER TABLE `raport`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `zadanie`
--
ALTER TABLE `zadanie`
  MODIFY `task_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `zmiana_hasla`
--
ALTER TABLE `zmiana_hasla`
  MODIFY `reset_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `email_client`
--
ALTER TABLE `email_client`
  ADD CONSTRAINT `email_client_ibfk_3` FOREIGN KEY (`client_nip`) REFERENCES `klient` (`client_nip`) ON UPDATE CASCADE;

--
-- Constraints for table `email_report`
--
ALTER TABLE `email_report`
  ADD CONSTRAINT `email_report_ibfk_1` FOREIGN KEY (`email_id`) REFERENCES `email_client` (`email_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `email_report_ibfk_2` FOREIGN KEY (`report_id`) REFERENCES `raport` (`report_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `faktura`
--
ALTER TABLE `faktura`
  ADD CONSTRAINT `faktura_ibfk_1` FOREIGN KEY (`client_nip`) REFERENCES `klient` (`client_nip`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `praca`
--
ALTER TABLE `praca`
  ADD CONSTRAINT `praca_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `pracownik` (`employee_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `praca_ibfk_3` FOREIGN KEY (`client_nip`) REFERENCES `klient` (`client_nip`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `rachunek`
--
ALTER TABLE `rachunek`
  ADD CONSTRAINT `rachunek_ibfk_1` FOREIGN KEY (`client_nip`) REFERENCES `klient` (`client_nip`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `raport`
--
ALTER TABLE `raport`
  ADD CONSTRAINT `raport_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `pracownik` (`employee_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `raport_ibfk_2` FOREIGN KEY (`client_nip`) REFERENCES `klient` (`client_nip`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `task_worker`
--
ALTER TABLE `task_worker`
  ADD CONSTRAINT `task_worker_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `pracownik` (`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `zadanie`
--
ALTER TABLE `zadanie`
  ADD CONSTRAINT `zadanie_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `pracownik` (`employee_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `zadanie_ibfk_2` FOREIGN KEY (`client_nip`) REFERENCES `klient` (`client_nip`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
