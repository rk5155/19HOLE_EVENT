<template>
  <div id="wayToParticipate" class="wayToParticipate">
    <h1 class="wayToParticipate__title">イベント参加方法</h1>

    <div class="wayToParticipateFlow">
      <div class="wayToParticipateFlow__wrapper">
        <h2 class="wayToParticipateFlow__title">1, メールアドレスを登録</h2>
        <p>※登録は初回のみです。</p>
        <img class="wayToParticipateFlow__img" src="@/assets/images/wayToParticipate/img1.png" alt="">
        <router-link to="/SignUp">こちらから登録できます。</router-link>
      </div>

      <div class="wayToParticipateFlow__wrapper">
        <h2 class="wayToParticipateFlow__title">2, 氏名を登録</h2>
        <p>※登録は初回のみです。</p>
        <img class="wayToParticipateFlow__img" src="@/assets/images/wayToParticipate/img2.png" alt="">
      </div>

      <div class="wayToParticipateFlow__wrapper">
        <h2 class="wayToParticipateFlow__title">3, イベント一覧から参加したいイベントを選ぶ</h2>
        <p>詳細を確認しましょう。</p>
        <img class="wayToParticipateFlow__img" src="@/assets/images/wayToParticipate/img3_1.png" alt="">
        <p class="wayToParticipateFlow__text--margin">参加ボタンを押して参加費の支払い画面に進みます。<br>※この時点ではお支払いされません。</p>
        <img class="wayToParticipateFlow__img" src="@/assets/images/wayToParticipate/img3_2.png" alt="">
      </div>

      <div class="wayToParticipateFlow__wrapper">
        <h2 class="wayToParticipateFlow__title">4, 参加費を支払う</h2>
        <p>※参加費を先にお支払いお願いします。参加確定の預かり金として、先にいただいております。</p>
        <p>※プレー料金は参加費を差し引いた金額となっております。<br>例）10,000円（プレー料金）- 1,000円(参加費) = 9,000円（プレー料金）</p>
        <p>※プレー料金は当日各自でご精算となります。</p>
        <p>※イベント開催が中止となった場合は返金させていただきます。</p>
        <img class="wayToParticipateFlow__img" src="@/assets/images/wayToParticipate/img4.png" alt="">
      </div>

      <div class="wayToParticipateFlow__wrapper">
        <h2 class="wayToParticipateFlow__title">5, 参加確定</h2>
        <p>支払いが完了すると、「このイベントに参加予定です」と表示され、オープンチャットに参加することができます。</p>
        <img class="wayToParticipateFlow__img" src="@/assets/images/wayToParticipate/img5.png" alt="">
      </div>

      <div class="wayToParticipateFlow__wrapper">
        <h2 class="wayToParticipateFlow__title">6, オープンチャットでやりとり</h2>
        <p>ご挨拶や、ピックアップのやりとりなどを行いましょう。</p>
        <img class="wayToParticipateFlow__img" src="@/assets/images/wayToParticipate/img6.png" alt="">
      </div>

      <div class="wayToParticipateFlow__wrapper">
        <h2 class="wayToParticipateFlow__title">7, 当日のイベントを楽しみましょう！</h2>
        <p>当日はスタート時間までに集合いただければOKです！</p>
      </div>

    </div>
  </div>
</template>

<style>
.wayToParticipate__title {
  font-size: 30px;
  color: black;
  padding: 1rem 2rem;
  border-bottom: 6px double #000;
  text-align: center;
  font-weight: bold;
  margin-bottom: 40px;
}

.wayToParticipate {
  text-align: center;
}

.wayToParticipateFlow__title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.wayToParticipateFlow__img {
  width: 300px;
  display: block;
  margin: 0 auto;
}

.wayToParticipateFlow__wrapper {
  margin-bottom: 80px;
}

.wayToParticipateFlow__text--margin {
  margin: 20px 0;
}

@media screen and (max-width: 580px) {
  .wayToParticipate__title {
    font-size: 24px;
  }

  .wayToParticipateFlow__title {
    font-size: 22px;
  }
}
</style>