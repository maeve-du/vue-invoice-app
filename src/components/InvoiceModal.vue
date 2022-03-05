<template>
  <div
    class="invoice-wrap flex flex-column"
    ref="invoiceWrap"
    @click="checkClick"
  >
    <form @submit.prevent="submitForm" class="invoice-content">
      <div><LoadingView v-if="loading" /></div>
      <h1 v-text="editInvoice ? 'Edit Invoice' : 'New Invoice'"></h1>
      <!-- Bill form -->
      <div class="bill-from flex flex-column">
        <h4>Bill From</h4>
        <div class="input flex flex-column">
          <!-- Bill from Stress Address -->
          <label for="billerStressAddress">Stress Address</label>
          <input
            required
            type="text"
            id="billerStressAddress"
            v-model="billerStreetAddress"
          />
        </div>
        <!-- Bill from location detail  -->
        <div class="address-details flex">
          <!-- Bill from city  -->
          <div class="input flex flex-column">
            <label for="billerCity">City</label>
            <input required type="text" id="billerCity" v-model="billerCity" />
          </div>
          <!-- Bill from zip code  -->
          <div class="input flex flex-column">
            <label for="billerZipCode">Zip Code</label>
            <input
              required
              type="text"
              id="billerZipCode"
              v-model="billerZipCode"
            />
          </div>
          <!-- Bill from Country/Region  -->
          <div class="input flex flex-column">
            <label for="billerCountry">Country/Region</label>
            <input
              required
              type="text"
              id="billerCountry"
              v-model="billerCountry"
            />
          </div>
        </div>
      </div>
      <!-- Bill to -->
      <div class="bill-to flex flex-column">
        <h4>Bill To</h4>
        <!-- Bill to name -->
        <div class="input flex flex-column">
          <label for="clientName">Client's Name</label>
          <input required type="text" id="clientName" v-model="clientName" />
        </div>
        <!-- Bill to email -->
        <div class="input flex flex-column">
          <label for="clientEmail">Client's Email</label>
          <input required type="text" id="clientEmail" v-model="clientEmail" />
        </div>
        <!-- Bill to address -->
        <div class="input flex flex-column">
          <label for="clientStressAddress">Stress Address</label>
          <input
            required
            type="text"
            id="clientStressAddress"
            v-model="clientStressAddress"
          />
        </div>
        <!-- Bill to address detail -->
        <div class="address-details flex">
          <div class="input flex flex-column">
            <label for="clientCity">City</label>
            <input required type="text" id="clientCity" v-model="clientCity" />
          </div>
          <div class="input flex flex-column">
            <label for="clientZipCode">Zip Code</label>
            <input
              required
              type="text"
              id="clientZipCode"
              v-model="clientZipCode"
            />
          </div>
          <div class="input flex flex-column">
            <label for="clientCountryOrRegion">Country/Region</label>
            <input
              required
              type="text"
              id="clientCountryOrRegion"
              v-model="clientCountryOrRegion"
            />
          </div>
        </div>
      </div>
      <!-- Invoice Work Details -->
      <div class="invoice-work flex flex-column">
        <!-- Invoice payments -->
        <div class="payment flex">
          <div class="input flex flex-column">
            <label for="invoiceDate">Invoice Date</label>
            <input
              disabled
              type="text"
              id="invoiceDate"
              v-model="invoiceDate"
            />
          </div>
          <div class="input flex flex-column">
            <label for="paymentDueDate">Payment Due</label>
            <input
              disabled
              type="text"
              id="paymentDueDate"
              v-model="paymentDueDate"
            />
          </div>
        </div>
        <!-- Invoice payment terms -->
        <div class="input flex flex-column">
          <label for="paymentTerms">Payment Terms</label>
          <select required id="paymentTerms" v-model="paymentTerms">
            <option value="30">Net 30 Days</option>
            <option value="60">Net 60 days</option>
          </select>
        </div>
        <!-- Invoice Product Description -->
        <div class="input flex flex-column">
          <label for="productDescription">Product Description</label>
          <input
            required
            type="text"
            id="productDescription"
            v-model="productDescription"
          />
        </div>
        <!-- Item lists -->
        <div class="work-items">
          <h3>Item List</h3>
          <table class="item-list">
            <tr class="table-heading flex">
              <th class="item-name">Item Name</th>
              <th class="qty">Qty</th>
              <th class="price">Price</th>
              <th class="total">Total</th>
            </tr>
            <tr
              class="table-items flex"
              v-for="(item, index) in invoiceItemList"
              :key="index"
            >
              <td class="item-name">
                <input type="text" v-model="item.itemName" />
              </td>
              <td class="qty">
                <input type="text" v-model="item.qty" />
              </td>
              <td class="price">
                <input type="text" v-model="item.price" />
              </td>
              <td class="total flex">
                ¥ {{ (item.total = item.qty * item.price) }}
              </td>
              <img
                src="@/assets/icon-delete.svg"
                @click="deleteInvoiceItem(item.id)"
              />
            </tr>
          </table>
          <!-- Add New Item -->
          <div @click="addNewInvoiceItem" class="flex button">
            <img src="@/assets/icon-plus.svg" alt="" />
            Add New Item
          </div>
        </div>
        <!-- Save/Exit -->
        <div class="save flex">
          <div class="left">
            <button type="button" class="red" @click="closeInvoice">
              Cancel
            </button>
          </div>
          <div class="right flex">
            <button
              v-if="!editInvoice"
              type="submit"
              class="dark-purple"
              @click="SaveDraft"
            >
              Save Draft
            </button>
            <button
              v-if="!editInvoice"
              type="submit"
              class="purple"
              @click="publishInvoice"
            >
              Create Invoice
            </button>
            <button v-if="editInvoice" type="submit" class="purple">
              Update Invoice
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import db from "@/firebase/firebaseinit.js";
import LoadingView from "@/components/LoadingView.vue";
import { mapActions, mapMutations, mapState } from "vuex";
import { uid } from "uid";
export default {
  name: "InvoiceModal",
  components: {
    LoadingView,
  },
  data() {
    // return {
    //   loading: null,
    //   docId: null,
    //   dateOptions: { year: "numeric", month: "short", day: "numeric" },
    //   billerStreetAddress: null,
    //   billerCity: null,
    //   billerZipCode: null,
    //   billerCountry: null,
    //   clientName: null,
    //   clientEmail: null,
    //   clientStressAddress: null,
    //   clientCity: null,
    //   clientZipCode: null,
    //   clientCountryOrRegion: null,
    //   invoiceDateUnix: null,
    //   invoiceDate: null,
    //   paymentTerms: null,
    //   paymentDueDateUnix: null,
    //   paymentDueDate: null,
    //   productDescription: null,
    //   invoicePending: null,
    //   invoiceDraft: null,
    //   invoiceItemList: [],
    //   invoiceTotal: 0,
    // };
    return {
      loading: null,
      dateOptions: { year: "numeric", month: "short", day: "numeric" },
      billerStreetAddress: "123 testing ville",
      billerCity: "mooncity",
      billerZipCode: "382932",
      billerCountry: "Jupiter",
      clientName: "Emma",
      clientEmail: "emma@hotmail.com",
      clientStressAddress: "unit c 333 testing road",
      clientCity: "baoan",
      clientZipCode: "998899",
      clientCountryOrRegion: "Mars",
      invoiceDateUnix: null,
      invoiceDate: null,
      paymentTerms: null,
      paymentDueDateUnix: null,
      paymentDueDate: null,
      productDescription: "productDescription",
      invoicePending: null,
      invoiceDraft: null,
      invoiceItemList: [],
      invoiceTotal: 0,
    };
  },
  created() {
    // get current date for invoice date field
    if (!this.editInvoice) {
      this.invoiceDateUnix = Date.now();
      this.invoiceDate = new Date(this.invoiceDateUnix).toLocaleDateString(
        "en-us",
        this.dateOptions
      );
    }
    if (this.editInvoice) {
      const currentInvoice = this.currentInvoiceArray[0];
      this.docId = currentInvoice.docId;
      this.billerStreetAddress = currentInvoice.billerStreetAddress;
      this.billerCity = currentInvoice.billerCity;
      this.billerZipCode = currentInvoice.billerZipCode;
      this.billerCountry = currentInvoice.billerCountry;
      this.clientName = currentInvoice.clientName;
      this.clientEmail = currentInvoice.clientEmail;
      this.clientStressAddress = currentInvoice.clientStressAddress;
      this.clientCity = currentInvoice.clientCity;
      this.clientZipCode = currentInvoice.clientZipCode;
      this.clientCountryOrRegion = currentInvoice.clientCountryOrRegion;
      this.invoiceDateUnix = currentInvoice.invoiceDateUnix;
      this.invoiceDate = currentInvoice.invoiceDate;
      this.paymentTerms = currentInvoice.paymentTerms;
      this.paymentDueDateUnix = currentInvoice.paymentDueDateUnix;
      this.paymentDueDate = currentInvoice.paymentDueDate;
      this.productDescription = currentInvoice.productDescription;
      this.invoicePending = currentInvoice.invoicePending;
      this.invoiceDraft = currentInvoice.invoiceDraft;
      this.invoiceItemList = currentInvoice.invoiceItemList;
      this.invoiceTotal = currentInvoice.invoiceTotal;
    }
  },
  watch: {
    paymentTerms() {
      const futureDate = new Date();

      this.paymentDueDateUnix = futureDate.setDate(
        futureDate.getDate() + parseInt(this.paymentTerms)
      );

      this.paymentDueDate = new Date(
        this.paymentDueDateUnix
      ).toLocaleDateString("en-us", this.dateOptions);
      console.log(this.paymentDueDate);
    },
  },
  computed: {
    ...mapState(["editInvoice", "currentInvoiceArray"]),
  },
  methods: {
    checkClick(e) {
      if (e.target === this.$refs.invoiceWrap) {
        this.TOGGLE_MODAL();
      }
    },

    addNewInvoiceItem() {
      this.invoiceItemList.push({
        id: uid(),
        itemName: "",
        qty: "",
        price: "",
        total: 0,
      });
    },

    deleteInvoiceItem(id) {
      this.invoiceItemList = this.invoiceItemList.filter((item) => {
        return item.id !== id;
      });
    },
    calInvoiceTotal() {
      this.invoiceTotal = 0;
      this.invoiceItemList.forEach((item) => {
        this.invoiceTotal += item.total;
      });
    },
    publishInvoice() {
      this.invoicePending = true;
    },
    SaveDraft() {
      this.invoiceDraft = true;
    },

    async uploadInvoice() {
      if (this.invoiceItemList.length <= 0) {
        alert("Please ensure you filled out work items!");
        return;
      }
      this.loading = true;
      this.calInvoiceTotal();

      const dataBase = db.collection("invoices").doc();
      await dataBase.set({
        invoiceId: uid(6),
        billerStreetAddress: this.billerStreetAddress,
        billerCity: this.billerCity,
        billerZipCode: this.billerZipCode,
        billerCountry: this.billerCountry,
        clientName: this.clientName,
        clientEmail: this.clientEmail,
        clientStressAddress: this.clientStressAddress,
        clientCity: this.clientCity,
        clientZipCode: this.clientZipCode,
        clientCountryOrRegion: this.clientCountryOrRegion,
        invoiceDateUnix: this.invoiceDateUnix,
        invoiceDate: this.invoiceDate,
        paymentTerms: this.paymentTerms,
        paymentDueDateUnix: this.paymentDueDateUnix,
        paymentDueDate: this.paymentDueDate,
        productDescription: this.productDescription,
        invoiceItemList: this.invoiceItemList,
        invoiceTotal: this.invoiceTotal,
        invoicePending: this.invoicePending,
        invoiceDraft: this.invoiceDraft,
        invoicePaid: null,
      });
      this.loading = false;
      this.TOGGLE_INVOICE();
      this.GET_INVOICES();
    },

    async updateInvoice() {
      if (this.invoiceItemList.length <= 0) {
        alert("Please ensure you filled out work items!");
        return;
      }
      this.loading = true;
      this.calInvoiceTotal();

      const dataBase = db.collection("invoices").doc(this.docId);
      await dataBase.update({
        billerStreetAddress: this.billerStreetAddress,
        billerCity: this.billerCity,
        billerZipCode: this.billerZipCode,
        billerCountry: this.billerCountry,
        clientName: this.clientName,
        clientEmail: this.clientEmail,
        clientStressAddress: this.clientStressAddress,
        clientCity: this.clientCity,
        clientZipCode: this.clientZipCode,
        clientCountryOrRegion: this.clientCountryOrRegion,
        paymentTerms: this.paymentTerms,
        paymentDueDateUnix: this.paymentDueDateUnix,
        paymentDueDate: this.paymentDueDate,
        productDescription: this.productDescription,
        invoiceItemList: this.invoiceItemList,
        invoiceTotal: this.invoiceTotal,
      });
      this.loading = false;
      const data = {
        docId: this.docId,
        routeId: this.$route.params.invoiceId,
      };

      this.UPDATE_INVOICE(data);
      this.GET_INVOICES();
    },

    submitForm() {
      if (this.editInvoice) {
        this.updateInvoice();
        return;
      }
      this.uploadInvoice();
    },
    ...mapMutations(["TOGGLE_INVOICE", "TOGGLE_MODAL", "TOGGLE_EDIT_INVOICE"]),
    ...mapActions(["UPDATE_INVOICE", "GET_INVOICES"]),
    closeInvoice() {
      this.TOGGLE_INVOICE();
      if (this.editInvoice) {
        this.TOGGLE_EDIT_INVOICE();
      }
    },
  },
};
</script>

