<script setup>
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <DashboardLayout>
    <div class="about-page">
      <div class="container">

        <!-- Hero -->
        <div class="about-hero">
          <div class="hero-icon">
            <i class="bi bi-hexagon-fill"></i>
          </div>
          <div class="hero-text">
            <h1>អំពី <span class="brand">Connexion</span></h1>
            <p>សហគមន៍បច្ចេកវិទ្យាដែលបង្កើតឡើងសម្រាប់អ្នកអភិវឌ្ឍន៍ អ្នករចនា និងអ្នកបង្កើត — ជាកន្លែងដែលទេពកោសល្យជួបនឹងឱកាស។</p>
          </div>
        </div>

        <!-- Mission banner -->
        <div class="mission-banner">
          <i class="bi bi-rocket-takeoff-fill mission-icon"></i>
          <div>
            <strong>បេសកកម្មរបស់យើង</strong>
            <p>ដើម្បីភ្ជាប់អ្នកជំនាញផ្នែកបច្ចេកវិទ្យានៅទូទាំងប្រទេសកម្ពុជា និងអាស៊ីអាគ្នេយ៍តាមរយៈការចែករំលែកចំណេះដឹង ឱកាសការងារ និងព្រឹត្តិការណ៍ដ៏មានអត្ថន័យ</p>
          </div>
        </div>

        <!-- Three pillars -->
        <div class="pillars">

          <div class="pillar">
            <div class="pillar-icon community">
              <i class="bi bi-people-fill"></i>
            </div>
            <h3>សហគមន៍បច្ចេកវិទ្យា</h3>
            <p>
             Connexion គឺជាកន្លែងមួយដែលអ្នកអភិវឌ្ឍន៍ អ្នករចនា សិស្សានុសិស្ស និងអ្នកជំនាញផ្នែកបច្ចេកវិទ្យាតភ្ជាប់។
              ចែករំលែកការបង្ហោះ បង្ហាញគម្រោងរបស់អ្នក ស្វែងយល់ពីអ្វីដែលអ្នកដទៃកំពុងសាងសង់ និងពង្រីករបស់អ្នក។
              បណ្តាញវិជ្ជាជីវៈ - ទាំងអស់នៅកន្លែងតែមួយ។
            </p>
            <ul class="pillar-list">
              <li><i class="bi bi-check2-circle"></i> បង្កើតប្រវត្តិរូបអាជីពជាមួយ CV & ជំនាញ</li>
              <li><i class="bi bi-check2-circle"></i> ចែករំលែកគំនិតបច្ចេកវិទ្យា ព័ត៌មាន និងគម្រោង</li>
              <li><i class="bi bi-check2-circle"></i>សារដោយផ្ទាល់ទៅនរណាម្នាក់នៅក្នុងបណ្តាញ</li>
              <li><i class="bi bi-check2-circle"></i> សហការជាមួយក្រុមហ៊ុន និងក្រុម</li>
            </ul>
          </div>

          <div class="pillar">
            <div class="pillar-icon jobs">
              <i class="bi bi-briefcase-fill"></i>
            </div>
            <h3>ការងារ និងឱកាស </h3>
            <p>
           កំពុងរកមើលតួនាទីបន្ទាប់របស់អ្នក ការងារឯករាជ្យ ឬកម្មសិក្សា? Novia អនុញ្ញាតឱ្យក្រុមហ៊ុននិង
              អ្នកជ្រើសរើសបុគ្គលិកប្រកាសឱកាសដោយផ្ទាល់ទៅកាន់សហគមន៍បច្ចេកវិទ្យា។ ផ្ទុក CV របស់អ្នកហើយអនុញ្ញាតឱ្យ
              មនុស្សត្រឹមត្រូវរកអ្នក។
            </p>
            <ul class="pillar-list">
              <li><i class="bi bi-check2-circle"></i> រកមើលការប្រកាសការងារបច្ចេកវិទ្យា</li>
              <li><i class="bi bi-check2-circle"></i>ផ្ទុកប្រវត្តិរូបសង្ខេប / CV របស់អ្នក។</li>
              <li><i class="bi bi-check2-circle"></i>បង្ហាញផលប័ត្រ និងបទពិសោធន៍របស់អ្នក។</li>
              <li><i class="bi bi-check2-circle"></i> រកឃើញដោយក្រុមហ៊ុននានា</li>
            </ul>
          </div>

          <div class="pillar">
            <div class="pillar-icon events">
              <i class="bi bi-calendar-event-fill"></i>
            </div>
            <h3>ព្រឹត្តិការណ៍ និងកិច្ចប្រជុំ</h3>
            <p>
             រក្សាទំនាក់ទំនងជាមួយឈុតបច្ចេកវិទ្យាក្នុងស្រុក។ Connexion surfaces hackathons, សិក្ខាសាលា,
              webinars និងព្រឹត្តិការណ៍បណ្តាញ ដូច្នេះអ្នកមិនដែលខកខានឱកាសដើម្បីរៀន ប្រកួតប្រជែង ឬ
              ជួបមនុស្សដែលមានគំនិតដូចគ្នា។

            </p>
            <ul class="pillar-list">
              <li><i class="bi bi-check2-circle"></i> ស្វែងយល់ពីព្រឹត្តិការណ៍បច្ចេកវិទ្យានាពេលខាងមុខ</li>
              <li><i class="bi bi-check2-circle"></i> ប្រកាស និងផ្សព្វផ្សាយព្រឹត្តិការណ៍ផ្ទាល់ខ្លួនរបស់អ្នក។</li>
              <li><i class="bi bi-check2-circle"></i>ចូលរួមកម្មវិធី hackathons និងការប្រកួតសរសេរកូដ</li>
              <li><i class="bi bi-check2-circle"></i>ភ្ជាប់ជាមួយវាគ្មិន និងអ្នករៀបចំ</li>
            </ul>
          </div>

        </div>

        <!-- How it works -->
        <div class="section-card">
          <h2><i class="bi bi-diagram-3-fill"></i> របៀបដែលវាដំណើរការ</h2>
          <div class="steps">
            <div class="step">
              <div class="step-num">1</div>
              <div>
                <strong>បង្កើត Profile របស់អ្នក</strong>
                <p>ចុះឈ្មោះ និងបង្កើតទម្រង់វិជ្ជាជីវៈរបស់អ្នក។ បន្ថែមជំនាញ ការអប់រំ បទពិសោធន៍ការងារ ប្រវត្តិរូបសង្ខេប និងព័ត៌មានលម្អិតអំពីការសហការរបស់អ្នក។</p>
              </div>
            </div>
            <div class="step">
              <div class="step-num">2</div>
              <div>
                <strong>រុករកសហគមន៍</strong>
                <p>រកមើលប្រកាសពីអ្នកជំនាញបច្ចេកវិទ្យាផ្សេងទៀត។ ស្វែងរកការងារ ព្រឹត្តិការណ៍ និងគម្រោងដែលត្រូវបានចែករំលែកនៅទូទាំងវេទិកា។</p>
              </div>
            </div>
            <div class="step">
              <div class="step-num">3</div>
              <div>
                <strong>ចែករំលែក និងចូលរួម</strong>
                <p>បោះផ្សាយប្រកាសផ្ទាល់ខ្លួនរបស់អ្នក — ចែករំលែកអ្វីដែលអ្នកកំពុងធ្វើការ ការងារដែលអ្នកកំពុងជួល ឬព្រឹត្តិការណ៍នាពេលខាងមុខដែលអ្នកកំពុងរៀបចំ។</p>
              </div>
            </div>
            <div class="step">
              <div class="step-num">4</div>
              <div>
                <strong>ភ្ជាប់ និងសហការ</strong>
                <p>ផ្ញើសារទៅកាន់អ្នកជំនាញដោយផ្ទាល់ ទស្សនាកម្រងព័ត៌មានរបស់ពួកគេ និងបង្កើតទំនាក់ទំនងការងារពិតប្រាកដនៅក្នុងចន្លោះបច្ចេកវិទ្យា។</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick links -->
        <div class="quick-links">
          <button class="ql-btn" @click="router.push('/faq')">
            <i class="bi bi-question-circle-fill"></i>
            <span>អាន FAQ</span>
          </button>
          <button class="ql-btn" @click="router.push('/help')">
            <i class="bi bi-life-preserver"></i>
            <span>ចូលទៅកាន់មជ្ឈមណ្ឌលជំនួយ</span>
          </button>
          <button class="ql-btn" @click="router.push('/')">
            <i class="bi bi-house-door-fill"></i>
            <span>ត្រឡប់ទៅផ្ទះវិញ។</span>
          </button>
        </div>

      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.about-page {
  min-height: 100vh;
  background: #f0f2f5;
  padding: 28px 16px 48px;
}
.container {
  max-width: 960px;
  margin: 0 auto;
}

