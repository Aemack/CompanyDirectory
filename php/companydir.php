<?php

$dbName = "id14686068_companydirectory";
$dbUser = "root";
$dbHost = "localhost";
$dbPass = "";

function updateName($nFirstName,$nSecondName, $id){
    global $dbName, $dbUser, $dbHost, $dbPass;
    $conn = mysqli_connect($dbHost, $dbUser, $dbPass, $dbName);
    
    $sql = "UPDATE personnel 
    SET firstName='$nFirstName',
    lastName='$nSecondName' 
    WHERE id=$id";

    $res = mysqli_query($conn, $sql);
    
    

    return [$nFirstName,$nSecondName];
}

function updateDetails($column, $data, $id){
    global $dbName, $dbUser, $dbHost, $dbPass;
    $conn = mysqli_connect($dbHost, $dbUser, $dbPass, $dbName);

    if ($column == "id"){
        $sql= "SELECT * FROM personnel WHERE id=$data";
        $res = mysqli_query($conn, $sql);

        if ($res){
            echo "ID is already in use";
        }

    }

    $sql = "UPDATE personnel 
    SET $column ='$data' 
    WHERE id=$id";
    
    $res = mysqli_query($conn, $sql);
            
    return [$data,$res];

}


function getLocations(){
    global $dbName, $dbUser, $dbHost, $dbPass;
    $conn = mysqli_connect($dbHost, $dbUser, $dbPass, $dbName);

    
    $sql = "SELECT * FROM location";

    
    $res = mysqli_query($conn, $sql);

    if ($res->num_rows > 0) {
        // output data of each row
        $i=0;
        while($row = $res->fetch_assoc()) {
          $result[$i]["id"] = $row["id"];
          $result[$i]["name"] = $row["name"];
          $i++;
        }
      } else {
        echo "0 results";
      }

      return $result;

}

function getPersonByID($id){
    global $dbName, $dbUser, $dbHost, $dbPass;
    $conn = mysqli_connect($dbHost, $dbUser, $dbPass, $dbName);

    
    $sql = "SELECT * FROM personnel where id='$id'";

    
    $res = mysqli_query($conn, $sql);

    $row = $res->fetch_assoc();

    $record["id"] = $row["id"];
    $record["firstName"] = $row["firstName"];
    $record["lastName"] = $row["lastName"];
    $record["email"] = $row["email"];
    $record["departmentID"] = $row["departmentID"];
    $record["jobTitle"] = $row["jobTitle"];
    $record["locationID"] = getLocationIDFromDepartment($row["departmentID"]); 
    $record["locationName"] = getLocationFromDepartment($row["departmentID"]);
    $record["departmentName"] = getDepartmentName($row["departmentID"]);
    $depHead =getDepHeadName($record["departmentID"]);
    $record["departmentHead"] = $depHead[0];
    $record["departmentHeadID"] = $depHead[1];
    return $record;

}

function getDepartments(){
    global $dbName, $dbUser, $dbHost, $dbPass;
    $conn = mysqli_connect($dbHost, $dbUser, $dbPass, $dbName);

    
    $sql = "SELECT * FROM department";

    
    $res = mysqli_query($conn, $sql);

    if ($res->num_rows > 0) {
        // output data of each row
        $i=0;
        while($row = $res->fetch_assoc()) {
          $result[$i]["id"] = $row["id"];
          $result[$i]["name"] = $row["name"];
          $i++;
        }
      } else {
        echo "0 results";
      }

      return $result;

}

function getDepartmentsFromLocation($location){
    global $dbName, $dbUser, $dbHost, $dbPass;
    if($location && !empty($location)){
        
        $conn = mysqli_connect($dbHost, $dbUser, $dbPass, $dbName);
        $q = "SELECT * FROM department WHERE locationID='$location'";
        $re = mysqli_query($conn, $q);
        $departments = [];
        if ($re->num_rows > 0) {
            $i=0;
            while($ro = $re->fetch_assoc()) {
              $departments[$i] = $ro["id"];
              $i++;
            }
        }

    }
    return $departments;
}

function getDepartmentName($id){
    
    global $dbName, $dbUser, $dbHost, $dbPass;
    $conn = mysqli_connect($dbHost, $dbUser, $dbPass, $dbName);

    $sql = "SELECT * FROM department WHERE id=$id";
    $res = mysqli_query($conn, $sql);
    
    $row = $res->fetch_assoc();
    return $row["name"];
    

}

function getLocationIDFromDepartment($departmentID){
    global $dbName, $dbUser, $dbHost, $dbPass;

    $conn = mysqli_connect($dbHost, $dbUser, $dbPass, $dbName);
    $q = "SELECT * FROM department  WHERE id='$departmentID'";

    $res = mysqli_query($conn, $q);
    $row = $res->fetch_assoc();

    return $row["locationID"];
}

function getLocationFromDepartment($department){
    global $dbName, $dbUser, $dbHost, $dbPass;

    $conn = mysqli_connect($dbHost, $dbUser, $dbPass, $dbName);
    $q = "SELECT * FROM department  WHERE id='$department'";

    $res = mysqli_query($conn, $q);
    $row = $res->fetch_assoc();
    $locationName = getLocationName($row["locationID"]);
    return $locationName;
}

