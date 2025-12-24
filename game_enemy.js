/* =========================================================
   敵側の行動（通常攻撃 / ため攻撃）
   ========================================================= */

let enemyIsCharging = false;   // ← ため状態フラグ

/* =========================================================
   敵の行動メイン
   ========================================================= */
function enemyAction() {

  // すでにため状態なら → 必殺技を発動
  if (enemyIsCharging) {
    enemyIsCharging = false;
    enemyActionAfterCharge();   // ← 必殺技の本番
    return;
  }

  // ため攻撃をするかどうか（20%）
  const willCharge = Math.random() < 0.20;

  if (willCharge) {
    enemyChargeAttack();        // ← ため動作（怪しい目）
  } else {
    enemyNormalAttack();        // ← 通常攻撃
  }
}

/* =========================================================
   通常攻撃
   ========================================================= */
function enemyNormalAttack() {
  const ownerLines = [
    "酔ったオーナー：そっちも飲んで！",
    "酔ったオーナー：リナもつくったるわ！飲んで！",
    "酔ったオーナー：え？！私だけ？？！飲んでよ！"
  ];

  const dmg = Math.floor((350 + Math.random() * 200) * 1.6);

  startSteps([
    () => {
      showMessage(ownerLines[Math.floor(Math.random() * ownerLines.length)]);
    },

    () => {
      enemySprite.src = "rn_st_0.png";
      enemySprite.classList.remove("shake");

      playerHP -= dmg;
      showDamagePopup(dmg, true);   // ← プレイヤーが受けたダメージ（赤）

      updateStatus();
      showMessage("あなたはダメージを受けた……。");
    },

    () => {
      updateEnemySpriteByHP();
      startPlayerTurn();
    }
  ]);
}

/* =========================================================
   ため攻撃（怪しい目）
   ========================================================= */
function enemyChargeAttack() {
  enemyIsCharging = true;

  startSteps([
    () => {
      enemySprite.src = "rn_og_1.png";
      showMessage("酔ったオーナーが怪しい目でこっちを見ている....");
    },
    () => {
      startPlayerTurn();
    }
  ]);
}

/* =========================================================
   ため攻撃 → 次ターンの本番攻撃
   ========================================================= */
function enemyActionAfterCharge() {

  if (playerDefending) {
    enemyChargeAttack_Defended();
  } else {
    enemyChargeAttack_NotDefended();
  }
}

/* =========================================================
   スルースキル時のため攻撃
   ========================================================= */
function enemyChargeAttack_Defended() {
  const playerLines = [
    "あなた：まぁ、自分は、ふつうので、いいかな.......",
    "あなた：.......ふつうのでいいよ？？"
  ];

  const ownerLines = [
    "酔ったオーナー：そっか...",
    "酔ったオーナー：つれんなー...",
    "酔ったオーナー：ふつうか、ま、おけ。"
  ];

  const dmg = Math.floor((200 + Math.random() * 150) * 0.9);

  startSteps([
    () => {
      enemySprite.src = "rn_st_0.png";
      showMessage(playerLines[Math.floor(Math.random() * playerLines.length)]);
    },

    () => {
      enemySprite.src = "rn_og_2_1.png";
      showMessage(ownerLines[Math.floor(Math.random() * ownerLines.length)]);
    },

    () => {
      enemySprite.src = "rn_st_0.png";
      playerHP -= dmg;
      showDamagePopup(dmg, true); // ← プレイヤーが受けたダメージ（赤）
      updateStatus();
      showMessage("あなたは少しダメージを受けた……。");
    },

    () => {
      updateEnemySpriteByHP();
      startPlayerTurn();
    }
  ]);
}

/* =========================================================
   非スルースキル時のため攻撃（大ダメージ）
   ========================================================= */
function enemyChargeAttack_NotDefended() {
  const playerLines = [
    "あなた：.........わかった、のむよ！",
    "あなた：よし！自分ものむわ！"
  ];

  const ownerLines = [
    "酔ったオーナー：うぇーーーい！",
    "酔ったオーナー：いいね！",
    "酔ったオーナー：のめのめ！"
  ];

  const dmg = Math.floor((900 + Math.random() * 600) * 2.0);

  startSteps([
    () => {
      enemySprite.src = "rn_st_0.png";
      showMessage(playerLines[Math.floor(Math.random() * playerLines.length)]);
    },

    () => {
      enemySprite.src = "rn_og_2_2.png";
      showMessage(ownerLines[Math.floor(Math.random() * ownerLines.length)]);
    },

    () => {
      enemySprite.src = "rn_st_0.png";
      playerHP -= dmg;
      showDamagePopup(dmg, true); // ← プレイヤーが受けたダメージ（赤）
      updateStatus();
      showMessage("あなたは大ダメージを受けた……！");
    },

    () => {
      updateEnemySpriteByHP();
      startPlayerTurn();
    }
  ]);
}
