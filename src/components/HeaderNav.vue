<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand">19HOLE</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <router-link to="/" class="nav-link">ホーム</router-link>
          <router-link to="/SignUp" class="nav-link">新規登録</router-link>
          <router-link to="/eventCreation" class="nav-link">イベント作成</router-link>
          <router-link to="/AdminPage" class="nav-link">管理者</router-link>
          <router-link to="/LoginPage" class="nav-link">ログイン</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>
