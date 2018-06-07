<template>
<div>
    <header class="hero is-primary is-bold">
        <div class="hero-body has-text-centered">
            <h2 class="title">
                Vs
            </h2>
            <h3 class="subtitle">
                0.3.2
            </h3>
        </div>
    </header>

    <section class="section">
        <div class="tile is-parent is-vertical">
            <article class="tile is-child content">
                <h2 class="title">d3Metric</h2>
                <hr>
                <div class="columns">
                    <div class="column is-8">
                        <d3-metric :data="3" height="200px"></d3-metric>
                    </div>
                    <div class="column is-4">
                        <pre>
                            <code>
                                js
                            </code>
                        </pre>
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
    return {};
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
