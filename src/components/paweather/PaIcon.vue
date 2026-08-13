<script setup>
defineProps({
  name: { type: String, default: 'paw' },
  label: { type: String, default: '' }
})
</script>

<template>
  <svg
    class="pa-icon"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :aria-hidden="label ? undefined : 'true'"
    :aria-label="label || undefined"
    :role="label ? 'img' : undefined"
  >
    <g v-if="name === 'paw'" fill="currentColor">
      <ellipse cx="7" cy="6.3" rx="2" ry="2.7" transform="rotate(-25 7 6.3)" />
      <ellipse cx="12" cy="4.8" rx="2" ry="2.7" />
      <ellipse cx="17" cy="6.3" rx="2" ry="2.7" transform="rotate(25 17 6.3)" />
      <ellipse cx="19.3" cy="11" rx="1.8" ry="2.4" transform="rotate(35 19.3 11)" />
      <path d="M12 9.1c-3.9 0-7.3 3.2-7.3 6.5 0 2.1 1.5 3.6 3.5 3.6 1.3 0 2.4-.7 3.8-.7s2.5.7 3.8.7c2 0 3.5-1.5 3.5-3.6 0-3.3-3.4-6.5-7.3-6.5Z" />
    </g>
    <g v-else stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <template v-if="name === 'location'">
        <path d="M20 10c0 5.2-8 11-8 11S4 15.2 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </template>
      <template v-else-if="name === 'thermometer'">
        <path d="M9 14.4V5a3 3 0 0 1 6 0v9.4a4.7 4.7 0 1 1-6 0Z" />
        <path d="M12 7v9" /><circle cx="12" cy="18" r="1.5" fill="currentColor" />
      </template>
      <template v-else-if="name === 'humidity'">
        <path d="M12 2.8S6.5 9 6.5 14a5.5 5.5 0 0 0 11 0c0-5-5.5-11.2-5.5-11.2Z" />
      </template>
      <template v-else-if="name === 'rain'">
        <path d="M6.5 15h10a4 4 0 0 0 .5-8 5.5 5.5 0 0 0-10.3 1.5A3.3 3.3 0 0 0 6.5 15Z" />
        <path d="m8 18-1 2m5-2-1 2m5-2-1 2" />
      </template>
      <template v-else-if="name === 'air' || name === 'wind'">
        <path d="M3 8h11.5a2.5 2.5 0 1 0-2.3-3.5M3 12h16M3 16h10.5a2.5 2.5 0 1 1-2.3 3.5" />
      </template>
      <template v-else-if="name === 'restroom'">
        <circle cx="7" cy="4.5" r="1.5" /><circle cx="17" cy="4.5" r="1.5" />
        <path d="M7 7v6m-3 0 1-5h4l1 5M5.5 13v7m3-7v7M17 7l-3 8h6l-3-8Zm-1.5 8v5m3-5v5M12 3v18" />
      </template>
      <template v-else-if="name === 'walk'">
        <circle cx="6" cy="18" r="2" /><circle cx="18" cy="6" r="2" />
        <path d="M7.8 17c1-4.6 4-4.3 5.2-7.2.7-1.7 1.5-2.6 3.2-3.1" stroke-dasharray="2.4 2.4" />
      </template>
      <template v-else-if="name === 'phone'">
        <path d="M7.2 3.5 4.5 5.1c-.8.5-1.1 1.4-.8 2.3 2.1 6.1 6.8 10.8 12.9 12.9.9.3 1.8 0 2.3-.8l1.6-2.7-4.1-2.2-1.2 1.8c-3.2-1.4-6.2-4.4-7.6-7.6l1.8-1.2-2.2-4.1Z" />
      </template>
      <template v-else-if="name === 'clock'">
        <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
      </template>
      <template v-else-if="name === 'info'">
        <circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.2v.1" />
      </template>
      <template v-else-if="name === 'menu'">
        <path d="M4 6h16M4 12h16M4 18h16" />
      </template>
      <template v-else-if="name === 'home'">
        <path d="m3 11 9-8 9 8M5.5 9.5V21h13V9.5M9.5 21v-6h5v6" />
      </template>
      <template v-else-if="name === 'snow' || name === 'cold'">
        <path d="M12 2v20M4 7l16 10M4 17 20 7M9 4l3 3 3-3M9 20l3-3 3 3" />
      </template>
      <template v-else-if="name === 'sun'">
        <circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4m0-14.2-1.4 1.4M6.3 17.7l-1.4 1.4" />
      </template>
      <template v-else-if="name === 'storm'">
        <path d="M6 14.5h11a4 4 0 0 0 0-8 5.7 5.7 0 0 0-10.7 1.7A3.2 3.2 0 0 0 6 14.5Z" /><path d="m12 14-2 4h3l-2 4" />
      </template>
      <template v-else>
        <path d="M6 16h11a4 4 0 0 0 0-8 5.7 5.7 0 0 0-10.7 1.7A3.2 3.2 0 0 0 6 16Z" />
        <path d="M8 5a5 5 0 0 1 8-1" />
      </template>
    </g>
  </svg>
</template>

<style scoped>
.pa-icon { width:1em; height:1em; display:inline-block; flex:0 0 auto; overflow:visible; vertical-align:-.13em; }
</style>
