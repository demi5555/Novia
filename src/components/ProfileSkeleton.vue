<template>
  <div class="container-fluid py-4 bg-white rounded-5 px-4 shadow-sm">

    <!-- HEADER -->
    <div class="d-flex align-items-center gap-3 mt-5 mb-5">
      <div class="skeleton icon"></div>
      <div>
        <div class="skeleton title"></div>
        <div class="skeleton subtitle mt-2"></div>
      </div>
    </div>

    <!-- PROFILE BODY -->
    <div class="d-flex bg-light rounded-5 px-5 py-4">

      <!-- LEFT -->
      <div class="col-lg-6">
        <div class="d-flex align-items-center gap-4">

          <!-- AVATAR -->
          <div class="skeleton avatar"></div>

          <!-- INFO -->
          <div class="flex-grow-1">
            <div class="skeleton name mb-3"></div>
            <div class="skeleton text mb-2"></div>
            <div class="skeleton text w-75"></div>
          </div>

        </div>
      </div>

      <!-- RIGHT BUTTONS -->
      <div class="col-lg-6 d-flex justify-content-end align-items-center gap-3">
        <div class="skeleton btn"></div>
        <div class="skeleton btn danger"></div>
      </div>

    </div>

    <!-- PERSONAL INFO -->
    <div class="bg-light rounded-5 px-5 mt-5 py-4">
      <div class="row">

        <div class="col-lg-6">
          <div class="skeleton section-title mb-4"></div>

          <div class="mb-4">
            <div class="skeleton label mb-2"></div>
            <div class="skeleton value"></div>
          </div>

          <div class="mb-4">
            <div class="skeleton label mb-2"></div>
            <div class="skeleton value"></div>
          </div>

          <div>
            <div class="skeleton label mb-2"></div>
            <div class="skeleton value"></div>
          </div>
        </div>

        <div class="col-lg-6 mt-5 mt-lg-0">
          <div class="mb-4">
            <div class="skeleton label mb-2"></div>
            <div class="skeleton value"></div>
          </div>

          <div class="mb-4">
            <div class="skeleton label mb-2"></div>
            <div class="skeleton value"></div>
          </div>

          <div>
            <div class="skeleton label mb-2"></div>
            <div class="skeleton value"></div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
/* BASE */
.skeleton {
  position: relative;
  overflow: hidden;
  background: #e2e2e2;
  border-radius: 20px;
}

.skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    #e2e2e2 25%,
    #f0f0f0 50%,
    #e2e2e2 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite linear;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* SHAPES */
.icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
}

.title {
  width: 160px;
  height: 18px;
}

.subtitle {
  width: 220px;
  height: 12px;
  border-radius: 10px;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}

.name {
  width: 180px;
  height: 18px;
}

.text {
  width: 220px;
  height: 12px;
  border-radius: 10px;
}

.btn {
  width: 170px;
  height: 40px;
  border-radius: 50px;
}

.btn.danger {
  width: 160px;
}

.section-title {
  width: 200px;
  height: 16px;
}

.label {
  width: 100px;
  height: 10px;
  border-radius: 8px;
}

.value {
  width: 200px;
  height: 14px;
}
</style>