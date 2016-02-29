//Developer Console�Őݒ肵���N���C�A���gID�����
var CLIENT_ID = '452192057370-dakspl44ipji54kd560q7ikih72dfopt.apps.googleusercontent.com';
//�K�v�Ƃ��Ă�X�R�[�v�i�J���}��؂�ŕ����ݒ�j
var SCOPES = ['https://www.googleapis.com/auth/drive'];

//�F�؂����s���郋�[�`��
function checkAuth() {
  gapi.auth.authorize(
    {
      'client_id': CLIENT_ID,
      'scope': SCOPES.join(' '),
      'immediate': true
    }, handleAuthResult);
}

function handleAuthResult(authResult) {
  var authorizeDiv = document.getElementById('authorize-div');
  if (authResult && !authResult.error) {
    authorizeDiv.style.display = 'none';
    callScriptFunction();
  } else {
    authorizeDiv.style.display = 'inline';
  }
}

function handleAuthClick(event) {
  gapi.auth.authorize(
    {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
    handleAuthResult);
  return false;
}

//Execution API�����s���ăX�N���v�g���̊֐���@�����[�`��
function callScriptFunction() {
  //���݂�API ID����͂���
  var scriptId = "MC931ZSNhWiKc8TKMR1InMomsG6x9FZoj";

  // �X�N���v�g���̊֐��i������K�v�Ƃ���ꍇ�́A'parameters': [sheetId]�Ƃ�������ɓn����j
  var request = {
      'function': 'getAccessories'
  };

  // API���N�G�X�g��g�ݗ��Ă�
  var op = gapi.client.request({
      'root': 'https://script.googleapis.com',
      'path': 'v1/scripts/' + scriptId + ':run',
      'method': 'POST',
      'body': request
  });

  //���N�G�X�g�̎��s�ƌ��ʂ̎󂯎��
  op.execute(function(resp) {
    if (resp.error && resp.error.status) {
      //API�̎��s�Ɏ��s�����ꍇ�̏���
      appenddiv('API�̌Ăяo�����s:');
      appenddiv(JSON.stringify(resp, null, 2));
    } else if (resp.error) {
      //API�̎��s���ʁA�G���[�����������ꍇ�̏���
      var error = resp.error.details[0];
      appenddiv('�X�N���v�g�G���[���b�Z�[�W: ' + error.errorMessage);

      if (error.scriptStackTraceElements) {
        appenddiv('�X�N���v�g�G���[:');
        for (var i = 0; i < error.scriptStackTraceElements.length; i++) {
          var trace = error.scriptStackTraceElements[i];
          appenddiv('\t' + trace.function + ':' + trace.lineNumber);
        }
      }
    } else {
      //API�̎��s�ɐ������A�A���Ă����l���������郋�[�`��
      var data = resp.response.result;
      var length = data.length;
      var clength = data[0].length;

      if (length == 0) {
          appenddiv('�f�[�^���Ȃ���');
      } else {
        appenddiv('<p><b>���������f�[�^�̏ڍ�</b></p>');
        var html = "<table border='1'>";

        for(var i = 0;i<length;i++){
          html += "<tr>";
          for(var j = 0;j<clength;j++){
            html += "<td>" + data[i][j] + "</td>";
          }
          html += "</tr>";
        }

        html += "</table>";
        appenddiv(html);
      }
    }
  });
}

//id��output�̃^�O�Ɍ��ʂ��������ފ֐�
function appenddiv(message) {
  var pre = document.getElementById('output');
  pre.innerHTML = pre.innerHTML + message;
}
