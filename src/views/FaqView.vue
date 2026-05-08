<script setup>
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const openIndex = ref(null)

const toggle = (i) => {
  openIndex.value = openIndex.value === i ? null : i
}

const faqs = [
  {
    category: 'សំណួរដំបូងៗ',
    items: [
      {
        q: 'តើ Connexion គឺជាអ្វី?',
        a: 'Connexion គឺជាកន្លែងជួបជុំសម្រាប់អ្នកចូលចិត្តបច្ចេកវិទ្យា មិនថាអ្នករៀនផ្នែកកូដ រចនា (Design) ឬជានិស្សិតនោះទេ។ នៅទីនេះអ្នកអាចចែករំលែកចំណេះដឹង រកការងារ មើលកម្មវិធីប្លែកៗ និងជជែកលេងជាមួយអ្នកដទៃបានយ៉ាងងាយស្រួល។'
      },
      {
        q: 'តើនរណាខ្លះអាចប្រើ Connexion បាន?',
        a: 'ឱ្យតែអ្នកស្រឡាញ់បច្ចេកវិទ្យា គឺអាចប្រើបានទាំងអស់! មិនថាអ្នកជានិស្សិត អ្នកធ្វើការសេរី ឬក្រុមហ៊ុនដែលចង់រើសបុគ្គលិក ក៏អាចចូលរួមបានដែរ។'
      },
      {
        q: 'តើត្រូវអស់លុយអត់ពេលប្រើ Connexion?',
        a: 'អត់អស់លុយទេ! ការបង្កើតគណនី និងការប្រើមុខងារសំខាន់ៗដូចជា ការបង្ហោះ ផ្ញើសារ និងការរៀបចំប្រវត្តិរូប គឺប្រើបានដោយសេរី និងឥតគិតថ្លៃ។'
      },
    ]
  },
  {
    category: 'ប្រវត្តិរូប និង CV',
    items: [
      {
        q: 'តើត្រូវដាក់បញ្ចូល CV តាមរបៀបណា?',
        a: 'ចូលទៅកាន់ទំព័រ "ប្រវត្តិរូប" រួចចុចលើពាក្យ "CV"។ អ្នកអាចដាក់ឯកសារជាប្រភេទ PDF ឬ Word បាន។ នៅពេលអ្នកដទៃចូលមើលប្រវត្តិរូបរបស់អ្នក គេអាចមើលឃើញ ឬទាញយក CV របស់អ្នកទៅមើលបាន។'
      },
      {
        q: 'តើអ្នកដទៃអាចឃើញព័ត៌មានផ្ទាល់ខ្លួនរបស់ខ្ញុំទេ?',
        a: 'គេអាចឃើញត្រឹមតែអ្វីដែលអ្នកបង្ហាញដូចជា ឈ្មោះ ជំនាញ ការសិក្សា និងស្នាដៃរបស់អ្នកប៉ុណ្ណោះ។ ចំពោះរបស់សម្ងាត់ដូចជា "ពាក្យសម្ងាត់" គឺគ្មានអ្នកណាអាចឃើញឡើយ។'
      },
      {
        q: 'តើត្រូវបន្ថែម ឬលុបជំនាញ (Skills) យ៉ាងដូចម្តេច?',
        a: 'នៅក្នុងទំព័រប្រវត្តិរូប ចុចលើប៊ូតុង "ជំនាញ"។ អ្នកអាចវាយស្វែងរកជំនាញដែលអ្នកមាន រួចចុចជ្រើសរើសយកតែម្តង។'
      }
    ]
  },
  {
    category: 'ការងារ និងព្រឹត្តិការណ៍',
    items: [
      {
        q: 'តើត្រូវរកការងារនៅលើ Connexion យ៉ាងម៉េច?',
        a: 'អ្នកអាចមើលនៅលើទំព័រដើម ហើយរើសយកពាក្យ "ការងារ"។ អ្នកនឹងឃើញក្រុមហ៊ុនជាច្រើនបង្ហោះរើសបុគ្គលិក។ កុំភ្លេចរៀបចំ CV ក្នុងប្រវត្តិរូបឱ្យបានស្អាត ដើម្បីឱ្យគេងាយទាក់ទងមកអ្នក។'
      },
      {
        q: 'តើចង់រកមើល ឬផ្សព្វផ្សាយកម្មវិធីបច្ចេកវិទ្យាត្រូវធ្វើម៉េច?',
        a: 'បើចង់រកមើលកម្មវិធីប្លែកៗដូចជា ការប្រកួត ឬសិក្ខាសាលា សូមរើសយកពាក្យ "ព្រឹត្តិការណ៍"។ បើអ្នកចង់ផ្សព្វផ្សាយកម្មវិធីខ្លួនឯង គ្រាន់តែបង្កើតប្រកាសថ្មី ហើយរើសយកប្រភេទ "ព្រឹត្តិការណ៍" ជាការស្រេច។'
      }
    ]
  }
]
</script>

