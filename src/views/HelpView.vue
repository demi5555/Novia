<script setup>
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <DashboardLayout>
    <div class="help-page">
      <div class="container">

        <!-- Header -->
        <div class="page-header">
          <div class="header-icon">
            <i class="bi bi-life-preserver"></i>
          </div>
          <div>
            <h1>Help Center</h1>
            <p>Everything you need to get the most out of Novia.</p>
          </div>
        </div>

        <!-- Topics grid -->
        <div class="topics-grid">

          <div class="topic-card">
            <div class="topic-icon profile">
              <i class="bi bi-person-circle"></i>
            </div>
            <h3>Setting Up Your Profile</h3>
            <ul>
              <li>Go to <strong>My Profile</strong> from the top navigation or avatar menu.</li>
              <li>Upload a profile photo and cover image using the camera icons.</li>
              <li>Click <strong>Edit Profile</strong> to fill in your name, location, phone, and date of birth.</li>
              <li>Add your <strong>Professional</strong> details — job title and company.</li>
              <li>Use the <strong>Skills</strong> button to add or search for your technical skills.</li>
              <li>In the <strong>CV tab</strong>, upload your resume (PDF, DOC, or DOCX).</li>
            </ul>
          </div>

          <div class="topic-card">
            <div class="topic-icon post">
              <i class="bi bi-pencil-square"></i>
            </div>
            <h3>Creating a Post</h3>
            <ul>
              <li>Click the <strong>Create Post</strong> button in the top navigation bar.</li>
              <li>Write your content in the editor. You can attach images or files.</li>
              <li>Choose a <strong>category</strong> — Community, Job, Event, or Project.</li>
              <li>Hit <strong>Publish</strong> to share with the community.</li>
              <li>Your post will appear on the Home feed for all users to see.</li>
            </ul>
          </div>

          <div class="topic-card">
            <div class="topic-icon message">
              <i class="bi bi-chat-dots-fill"></i>
            </div>
            <h3>Sending Messages</h3>
            <ul>
              <li>Open the <strong>Message</strong> page from the left sidebar.</li>
              <li>Use the search to find a user by name, then start a conversation.</li>
              <li>You can also click the <strong>Message</strong> button on someone's profile to start chatting directly.</li>
              <li>Messages are real-time — replies appear instantly.</li>
            </ul>
          </div>

          <div class="topic-card">
            <div class="topic-icon collab">
              <i class="bi bi-building"></i>
            </div>
            <h3>Adding Collaboration Info</h3>
            <ul>
              <li>Go to your profile and click the <strong>Collaboration</strong> tab.</li>
              <li>Upload your company or organization logo.</li>
              <li>Add the company website or portfolio link.</li>
              <li>This info will be visible to anyone viewing your public profile, helping companies find you.</li>
            </ul>
          </div>

          <div class="topic-card">
            <div class="topic-icon edu">
              <i class="bi bi-mortarboard-fill"></i>
            </div>
            <h3>Managing Education</h3>
            <ul>
              <li>Navigate to <strong>Edit Education</strong> from your profile.</li>
              <li>Add your school, degree type, and major/subject.</li>
              <li>Set your start and end dates (or mark "Currently Studying").</li>
              <li>Add an optional description of your studies.</li>
              <li>Edit or delete existing entries using the buttons in the timeline.</li>
            </ul>
          </div>

          <div class="topic-card">
            <div class="topic-icon security">
              <i class="bi bi-shield-check"></i>
            </div>
            <h3>Account & Security</h3>
            <ul>
              <li>Go to <strong>Settings</strong> from the sidebar to update your preferences.</li>
              <li>Visit <strong>Privacy & Security</strong> to change your password.</li>
              <li>Use a strong password (8+ characters, mix of letters and numbers).</li>
              <li>Log out after using shared devices to keep your account secure.</li>
              <li>Contact the admin if you believe your account has been compromised.</li>
            </ul>
          </div>

        </div>

        <!-- Contact note -->
        <div class="contact-note">
          <i class="bi bi-envelope-fill"></i>
          <div>
            <strong>Still need help?</strong>
            <p>Contact the Novia support team or your platform administrator for account issues, verification problems, or technical errors.</p>
          </div>
          <button class="btn-faq" @click="router.push('/faq')">
            <i class="bi bi-question-circle"></i> Read FAQ
          </button>
        </div>

      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.help-page {
  min-height: 100vh;
  background: #f0f2f5;
  padding: 28px 16px 48px;
}
.container {
  max-width: 960px;
  margin: 0 auto;
}

/* Header */
.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
}
.header-icon {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  background: linear-gradient(135deg, #0ea5e9, #6366f1);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  box-shadow: 0 4px 18px rgba(14,165,233,.3);
}
.page-header h1 {
  margin: 0 0 4px;
  font-size: 1.6rem;
  font-weight: 800;
  color: #0f172a;
}
.page-header p {
  margin: 0;
  color: #64748b;
  font-size: .9rem;
}

/* Topics */
.topics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
  margin-bottom: 24px;
}
@media (max-width: 680px) {
  .topics-grid { grid-template-columns: 1fr; }
}
.topic-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0,0,0,.04);
}
.topic-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-bottom: 12px;
}
.topic-icon.profile  { background: #ede9fe; color: #6366f1; }
.topic-icon.post     { background: #e0f2fe; color: #0284c7; }
.topic-icon.message  { background: #dcfce7; color: #16a34a; }
.topic-icon.collab   { background: #fef3c7; color: #d97706; }
.topic-icon.edu      { background: #fce7f3; color: #db2777; }
.topic-icon.security { background: #f0fdf4; color: #15803d; }
.topic-card h3 {
  font-size: .95rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px;
}
.topic-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.topic-card li {
  font-size: .83rem;
  color: #475569;
  line-height: 1.55;
  padding-left: 14px;
  position: relative;
}
.topic-card li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #6366f1;
  font-weight: 700;
}

/* Contact note */
.contact-note {
  background: #fff;
  border-radius: 14px;
  padding: 20px 22px;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,.04);
}
.contact-note > i {
  font-size: 1.6rem;
  color: #6366f1;
  flex-shrink: 0;
}
.contact-note strong {
  display: block;
  font-size: .9rem;
  color: #1e293b;
  margin-bottom: 3px;
}
.contact-note p {
  margin: 0;
  font-size: .82rem;
  color: #64748b;
  line-height: 1.55;
}
.btn-faq {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  border-radius: 9px;
  border: 1.5px solid #6366f1;
  background: #fff;
  color: #6366f1;
  font-size: .84rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all .15s;
  flex-shrink: 0;
}
.btn-faq:hover { background: #6366f1; color: #fff; }
</style>
