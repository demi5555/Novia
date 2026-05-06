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
            <h1>មជ្ឈមណ្ឌលជំនួយ</h1>
            <p>អ្វីគ្រប់យ៉ាងដែលអ្នកត្រូវការដើម្បីទទួលបានអត្ថប្រយោជន៍ច្រើនបំផុតពី Connexion ។</p>
          </div>
        </div>

        <!-- Topics grid -->
        <div class="topics-grid">

          <div class="topic-card">
            <div class="topic-icon profile">
              <i class="bi bi-person-circle"></i>
            </div>
            <h3>ការដំឡើងប្រវត្តិរូបរបស់អ្នក។</h3>
            <ul>
              <li>ទៅកាន់<strong>រូបភាព</strong> ពីម៉ឺនុយរុករកកំពូល ឬរូបតំណាង។</li>
              <li>បង្ហោះរូបថតកម្រងព័ត៌មាន និងរូបភាពគម្របដោយប្រើរូបតំណាងកាមេរ៉ា។</li>
              <li>ចុច <strong>កែសម្រួលប្រវត្តិរូប</strong>ដើម្បីបំពេញឈ្មោះ ទីតាំង ទូរស័ព្ទ និងថ្ងៃខែឆ្នាំកំណើត។</li>
              <li>បន្ថែមរបស់អ្នក <strong>វិជ្ជាជីវៈ</strong> ព័ត៌មានលម្អិត - ចំណងជើងការងារ និងក្រុមហ៊ុន។</li>
              <li>ប្រើ <strong>ជំនាញ</strong>ប៊ូតុងដើម្បីបន្ថែម ឬស្វែងរកជំនាញបច្ចេកទេសរបស់អ្នក។</li>
              <li>នៅក្នុង <strong>ផ្ទាំង CV</strong>ផ្ទុកប្រវត្តិរូបសង្ខេបរបស់អ្នក (PDF, DOC, ឬ DOCX) ។</li>
            </ul>
          </div>

          <div class="topic-card">
            <div class="topic-icon post">
              <i class="bi bi-pencil-square"></i>
            </div>
            <h3>ការបង្កើតប្រកាស</h3>
            <ul>
             <li>ចុចលើប៊ូតុង <strong>បង្កើតប្រកាស</strong> នៅក្នុងរបាររុករកកំពូល។</li>
             <li>សរសេរខ្លឹមសាររបស់អ្នកនៅក្នុងកម្មវិធីនិពន្ធ។ អ្នកអាចភ្ជាប់រូបភាព ឬឯកសារ។</li>
              <li>ជ្រើសរើស <strong>ប្រភេទ</strong> — សហគមន៍ ការងារ ព្រឹត្តិការណ៍ ឬគម្រោង។</li>
              <li>ចុច <strong>បោះផ្សាយ</strong> ដើម្បីចែករំលែកជាមួយសហគមន៍។</li>
              <li>ការបង្ហោះរបស់អ្នកនឹងបង្ហាញនៅលើទំព័រដើមសម្រាប់អ្នកប្រើប្រាស់ទាំងអស់ឃើញ។</li>
            </ul>
          </div>

          <div class="topic-card">
            <div class="topic-icon message">
              <i class="bi bi-chat-dots-fill"></i>
            </div>
            <h3>ការផ្ញើសារ</h3>
          <ul>
              <li>បើកទំព័រ <strong>សារ</strong> ពីរបារចំហៀងខាងឆ្វេង។</li>
              <li>ប្រើការស្វែងរកដើម្បីស្វែងរកអ្នកប្រើប្រាស់តាមឈ្មោះ បន្ទាប់មកចាប់ផ្តើមការសន្ទនា។</li>
              <li>អ្នកក៏អាចចុចប៊ូតុង <strong>សារ</strong> នៅលើកម្រងព័ត៌មានរបស់នរណាម្នាក់ ដើម្បីចាប់ផ្តើមជជែកដោយផ្ទាល់។</li>
              <li>សារ​គឺ​ជា​ពេល​វេលា​ពិត​ប្រាកដ — ការ​ឆ្លើយតប​នឹង​លេច​ឡើង​ភ្លាមៗ។</li>
            </ul>

          </div>

          <div class="topic-card">
            <div class="topic-icon collab">
              <i class="bi bi-building"></i>
            </div>
        <h3>ការបន្ថែមព័ត៌មានសហការ</h3>
            <ul>
              <li>ចូលទៅកាន់កម្រងព័ត៌មានរបស់អ្នក ហើយចុចលើផ្ទាំង <strong>កិច្ចសហការ</strong>។</li>
              <li>បង្ហោះរូបសញ្ញាក្រុមហ៊ុន ឬស្ថាប័នរបស់អ្នក។</li>
              <li>បន្ថែមគេហទំព័រក្រុមហ៊ុន ឬតំណភ្ជាប់ផលប័ត្រ។</li>
              <li>ព័ត៌មាន​នេះ​នឹង​អាច​មើល​ឃើញ​ដោយ​អ្នក​ណា​ម្នាក់​ដែល​មើល​កម្រង​ព័ត៌មាន​សាធារណៈ​របស់​អ្នក ដោយ​ជួយ​ក្រុមហ៊ុន​រក​ឃើញ​អ្នក។</li>
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
