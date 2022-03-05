<template>
  <div class="invoice-view container" v-if="currentInvoice">
    <router-link class="nav-link flex" :to="{ name: 'home' }">
      <img src="@/assets/icon-arrow-left.svg" alt="" /> Go Back
    </router-link>
    <!-- Header -->
    <div class="header flex">
      <div class="left flex">
        <span>Status</span>
        <div
          class="status-button flex"
          :class="{
            paid: currentInvoice.invoicePaid,
            draft: currentInvoice.invoiceDraft,
            pending: currentInvoice.invoicePending,
          }"
        >
          <span v-if="currentInvoice.invoicePaid">Paid</span>
          <span v-if="currentInvoice.invoiceDraft">Draft</span>
          <span v-if="currentInvoice.invoicePending">Pending</span>
        </div>
      </div>
      <div class="right flex">
        <button
          class="dark-purple"
          @click="toggleEditInvoice(currentInvoice.docId)"
        >
          Edit
        </button>
        <button class="red" @click="deleteInvoice(currentInvoice.docId)">
          Delete
        </button>
        <button
          class="green"
          v-if="currentInvoice.invoicePending"
          @click="updateStatusToPaid(currentInvoice.docId)"
        >
          Mark as Paid
        </button>
        <button
          class="orange"
          v-if="currentInvoice.invoiceDraft || currentInvoice.invoicePaid"
          @click="updateStatusToPending(currentInvoice.docId)"
        >
          Mark as Pending
        </button>
      </div>
    </div>

    <!-- Invoice Details -->
    <div class="invoice-details flex flex-column">
      <div class="top flex">
        <div class="left flex flex-column">
          <p><span>#</span>{{ currentInvoice.invoiceId }}</p>
          <p>{{ currentInvoice.productDescription }}</p>
        </div>
        <div class="right flex flex-column">
          <p>{{ currentInvoice.billerStreetAddress }}</p>
          <p>{{ currentInvoice.billerCity }}</p>
          <p>{{ currentInvoice.billerZipCode }}</p>
          <p>{{ currentInvoice.billerCountry }}</p>
        </div>
      </div>
      <div class="middle flex">
        <div class="payment flex flex-column">
          <h4>Invoice Date</h4>
          <p>
            {{ currentInvoice.invoiceDate }}
          </p>
          <h4>Payment Date</h4>
          <p>
            {{ currentInvoice.paymentDueDate }}
          </p>
        </div>
        <div class="bill flex flex-column">
          <h4>Bill To</h4>
          <p>{{ currentInvoice.clientName }}</p>
          <p>{{ currentInvoice.clientStressAddress }}</p>
          <p>{{ currentInvoice.clientCity }}</p>
          <p>{{ currentInvoice.clientZipCode }}</p>
          <p>{{ currentInvoice.clientCountryOrRegion }}</p>
        </div>
        <div class="send-to flex flex-column">
          <h4>Send To</h4>
          <p>{{ currentInvoice.clientEmail }}</p>
        </div>
      </div>
      <div class="bottom flex flex-column">
        <div class="billing-items">
          <div class="heading flex">
            <p>Item Name</p>
            <p>QTY</p>
            <p>Prcie</p>
            <p>Total</p>
          </div>
          <div
            class="item flex"
            v-for="(item, index) in currentInvoice.invoiceItemList"
            :key="index"
          >
            <p>{{ item.itemName }}</p>
            <p>{{ item.qty }}</p>
            <p>¥ {{ item.price }}</p>
            <p>¥ {{ item.total }}</p>
          </div>
        </div>
        <div class="total flex">
          <p>Amount Due</p>
          <p>¥ {{ currentInvoice.invoiceTotal }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  name: "InvoiceView",
  data() {
    return {
      currentInvoice: null,
    };
  },
  created() {
    this.getCurrentInvoice();
  },
  methods: {
    ...mapMutations([
      "SET_CURRENT_INVOICE",
      "TOGGLE_EDIT_INVOICE",
      "TOGGLE_INVOICE",
    ]),
    getCurrentInvoice() {
      this.SET_CURRENT_INVOICE(this.$route.params.invoiceId);
      this.currentInvoice = this.currentInvoiceArray[0];
    },
    toggleEditInvoice() {
      this.TOGGLE_EDIT_INVOICE();
      this.TOGGLE_INVOICE();
    },
    ...mapActions([
      "DELETE_INVOICE",
      "UPDATE_STATUS_TO_PENDING",
      "UPDATE_STATUS_TO_PAID",
      "GET_INVOICES",
    ]),
    async deleteInvoice(docId) {
      await this.DELETE_INVOICE(docId);

      await this.GET_INVOICES();
      this.$router.push({ name: "home" });
    },
    async updateStatusToPaid(docId) {
      this.UPDATE_STATUS_TO_PAID(docId);
    },
    async updateStatusToPending(docId) {
      this.UPDATE_STATUS_TO_PENDING(docId);
    },
  },
  computed: {
    ...mapState(["currentInvoiceArray", "editInvoice"]),
  },
  watch: {
    editInvoice() {
      if (!this.editInvoice) {
        this.currentInvoice = this.currentInvoiceArray[0];
      }
    },
  },
};
</script>

