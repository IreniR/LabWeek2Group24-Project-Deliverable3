<!DOCTYPE html>
<html>
<head>
	<title></title>
	<link rel="stylesheet" type="text/css" href="form.css">
</head>
<body>
	<?php 

	try{

		//creates variables for accessing database
		$connString = "mysql:host=localhost;dbname=assignment3";
		$user = "user";
		$pass = "Icube321.";

		$pdo = new PDO($connString,$user,$pass);
		$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		//retrieves username and password values from the forms
		$username = $_POST["username"];
		$password = $_POST["password"];

		//if login form is used
		if(isset($_POST["login"])){

			//$id = 1;
			//$lastId = "SELECT id FROM users ORDER BY id DESC LIMIT 1";

			//if username is not empty
			if(!empty($_POST["username"])){
				//$selectuser = "SELECT username FROM users WHERE id = $id ";
				//$selectpass = "SELECT password FROM users WHERE id = $id ";

				//retrieve record with similar username and password from database
				$select = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";

				//calls retrieve function
				$result = $pdo->query($select);

				//holds record return
				$row = $result->fetch();
				//checks if the fields matched up, then starts game instance
				if(!empty($row["username"]) && !empty($row["password"])){
					echo "Congrats on logging in, ".$username."!!!";
					echo"Enjoy your game.";
					 header( 'Location: Sudoku2.0.html' ) ;

				} else {
					//if the fields did not match redirect to login page
					echo "Sorry, wrong login info entered.";
					header( 'Location: loginForm.php' ) ;
				}
		}
		//if user signs up
		} else if(isset($_POST["signUp"])){
		
		//inserts new information into database
		$sql = "INSERT INTO users (username, password) VALUES ('$username', '$password')";
		$pdo->exec($sql);
		 echo "Welcome ".$username."!!!";
		 echo "Enjoy your game.";
		 //redirect to game instance
		 header( 'Location: Sudoku2.0.html' ) ;
	}
	}

	//catches database access error
	catch(PDOException $e){
		die($e->getMessage());
	}
	//destroys pdo object
	$pdo = null;
	 ?>

</body>
</html>