<template>
  <section class="header">
    <div class="socials">
      <a class="social shake-little" href="https://t.me/vocal_fun_official" target="_blank" rel="noopener noreferrer">
        <img src="/img/telegram.png" alt="Telegram Logo" width="24" height="22">
        TELEGRAM
      </a>
      <a class="social shake-little" href="https://x.com/vocalfun" target="_blank" rel="noopener noreferrer">
        <img src="/img/twitter.png" alt="Twitter Logo" width="23" height="18">
        TWITTER
      </a>
    </div>

    <div class="logo">
      <img class="logo-bar-element" src="/img/top-bar-element.png" alt="">
      <img class="shake-little shake-constant" src="/logo/logo.png" alt="Logo" width="24" height="24" >
      vocal.fun
      <img class="logo-bar-element" src="/img/top-bar-element.png" alt="">
    </div>

    <div class="wallet-connect">
      <a href="#">connect wallet</a>
    </div>
  </section>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 1.25em;
  height: 41px;

  .logo {
    font-size: 1.2rem;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    text-transform: uppercase;

    .logo-bar-element {
      height: 12px;
    }
  }

  .socials {
    display: flex;
    flex-direction: row;
    gap: 10px;
    text-transform: uppercase;

    a.social {
      display: inline-flex;
      cursor: pointer;
      box-shadow: -3px 3px 0 0 #7B8494 inset,
                  -1.5px -1.5px 0 0 #4A5A6B inset,
                  3px 3px 0 0 #EFFFFF inset,
                  1.5px 1.5px 0 0 #ADB5C6 inset,
                  -1.5px -1.5px 0 0 #4A5A6B inset;
      padding: .375rem;
      color: #2E3F4B;
      background: #BDCED6;

      img {
        margin-right: .1875rem;
      }
    }
  }

  .wallet-connect {
    text-align: center;
    a {
      cursor: pointer;
      transition: color 0.3s ease-in-out;
    }
    a:hover {
      text-decoration: underline;
      color: white;
    }
  }
}

@media (max-width: 840px) {
  .header {
    height: auto;
    margin-bottom: 2.1875rem;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;

    .socials {
      order: 1;
      flex-grow: 1;
    }

    .wallet-connect {
      order: 1;
      flex-grow: 1;
      text-align: right;
      margin-left: 1.25rem;
    }

    .logo {
      order: 2;
      flex-grow: 2;
      justify-content: center;

      .logo-bar-element {
        height: 10px;
      }
    }
  }
}

@media (max-width: 500px) {
  .header {
    .wallet-connect {
      margin-left: 0;
    }
  }
}

@media (max-width: 475px) {
  .header {
    margin-bottom: 1.56rem;
    .socials {
      justify-content: center;
    }
    .logo {
      margin: .625rem 0;
    }
    .wallet-connect {
      text-align: center;
    }
  }
}
</style>