<style scoped>
.invoice-wrap {
  position: fixed;
  top: 0;
  left: 0;
  background-color: transparent;
  width: 100%;
  height: 100vh;
  overflow: scroll;
  /* background: red; */
}

.invoice-wrap::-webkit-scrollbar {
  display: none;
}

.invoice-content {
  position: relative;
  padding: 56px;
  max-width: 700px;
  width: 100%;
  background-color: #141625;
  color: #fff;
  box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, 0.2),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
.invoice-content h1 {
  margin-bottom: 48px;
  color: #fff;
}
.invoice-content h3 {
  margin-bottom: 16px;
  font-size: 18px;
  color: #fff;
}

.invoice-content h4 {
  color: #7c5dfa;
  font-size: 12px;
  margin-bottom: 24px;
}

.input {
  margin-bottom: 24px;
}

label {
  margin-bottom: 16px;
  font-size: 12px;
}

input,
select {
  width: 100%;
  background-color: #1e2139;
  color: #fff;
  border-radius: 4px;
  padding: 12px 4px;
  border: none;
}

/* bill to / from */

.bill-to,
.bill-from {
  margin-bottom: 48px;
}

.address-details {
  gap: 16px;
}

.address-details div {
  flex: 1;
}

/* invoice work */
.invoice-work .payment {
  gap: 24px;
}
.invoice-work .payment div {
  flex: 1;
}

.invoice-work .work-items .item-list {
  width: 100%;
}

table .table-heading,
table .table-items {
  gap: 16px;
  font-size: 12px;
}

table .table-heading {
  margin-bottom: 16px;
}

table .table-heading th {
  text-align: left;
}

table .item-name {
  flex-basis: 50%;
}

table .qty {
  flex-basis: 10%;
}
table .price {
  flex-basis: 20%;
}
table .total {
  flex-basis: 20%;
  align-self: center;
}

table .table-items {
  position: relative;
  margin-bottom: 24px;
}

table .table-items img {
  position: absolute;
  top: 15px;
  right: 0;
  width: 12px;
  height: 16px;
}

.work-items .button {
  color: #fff;
  background-color: #252945;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.work-items .button img {
  margin-right: 4px;
}

.save {
  margin-top: 60px;
}
.save div {
  flex: 1;
}
.save .right {
  justify-content: flex-end;
}

input:hover,
select:hover {
  outline: none;
}

input:focus-visible,
select:focus-visible {
  outline: none;
}

@media (min-width: 900px) {
  .invoice-wrap {
    left: 90px;
  }
}
</style>