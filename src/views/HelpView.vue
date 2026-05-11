<script setup>
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <DashboardLayout>
    <div class="help-page">
      <div class="container">

        <div class="page-header">
          <div class="header-icon">
            <i class="bi bi-life-preserver"></i>
          </div>
          <div>
            <h1>មជ្ឈមណ្ឌលជំនួយ</h1>
            <p>អ្វីៗគ្រប់យ៉ាងដែលអ្នកត្រូវដឹង ដើម្បីប្រើប្រាស់ Connexion ឱ្យកាន់តែប្រសើរ។</p>
          </div>
        </div>

        <div class="topics-grid">

          <div class="topic-card">
            <div class="topic-icon profile">
              <i class="bi bi-person-circle"></i>
            </div>
            <h3>រៀបចំប្រវត្តិរូប</h3>
            <ul>
              <li>ចូលទៅកាន់ <strong>រូបតំណាង</strong> ឬចុចលើរូបរបស់អ្នកនៅខាងលើ។</li>
              <li>ដាក់រូបថតផ្ទាល់ខ្លួន និងរូបភាពគម្រប (Cover photo)។</li>
              <li>ចុច <strong>កែសម្រួលប្រវត្តិរូប</strong> ដើម្បីបំពេញឈ្មោះ ទីតាំង និងថ្ងៃខែឆ្នាំកំណើត។</li>
              <li>បន្ថែម <strong>ព័ត៌មានការងារ</strong> ដូចជាតួនាទី និងក្រុមហ៊ុនដែលអ្នកធ្វើការ។</li>
              <li>ចុចប៊ូតុង <strong>ជំនាញ</strong> ដើម្បីស្វែងរក ឬបន្ថែមអ្វីដែលអ្នកពូកែធ្វើ។</li>
              <li>ក្នុងផ្នែក <strong>CV</strong> អ្នកអាចដាក់ឯកសារប្រវត្តិរូបសង្ខេប (PDF ឬ Word)។</li>
            </ul>
          </div>

          <div class="topic-card">
            <div class="topic-icon post">
              <i class="bi bi-pencil-square"></i>
            </div>
            <h3>របៀបបង្ហោះព័ត៌មាន</h3>
            <ul>
              <li>ចុចប៊ូតុង <strong>បង្កើតប្រកាស</strong> នៅផ្នែកខាងលើ។</li>
              <li>សរសេរខ្លឹមសារដែលអ្នកចង់ចែករំលែក ហើយអាចដាក់រូបភាព ឬឯកសារផ្សេងៗ។</li>
              <li>ជ្រើសរើស <strong>ប្រភេទ</strong> ដូចជា ការងារ គម្រោង ឬព័ត៌មានទូទៅ។</li>
              <li>ចុច <strong>បង្ហោះ</strong> ដើម្បីចែករំលែកទៅកាន់អ្នកដទៃ។</li>
              <li>អ្វីដែលអ្នកបង្ហោះនឹងបង្ហាញនៅលើទំព័រដើមសម្រាប់អ្នកប្រើប្រាស់ទាំងអស់។</li>
            </ul>
          </div>

          <div class="topic-card">
            <div class="topic-icon message">
              <i class="bi bi-chat-dots-fill"></i>
            </div>
            <h3>ការផ្ញើសារ</h3>
            <ul>
              <li>ចុចលើពាក្យ <strong>សារ</strong> នៅម៉ឺនុយខាងឆ្វេងដៃ។</li>
              <li>ស្វែងរកឈ្មោះមិត្តភក្តិរបស់អ្នកដើម្បីចាប់ផ្តើមជជែកគ្នា។</li>
              <li>អ្នកក៏អាចចុចប៊ូតុង <strong>សារ</strong> នៅលើប្រវត្តិរូបរបស់អ្នកដទៃផ្ទាល់តែម្តង។</li>
              <li>សារនឹងផ្ញើទៅភ្លាមៗ និងទទួលបានការឆ្លើយតបវិញភ្លាមៗ។</li>
            </ul>
          </div>

          <div class="topic-card">
            <div class="topic-icon collab">
              <i class="bi bi-building"></i>
            </div>
            <h3>ព័ត៌មានសម្រាប់កិច្ចសហការ</h3>
            <ul>
              <li>ចូលទៅកាន់ប្រវត្តិរូប រួចជ្រើសរើសផ្នែក <strong>កិច្ចសហការ</strong>។</li>
              <li>ដាក់រូបសញ្ញា (Logo) ក្រុមហ៊ុន ឬស្ថាប័នរបស់អ្នក។</li>
              <li>ដាក់តំណភ្ជាប់គេហទំព័រ ឬស្នាដៃដែលអ្នកធ្លាប់ធ្វើ។</li>
              <li>ព័ត៌មាននេះជួយឱ្យក្រុមហ៊ុនផ្សេងៗងាយស្រួលរកឃើញអ្នក។</li>
            </ul>
          </div>

          <div class="topic-card">
            <div class="topic-icon edu">
              <i class="bi bi-mortarboard-fill"></i>
            </div>
            <h3>ព័ត៌មានការសិក្សា</h3>
            <ul>
              <li>ចុចលើ <strong>កែសម្រួលការអប់រំ</strong> ក្នុងប្រវត្តិរូបរបស់អ្នក។</li>
              <li>បន្ថែមឈ្មោះសាលា កម្រិតសញ្ញាបត្រ និងមុខជំនាញដែលអ្នករៀន។</li>
              <li>កំណត់ឆ្នាំចាប់ផ្តើម និងឆ្នាំបញ្ចប់ (ឬរើសយក "កំពុងសិក្សា")។</li>
              <li>អ្នកអាចសរសេររៀបរាប់បន្ថែមខ្លីៗពីការសិក្សារបស់អ្នក។</li>
              <li>អ្នកអាចកែ ឬលុបព័ត៌មានទាំងនេះវិញបានគ្រប់ពេល។</li>
            </ul>
          </div>

          <div class="topic-card">
            <div class="topic-icon security">
              <i class="bi bi-shield-check"></i>
            </div>
            <h3>គណនី និងសុវត្ថិភាព</h3>
            <ul>
              <li>ចូលទៅកាន់ <strong>ការកំណត់</strong> ដើម្បីរៀបចំគណនីតាមតម្រូវការ។</li>
              <li>ចូលទៅកាន់ <strong>ឯកជនភាព និងសុវត្ថិភាព</strong> ដើម្បីប្តូរពាក្យសម្ងាត់។</li>
              <li>គួរប្រើពាក្យសម្ងាត់ឱ្យពិបាកទាយ (មានអក្សរ លេខ និងសញ្ញា)។</li>
              <li>ត្រូវចាកចេញពីគណនី (Logout) ជានិច្ច ប្រសិនបើប្រើទូរស័ព្ទ ឬកុំព្យូទ័ររួមគ្នា។</li>
              <li>ទាក់ទងមកយើងភ្លាម បើអ្នកមានអារម្មណ៍ថាគណនីមានអ្នកលួចប្រើ។</li>
            </ul>
          </div>

        </div>

        <div class="contact-note">
          <i class="bi bi-envelope-fill"></i>
          <div>
            <strong>នៅតែមានចម្ងល់មែនទេ?</strong>
            <p>ទាក់ទងមកក្រុមការងារគាំទ្រ Novia ឬអ្នកគ្រប់គ្រងប្រព័ន្ធ ប្រសិនបើអ្នកជួបបញ្ហាបច្ចេកទេស ឬការប្រើប្រាស់គណនី។</p>
          </div>
          <button class="btn-faq" @click="router.push('/faq')">
            <i class="bi bi-question-circle"></i> សំណួរដែលសួរញឹកញាប់
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
  font-family: 'Kantumruy Pro', sans-serif; /* បន្ថែមហ្វុងខ្មែរប្រសិនបើមាន */
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
  font-weight: 700;
  color: #0f172a;
}
.page-header p {
  margin: 0;
  color: #64748b;
  font-size: .95rem;
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
  font-size: 1rem;
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
  gap: 10px;
}
.topic-card li {
  font-size: .88rem;
  color: #475569;
  line-height: 1.6;
  padding-left: 16px;
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
  font-size: .95rem;
  color: #1e293b;
  margin-bottom: 3px;
}
.contact-note p {
  margin: 0;
  font-size: .85rem;
  color: #64748b;
  line-height: 1.6;
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
  font-size: .88rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all .15s;
  flex-shrink: 0;
}
.btn-faq:hover { background: #6366f1; color: #fff; }
</style>