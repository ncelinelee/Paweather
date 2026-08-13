<script setup>
import PaIcon from '@/components/paweather/PaIcon.vue'

defineProps({ links: { type: String, default: '' } })
</script>

<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-brand"><PaIcon name="paw" /><span><strong>Paweather</strong><small>Paw + Weather</small></span></div>
      <div class="footer-links">{{ links }}</div>
      <div class="copyright">© 2026 Paweather</div>
    </div>
  </footer>
</template>

<style scoped>
.footer{width:100%;padding:26px clamp(24px,4vw,64px);border-top:1px solid #e5e3dc;background:#f7f5ef;color:#5f625d}.footer-inner{width:100%;display:flex;align-items:center;gap:40px}.footer-brand{display:flex;align-items:center;gap:9px;font-size:20px}.footer-brand span,.footer-brand strong,.footer-brand small{display:block}.footer-brand strong{color:#353934;font-size:18px}.footer-brand small{color:#92958f;font-size:10px}.footer-links{flex:1;font-size:10px}.copyright{color:#999c96;font-size:9px}
@media(max-width:520px){.footer-inner{flex-direction:column;align-items:flex-start;gap:14px}}
</style>
