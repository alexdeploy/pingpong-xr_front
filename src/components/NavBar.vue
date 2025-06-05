<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import logo from '../assets/logo.png'
import pingpongLogo from '../assets/pingpong.png'

const router = useRouter()
const currentRoute = ref('')

onMounted(() => {
  currentRoute.value = router.currentRoute.value.path
})

router.afterEach((to) => {
  currentRoute.value = to.path
})
</script>

<template>
  <header class="navbar">
    <div class="navbar-container">
      <div class="navbar-logo">
        <img :src="logo" alt="Logo" class="logo" />
        <span class="separator"></span>
        <img :src="pingpongLogo" alt="Ping Pong Logo" class="logo" />
        <h1>Ping Pong</h1>
      </div>
      <nav class="navbar-menu">
        <router-link to="/ranking" class="nav-link" :class="{ active: currentRoute === '/ranking' }">
          Ranking
        </router-link>
        <router-link to="/matches" class="nav-link" :class="{ active: currentRoute === '/matches' }">
          Partidos
        </router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  background-color: var(--color-card);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-4);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.navbar-logo h1 {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  color: var( --color-primary-dark);
}

.separator {
  width: 1px;
  height: 24px;
  background-color: var( --color-primary-dark);
  margin: 0 var(--space-2);
}

.navbar-logo .logo {
  width: 40px;
  height: 40px;
  margin-right: var(--space-2);
}

.navbar-menu {
  display: flex;
  gap: var(--space-6);
}

.nav-link {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
  padding: var(--space-2) 0;
  position: relative;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--color-primary);
}

.nav-link.active {
  color: var(--color-primary);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--color-primary);
  border-radius: 2px;
}

@media (max-width: 640px) {
  .navbar-container {
    flex-direction: column;
    gap: var(--space-4);
    padding: var(--space-4) var(--space-4) var(--space-3);
  }
  
  .navbar-menu {
    width: 100%;
    justify-content: center;
  }
}
</style>