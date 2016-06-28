
function heads_up_judge(performance_id, judge_name, value) {

  window.web_sock.send(JSON.stringify( { 
    type: 'heads_up', 
    event: 'judge',
    performance_id: performance_id, 
    judge_name: judge_name, 
    value: value, 
    key: login_info.key,
    web_sock_id: window.web_sock_id,
    competition_id: slam.id
  }));
}

function heads_up_set_time(performance_id, minutes, seconds) {
  window.web_sock.send(JSON.stringify( { 
    type: 'heads_up',
    event: 'set_time', 
    performance_id: performance_id, 
    minutes: minutes,
    seconds: seconds,
    key: login_info.key,
    web_sock_id: window.web_sock_id,
    competition_id: slam.id
  }));

}

function heads_up_set_penalty(performance_id, penalty) {
  window.web_sock.send(JSON.stringify( { 
    type: 'heads_up',
    event: 'set_penalty', 
    performance_id: performance_id, 
    penalty: penalty,
    key: login_info.key,
    web_sock_id: window.web_sock_id,
    competition_id: slam.id
  }));


}