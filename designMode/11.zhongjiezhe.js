// 中介者模式使各个对象之间得以解耦，以中介者和对象之间的一对多关系取代了对象 之间的网状多对多关系。各个对象只需关注自身功能的实现，对象之间的交互关系交给了中介者对象来实现和维护。
function Player(name, teamColor) {
  this.name = name; // 角色名字
  this.teamColor = teamColor; // 队伍颜色
  this.state = 'alive'; // 玩家生存状态
};
Player.prototype.win = function () {
  console.log(this.name + ' won ');
};
Player.prototype.lose = function () {
  console.log(this.name + ' lost');
};
/*******************玩家死亡*****************/
Player.prototype.die = function () {
  this.state = 'dead';
  playerDirector.receiveMessage('playerDead', this);
};
/*******************移除玩家*****************/
Player.prototype.remove = function () {
  playerDirector.receiveMessage('removePlayer', this);
};
/*******************玩家换队*****************/
Player.prototype.changeTeam = function (color) {
  playerDirector.receiveMessage('changeTeam', this, color); // 给中介者发送消息，玩家换队
};

var playerFactory = function (name, teamColor) {
  var newPlayer = new Player(name, teamColor); // 创造一个新的玩家对象
  playerDirector.receiveMessage('addPlayer', newPlayer); // 给中介者发送消息，新增玩家
  return newPlayer;
};
var playerDirector = (function () {
  var players = {}, // 保存所有玩家
    operations = {}; // 中介者可以执行的操作
  /****************新增一个玩家***************************/
  operations.addPlayer = function (player) {
    var teamColor = player.teamColor; // 玩家的队伍颜色
    players[teamColor] = players[teamColor] || [];
    // 如果该颜色的玩家还没有成立队伍，则新成立一个队伍
    players[teamColor].push(player); // 添加玩家进队伍
  };
  /****************移除一个玩家***************************/
  operations.removePlayer = function (player) {
    var teamColor = player.teamColor, // 玩家的队伍颜色
      teamPlayers = players[teamColor] || []; // 该队伍所有成员
    for (var i = teamPlayers.length - 1; i >= 0; i--) { // 遍历删除
      if (teamPlayers[i] === player) {
        teamPlayers.splice(i, 1);
      }
    }
  };

  /****************玩家换队***************************/
  operations.changeTeam = function (player, newTeamColor) {
    // 玩家换队
    operations.removePlayer(player);
    player.teamColor = newTeamColor;
    operations.addPlayer(player);
  };
  // 从原队伍中删除 // 改变队伍颜色
  // 增加到新队伍中
  operations.playerDead = function (player) {
    var teamColor = player.teamColor,
      teamPlayers = players[teamColor];
    var all_dead = true;
    // 玩家死亡 // 玩家所在队伍
    for (var i = 0, player; player = teamPlayers[i++];) {
      if (player.state !== 'dead') {
        all_dead = false;
        break;
      }
    }
    if (all_dead === true) {
      // 全部死亡
      for (var i = 0, player; player = teamPlayers[i++];) {
        player.lose(); // 本队所有玩家 lose
      }
      for (var color in players) {
        if (color !== teamColor) {
          var teamPlayers = players[color];
          for (var i = 0, player; player = teamPlayers[i++];) {
            player.win();
          }
        }
      }
    }
  };

  var receiveMessage = function () {
    var message = Array.prototype.shift.call(arguments); operations[message].apply(this, arguments);
  };
  return {
    receiveMessage: receiveMessage
  }
})()


// 红队:
var player1 = playerFactory('皮蛋', 'red'),
  player2 = playerFactory('小乖', 'red'),
  player3 = playerFactory('宝宝', 'red'),
  player4 = playerFactory('小强', 'red');
// 蓝队:
var player5 = playerFactory('黑妞', 'blue'),
  player6 = playerFactory('葱头', 'blue'),
  player7 = playerFactory('胖墩', 'blue'),
  player8 = playerFactory('海盗', 'blue');
player1.die();
player2.die();
player3.die();
player4.die();
