/* =========================================================
   基本パラメータ
   ========================================================= */
const MAX_PLAYER_HP = 8054;
const MAX_ENEMY_HP  = 9358;

const MAX_PLAYER_MP = 100;
const MAGIC_COST    = 25;

let playerHP = MAX_PLAYER_HP;
let enemyHP  = MAX_ENEMY_HP;
let playerMP = 0;
let enemyMP  = 0;

let isPlayerTurn = true;
let playerDefending = false;
let gameOver = false;

/* =========================================================
   DOM 取得
   ========================================================= */
const enemySprite   = document.getElementById("enemy-sprite");
const messageArea   = document.getElementById("message-area");
const youWinDiv     = document.getElementById("you-win");

const playerHpBar   = document.getElementById("player-hp-bar");
const playerMpBar   = document.getElementById("player-mp-bar");
const enemyHpBar    = document.getElementById("enemy-hp-bar");

const playerHpText  = document.getElementById("player-hp-text");
const playerMpText  = document.getElementById("player-mp-text");
const enemyHpText   = document.getElementById("enemy-hp-text");

const btnAttack  = document.getElementById("btn-attack");
const btnMagic   = document.getElementById("btn-magic");
const btnDefend  = document.getElementById("btn-defend");
const btnRestart = document.getElementById("restart-btn");

/* tap 表示用 */
const tapIndicator = document.getElementById("tap-indicator");

/* =========================================================
   メッセージ進行（ADVステップ制）
   ========================================================= */
let stepQueue = [];     // 実行するステップの配列
let stepIndex = 0;      // 現在のステップ番号
let waitingForClick = false;

// ステップ開始
function startSteps(steps) {
  stepQueue = steps;
  stepIndex = 0;
  waitingForClick = false;
  runNextStep();
}

// 次のステップへ
function runNextStep() {
  if (stepIndex >= stepQueue.length) {
    waitingForClick = false;
    if (tapIndicator) tapIndicator.style.display = "none";
    return;
  }
  const step = stepQueue[stepIndex];
  stepIndex++;
  step();
}

// メッセージクリックで次へ
messageArea.onclick = () => {
  if (waitingForClick) {
    waitingForClick = false;
    if (tapIndicator) tapIndicator.style.display = "none";
    runNextStep();
  }
};

// メッセージ表示（クリック待ち）
function showMessage(text) {
  const messageText = document.getElementById("message-text");
  if (messageText) {
    messageText.textContent = text;
  } else {
    // 念のため、旧仕様にも対応
    messageArea.textContent = text;
  }
  waitingForClick = true;
  if (tapIndicator) tapIndicator.style.display = "block";
}

/* =========================================================
   ステータス更新
   ========================================================= */
function updateStatus() {
  playerHP = Math.max(0, playerHP);
  enemyHP  = Math.max(0, enemyHP);
  playerMP = Math.max(0, playerMP);

  playerHpBar.style.width = (playerHP / MAX_PLAYER_HP * 100) + "%";
  enemyHpBar.style.width  = (enemyHP  / MAX_ENEMY_HP * 100) + "%";
  playerMpBar.style.width = (playerMP / MAX_PLAYER_MP * 100) + "%";

  playerHpText.textContent = `HP: ${playerHP} / ${MAX_PLAYER_HP}`;
  playerMpText.textContent = `MP: ${playerMP} / ${MAX_PLAYER_MP}`;
  enemyHpText.textContent  = `HP: ${enemyHP} / ${MAX_ENEMY_HP}`;
}

/* =========================================================
   敵画像の状態遷移
   ========================================================= */
function updateEnemySpriteByHP() {
  if (enemyHP <= 0) {
    enemySprite.src = "rn_st_3.png"; // 撃破
    return;
  }
  if (playerHP <= 0) {
    enemySprite.src = "rn_st_4.png"; // プレイヤー敗北
    return;
  }
  if (enemyHP === MAX_ENEMY_HP) {
    enemySprite.src = "rn_st_0.png"; // 通常
    return;
  }
  if (enemyHP <= 2000) {
    enemySprite.src = "rn_st_2.png"; // 瀕死
    return;
  }
  if (enemyHP <= 5000) {
    enemySprite.src = "rn_st_1.png"; // 中ダメージ
    return;
  }
  enemySprite.src = "rn_st_0.png";
}

/* =========================================================
   ダメージポップアップ
   ========================================================= */
function showDamagePopup(dmg, isPlayerDamage = false) {
  const div = document.createElement("div");
  div.className = "damage-popup";
  div.textContent = dmg;

  // 色分け
  if (isPlayerDamage) {
    div.style.color = "#ff4040";   // プレイヤーが受けたダメージ → 赤
  } else {
    div.style.color = "#ffffff";   // 敵に与えたダメージ → 白
  }

  document.getElementById("battle-field").appendChild(div);
  setTimeout(() => div.remove(), 800);
}

/* =========================================================
   ボタン制御
   ========================================================= */
function setButtonsEnabled(b) {
  btnAttack.disabled = !b;
  btnMagic.disabled  = !b;
  btnDefend.disabled = !b;
}

/* =========================================================
   ゲームオーバー判定
   ========================================================= */
function checkBattleEnd() {
  if (playerHP <= 0) {
    showMessage("あなたは倒れてしまった……。\n酔ったオーナーの勝利だ。");
    enemySprite.src = "rn_st_4.png";
    gameOver = true;
    btnRestart.style.display = "block";
    return true;
  }

  if (enemyHP <= 0) {
    showMessage("酔ったオーナーを倒した！\nあなたの勝利だ！");
    enemySprite.src = "rn_st_3.png";
    youWinDiv.style.display = "block";
    gameOver = true;
    btnRestart.style.display = "block";
    return true;
  }

  return false;
}

/* =========================================================
   ターン終了 → 敵ターンへ
   ========================================================= */
function endPlayerTurn() {
  if (checkBattleEnd()) return;

  isPlayerTurn = false;
  setButtonsEnabled(false);

  // 敵の行動は game_enemy.js で実装
  enemyAction();
}

/* =========================================================
   プレイヤーターン開始
   ========================================================= */
function startPlayerTurn() {
  if (checkBattleEnd()) return;

  isPlayerTurn = true;
  playerDefending = false;
  if (!enemyIsCharging) {
    updateEnemySpriteByHP();
  }

  setButtonsEnabled(true);
}

/* =========================================================
   リスタート（リロードしないで再開）
   ========================================================= */
btnRestart.onclick = () => {
  // パラメータ初期化
  playerHP = MAX_PLAYER_HP;
  enemyHP  = MAX_ENEMY_HP;
  playerMP = 0;
  enemyMP  = 0;
  gameOver = false;
  isPlayerTurn = true;
  playerDefending = false;
  enemyIsCharging = false;

  // UI 初期化
  youWinDiv.style.display = "none";
  btnRestart.style.display = "none";
  updateStatus();
  updateEnemySpriteByHP();
  setButtonsEnabled(true);

  // 再スタートメッセージ
  showMessage("オーナーを酔い潰せたら勝ちだ！");
};

/* =========================================================
   初期化
   ========================================================= */
updateStatus();
updateEnemySpriteByHP();
setButtonsEnabled(true);

// ゲーム開始メッセージ
showMessage("オーナーを酔い潰せたら勝ちだ！");
