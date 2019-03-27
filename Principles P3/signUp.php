<!DOCTYPE html>
<html>
<head>
	<title></title>
	<link rel="stylesheet" type="text/css" href="form.css">
</head>
<body>
	<h1>SUDOKU</h1>
	<ul>
	<li><a href="loginForm.php">Log In</a><li>
	<li><a href="signUp.php">Sign Up</a><li>
	</ul>
	<br><br>
	

	<form method="POST" action="checkUser.php" >
		<fieldset>
			<legend>Sign Up</legend>
			Username: <input type="text" name="username">
			Password: <input type="password" name="password"><br><br>

			<input id="submitBtn" type="submit" name="signUp" value="Play">
		</fieldset>
	</form>

</body>
</html>