const express = require('express');
const TS3 = require('ts3-nodejs-library');
const axios = require('axios');
const app = express();
const port = 3000;

const CONFIG = {
  teamspeak: {
    host: 'localhost',
    queryport: 10011,
    username: 'serveradmin',
    password: '260708132QwQ',
    serverport: 9987
  },
  steam: {
    apiKey: 'AD3F4A5BDA2A6DF3E1376834107974C2',
    steamID: '76561198828344660'
  }
};

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '内部服务器错误' });
});

// 新增获取游戏时长函数 [^1]
async function getTopGames(apiKey, steamID) {
  try {
    const response = await axios.get(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamID}&include_played_free_games=true`
    );
    
    const games = response.data.response.games || [];
    return games
      .filter(game => game.playtime_forever > 0)
      .sort((a, b) => b.playtime_forever - a.playtime_forever)
      .slice(0, 3)
      .map(game => ({
        name: game.name,
        playtime: Math.round(game.playtime_forever / 60)
      }));
  } catch (error) {
    console.error('获取游戏时长失败:', error.message);
    return [];
  }
}

app.get('/api/steam/status', async (req, res) => {
  try {
    const [playerRes, topGames] = await Promise.all([
      axios.get(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${CONFIG.steam.apiKey}&steamids=${CONFIG.steam.steamID}`
      ),
      getTopGames(CONFIG.steam.apiKey, CONFIG.steam.steamID)
    ]);

    const player = playerRes.data.response.players[0];
    const statusMap = {
      0: '离线', 1: '在线', 2: '忙碌',
      3: '离开', 4: '打盹', 5: '想交易', 6: '想玩游戏'
    };

    const responseData = {
      user: {
        name: player.personaname,
        avatar: player.avatarfull,
        status_code: player.personastate
      },
      current_game: player.gameextrainfo ? {
        name: player.gameextrainfo,
        image: `https://cdn.cloudflare.steamstatic.com/steam/apps/${player.gameid}/header.jpg`
      } : null
    };

    // 仅在非游戏状态时显示游戏时长 [^1]
    if (!player.gameextrainfo) {
      responseData.top_games = topGames;
    }

    res.json(responseData);
  } catch (error) {
    console.error('Steam API错误:', error.message);
    res.status(500).json({ 
      error: "无法获取Steam数据",
      detail: error.response?.data || '无响应数据'
    });
  }
});

// 保持原有TeamSpeak接口不变
app.get('/api/teamspeak/status', async (req, res) => {/* 原有代码 */});

app.listen(port, () => {
  console.log(`API服务运行在 http://localhost:${port}`);
});