/* Hero */
.about-hero {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 24px;
}
.hero-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 4px 20px rgba(99,102,241,0.35);
}
.hero-text h1 {
  margin: 0 0 4px;
  font-size: 1.8rem;
  font-weight: 800;
  color: #0f172a;
}
.hero-text .brand { color: #6366f1; }
.hero-text p {
  margin: 0;
  color: #64748b;
  font-size: .95rem;
}

/* Mission banner */
.mission-banner {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 14px;
  padding: 18px 22px;
  color: #fff;
  margin-bottom: 28px;
}
.mission-icon {
  font-size: 1.8rem;
  flex-shrink: 0;
  margin-top: 2px;
}
.mission-banner strong {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 4px;
}
.mission-banner p {
  margin: 0;
  font-size: .88rem;
  opacity: .92;
  line-height: 1.6;
}

/* Three pillars */
.pillars {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 24px;
}
@media (max-width: 768px) {
  .pillars { grid-template-columns: 1fr; }
}
.pillar {
  background: #fff;
  border-radius: 14px;
  padding: 22px 20px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0,0,0,.04);
}
.pillar-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  margin-bottom: 14px;
}
.pillar-icon.community { background: #ede9fe; color: #6366f1; }
.pillar-icon.jobs      { background: #dcfce7; color: #16a34a; }
.pillar-icon.events    { background: #fef3c7; color: #d97706; }
.pillar h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px;
}
.pillar p {
  font-size: .84rem;
  color: #64748b;
  line-height: 1.65;
  margin: 0 0 14px;
}
.pillar-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.pillar-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: .82rem;
  color: #374151;
}
.pillar-list i { color: #6366f1; flex-shrink: 0; }

/* How it works */
.section-card {
  background: #fff;
  border-radius: 14px;
  padding: 22px 24px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0,0,0,.04);
  margin-bottom: 24px;
}
.section-card h2 {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 20px;
  display: flex;
  align-items: center;
  gap: 9px;
}
.section-card h2 i { color: #6366f1; }
.steps { display: flex; flex-direction: column; gap: 18px; }
.step {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}
.step-num {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  font-size: .88rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.step strong { display: block; font-size: .9rem; color: #1e293b; margin-bottom: 3px; }
.step p { margin: 0; font-size: .82rem; color: #64748b; line-height: 1.6; }

/* Quick links */
.quick-links {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.ql-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 18px;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  color: #374151;
  font-size: .88rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all .15s;
}
.ql-btn:hover { border-color: #6366f1; color: #6366f1; background: #f8f5ff; }
.ql-btn i { font-size: 1rem; }
</style>
