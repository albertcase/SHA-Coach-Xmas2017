<?php
namespace Lib;

class Redis {

  protected static $instance = NULL;

  protected function __construct() {}

  public static function getInstance() {
    
    if (!isset(static::$instance)) {
      $redis = new \Redis();
      $redis->connect(REDIS_HOST);
      //$redis->auth(variable_get('redis_client_password'));
      $redis->select(REDIS_DBNAME);
      // if (!empty(variable_get('cache_prefix')))
      //   $redis->setOption(\Redis::OPT_PREFIX, variable_get('cache_prefix'));
      static::$instance = $redis;
    }
    return static::$instance;
  }
}