<template>
  <DashboardLayout>
    <div class="faq-page">
      <div class="container">

        <div class="page-header">
          <div class="header-icon">
            <i class="bi bi-question-circle-fill"></i>
          </div>
          <div>
            <h1>សំណួរដែលសួរញឹកញាប់</h1>
            <p>ចម្លើយរហ័សសម្រាប់ចម្ងល់ទូទៅអំពី Connexion ។</p>
          </div>
        </div>

        <div v-for="(section, si) in faqs" :key="si" class="faq-section">
          <div class="section-label">{{ section.category }}</div>
          <div class="accordion">
            <div
              v-for="(item, ii) in section.items"
              :key="ii"
              class="acc-item"
              :class="{ open: openIndex === `${si}-${ii}` }"
            >
              <button class="acc-q" @click="toggle(`${si}-${ii}`)">
                <span>{{ item.q }}</span>
                <i class="bi" :class="openIndex === `${si}-${ii}` ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
              </button>
              <div class="acc-a" v-show="openIndex === `${si}-${ii}`">
                <p>{{ item.a }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="faq-footer">
          <i class="bi bi-headset"></i>
          <div>
            <strong>រកមិនឃើញចម្លើយមែនទេ?</strong>
            <p>អ្នកអាចចូលទៅកាន់ "មជ្ឈមណ្ឌលជំនួយ" ដើម្បីមើលការណែនាំលម្អិតពីមុខងារនីមួយៗ។</p>
          </div>
          <button class="btn-help" @click="router.push('/help')">
            <i class="bi bi-life-preserver"></i> មជ្ឈមណ្ឌលជំនួយ
          </button>
        </div>

      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.faq-page { min-height: 100vh; background: #f0f2f5; padding: 28px 16px 48px; }
.container { max-width: 780px; margin: 0 auto; }
.page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; }
.header-icon { width: 54px; height: 54px; border-radius: 14px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; box-shadow: 0 4px 18px rgba(99,102,241,.3); }
.page-header h1 { margin: 0 0 4px; font-size: 1.55rem; font-weight: 700; color: #0f172a; }
.page-header p { margin: 0; color: #64748b; font-size: .95rem; }
.faq-section { margin-bottom: 28px; }
.section-label { font-size: .75rem; font-weight: 700; color: #6366f1; margin-bottom: 10px; padding-left: 4px; }
.accordion { display: flex; flex-direction: column; gap: 8px; }
.acc-item { background: #fff; border-radius: 12px; border: 1.5px solid #e5e7eb; overflow: hidden; transition: border-color .15s; }
.acc-item.open { border-color: #6366f1; }
.acc-q { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: none; border: none; cursor: pointer; font-family: inherit; font-size: .9rem; font-weight: 600; color: #1e293b; text-align: left; }
.acc-q:hover, .acc-item.open .acc-q { color: #6366f1; }
.acc-a { padding: 0 16px 14px; border-top: 1px solid #f1f5f9; }
.acc-a p { margin: 10px 0 0; font-size: .9rem; color: #475569; line-height: 1.65; }
.faq-footer { background: #fff; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px 22px; display: flex; align-items: center; gap: 14px; box-shadow: 0 2px 8px rgba(0,0,0,.04); }
.faq-footer > i { font-size: 1.6rem; color: #6366f1; flex-shrink: 0; }
.faq-footer strong { display: block; font-size: .95rem; color: #1e293b; margin-bottom: 3px; }
.faq-footer p { margin: 0; font-size: .85rem; color: #64748b; }
.btn-help { margin-left: auto; display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: 9px; background: #6366f1; color: #fff; font-size: .88rem; font-weight: 600; border: none; cursor: pointer; }
.btn-help:hover { background: #4f46e5; }
</style>