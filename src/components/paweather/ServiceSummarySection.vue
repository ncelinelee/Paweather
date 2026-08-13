<script setup>
import PaIcon from '@/components/paweather/PaIcon.vue'

defineProps({
  tip: { type: Object, required: true },
  labels: { type: Object, required: true }
})
</script>

<template>
  <section class="service-summary">
    <div class="summary-grid">
      <article class="summary-card">
        <h2>{{ labels.aboutTitle }}</h2>
        <p class="description">{{ labels.aboutDescription1 }}<br />{{ labels.aboutDescription2 }}</p>
        <div class="feature-grid">
          <div class="feature"><span class="feature-icon weather"><PaIcon name="weather" /></span><strong>{{ labels.featureWeather }}</strong><p>{{ labels.featureWeatherDesc }}</p></div>
          <div class="feature"><span class="feature-icon location"><PaIcon name="location" /></span><strong>{{ labels.featureRefresh }}</strong><p>{{ labels.featureRefreshDesc }}</p></div>
          <div class="feature"><span class="feature-icon dog"><PaIcon name="paw" /></span><strong>{{ labels.featureDog }}</strong><p>{{ labels.featureDogDesc }}</p></div>
        </div>
      </article>

      <article class="summary-card">
        <h2>{{ labels.guideTitle }}</h2>
        <div class="contextual-tip" :class="tip.className">
          <span class="contextual-tip-icon"><PaIcon :name="tip.icon" /></span>
          <div><strong>{{ tip.title }}</strong><p>{{ tip.text }}</p></div>
        </div>
      </article>
    </div>

    <section class="bottom-banner"><div>{{ labels.banner1 }}<br /><strong>{{ labels.banner2 }}</strong></div><PaIcon name="paw" /></section>
    <div class="information-bar"><PaIcon name="info" /> {{ labels.info }}</div>
  </section>
</template>

<style scoped>
.service-summary{width:100%}.summary-grid{width:100%;margin-top:22px;display:grid;grid-template-columns:1fr 1fr;gap:22px}.summary-card{padding:24px;border:1px solid #e8e5dd;border-radius:24px;background:rgba(255,255,255,.96);box-shadow:0 10px 26px rgba(88,78,60,.055)}.summary-card h2{margin:0 0 12px;color:#373a35;font-size:18px}.description{color:#686d66;font-size:12px;line-height:1.6}
.feature-grid{margin-top:20px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.feature{min-height:118px;padding:16px 12px;border-radius:14px;background:#fafbf9;text-align:center}.feature-icon{width:44px;height:44px;margin:0 auto 9px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:21px}.feature-icon.weather{color:#557f93;background:#edf5f8}.feature-icon.location{color:#4f8b70;background:#edf7f1}.feature-icon.dog{color:#826c91;background:#f5f1f8}.feature strong{color:#434943;font-size:11px}.feature p{color:#898f88;font-size:9px;line-height:1.5}
.contextual-tip{min-height:118px;padding:20px;display:flex;align-items:center;gap:16px;border-radius:16px;background:#edf7f0}.contextual-tip-icon{width:52px;height:52px;display:flex;align-items:center;justify-content:center;flex:0 0 auto;border-radius:16px;background:rgba(255,255,255,.72);font-size:27px}.contextual-tip strong{display:block;color:#34443a;font-size:14px}.contextual-tip p{margin:7px 0 0;color:#68736b;font-size:10px;line-height:1.6}.contextual-tip.tip-hot,.contextual-tip.tip-caution{background:#fff5df}.contextual-tip.tip-rain,.contextual-tip.tip-cold{background:#edf4fb}.contextual-tip.tip-danger{background:#ffeded}.contextual-tip.tip-neutral{background:#f3f5f3}
.bottom-banner{margin-top:22px;padding:20px 26px;display:flex;justify-content:space-between;align-items:center;border:1px solid #e6e7df;border-radius:20px;background:linear-gradient(90deg,#f1f8f3,#fff8ec);color:#5e685f;font-size:14px;line-height:1.6}.bottom-banner strong{color:#478267}.bottom-banner>.pa-icon{color:#589276;font-size:40px}.information-bar{margin-top:12px;padding:9px;color:#8d928b;font-size:10px;text-align:center}.information-bar .pa-icon{color:#65917d}
@media(max-width:980px){.summary-grid{grid-template-columns:1fr}.summary-card{border-radius:20px}}
@media(max-width:720px){.feature-grid{grid-template-columns:1fr 1fr}}
@media(max-width:520px){.feature-grid{grid-template-columns:1fr}}
</style>
