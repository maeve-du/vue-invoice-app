<template>
  <div class="modal">
    <div class="modal-content">
      <p>Your changes will not be saved, Are you sure you want to exit?</p>
      <div class="actions flex">
        <button @click="closeModal" class="purple">Cancel</button>
        <button @click="closeInvoice" class="red">Comfirm Exit</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  name: "MsgModal",
  methods: {
    ...mapMutations(["TOGGLE_MODAL", "TOGGLE_INVOICE", "TOGGLE_EDIT_INVOICE"]),
    closeModal() {
      this.TOGGLE_MODAL();
    },
    closeInvoice() {
      this.closeModal();
      this.TOGGLE_INVOICE();
      if (this.editInvoice) {
        this.TOGGLE_EDIT_INVOICE();
      }
    },
  },
  computed: {
    ...mapState(["editInvoice"]),
  },
};
</script>

<style>
.modal {
  z-index: 100;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}
.modal .modal-content {
  border-radius: 20px;
  padding: 48px 32px;
  max-width: 450px;
  background-color: #252945;
  color: #fff;
}

.modal p {
  text-align: center;
}

.modal .actions {
  margin-top: 24px;
}

.modal button {
  flex: 1;
}
</style>