<template>
  <div class="home container">
    <!-- header -->
    <div class="header flex">
      <div class="left flex flex-column">
        <h1>Invoices</h1>
        <span>There are {{ invoiceData.length }} total invoices</span>
      </div>
      <div class="right flex">
        <div class="fliter flex" @click="toggleFilterMenu">
          <span
            >Filter by status
            <span v-if="filteredInvoice"> : {{ filteredInvoice }}</span></span
          >
          <img src="@/assets/icon-arrow-down.svg" alt="" />
          <ul class="fliter-menu" v-show="filterMenu">
            <li @click="filteredInvoices">Draft</li>
            <li @click="filteredInvoices">Pending</li>
            <li @click="filteredInvoices">Paid</li>
            <li @click="filteredInvoices">Clear Filter</li>
          </ul>
        </div>
        <div class="button flex" @click="newInvoices">
          <div class="inner-button flex">
            <img src="@/assets/icon-plus.svg" alt="" />
          </div>
          <span>New Invoice</span>
        </div>
      </div>
    </div>
    <!-- Invoices -->
    <div v-if="invoiceData.length > 0">
      <InvoiceTable
        v-for="(invoice, index) in filteredData"
        :invoice="invoice"
        :key="index"
      />
    </div>
    <div v-else class="empty flex flex-column">
      <img src="@/assets/illustration-empty.svg" alt="" />
      <h3>There is nothing here</h3>
      <p>
        Create a new invoice by clicking the New Invoice button and get started
      </p>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from "vuex";
import InvoiceTable from "@/components/InvoiceTable.vue";
export default {
  name: "HomeView",
  components: { InvoiceTable },
  data() {
    return {
      filterMenu: null,
      filteredInvoice: null,
    };
  },
  methods: {
    toggleFilterMenu() {
      this.filterMenu = !this.filterMenu;
    },
    ...mapMutations(["TOGGLE_INVOICE"]),
    ...mapActions(["GET_INVOICES"]),
    newInvoices() {
      this.TOGGLE_INVOICE();
    },
    filteredInvoices(e) {
      if (e.target.innerText === "Clear Filter") {
        this.filteredInvoice = null;
        return;
      }
      this.filteredInvoice = e.target.innerText;
    },
  },
  computed: {
    ...mapState(["invoiceData"]),
    filteredData() {
      return this.invoiceData.filter((invoice) => {
        if (this.filteredInvoice === "Draft") {
          return invoice.invoiceDraft === true;
        }
        if (this.filteredInvoice === "Pending") {
          return invoice.invoicePending === true;
        }
        if (this.filteredInvoice === "Paid") {
          return invoice.invoicePaid === true;
        }
        return invoice;
      });
    },
  },
};
</script>

<style scoped>
.home {
  color: #fff;
}
.home .header {
  margin-bottom: 65px;
}
.home .header .left,
.home .header .right {
  flex: 1;
  /* background: red; */
}

.home .right {
  justify-content: flex-end;
  align-items: center;
}

.header .left {
  align-items: left;
}

.home .button,
.home .fliter {
  align-items: center;
}

.home .button span,
.home .fliter span {
  font-size: 12px;
}

.home .fliter {
  /* user-select: none; */
  cursor: pointer;
  position: relative;
  margin-right: 40px;
}

/* 查下这个是什么属性 */
/* .fliter span img {
  pointer-events: none;
} */
.fliter img {
  margin-left: 12px;
  width: 9px;
  height: 5px;
}
.fliter-menu {
  cursor: pointer;
  width: 120px;
  position: absolute;
  top: 25px;
  list-style: none;
  background-color: #1e2139;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
.fliter-menu li {
  cursor: pointer;
  font-size: 12px;
  padding: 10px 20px;
}

.fliter-menu li:hover {
  color: #1e2139;
  background-color: #fff;
}

.home .right .button {
  padding: 8px 10px;
  background-color: #7c5dfa;
  border-radius: 40px;
}

.inner-button {
  margin-right: 8px;
  border-radius: 50%;
  padding: 8px;
  align-items: center;
  justify-content: center;
  background-color: #fff;
}
.inner-button img {
  width: 10px;
  height: 10px;
}

.empty {
  margin-top: 160px;
  align-items: center;
}
.empty img {
  width: 214px;
  height: 200px;
}

.empty h3 {
  font-size: 20px;
  margin-top: 40px;
}
.empty p {
  text-align: center;
  max-width: 224px;
  font-weight: 300;
  font-size: 12px;
  margin-top: 16px;
}
</style>
