<?php
$resp = array(
    'STATUS' => 'ERROR'
);

// simulate web latency
sleep(rand(1, 3));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $resp['REQUEST_METHOD'] = 'POST';
    // print_r($_POST);
    if (isset($_POST['answers'])) {
        $answers = $_POST['answers'];
        $temp = array();
        for ($i = 0; $i < count($answers); $i++) {
            $temp[$answers[$i]] = rand(1, 100);
        }
    }
    $resp['STATUS'] = 'OK';
    $resp['data'] = $temp;
}

// return json encoded array
echo json_encode($resp);
?>
