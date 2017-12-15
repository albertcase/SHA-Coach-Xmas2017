<?php
namespace Lib;

class Helper {

  public function aes128_cbc_encrypt($key, $data, $iv) {
    if(16 !== strlen($key)) $key = hash('MD5', $key, true);
    if(16 !== strlen($iv)) $iv = hash('MD5', $iv, true);
    $padding = 16 - (strlen($data) % 16);
    $data .= str_repeat(chr($padding), $padding);
    return mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $key, $data, MCRYPT_MODE_CBC, $iv);
  }

  public function aes128_cbc_decrypt($key, $data, $iv) {
    if(16 !== strlen($key)) $key = hash('MD5', $key, true);
    if(16 !== strlen($iv)) $iv = hash('MD5', $iv, true);
    $data = mcrypt_decrypt(MCRYPT_RIJNDAEL_128, $key, $data, MCRYPT_MODE_CBC, $iv);
    $padding = ord($data[strlen($data) - 1]);
    return substr($data, 0, -$padding);
  }

  public function saveTable($table, $data, $index){

    $pdo = PDO::getInstance();

    if(isset($data->{$index})) {
      $sql = "SELECT 1 FROM `{$table}` WHERE `{$index}` = :index";
      $query = $pdo->prepare($sql);    
      $query->execute(array(':index' => $data->{$index}));
      if($query->fetch(\PDO::FETCH_ASSOC)){
        if(isset($data->created))
          unset($data->created);
        return $this->updateTable($table, $data, array(array($index, $data->{$index})));
      } else {
        //unset($data->{$index});
        return $this->insertTable($table, $data);
      }
    } else {
      return $this->insertTable($table, $data);
    }
  }

  /**
  * Decrypt data from a CryptoJS json encoding string
  *
  * @param mixed $passphrase
  * @param mixed $jsonString
  * @return mixed
  */
  function cryptoJsAesDecrypt($passphrase, $jsonString){
      $jsondata = json_decode($jsonString, true);
      $salt = hex2bin($jsondata["s"]);
      $ct = base64_decode($jsondata["ct"]);
      $iv  = hex2bin($jsondata["iv"]);
      $concatedPassphrase = $passphrase.$salt;
      $md5 = array();
      $md5[0] = md5($concatedPassphrase, true);
      $result = $md5[0];
      for ($i = 1; $i < 3; $i++) {
          $md5[$i] = md5($md5[$i - 1].$concatedPassphrase, true);
          $result .= $md5[$i];
      }
      $key = substr($result, 0, 32);
      $data = openssl_decrypt($ct, 'aes-256-cbc', $key, true, $iv);
      return json_decode($data, true);
  }

  /**
  * Encrypt value to a cryptojs compatiable json encoding string
  *
  * @param mixed $passphrase
  * @param mixed $value
  * @return string
  */
  function cryptoJsAesEncrypt($passphrase, $value){
      $salt = openssl_random_pseudo_bytes(8);
      $salted = '';
      $dx = '';
      while (strlen($salted) < 48) {
          $dx = md5($dx.$passphrase.$salt, true);
          $salted .= $dx;
      }
      $key = substr($salted, 0, 32);
      $iv  = substr($salted, 32,16);
      $encrypted_data = openssl_encrypt(json_encode($value), 'aes-256-cbc', $key, true, $iv);
      $data = array("ct" => base64_encode($encrypted_data), "iv" => bin2hex($iv), "s" => bin2hex($salt));
      return json_encode($data);
  }
  
  public function insertTable($table, $data) {

    $pdo = PDO::getInstance();

    $fields_set = '';
    $params = array();
    foreach($data as $field => $value) {
      $fields_set .= "`{$field}` = :{$field}, ";
      $params[':'.$field] = $value;
    }
    $fields_set = substr($fields_set, 0, -2);
    $sql = "INSERT INTO `{$table}` SET {$fields_set}";

    $query = $pdo->prepare($sql);   
    $res = $query->execute($params);
    if($res) {
      return $pdo->lastinsertid();
    }
    return false;
  }

  public function updateTable($table, $data, $conditions = array()) {

    $pdo = PDO::getInstance();

    $fields_set = '';
    $params = array();
    foreach($data as $field => $value) {
      $fields_set .= "`{$field}` = :{$field}, ";
      $params[':'.$field] = $value;
    }
    $fields_set = substr($fields_set, 0, -2);
    if($conditions) {
      $fields_set .= ' WHERE ';
      foreach($conditions as $condition) {
        $symbol = isset($condition[2]) ? $condition[2] : '=';
        $fields_set .= "`{$condition[0]}` {$symbol} :q_{$condition[0]} AND ";
        $params[':q_'.$condition[0]] = $condition[1];
      }
      $fields_set = substr($fields_set, 0, -5);
    }
    $sql = "UPDATE `{$table}` SET {$fields_set}";
    //var_dump($sql, $params);exit;
    $query = $pdo->prepare($sql);   
    $res = $query->execute($params);
    if($res) {
      return true;
    }
    return false;
  }

  public function uuidGenerator() {
    $str = md5(uniqid(mt_rand(), true)); 
    $uuid  = substr($str,0,8) . '-';   
    $uuid .= substr($str,8,4) . '-';   
    $uuid .= substr($str,12,4) . '-';   
    $uuid .= substr($str,16,4) . '-';   
    $uuid .= substr($str,20,12); 
    return $uuid;
  }
}