<template>
    <div>
        <section class="hero is-primary is-bold">
            <div class="hero-head has-text-centered">
                <header class="section">
                    <h3 class="title">Vs</h3>
                    <h4 class="subtitle">0.4.3</h4>
                </header>
            </div>
        </section>

        <section class="section">
            <div class="tile is-parent is-vertical">
                <article class="tile is-child content">
                    <h2 class="title">d3Metric</h2>

                    <hr>

                    <div class="columns">
                        <div class="column is-8 box">
                            <d3-horizontal-bar :data="horizontalBarData"></d3-horizontal-bar>
                        </div>
                        <div class="column is-4">
                        </div>
                    </div>
                </article>
            </div>
        </section>
    </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
        horizontalBarData: [
            { key: new Date(2017, 1, 1), value: 3 },
            { key: new Date(2017, 6, 1), value: 4 },
            { key: new Date(2017, 12, 1), value: 5 },
        ]
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
