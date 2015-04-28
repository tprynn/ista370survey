
<?
try {
	$db = new PDO('sqlite:experiment.sqlite');
	//$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
	$st = $db->prepare('INSERT INTO experiment 
	(sex, age, student, task1_group, task1_1, task1_2, task1_3, task2_group, task2_1, task2_2, task2_3) 
	VALUES 
	(:sex, :age, :student, :task1_group, :task1_1, :task1_2, :task1_3, :task2_group, :task2_1, :task2_2, :task2_3)');
	
	$st->bindParam(':sex', $_POST['sex']);
	$st->bindParam(':age', $_POST['age']);
	$st->bindParam(':student', $_POST['student-id']);
	$st->bindParam(':task1_group', $_POST['task1-group']);
	$st->bindParam(':task1_1', $_POST['task1-1']);
	$st->bindParam(':task1_2', $_POST['task1-2']);
	$st->bindParam(':task1_3', $_POST['task1-3']);
	$st->bindParam(':task2_group', $_POST['task2-group']);
	$st->bindParam(':task2_1', $_POST['task2-1']);
	$st->bindParam(':task2_2', $_POST['task2-2']);
	$st->bindParam(':task2_3', $_POST['task2-3']);
	
	$st->execute();
} catch (PDOException $e) {
	//error_log($e->getMessage());
	//echo $e->getMessage();
	die('Connection failed');
}

echo "<!DOCTYPE html>
<html>
<body>
<h2>Thank you!</h2>
</body>
</html>"
?>

