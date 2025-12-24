/* =========================================================
   プレイヤー側の演出（１杯あげる / テキーラのます / スルースキル）
   ========================================================= */

/* =========================================================
   １杯あげる（攻撃）4ステップ演出
   ========================================================= */
btnAttack.onclick = () => {
  if (!isPlayerTurn || gameOver) return;

  setButtonsEnabled(false);

  const playerLines = [
    "あなた：一杯のみゃー！",
    "あなた：まぁ飲んで",
    "あなた：飲む？",
    "あなた：あげるわ！",
    "あなた：ほれほれ！"
  ];

  const ownerReceive = [
    "酔ったオーナー：頂きます！",
    "酔ったオーナー：いいの？　やったー！",
    "酔ったオーナー：ほんとに？！　ありがとう！！"
  ];

  const ownerDrink = [
    "酔ったオーナー：ゴクゴク...",
    "酔ったオーナー：グビグビ...",
    "酔ったオーナー：ゴ...ゴ..."
  ];

  const ownerFinish = [
    "酔ったオーナー：ぷはー！",
    "酔ったオーナー：うみゃー！",
    "酔ったオーナー：んー！"
  ];

  const dmg = Math.floor(300 + Math.random() * 200);

  startSteps([
    // 1
    () => {
      enemySprite.src = "rn_lt_0.png";
      showMessage(playerLines[Math.floor(Math.random() * playerLines.length)]);
    },

    // 2
    () => {
      enemySprite.src = "rn_lt_1.png";
      showMessage(ownerReceive[Math.floor(Math.random() * ownerReceive.length)]);
    },

    // 3
    () => {
      enemySprite.src = "rn_lt_2.png";
      showMessage(ownerDrink[Math.floor(Math.random() * ownerDrink.length)]);
    },

    // 4（ダメージ）
    () => {
      enemySprite.src = "rn_lt_3.png";
      enemySprite.classList.add("shake");

      enemyHP -= dmg;
      showDamagePopup(dmg, false);  // ← false = 敵に与えたダメージ（白）


      // ★ MP 回復（調整可能）
      playerMP = Math.min(MAX_PLAYER_MP, playerMP + 12);

      updateStatus();

      showMessage(ownerFinish[Math.floor(Math.random() * ownerFinish.length)]);

      setTimeout(() => enemySprite.classList.remove("shake"), 1200);
    },

    // 5（終了）
    () => {
      updateEnemySpriteByHP();
      endPlayerTurn();
    }
  ]);
};

/* =========================================================
   テキーラのます（奥義）4ステップ演出
   ========================================================= */
btnMagic.onclick = () => {
  if (!isPlayerTurn || gameOver) return;

  if (playerMP < MAGIC_COST) {
    showMessage("あなた：（今は止めとくか....）");
    return;
  }

  setButtonsEnabled(false);
  playerMP -= MAGIC_COST;
  updateStatus();

  const playerLines = [
    "あなた：くらえ！",
    "あなた：まぁまぁ飲んじゃお！",
    "あなた：いけるいける！",
    "あなた：ほらあげるわ！",
    "あなた：へいへいのんじゃえ！"
  ];

  const ownerReceive = [
    "酔ったオーナー：い、頂きます...！",
    "酔ったオーナー：まじーー！？　...飲みます！",
    "酔ったオーナー：ありがとう！！　頂きます！！！"
  ];

  const ownerDrink = [
    "酔ったオーナー：ゴクゴクゴク...",
    "酔ったオーナー：グビグビグビ...",
    "酔ったオーナー：ゴ...ゴ...ゴ..."
  ];

  const ownerFinish = [
    "酔ったオーナー：はーーーー！",
    "酔ったオーナー：うっ！！！",
    "酔ったオーナー：んーーーー！"
  ];

  const dmg = Math.floor(1200 + Math.random() * 600);

  startSteps([
    // 1
    () => {
      enemySprite.src = "rn_tk_0.png";
      showMessage(playerLines[Math.floor(Math.random() * playerLines.length)]);
    },

    // 2
    () => {
      enemySprite.src = "rn_tk_1.png";
      showMessage(ownerReceive[Math.floor(Math.random() * ownerReceive.length)]);
    },

    // 3
    () => {
      enemySprite.src = "rn_tk_2.png";
      showMessage(ownerDrink[Math.floor(Math.random() * ownerDrink.length)]);
    },

    // 4（ダメージ）
    () => {
      enemySprite.src = "rn_tk_3.png";
      enemySprite.classList.add("shake");

      enemyHP -= dmg;
      showDamagePopup(dmg);

      updateStatus();

      showMessage(ownerFinish[Math.floor(Math.random() * ownerFinish.length)]);

      setTimeout(() => enemySprite.classList.remove("shake"), 2000);
    },

    // 5（終了）
    () => {
      updateEnemySpriteByHP();
      endPlayerTurn();
    }
  ]);
};

/* =========================================================
   スルースキル（防御）
   ========================================================= */
btnDefend.onclick = () => {
  if (!isPlayerTurn || gameOver) return;

  setButtonsEnabled(false);
  playerDefending = true;

  showMessage("あなたはスルースキルを発動した……。");

  startSteps([
    () => {
      updateEnemySpriteByHP();
      endPlayerTurn();
    }
  ]);
};
