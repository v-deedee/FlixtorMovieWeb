-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 05, 2023 at 08:29 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `flixtor`
--

-- --------------------------------------------------------

--
-- Table structure for table `actor`
--

CREATE TABLE `actor` (
  `id` tinyint(3) UNSIGNED NOT NULL,
  `full_name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `actor`
--

INSERT INTO `actor` (`id`, `full_name`) VALUES
(1, 'Keanu Reeves'),
(2, 'Clancy Brown'),
(3, 'George Georgiou'),
(4, 'Laurence Fishburne'),
(5, 'Francois Cluzet'),
(6, 'Omar Sy'),
(7, 'Anne Le Ny'),
(8, 'Audrey Fleurot'),
(9, 'Marlon Brando'),
(10, 'Al Pacino'),
(11, 'James Caan'),
(12, 'Diane Keaton'),
(13, 'Richard S. Castellan'),
(14, 'Robert Duvall'),
(15, 'Matthew Broderick'),
(16, 'Jeremy Irons'),
(17, 'Rowan Atkinson'),
(18, 'James Earl Jones'),
(19, 'Whoopi Goldberg'),
(20, 'Sebastiao Salgado'),
(21, 'Wim Wenders'),
(22, 'Lélia Wanick Salgado'),
(23, 'Ethan Hawke'),
(24, 'Julie Delpy'),
(25, 'Margot Robbie'),
(26, 'Jonah Hill'),
(27, 'Leonardo Dicaprio');

-- --------------------------------------------------------

--
-- Table structure for table `cast`
--

CREATE TABLE `cast` (
  `id` tinyint(3) UNSIGNED NOT NULL,
  `movie_id` tinyint(3) UNSIGNED NOT NULL,
  `actor_id` tinyint(3) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cast`
--

INSERT INTO `cast` (`id`, `movie_id`, `actor_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 1, 4),
(5, 2, 5),
(6, 2, 6),
(7, 2, 7),
(8, 2, 8),
(9, 3, 9),
(10, 3, 10),
(11, 3, 11),
(12, 3, 12),
(13, 3, 13),
(14, 3, 14),
(15, 4, 15),
(16, 4, 16),
(17, 4, 17),
(18, 4, 18),
(19, 4, 19),
(20, 5, 19),
(21, 5, 20),
(22, 5, 21),
(23, 6, 23),
(24, 6, 24),
(25, 7, 25),
(26, 7, 26),
(27, 7, 27);

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` tinyint(3) UNSIGNED NOT NULL,
  `movie_id` tinyint(3) UNSIGNED NOT NULL,
  `gerne_id` tinyint(3) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `movie_id`, `gerne_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 2, 4),
(5, 2, 6),
(6, 2, 6),
(7, 3, 2),
(8, 3, 4),
(9, 4, 12),
(10, 4, 18),
(11, 4, 4),
(12, 4, 7),
(13, 5, 6),
(14, 5, 8),
(15, 5, 20),
(16, 6, 4),
(17, 6, 10),
(18, 7, 6),
(19, 7, 5),
(20, 7, 4),
(22, 7, 2);

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `id` tinyint(3) UNSIGNED NOT NULL,
  `content` text NOT NULL,
  `violate` tinyint(1) NOT NULL,
  `create_at` datetime NOT NULL,
  `update_at` datetime DEFAULT NULL,
  `user_id` tinyint(3) UNSIGNED NOT NULL,
  `movie_id` tinyint(3) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `comment`
--
DELIMITER $$
CREATE TRIGGER `trigger_insert_comment` BEFORE INSERT ON `comment` FOR EACH ROW BEGIN
	-- danh sách các từ cấm
	SET @banned_words = 'arse,arsehead,arsehole,ass,asshole,bastard,bitch,bloody,bollocks,brotherfucker,bugger,bullshit,child-fucker,Christ on a bike,Christ on a cracker,cock,cocksucker,crap,cunt,damn,damn it,dick,dickhead,dyke,fatherfucker,frigger,fuck,goddamn,godsdamn,hell,holy shit,horseshit,in shit,Jesus Christ,Jesus fuck,Jesus H. Christ,Jesus Harold Christ,Jesus wept,Jesus, Mary and Joseph,kike,motherfucker,nigga,nigra,piss,prick,pussy,shit,shit ass,shite,sisterfucker,slut,son of a bitch,son of a whore,spastic,sweet Jesus,turd,twat,wanker';

	-- lấy nội dung content mới nhất
	SET @content = CONVERT(NEW.content USING utf8mb4) COLLATE utf8mb4_unicode_ci;

	-- kiểm tra xem content có chứa từ cấm không
	IF (@content REGEXP REPLACE(@banned_words, ',', '|')) THEN
		SET NEW.violate = 1; -- đánh dấu comment vi phạm
		-- cập nhật bảng user
		UPDATE user SET ban = ban + 1 WHERE id = NEW.user_id;
	END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trigger_update_comment` BEFORE UPDATE ON `comment` FOR EACH ROW BEGIN
	-- danh sách các từ cấm
	SET @banned_words = 'arse,arsehead,arsehole,ass,asshole,bastard,bitch,bloody,bollocks,brotherfucker,bugger,bullshit,child-fucker,Christ on a bike,Christ on a cracker,cock,cocksucker,crap,cunt,damn,damn it,dick,dickhead,dyke,fatherfucker,frigger,fuck,goddamn,godsdamn,hell,holy shit,horseshit,in shit,Jesus Christ,Jesus fuck,Jesus H. Christ,Jesus Harold Christ,Jesus wept,Jesus, Mary and Joseph,kike,motherfucker,nigga,nigra,piss,prick,pussy,shit,shit ass,shite,sisterfucker,slut,son of a bitch,son of a whore,spastic,sweet Jesus,turd,twat,wanker';

	-- lấy nội dung content mới nhất
	SET @content = CONVERT(NEW.content USING utf8mb4) COLLATE utf8mb4_unicode_ci;

	-- kiểm tra xem content có chứa từ cấm không
	IF (@content REGEXP REPLACE(@banned_words, ',', '|')) THEN
		SET NEW.violate = 1; -- đánh dấu comment vi phạm
		-- cập nhật bảng user
		UPDATE user SET ban = ban + 1 WHERE id = NEW.user_id;
	END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `director`
--

CREATE TABLE `director` (
  `id` tinyint(3) UNSIGNED NOT NULL,
  `full_name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `director`
--

INSERT INTO `director` (`id`, `full_name`) VALUES
(1, 'Chad Stahelski'),
(2, 'Olivier Nakache'),
(3, 'Francis Ford Coppola'),
(4, 'Roger Allers'),
(5, 'Juliano Ribeiro'),
(6, 'Richard Linklater'),
(7, 'Martin Scorsese');

-- --------------------------------------------------------

--
-- Table structure for table `gerne`
--

CREATE TABLE `gerne` (
  `id` tinyint(3) UNSIGNED NOT NULL,
  `name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gerne`
--

INSERT INTO `gerne` (`id`, `name`) VALUES
(1, 'Action'),
(2, 'Crime'),
(3, 'Thriller'),
(4, 'Drama'),
(5, 'Comedy'),
(6, 'Biography'),
(7, 'Family'),
(8, 'History'),
(9, 'Music'),
(10, 'Romance'),
(11, 'Western'),
(12, 'Adventure'),
(13, 'Costome'),
(14, 'Horror'),
(15, 'Sci-Fi'),
(16, 'War'),
(17, 'Sport'),
(18, 'Animation'),
(19, 'Fantasy'),
(20, 'Documentary'),
(21, 'Mystery'),
(22, 'Kungfu');

-- --------------------------------------------------------

--
-- Table structure for table `movie`
--

CREATE TABLE `movie` (
  `id` tinyint(3) UNSIGNED NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `rating` decimal(2,1) UNSIGNED NOT NULL,
  `duration` time NOT NULL,
  `image` text NOT NULL,
  `video` text NOT NULL,
  `release` date NOT NULL,
  `create_at` datetime NOT NULL,
  `update_at` datetime DEFAULT NULL,
  `director_id` tinyint(3) UNSIGNED NOT NULL,
  `producer_id` tinyint(3) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `movie`
--

INSERT INTO `movie` (`id`, `title`, `description`, `rating`, `duration`, `image`, `video`, `release`, `create_at`, `update_at`, `director_id`, `producer_id`) VALUES
(1, 'John Wick: Chapter 4', 'John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into foes.', 8.3, '02:49:00', 'John-Wick-Chapter-4.jpg-w380', 'y2mate.com - John Wick Chapter 4 2023 Final Trailer  Keanu Reeves Donnie Yen Bill Skarsgård_480p.mp4', '2023-03-24', '2023-04-11 12:12:52', NULL, 1, 1),
(2, 'The Intouchables', 'After he becomes a quadriplegic from a paragliding accident, an aristocrat hires a young man from the projects to be his caregiver.', 8.5, '01:52:00', '1cca6fca12e7cb7214a5ef43a7a4b2cf.jpg-w380', 'y2mate.com - The Intouchables Official Trailer 1 2012 HD Movie_480p.mp4', '2012-12-13', '2023-04-21 17:50:08', NULL, 2, 2),
(3, 'The Godfather', 'The aging patriarch of an organized crime dynasty in postwar New York City transfers control of his clandestine empire to his reluctant youngest son.', 9.2, '02:55:00', 'b28861266574af44a3e2e0f79d8e628f.jpg-w380', 'y2mate.com - The Godfather Trailer HD_480p.mp4', '1972-03-24', '2023-04-21 18:05:25', NULL, 3, 3),
(4, 'The Lion King', 'Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.', 8.5, '01:28:00', 'f3280215051cbc874e030f5a47cb3be8.jpg-w380', 'y2mate.com - The Lion King 1994 Trailer 1  Movieclips Classic Trailers_480p.mp4', '1994-06-24', '2023-04-21 18:15:25', NULL, 4, 4),
(5, 'The Salt of the Earth', 'The life and work of photographer Sebastiao Salgado, who has spent forty years documenting societies in hidden corners of the world.', 8.4, '01:50:00', '51ec3f97cc8884f4521857867c6f6420.jpg-w380', 'y2mate.com - The Salt of the Earth  Official Trailer_480p.mp4', '2015-03-27', '2023-04-21 18:25:29', NULL, 5, 5),
(6, 'Before Sunrise', 'A young man and woman meet on a train in Europe, and wind up spending one evening together in Vienna. Unfortunately, both know that this will probably be their only night together.', 8.1, '01:41:00', 'abfac818a77b832205fd6a3721bfc82a.jpg-w380', 'Before Sunrise (1995) Trailer #1 _ Movieclips Classic Trailers.mp4', '1995-01-27', '2023-04-21 18:34:33', NULL, 6, 6),
(7, 'The Wolf Of Wall Street', 'Based on the true story of Jordan Belfort, from his rise to a wealthy stock-broker living the high life to his fall involving crime, corruption and the federal government.', 8.2, '03:00:00', '21a44c43df0cc9c7b8dd83e844c93f32.jpg-w380', 'The Wolf of Wall Street - Official Trailer.mp4', '2013-12-25', '2023-05-05 20:12:10', NULL, 7, 7);

--
-- Triggers `movie`
--
DELIMITER $$
CREATE TRIGGER `trigger_delete_movie` BEFORE DELETE ON `movie` FOR EACH ROW BEGIN
    DELETE FROM comment WHERE movie_id = OLD.id;
    
    DELETE FROM movie_list WHERE movie_id = OLD.id;
    
	DELETE FROM cast WHERE movie_id = OLD.id;
    
    DELETE FROM category WHERE movie_id = OLD.id;
    
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `movie_list`
--

CREATE TABLE `movie_list` (
  `id` tinyint(3) UNSIGNED NOT NULL,
  `watch_list_id` tinyint(3) UNSIGNED NOT NULL,
  `movie_id` tinyint(3) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `producer`
--

CREATE TABLE `producer` (
  `id` tinyint(3) UNSIGNED NOT NULL,
  `name` varchar(20) NOT NULL,
  `country` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `producer`
--

INSERT INTO `producer` (`id`, `name`, `country`) VALUES
(1, 'Summit Entertainment', 'United States'),
(2, 'Canal+', 'France'),
(3, 'Albert.S.Ruddy', 'United States'),
(4, 'Walt Disney', 'United States'),
(5, 'Decia Films', 'Italy'),
(6, 'Castle Entertaiment', 'United States'),
(7, 'Appian Way', 'United States');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` tinyint(3) UNSIGNED NOT NULL,
  `user_name` varchar(20) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` text NOT NULL,
  `role` varchar(10) NOT NULL,
  `ban` tinyint(1) NOT NULL DEFAULT 0,
  `create_at` datetime NOT NULL,
  `update_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `user_name`, `email`, `password`, `role`, `ban`, `create_at`, `update_at`) VALUES
(10, 'duchoangt', 'duchoang@gmail.com', '$2a$08$XdH4FhRJeruZjpTM06OUHOqJz6a.FwqZa9KwfhLk71b3XRIVUBJPq', 'admin', 0, '2023-04-19 04:05:34', '2023-04-19 04:05:34'),
(12, 'huythang', 'huythang@gmail.com', '$2a$08$SDDdmPiQJYuUXGTlyzX7m.hFyAcmWUBx3JbxkNA9G0rbO.h0lgPzC', 'client', 0, '2023-04-21 09:10:14', '2023-04-21 09:10:14');

--
-- Triggers `user`
--
DELIMITER $$
CREATE TRIGGER `trigger_delete_user` BEFORE DELETE ON `user` FOR EACH ROW BEGIN
    DELETE FROM comment WHERE user_id = OLD.id;
    
    DELETE FROM movie_list WHERE watch_list_id IN (SELECT id FROM watch_list WHERE user_id = OLD.id);
    
	DELETE FROM watch_list WHERE user_id = OLD.id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `watch_list`
--

CREATE TABLE `watch_list` (
  `id` tinyint(3) UNSIGNED NOT NULL,
  `user_id` tinyint(3) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `watch_list`
--

INSERT INTO `watch_list` (`id`, `user_id`) VALUES
(2, 12);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `actor`
--
ALTER TABLE `actor`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cast`
--
ALTER TABLE `cast`
  ADD PRIMARY KEY (`id`),
  ADD KEY `actor_id` (`actor_id`),
  ADD KEY `movie_id` (`movie_id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `gerne_id` (`gerne_id`),
  ADD KEY `movie_id` (`movie_id`);

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `movie_id` (`movie_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `director`
--
ALTER TABLE `director`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gerne`
--
ALTER TABLE `gerne`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `movie`
--
ALTER TABLE `movie`
  ADD PRIMARY KEY (`id`),
  ADD KEY `director_id` (`director_id`),
  ADD KEY `producer_id` (`producer_id`);

--
-- Indexes for table `movie_list`
--
ALTER TABLE `movie_list`
  ADD PRIMARY KEY (`id`),
  ADD KEY `movie_id` (`movie_id`),
  ADD KEY `watch_list_id` (`watch_list_id`);

--
-- Indexes for table `producer`
--
ALTER TABLE `producer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `watch_list`
--
ALTER TABLE `watch_list`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `actor`
--
ALTER TABLE `actor`
  MODIFY `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `cast`
--
ALTER TABLE `cast`
  MODIFY `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `director`
--
ALTER TABLE `director`
  MODIFY `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `gerne`
--
ALTER TABLE `gerne`
  MODIFY `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `movie`
--
ALTER TABLE `movie`
  MODIFY `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `movie_list`
--
ALTER TABLE `movie_list`
  MODIFY `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `producer`
--
ALTER TABLE `producer`
  MODIFY `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `watch_list`
--
ALTER TABLE `watch_list`
  MODIFY `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cast`
--
ALTER TABLE `cast`
  ADD CONSTRAINT `cast_ibfk_1` FOREIGN KEY (`actor_id`) REFERENCES `actor` (`id`),
  ADD CONSTRAINT `cast_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`);

--
-- Constraints for table `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `category_ibfk_1` FOREIGN KEY (`gerne_id`) REFERENCES `gerne` (`id`),
  ADD CONSTRAINT `category_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`);

--
-- Constraints for table `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`),
  ADD CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `movie`
--
ALTER TABLE `movie`
  ADD CONSTRAINT `movie_ibfk_1` FOREIGN KEY (`director_id`) REFERENCES `director` (`id`),
  ADD CONSTRAINT `movie_ibfk_2` FOREIGN KEY (`producer_id`) REFERENCES `producer` (`id`);

--
-- Constraints for table `movie_list`
--
ALTER TABLE `movie_list`
  ADD CONSTRAINT `movie_list_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`),
  ADD CONSTRAINT `movie_list_ibfk_2` FOREIGN KEY (`watch_list_id`) REFERENCES `watch_list` (`id`);

--
-- Constraints for table `watch_list`
--
ALTER TABLE `watch_list`
  ADD CONSTRAINT `watch_list_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
