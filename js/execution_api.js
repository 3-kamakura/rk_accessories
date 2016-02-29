//Developer Consoleで設定したクライアントIDを入力
var CLIENT_ID = '452192057370-dakspl44ipji54kd560q7ikih72dfopt.apps.googleusercontent.com';
//必要としてるスコープ（カンマ区切りで複数設定）
var SCOPES = ['https://www.googleapis.com/auth/drive'];

//認証を実行するルーチン
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

//Execution APIを実行してスクリプト側の関数を叩くルーチン
function callScriptFunction() {
  //現在のAPI IDを入力する
  var scriptId = "MC931ZSNhWiKc8TKMR1InMomsG6x9FZoj";

  // スクリプト側の関数（引数を必要とする場合は、'parameters': [sheetId]といった具合に渡せる）
  var request = {
      'function': 'getAccessories'
  };

  // APIリクエストを組み立てる
  var op = gapi.client.request({
      'root': 'https://script.googleapis.com',
      'path': 'v1/scripts/' + scriptId + ':run',
      'method': 'POST',
      'body': request
  });

  //リクエストの実行と結果の受け取り
  op.execute(function(resp) {
    if (resp.error && resp.error.status) {
      //APIの実行に失敗した場合の処理
      appenddiv('APIの呼び出し失敗:');
      appenddiv(JSON.stringify(resp, null, 2));
    } else if (resp.error) {
      //APIの実行結果、エラーが発生した場合の処理
      var error = resp.error.details[0];
      appenddiv('スクリプトエラーメッセージ: ' + error.errorMessage);

      if (error.scriptStackTraceElements) {
        appenddiv('スクリプトエラー:');
        for (var i = 0; i < error.scriptStackTraceElements.length; i++) {
          var trace = error.scriptStackTraceElements[i];
          appenddiv('\t' + trace.function + ':' + trace.lineNumber);
        }
      }
    } else {
      //APIの実行に成功し、帰ってきた値を処理するルーチン
      var data = resp.response.result;
      var length = data.length;
      var clength = data[0].length;

      if (length == 0) {
          appenddiv('データがないよ');
      } else {
        appenddiv('<p><b>見つかったデータの詳細</b></p>');
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

//idがoutputのタグに結果を書き込む関数
function appenddiv(message) {
  var pre = document.getElementById('output');
  pre.innerHTML = pre.innerHTML + message;
}