function getLocationName($locationID){
    global $dbName, $dbUser, $dbHost, $dbPass;
    $conn = mysqli_connect($dbHost, $dbUser, $dbPass, $dbName);

    
    $sql = "SELECT * FROM location WHERE id = '$locationID'";

    $res = mysqli_query($conn, $sql);

    if ($res->num_rows > 0) {
        // output data of each row
        $i=0;
        $row = $res->fetch_assoc();
        $result = $row["name"];
        return $result;
    }

}

function deleteEntry($id){
    global $dbName, $dbUser, $dbHost, $dbPass;
    $conn = mysqli_connect($dbHost, $dbUser, $dbPass, $dbName);

    
    $sql = "DELETE FROM personnel WHERE id = '$id'";

    $res = mysqli_query($conn, $sql);

    return $res;

}

function search($obj){
    global $dbName, $dbUser, $dbHost, $dbPass;
    $result=[];
    $firstName = $obj["firstName"];
    $lastName = $obj["lastName"];
    $id = $obj["id"];
    $email = $obj["email"];
    $department = $obj["department"];
    $location = $obj["location"];
    $jobTitle = $obj["jobTitle"];
    

    
    $conn = mysqli_connect($dbHost, $dbUser, $dbPass, $dbName);

    



    $sql = "SELECT * FROM personnel WHERE id >= 0";

    
    if($firstName && !empty($firstName)){
        $sql .= " AND firstName = '$firstName'";
    }

    
    if($lastName && !empty($lastName)){
        $sql .= " AND lastName = '$lastName'";
    }

    
    if($email && !empty($email)){
        $sql .= " AND email = '$email'";
    }

    
    if($id && !empty($id)){
        $sql .= " AND id = '$id'";
    }

    
    if($jobTitle && !empty($jobTitle)){
        $sql .= " AND jobTitle = '$jobTitle'";
    } 

    
    if($department && !empty($department)){
        $sql .= " AND departmentID = '$department'";
    } 

    if($location && !empty($location)){
            $sql .= " AND (";
            $departments = getDepartmentsFromLocation($location);
            $i=0; 
            forEach($departments as $dep){
                //$depID = $dep["id"];
                $sql .= "departmentID = '$dep'";
                $i++;
                if ($i < sizeof($departments)){
                    $sql .= " OR ";
                }
                
            }
            $sql .= ")";
    
        }
    
    $res = mysqli_query($conn, $sql);
    
    if ($res->num_rows > 0) {
        // output data of each row
        $i=0;
        while($row = $res->fetch_assoc()) {
          $result[$i]["id"] = $row["id"];
          $result[$i]["firstName"] = $row["firstName"];
          $result[$i]["lastName"] = $row["lastName"];
          $result[$i]["email"] = $row["email"];
          $result[$i]["departmentID"] = $row["departmentID"];
          $result[$i]["jobTitle"] = $row["jobTitle"];
          $result[$i]["locationName"] = getLocationFromDepartment($row["departmentID"]);
          $result[$i]["departmentName"] = getDepartmentName($row["departmentID"]);
          $depHead = getDepHeadName($row["departmentID"]);
          $result[$i]["departmentHead"] = $depHead[0];
          $result[$i]["departmentHeadID"] = $depHead[1];
          $i++;
        }
        return $result;
      } else {
        echo "0 results";
      }

      


}

function getDepHeadName($depID){
    global $dbName, $dbUser, $dbHost, $dbPass;
    $conn = mysqli_connect($dbHost, $dbUser, $dbPass, $dbName);

    $sql = "SELECT * FROM personnel WHERE jobTitle='Department Head' AND departmentID='$depID'"; 
    $res = mysqli_query($conn, $sql);
    $row = $res->fetch_assoc();
    $headName = $row["firstName"]." ".$row["lastName"];

    $headID = $row["id"];
    return [$headName, $headID];
}

function updateAll($person){
    global $dbName, $dbUser, $dbHost, $dbPass;

    $id = $person["id"];
    $firstName = $person["firstName"];
    $lastName = $person["lastName"];
    $email = $person["email"];
    $departmentID = $person["departmentID"];
    $jobTitle = $person["jobTitle"];
    unset($person['id']);
    $conn = mysqli_connect($dbHost, $dbUser, $dbPass, $dbName);

    $sql="UPDATE personnel SET ";

    $i=0;
    foreach ($person as $key => $value) {
        $sql.=$key."='".$value."'";
        $i++;
        if ($i<count($person)){
            $sql.=',';
        }
        
     }


     $sql.=" WHERE id=".$id;

     $res = mysqli_query($conn, $sql);

     return $res;
}

