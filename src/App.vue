<template>
  <!-- <div><LoadingView /></div> -->
  <div v-if="invoicesLoaded">
    <div class="app flex flex-column" v-if="!mobile">
      <nav-bar />
      <div class="app-content flex flex-column">
        <MsgModal v-if="modalActive" />
        <transition name="invoice">
          <InvoiceModal v-if="invoiceModal" />
        </transition>
        <router-view />
      </div>
    </div>
    <div class="mobile-message flex flex-column" v-if="mobile">
      <h2>Sorry, this app is not supported on Mobile devices.</h2>
      <p>To use this app, please use a computer or Tablet</p>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar.vue";
import InvoiceModal from "@/components/InvoiceModal.vue";
import LoadingView from "@/components/LoadingView.vue";
import MsgModal from "@/components/MsgModal.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "App",
  components: {
    NavBar,
    InvoiceModal,
    LoadingView,
    MsgModal,
  },
  data() {
    return {
      mobile: null,
    };
  },
  created() {
    this.GET_INVOICES();
    this.checkScreen();
    window.addEventListener("resize", this.checkScreen);
  },
  methods: {
    checkScreen() {
      const windowWidth = window.innerWidth;
      if (windowWidth <= 750) {
        this.mobile = true;
        return;
      }
      this.mobile = false;
    },
    ...mapActions(["GET_INVOICES"]),
  },
  computed: {
    ...mapState(["invoiceModal", "modalActive", "invoicesLoaded"]),
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

@media (min-width: 900px) {
  .container {
    padding-top: 72px;
  }
  .app {
    flex-direction: row !important;
  }
}

.app {
  background-color: #141625;
  min-height: 100vh;
}

.app .app-content {
  padding: 0 20px;
  flex: 1;
  position: relative;
}
.mobile-message {
  text-align: center;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #141625;
  color: #fff;
}

/* animated invoice */
.invoice-enter-active,
.invoice-leave-active {
  transition: 0.8s ease all;
}

.invoice-enter-from,
.invoice-leave-to {
  transform: translateX(-700px);
}

button,
.button {
  cursor: pointer;
  padding: 16px 24px;
  border-radius: 30px;
  border: none;
  font-size: 12px;
  margin-right: 8px;
  color: #fff;
}

.dark-purple {
  background-color: #252945;
}

.red {
  background-color: #ec5757;
}

.purple {
  background-color: #7c5dfa;
}

.green {
  background-color: #33d69f;
}

.orange {
  background-color: #ff8f00;
}

/* // utility classes */

.flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.container {
  width: 100%;
  padding: 40px 10px;
  max-width: 850px;
  margin: 0 auto !important;
}

.nav-link {
  text-decoration: none;
  color: initial;
}

/* // Status Button Styling */

.status-button {
  font-size: 12px;
  margin-right: 30px;
  align-items: center;
  padding: 8px 30px;
  border-radius: 10px;
}

.status-button::before {
  content: "";
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}

.paid {
  color: #33d69f;
  background-color: rgba(51, 214, 160, 0.1);
}

.paid::before {
  background-color: #33d69f;
}

.pending {
  color: #ff8f00;
  background-color: rgba(255, 145, 0, 0.1);
}
.pending::before {
  background-color: #ff8f00;
}

.draft {
  color: #dfe3fa;
  background-color: rgba(223, 227, 250, 0.1);
}
.draft::before {
  background-color: #dfe3fa;
}
</style>