<style scoped>
.invoice-view .nav-link {
  margin-bottom: 32px;
  align-items: center;
  color: #fff;
  font-size: 12px;
}
.nav-link img {
  margin-right: 16px;
  width: 7px;
  height: 10px;
}

.header,
.invoice-details {
  background: #1e2139;
  border-radius: 20px;
}
.header {
  align-items: center;
  padding: 24px 32px;
  font-size: 12px;
}

.header .left {
  align-items: center;
}

.header .left span {
  color: #dfe3fa;
  margin-right: 16px;
}
.header .right {
  flex: 1;
  justify-content: flex-end;
}
.header .right button {
  color: #fff;
}

.invoice-details {
  padding: 48px;
  margin-top: 20px;
}
.invoice-details .top div {
  color: #dfe3fa;
  flex: 1;
}
.invoice-details .top .left {
  font-size: 12px;
}

.invoice-details .top .left p:first-child {
  font-size: 24px;
  text-transform: uppercase;
  color: #fff;
  margin-bottom: 8px;
}
.invoice-details .top .left p:nth-child(2) {
  font-size: 16px;
}

.invoice-details .top .left span {
  color: #888eb0;
}

.invoice-details .top .right {
  font-size: 12px;
  align-items: flex-end;
}

.invoice-details .middle {
  margin-top: 50px;
  color: #dfe3fa;
  gap: 16px;
}
.invoice-details .middle h4 {
  font-size: 12px;
  font-weight: 400;
  margin-bottom: 12px;
}

.invoice-details .middle p {
  font-size: 16px;
}

.invoice-details .middle .bill,
.invoice-details .middle .payment {
  flex: 1;
}

.invoice-details .middle .payment h4:nth-child(3) {
  margin-top: 32px;
}
.invoice-details .middle .payment p {
  font-weight: 600;
}

.invoice-details .middle .bill p:nth-child(2) {
  font-size: 16px;
}
.invoice-details .middle .bill p:nth-child(3) {
  margin-top: auto;
}
.invoice-details .middle .bill p {
  font-size: 12px;
}

.invoice-details .middle .send-to {
  flex: 2;
}

.invoice-details .bottom {
  margin-top: 50px;
}
.invoice-details .bottom .billing-items {
  padding: 32px;
  border-radius: 20px 20px 0 0;
  background-color: #252945;
}

.invoice-details .bottom .heading {
  color: #dfe3fa;
  font-size: 12px;
  margin-bottom: 32px;
}

.invoice-details .bottom .heading p:first-child {
  flex: 3;
  text-align: left;
}

.invoice-details .bottom .heading p {
  flex: 1;
  text-align: right;
}

.invoice-details .bottom .item {
  margin-bottom: 32px;
  font-size: 13px;
  color: #fff;
}
.invoice-details .bottom .item:last-child {
  margin-bottom: 0;
}
.invoice-details .bottom .item p:first-child {
  flex: 3;
  text-align: left;
}
.invoice-details .bottom .item p {
  flex: 1;
  text-align: right;
}

.invoice-details .bottom .total {
  color: #fff;
  padding: 32px;
  background-color: rgba(12, 14, 22, 0.7);
  align-items: center;
  border-radius: 0 0 20px 20px;
}
.invoice-details .bottom .total p {
  flex: 3;
  font-size: 12px;
}
.invoice-details .bottom .total p:nth-child(2) {
  font-size: 28px;
  text-align: right;
}
</style>
  // background: red;