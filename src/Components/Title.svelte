<section id="intro">
  <h1 id="intro-hed">Title Of The Article</h1>
  <h1 class="intro-sub">Subtitle of the article.</h1>
  <h3 id="intro__date">
    <a href="https://twitter.com/" target="_blank">Author Name</a>, Month Year
  </h3>
</section>

<style>
  #intro {
    max-width: 600px;
    margin: 1rem auto;
    text-align: center;
    padding-top: 1rem;
  }

  #intro-hed {
    font-size: 4rem;
    margin-top: 5px;
    margin-bottom: 0;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    max-width: 100%;
    margin: auto;
    color: var(--squid-ink);
  }

  .intro-sub {
    font-size: 1.4rem;
    color: var(--squid-ink);
    text-align: center;
    margin: 1rem;
    opacity: 0.75;
    padding: 2rem;
    font-family: var(--font-main);
  }

  #intro__date {
    font-size: 1.1rem;
    color: var(--squid-ink);
    margin: 0px;
    margin-top: 15px;
    padding-bottom: 0px;
    margin-bottom: 0px;
    color: black;
    padding-bottom: 1rem;
    font-family: var(--font-main);
  }

  /* mobile */
  @media screen and (max-width: 950px) {
    #intro-hed {
      font-size: 3.5rem;
    }

    .intro-sub {
      font-size: 1.5rem;
    }
  }
</style>
