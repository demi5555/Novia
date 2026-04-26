<template>
  <div class="container-fluid py-4 bg-white rounded-5 px-4 shadow-sm">
    <div class="d-flex align-items-center justify-content-between mb-5">
      <div class="d-flex align-items-center gap-3">
        <div class="p-3 bg-icon rounded-4">
          <LayoutGrid class="text-main" :size="28" />
        </div>
        <div>
          <h3 class="fw-bold mb-0">Category</h3>
          <p class="text-muted mb-0 small">Total Category :</p>
        </div>
      </div>
      <button
        @click="handleCreate"
        class="btn bg-btn px-4 rounded-pill fw-medium d-flex align-items-center gap-2"
      >
        <Plus /> Create Category
      </button>
    </div>

    <div class="table-responsive">
      <div v-if="cate.loading" class="text-center py-5">
        <div class="loader">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </div>
        <p class="mt-3 text-muted small">Loading category...</p>
      </div>

      <BaseTable
        v-else
        :column="columns"
        :rows="cate.category"
        @edit="handleEdit"
        @delete="handleDelete"
      ></BaseTable>

      <!-- Create Modal / Edit Modal -->
      <BaseModal v-if="showModal" @close-modal="closeModal">
        <template #header>
          <h1 class="modal-title fs-5 mx-auto">{{ modalTile }}</h1>
        </template>
        <template #body>
          <BaseInput
            input-placeholder="Enter Category Name"
            input-icon="LayoutDashboard"
            v-model="categoryName"
            :isDisabled="isDisabled"
          />
          <p v-if="err.category" class="text-danger m-0">
            {{ err.category }}
          </p>
        </template>
        <template #footer>
          <button
            type="button"
            class="btn btn-secondary rounded-pill px-6 py-2"
            @click="closeModal"
          >
            Cancel
          </button>
          <button
            :class="`btn ${color} px-6 py-2 rounded-pill`"
            @click="handleAction"
            :disabled="loading"
          >
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            {{ modalConfirm }}
          </button>
        </template>
      </BaseModal>
    </div>
  </div>
</template>

<script setup>
import BaseModal from "@/components/BaseModal.vue";
import BaseTable from "@/components/BaseTable.vue";
import { useCategoryStore } from "@/stores/category";
import { onMounted, reactive, ref, watch } from "vue";
import BaseInput from "@/components/BaseInput.vue";
import api from "@/api/https";
import { useToast } from "vue-toastification";
import { require } from "@/utils/validate";
let cate = useCategoryStore();
let per_page = ref(5);
let columns = [
  { label: "Id", key: "id" },
  { label: "Name", key: "name" },
];
let toast = useToast();
let showModal = ref(false);
let categoryName = ref("");
let loading = ref(false);
let modalTile = ref("");
let modalConfirm = ref("");
let isEdit = ref(null);
let isDelete = ref(null);
let color = ref("bg-btn");
let isDisabled = ref(false);
onMounted(async () => {
  await cate.fetchCategory();
});

//create category, update category, delete category
async function handleAction() {
    if (!validate()) return;

  loading.value = true;
  try {
    if (isEdit.value) {
      await api.put(`/api/categories/${isEdit.value}`, {
        name: categoryName.value,
      });
      toast.success("Category updated successfully!");
    } else if (isDelete.value) {
      await cate.deleteCategory(isDelete.value);
      toast.success("Category deleted successfully!");
    } else {
      await api.post("/api/categories", {
        name: categoryName.value,
      });
      toast.success("Category created successfully!");
    }
  } catch (error) {
    console.error("Error handling action:", error);
  } finally {
    loading.value = false;
    showModal.value = false;
    isEdit.value = null;
    isDelete.value = null;
    cate.fetchCategory(1, per_page.value);
  }
}

const closeModal = () => {
  if (loading.value) return;
  showModal.value = false;
};

const err = reactive({
  category: "",
})

watch(categoryName, (newValue) => {
  err.category = require(newValue, "Category name is required");
});

function validate() {
  err.category = require(categoryName.value, "Category name is required");
  return !err.category;
}



const handleCreate = () => {
  err.category = "";
  showModal.value = true;
  modalTile.value = "Create Category";
  modalConfirm.value = "Create";
  color.value = "bg-btn";
  categoryName.value = "";
  isDisabled.value = false;
};

const handleEdit = (value) => {
  isEdit.value = value.id;
  showModal.value = true;
  modalTile.value = "Update Category";
  modalConfirm.value = "Update";
  color.value = "bg-btn";
  categoryName.value = value.name;
  isDisabled.value = false;
};

const handleDelete = (value) => {
  isDelete.value = value.id;
  showModal.value = true;
  modalTile.value = "Delete Category";
  modalConfirm.value = "Delete";
  color.value = "btn-danger";
  categoryName.value = value.name;
  isDisabled.value = true;
};
</script>

<style scoped>
.bar {
  background-color: #6c757d;
}
</style>