function create($obj){
    global $dbName, $dbUser, $dbHost, $dbPass;
    $result=[];
    $id = $obj["id"];
    $firstName = $obj["firstName"];
    $lastName = $obj["lastName"];
    $email = $obj["email"];
    $departmentID = $obj["departmentID"];
    $departmentName = $obj["departmentName"];
    $jobTitle = $obj["jobTitle"];
    
    $conn = mysqli_connect($dbHost, $dbUser, $dbPass, $dbName);


        $sql = "SELECT * FROM personnel WHERE id=$id OR email='$email'";
        $res = mysqli_query($conn, $sql);
        $row = $res->fetch_assoc();

        if ($row){
            return "ID or Email already in use";
        }


    

    $sql = "INSERT INTO personnel (id, firstName,lastName,email,jobTitle,departmentID) VALUES ($id, '$firstName','$lastName','$email','$jobTitle','$departmentID')";

    $res = mysqli_query($conn, $sql);

    if($res){
        $sql="SELECT * FROM personnel WHERE id='$id' AND firstName='$firstName' AND lastName='$lastName' AND email='$email' AND jobTitle='$jobTitle'";
        $newres = mysqli_query($conn, $sql);
        $row = $newres->fetch_assoc();
        $result["id"] = $row["id"];
        $result["firstName"] = $row["firstName"];
        $result["lastName"] = $row["lastName"];
        $result["email"] = $row["email"];
        $result["jobTitle"] = $row["jobTitle"];
        $result["departmentID"] = $row["departmentID"];
        $result["departmentName"] = getDepartmentName($result["departmentID"]);
        $result["locationName"] = getLocationFromDepartment($result["departmentID"]);
        
        
        return $result;
    } else {
        echo "Failed";
    }


}

function fillJobs(){
    $jobs = ["Team Member","Team Member","Team Member","Team Member","Team Leader","Team Leader","Manager"];
    global $dbName, $dbUser, $dbHost, $dbPass;
    $conn = mysqli_connect($dbHost, $dbUser, $dbPass, $dbName);
    $sql = "SELECT * FROM personnel";    
    $res = mysqli_query($conn, $sql);
    $i=0;
    while($row = $res->fetch_assoc()) {
        $usedIDs[$i] = $row["id"];
        $i++;
    }

    forEach($usedIDs as $ID){
        $job=$jobs[rand(0,6)];
        $sql = "UPDATE personnel SET jobTitle='$job' WHERE id=$ID";
        mysqli_query($conn, $sql);
    }


    for($i=1;$i<13;$i++){
        $id = $usedIDs[$i];
        $sql = "UPDATE  personnel SET jobTitle='Department Head', departmentID=$i WHERE id=$id";
        $res = mysqli_query($conn, $sql);
    }

    
    return $res;

}

function checkID($id){
    global $dbName, $dbUser, $dbHost, $dbPass;
    $conn = mysqli_connect($dbHost, $dbUser, $dbPass, $dbName);
    $sql = "SELECT * FROM personnel WHERE id='$id'";    
    
    $res = mysqli_query($conn, $sql);

    $row = $res->fetch_assoc();

    if(!$row){
        return "false";
    }

    if(count($row) > 0){
        return "true";
    } else {
        return "false";
    }
}

function getAvailableIDs(){
    global $dbName, $dbUser, $dbHost, $dbPass;
    $conn = mysqli_connect($dbHost, $dbUser, $dbPass, $dbName);
    $sql = "SELECT * FROM personnel";
    $res = mysqli_query($conn, $sql);
    $availableIDs = [];
    $i=0;
    while($row = $res->fetch_assoc()) {
        $usedIDs[$i] = $row["id"];
        $i++;
    }
    $i=0;
    while (count($availableIDs) < 10){
        $i++;
        if (in_array($i,$usedIDs)){
            continue;
        } else {
            array_push($availableIDs, $i);
        }
    }
    return $availableIDs;
}

switch($_POST['functionname']) {
    case 'getDepHeadName':
        $result=getDepHeadName(($_POST['arguments'][0]));
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case 'fillJobs':
        $result=fillJobs();
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case 'checkID':
        $result=checkID(($_POST['arguments'][0]));
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case 'getAvailableIDs':
        $result=getAvailableIDs();
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case 'updateAll':
        $result=updateAll(($_POST['arguments'][0]));
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case 'create':
        $result=create(($_POST['arguments'][0]));
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case 'deleteEntry':
        $result=deleteEntry(($_POST['arguments'][0]));
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case 'updateDetails':
        $result=updateDetails(($_POST['arguments'][0]),($_POST['arguments'][1]),($_POST['arguments'][2]));
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case 'updateName':
        $result=updateName(($_POST['arguments'][0]),($_POST['arguments'][1]),($_POST['arguments'][2]));
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case 'getLocationFromDepartment':
        $result=getLocationFromDepartment(($_POST['arguments'][0]));
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case 'getLocationName':
        $result=getLocationName(($_POST['arguments'][0]));
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case 'getLocations':
        $result=getLocations();
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case 'getDepartments':
        $result=getDepartments();
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case 'search':
        $result=search(($_POST['arguments'][0]));
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case 'getPersonByID':
        $result=getPersonByID(($_POST['arguments'][0]));
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    }

?>