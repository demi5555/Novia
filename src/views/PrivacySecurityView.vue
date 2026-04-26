<template>
  <DashboardLayout>
    <div class="privacy-page">
      <div class="privacy-container">
        <header class="page-header">
          <div class="header-icon">
            <i class="bi bi-shield-lock-fill"></i>
          </div>
          <div>
            <h1 class="page-title">Privacy &amp; Security</h1>
            <p class="page-subtitle">
              Keep your account trusted by completing identity and certificate review.
            </p>
          </div>
        </header>

        <section class="card-block">
          <div class="card-head">
            <h2>ID Card Review</h2>
            <span class="status-chip pending">Pending Review</span>
          </div>
          <p class="card-text">
            Submit your national ID card to verify your identity. This helps protect your account
            and improves trust when connecting with other users.
          </p>
          <ul class="info-list">
            <li>Upload a clear photo of the front side of your ID card.</li>
            <li>Full name and date of birth must be readable.</li>
            <li>Blurred, cropped, or expired ID cards may be rejected.</li>
          </ul>
          <p class="note">
            Review time: usually within 1-2 business days.
          </p>
        </section>

        <section class="card-block">
          <div class="card-head">
            <h2>Certificate Review</h2>
            <span class="status-chip pending">Pending Review</span>
          </div>
          <p class="card-text">
            Add academic or professional certificates to strengthen your profile and demonstrate
            your qualifications.
          </p>
          <ul class="info-list">
            <li>Upload certificates in PDF or image format.</li>
            <li>Include your full name and certificate title.</li>
            <li>Documents with missing details may require resubmission.</li>
          </ul>
          <p class="note">
            Review time: usually within 2-3 business days.
          </p>
        </section>

        <section class="card-block muted">
          <h3>Privacy Notice</h3>
          <p>
            Your uploaded documents are only used for verification and account safety. They are not
            shared publicly on your profile.
          </p>
        </section>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '@/layouts/DashboardLayout.vue'
</script>

<style scoped>
.privacy-page {
  min-height: 100vh;
  background: #f3f4f6;
  padding: 24px 16px 40px;
}

.privacy-container {
  max-width: 860px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}

.header-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.page-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}

.page-subtitle {
  margin: 4px 0 0;
  font-size: 0.9rem;
  color: #64748b;
}

.card-block {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 18px;
  margin-bottom: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.card-head h2 {
  margin: 0;
  font-size: 1.05rem;
  color: #111827;
}

.status-chip {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-chip.pending {
  background: #fff7ed;
  color: #c2410c;
  border: 1px solid #fed7aa;
}

.card-text {
  margin: 0 0 10px;
  color: #475569;
  font-size: 0.9rem;
  line-height: 1.5;
}

.info-list {
  margin: 0 0 10px;
  padding-left: 18px;
  color: #334155;
  font-size: 0.88rem;
  line-height: 1.6;
}

.note {
  margin: 0;
  font-size: 0.82rem;
  color: #64748b;
}

.card-block.muted h3 {
  margin: 0 0 8px;
  font-size: 0.98rem;
  color: #111827;
}

.card-block.muted p {
  margin: 0;
  font-size: 0.88rem;
  color: #475569;
  line-height: 1.6;
}
</style>
