# P42 — تقييم Expo SDK 58 (البند P2-5): بحثٌ صادق، وتصحيحٌ للسجل، وتوصية تنفيذية

> **الوكيل:** P42-4c (بحث فقط — لا كود، لا تعديل مستودعات) · **التاريخ:** 2026-11-02 · **المرجع:** P2-5 «Expo SDK 58 evaluation» وتوجيه المهمة D6 «خطّط أولًا، لا تُرقّي تلقائيًا» · **الحالة:** مستند توصية — لا شيء أدناه نُفِّذ.
>
> **مدخلات البند كما وردت:** «الأثر المتبقي من تدقيق الاعتماديات في الجوال هي تثبيتات داخل شجرة Expo (decode-uri-component وdeepmerge وzod <4.6.6) لا يصلحها إلا قفزة expo@58 الكاسرة — والتطبيقات كلها على SDK 57».

## 0. تنبيه منهجي قبل كل شيء: فرضية البند لم تعد صحيحة على أرض المستودعات

هذا برنامج صدق قبل أن يكون برنامج ترقيات، لذا نبدأ بتصحيح السجل. تحقّقنا مباشرة من الملفات والأقفال وسجل Git والسجل (registry)، والنتيجة **ثلاث نقاط تنقض الفرضية**:

1. **القفزة الكاسرة وقعت أصلًا.** التطبيقات الثلاثة في نطاق المهمة قفزت 57→58 في برنامج P36 بتاريخ **2026-10-31** (02:27–02:43 UTC): SmartBot `c6322340` · Smart-Order `2340df9` · Smart-Menu `513682fc` — كلها بعنوان «the SDK 58 leap — 57→58 in one verified jump»، وببوابات خضراء موثقة في رسائلها (expo-doctor 20/20 · tsc · vitest · eslint · Hermes export). الـAABs الستة التي تحقّق منها P39/P41 صباح 2026-11-01 **هي أصلًا ثنائيات SDK 58** (تحقق النسب: `c6322340` سلفٌ لـ`832044d3`).
2. **الإصلاح «الوحيد» المزعوم لم يكن وحيدًا، ووقعت إلغاءته داخل البرنامج نفسه.** ملاحظة `a6590be` (Smart-Link، 2026-11-02 02:32) تقصدت تطبيق **Smart-Link/mobile هو نفسه** — التطبيق الوحيد الباقي على 57 — وقد تراجعت عنها صراحةً نفس اليوم في `a8834cb` (07:02): *«a6590be's 'needs the expo@58 jump' note was over-conservative — the override is the lever»*: عبر overrides أُغلقت zod (GHSA-mrhx-c7xc-m3w5) وdecode-uri-component (GHSA-qr28-fpjm-wq7f + GHSA-vcc3-ghjq-m6fr) **حتى على شجرة 57**. وموجة W2-3 أغلقت العائلتين في التطبيقات الثلاثة أيضًا (`0cf7a208` Smart-Menu · `c4716a8` SmartBot · `d25f840` Smart-Order).
3. **الإصلاح المتبقي فعلًا لا تحلّه أي قفزة إصدار Expo** — بل تحلّه رقعة patch اكتشفناها في هذا البحث: الـadvisory الوحيد الباقي في الجوال هو **deepmerge (GHSA-gcqx-w48m-w2h4)** ولا يوجد له إصدار مُرقّع على npm إطلاقًا (4.3.1 هو الأحدث وهو نفسه المتضرر — تحقق سجل)، **لكن `expo@58.0.22` (نُشر 2026-10-31 10:33 UTC، أي بعد قفزاتنا بساعات) يسحب deepmerge من الشجرة كليًا** عبر `@expo/config@58.0.10` التي أسقطت الاعتمادية. أي أن الإغلاق المتبقي = **رقعة 58.0.21→58.0.22 داخل SDK 58 نفسه**، لا قفزة كاسرة.

**العبارات المضلِّلة المحتملة إن لم يُصحَّح السجل:** أي خطّة «ترقية 57→58» للتطبيقات الثلاثة ستبدأ من فرضية خاطئة وستهدر جولة تنفيذ كاملة. البند P2-5 بصيغته الحالية **مُتجاوز بالوقائع (SUPERSEDED)** ويجب إغلاقه بصيغة جديدة (القسم 5).

---

## 1. الحالة الراهنة — الجرد (من المستودعات، قراءة فقط)

### 1.1 التطبيقات الثلاثة في نطاق المهمة

| | **SmartBot** `mobile/` | **Smart-Order** `mobile/` | **Smart-Menu** `mobile/` |
|---|---|---|---|
| **expo (مثبّت في القفل)** | **58.0.21** (`^58.0.0`) | **58.0.21** (`^58.0.0`) | **58.0.21** (`^58.0.0`) |
| **react-native** | 0.88.1 | 0.88.1 | 0.88.1 |
| **react / react-dom** | 19.3.0 | 19.3.0 | 19.3.0 (لا react-dom) |
| **expo-updates** | 58.0.19 — **مثبّت خامل** (لا runtimeVersion/updates في app.json) | 58.0.19 — **مثبّت خامل** | **غير مثبّت أصلًا** |
| **typescript** | ~6.0.3 | ~6.0.3 | ~6.0.3 |
| **قناة OTA** | لا (تحقق: app.json بلا `runtimeVersion`/`updates`) | لا | لا |
| **مدير الحزم** | npm (package-lock) | npm (package-lock) | pnpm 10.34.5 (overrides في pnpm-workspace/package.json، `node-linker=hoisted`) |
| **الملاحّة** | Expo Router (`src/app/`) + reanimated 4.7.1/worklets 0.13.0 + @expo/ui 58.0.25 + expo-glass-effect | Expo Router + expo-notifications 58.1.7 (handler صريح) | react-navigation 7 + NativeWind 4 + reanimated + إضافتان محليتان (`with-force-rtl`, `with-android-app-label`) + expo-build-properties (minSdk 25) |
| **package ID** | `ly.smartlink.smartbot` | `ly.smartlink.smartorder` | `ly.smartlink.smartmenu` |
| **EAS projectId** | `1b1a744c-…` | `99080633-…` | `4a2678f7-…` |
| **وضع الإصدار (مصفوفة التكافؤ)** | **NO-REBUILD** — فرق mobile/ منذ P39 `832044d3` فارغ | **NO-REBUILD** — أدوات تطوير فقط (overrides/lockfile؛ فُحص tarball expo-updates: glob لا يدخل رسومها التشغيلي) | **REBUILD-REQUIRED** عند دفعة الإصدار الجوالة القادمة — شاشتان مشحونتان تغيّرتا (بطاقة «مجاني/مجانية للأبد») + لا قناة OTA |

### 1.2 التطبيق الرابع — خارج قائمة المهمة لكنه جوهر تصحيح السجل

| | **Smart-Link** `mobile/` (smartlink-mobile — تطبيق المظلة) |
|---|---|
| **expo** | **57.0.31** (`~57.0.21`) — **التطبيق الوحيد الباقي فعلًا على SDK 57** |
| **react-native / react** | 0.86.3 / 19.2.3 |
| **expo-updates** | ~57.0.26 مثبّت خامل (لا config) · **لا eas.json ولا EAS projectId** · يبني عبر GitHub Actions `mobile-release.yml` (نمط SmartBot) |
| **overrides نشطة** | `{minimatch ^11.0.1, glob ^14.0.2, zod ^4.6.6, decode-uri-component 0.5.1}` — والقفل: zod@4.6.7 واحد، decode-uri-component@0.5.1، deepmerge@4.3.1 |
| **حجم الشجرة المصدرية** | 13 ملف src · بلا reanimated · بلا أنماط كاسرة معروفة (مسح القسم 3.4) |

### 1.3 الزاوية الأمنية الحالية (من ال lockfiles + سجل npm)

| الحزمة | advisory | الإصدار في أشجارنا اليوم | الحالة |
|---|---|---|---|
| zod | GHSA-mrhx-c7xc-m3w5 (high) | **4.6.7** في الأربعة كلها (override) | **مغلَق** — أثبتته البوابات (smoke الـ@expo/cli فوق zod-4 + بوابات CI) |
| decode-uri-component | GHSA-qr28-fpjm-wq7f + GHSA-vcc3-ghjq-m6fr (≤0.5.0) | **0.5.1** (Smart-Menu/Smart-Link عبر override) · **غائبة كليًا** عن قفلي SmartBot/Smart-Order (expo-router@58 أسقط query-string) | **مغلَق** |
| deepmerge | GHSA-gcqx-w48m-w2h4 (low 5.3 — prototype poisoning) | **4.3.1** في الأربعة (عبر `@expo/config`) | **استثناء موثّق** (`dec-deepmerge-unpatched` في decisions-ledger الخاص بSmartBot): لا إصدار مُرقّع وجوده؛ مدخل بناء/أداة فقط، لا يصله مدخل خارجي إنتاجي |

> ملاحظة: أرقام GHSA وحدود الإصدارات المتضررة منقولتان من توثيق الأسطول نفسه (رسائل `a8834cb`/`d25f840` + decisions-ledger). ما تحققناه نحن من السجل هو **وجود** الإصدارات المعالجة (zod 4.6.6/4.6.7، decode-uri-component 0.5.1) و**غياب** أي deepmerge أحدث من 4.3.1 — لم نستطع فتح قاعدة GHSA نفسها (API GitHub محدود — القسم 7).

---

## 2. ما الذي يقدّمه SDK 58 (وأي advisories يغلقها فعلًا — بالتحقق لا بالافتراض)

### 2.1 المحتوى الوظيفي (من ملاحظات الإصدار الرسمية، 2026-10-15 — جلبناها كاملة)

- **iOS 27 جاهزية + دورة حياة UIScene**: قوالب prebuild تولّد `SceneDelegate.swift`، وحزم Expo لم تعد تقرأ الهندسة من `UIScreen.main`.
- **iPhone Duo**: safe-area أهم، `expo-hinge` جديد، Expo UI `ArrangementView`.
- **React Native 0.88** (مع Strict TypeScript API افتراضيًا منذ 0.87).
- **expo-router**: data loaders مستقرة + NativeTabs + حالات تنقّل ومفاتيح مسارات **deterministic** (إصلاح جذرٍ لفئة أعطال تنقّل عشوائية).
- **أدوات**: Expo Observe، `@expo/agent-cli`، ويدجت الشاشة الرئيسية لأندرويد، Swift Package Manager، Expo Modules 2.0 beta + `expo-modules-core` مُبنى مسبقًا (بناءات أسرع)، محوّل Rust تجريبي (تجميع بارد أسرع ×2)، `@expo/fingerprint` الوضع الافتراضي `balanced` (**بنيات native أقل بلا داعٍ**)، نفق CLI أسرع.
- **bumps**: Node ≥22.13/24.3/26 · AGP 9 · Compose 1.12.1.

**الكسور المعلنة (التي تمسّ نمط تطبيقاتنا):** إزالة InteractionManager/Touchable الجذري/`Modal animated`/خصائص StatusBar القديمة؛ قتل deep imports من `react-native/Libraries/*` و`expo-router/build/*`؛ R8 مفعّل افتراضيًا في بناءات release؛ expo-router يخفض افتراض web output إلى `server`؛ إشعارات الواجهة تُعرض افتراضيًا ما لم يقل handler غير ذلك؛ `File.write()` صار async؛ RTL على iOS يتبع `I18nManager` (لا locale الجهاز)؛ NODE_ENV يفرضه CLI.

### 2.2 الزاوية الأمنية: ما يغلقه 58 فعلًا (بتحقق السجل) وما لا يغلقه

| الادّعاء في فرضية P2-5 | ما أثبته السجل |
|---|---|
| «zod <4.6.6 لا يصلحها إلا expo@58» | **غير صحيح بنيويًا**: `@expo/cli@58.1.17` (شجرة 58.0.21 نفسها) **ما زال يثبّت zod ^3.25.76** — أغلقناها هنا بـoverride لا بالقفزة. والأحدث `@expo/cli@58.1.18` (في 58.0.22) أسقط تثبيت zod من deps المباشرة (تحقق `npm view`) — أي أن **58.0.22 يجعل الoverride قابلًا للتقاعد** (يُتحقق وقت التنفيذ — القسم 7). |
| «decode-uri-component تحتاج قفزة 58» | **أُغلقت بـoverride 0.5.1 على 57 نفسها** (`a8834cb`)، وأشجار 58 (Bot/Order) **لا تحتويها أصلًا**: expo-router@58 أسقط `query-string` (تحقق: deps الرسمية للـ58.0.28 بلا query-string، والقفلان خاليان منها). |
| «deepmerge لا يصلحها إلا قفزة 58» | **العكس هو الصحيح جزئيًا**: لا يوجد deepmerge مُرقّع أصلًا (آخر إصدار 4.3.1 وهو المتضرر — تحقق سجل)، فلا قفزة إصدار تصلحها «بتصحيح الحزمة». لكن **expo@58.0.22 يسقطها من الشجرة**: يثبّت `@expo/config@~58.0.10` وقد أزالت 58.0.10 اعتمادية deepmerge (تحقق: deps 58.0.9 تحتويها، 58.0.10 لا). مسحنا كذلك المستهلكين المباشرين الرئيسيين في شجرة 58.0.22 (config-plugins · prebuild-config · image-utils · devcert · metro-config · router-server · package-manager · devtools · metro · schema-utils) — **كلها نظيفة**. ما لم نمسحه انتقاليًا بالكامل موسوم «غير محقق من السجل» حتى إعادة توليد القفل فعليًا. |

**خلاصة أمنية:** التطبيقات الثلاثة على 58 منذ 2026-10-31 وadvisories الجوال الوحيد الباقي (deepmerge، منخفض، وقت-البناء فقط) **يُغلق برقعة 58.0.22 لا بقفزة** — وهو ما لم يكن معروفًا عند صياغة P2-5 لأن 58.0.22 نُشر **بعد قفزاتنا بثماني ساعات** (10:33 UTC بينما القفزات 02:27–02:43 UTC).

### 2.3 لماذا نحن على 58.0.21 تحديدًا (ليست إهمالًا)

`expo@58.0.21` نُشر 2026-10-28، وقفزنا إليه 2026-10-31 فجرًا؛ `expo@58.0.22` نُشر صباح اليوم نفسه. الفارق بينهما في محورنا هو بالضبط: `@expo/config` 58.0.9→58.0.10 (إسقاط deepmerge) و`@expo/cli` 58.1.17→58.1.18 (إسقاط zod pin). آخر `latest` على npm يوم البحث: **58.0.22** (لا وجود لـSDK 59؛ وسوم canary لا تزال على خط 58).

---

## 3. الكسور المحتملة على تطبيقاتنا (بالأدلة من أشجارنا)

### 3.1 ما امتصّته القفزة فعلًا (دليل الـcommits)

- **SmartBot** (`c6322340`، 5 ملفات): ثلاث إصلاحات كسر موثقة — (1) قتل deep import `expo-router/build/react-navigation/bottom-tabs` في `(tabs)/_layout.tsx` والانتقال إلى `BottomTabBarButtonProps` من `expo-router/js-tabs` (التصدير العام الجديد)؛ (2+3) `audience` و`messages/[id]`: تشديد RN 0.88 لخصائص header/footer في FlatList (`null` → `undefined`).
- **Smart-Order** (`2340df9`، ملفان: package.json + القفل): **صفر تعديلات مصدر** — أقل القفزات كلفة في العائلة.
- **Smart-Menu** (`513682fc`، 4 ملفات): ملف مصدر واحد (`components/ui/Text.tsx`) + NativeWind 4 محفوظة + تعديل app.json. الإضافتان المحليتان (`with-force-rtl` عبر `withAndroidManifest/withInfoPlist` و`with-android-app-label`) نجاتا لأنهما فوق config-plugins API المستقرة.
- **البرهان التجريبي الأقوى على امتصاص الكسور:** البنيات الست EAS صباح 2026-11-01 (كلها FINISHED عند HEADs تتضمن القفزة — W0-3)، أي أن قالب 58 (بما فيه R8 الافتراضي وSceneDelegate) بَنى نظيفًا للتطبيقات الثلاثة.

### 3.2 مسح الأنماط الكاسرة في المصدر الحالي (grep عبر `src/` للتطبيقات الثلاثة)

- لا استخدام لـ`InteractionManager`/`ImageBackground`/deep imports من `react-native/Libraries/*`/`Touchable` الجذري/خصائص StatusBar المزالة/`Modal animated` — **نظيف**.
- لا استخدام لـ`withLayoutContext` (المهجورة في expo-router 58) — نظيف.
- **Smart-Order × expo-notifications:** التغيير الكاسر (إظهار الواجهة افتراضيًا) **مستوعب سلفًا** — `push-notifications.ts:36` يستدعي `setNotificationHandler` بشكل جديد تام (`shouldShowBanner/shouldShowList/shouldPlaySound/shouldSetBadge`).
- **SmartBot/Smart-Order × server-output الافتراضي:** غير معنيّين — `app.json` يثبّت `web.output: "static"` صراحةً.
- **Smart-Menu × تغيير RTL على iOS:** لصالحنا — التطبيق يفرض RTL بناءً (plugin) وتشغيلًا (`I18nManager.forceRTL(true)`)، والسلوك الجديد «يتبع I18nManager» يجعل مصدر الحقيقة لدينا هو المعمول به.
- **Node floors:** متطلبات 58 (≥22.13/≥24.3) — CI يستخدم majors عائمة (22/24) و`.nvmrc`=24 (المثبت v24.22.2) — كلها فوق الأرضيات. لا عمل مطلوب.

### 3.3 سطح الخطر المتبقي لموجة 58.0.22 (الرقعة، لا القفزة)

- انزياح patch داخل موجة 58: expo-router 58.0.28→**58.0.29**، @expo/ui 58.0.25→**58.0.26** (SmartBot)، expo-dev-client 58.0.17→**58.0.18**، expo-updates 58.0.19→**58.0.20**، expo-build-properties 58.0.11→**58.0.12** (Smart-Menu) — كلها وفق `bundledNativeModules.json` الرسمي لـ58.0.22 (جلبناه). أخطرها حساسيةً expo-router لأنه يمس نواة التنقل، لكن إصلاح P36 عندنا استخدم **re-export عامًا** (`js-tabs`) لا مسارًا داخليًا، فمقاوم لرقع الصف نفسها. الضامن: البوابات + smoke.
- إعادة توليد القفل تلمس overrides — سابقة مطمئنة: تجاوزت الregen مرتين موثقتين (P36 leap + a4b64552 لتوافق pnpm 9/10 مع EAS frozen-install).

### 3.4 smartlink-mobile (قفزة 57→58 كاملة — التقييم الوحيد المتبقي فعلًا بهذا الحجم)

مسح `src/` (13 ملفًا): **لا** deep imports من expo-router/build، **لا** ListHeaderComponent/ListFooterComponent، **لا** withLayoutContext/InteractionManager/ImageBackground، **لا** reanimated. أقرب شقيق نمطيًا هو Smart-Order (قفزته = ملفان). الفجوات الرئيسية التي ستمر بها القفزة: RN 0.86.3→0.88.1، React 19.2.3→19.3.0، gesture-handler 2.32→**3.3.0 (major)**، screens 4.26→4.30، safe-area 5.7→5.10، expo-router 57→58، وإسقاط query-string من الشجرة (decode-uri-component تغادر القفل طبيعيًا فيصبح overrideها بلا أثر). البوابة الجاهزة أصلًا في CI: `CI=1 npx expo export --platform android` (نفس الدخان الذي أثبت glob@14 على 57).

---

## 4. مصفوفة الجهد/الخطر

| التطبيق | العمل المتبقي | الجهد المقدّر | الخطر | الترتيب والشرط |
|---|---|---|---|---|
| **Smart-Menu** | رقعة 58.0.21→58.0.22 + `expo install --fix` (build-properties 58.0.12) + regen قفل pnpm | ~نصف يوم (بوابات: tsc · parity 362 · lint · CI=1 export + smoke على dev-client) | **منخفض** — كله patch داخل 58، والبنية 58 نجحت فعلًا في P39 | **الأول** — يركب حصرًا موجة **REBUILD-REQUIRED** القائمة (Wave-8): لا بناء إضافي واحد يُستهلك |
| **SmartBot** | نفس الرقعة (npm) + محاذاة @expo/ui/expo-router/dev-client/updates | ~نصف يوم (tsc · vitest · lint · Hermes export + **إعادة smoke الـ@expo/cli فوق zod-4**) | **منخفض–متوسط** (expo-router patch يمس نواة التنقل — يخففه الإصلاح عبر re-export عام) | **الثاني** — lockfile-only: **وضع NO-REBUILD يُحفظ** (تغيير رسم-بناء فقط؛ الـAAB المشحون لا يحتوي @expo/config ولا deepmerge أصلًا) |
| **Smart-Order** | نفس الرقعة (npm) | ~ربع–نصف يوم | **منخفض** (سابقة Smart-Order: قفزة كاملة بصفر مصدر) | **الثالث** — نفس اليوم مع SmartBot (نمط W2-3) |
| **smartlink-mobile** | قفزة كاملة 57→58 بنمط P36 (تثبيت ذرّي نظيف + regen) | ~نصف–يوم واحد (نمط Smart-Order المتوقع: ملفان–ثلاثة) | **منخفض–متوسط** (major لـgesture-handler يمر عبر expo-router فقط؛ 13 ملفًا بلا reanimated) | **رابعًا (P3، منصوح به لا مانع)** — يوحّد الأسطول على SDK واحد ويصفّر advisories الجوال **عائليًا** |

**كلفة عدم الفعل:** يبقى استثناء deepmerge موثّقًا إلى الأبد بلا ضرورة (الرقعة تغلقه في أشجار mobile الأربعة)، ويبقى الأسطول مشطّرًا بين 57/58 مع ازدواجية قوالب البناء.

---

## 5. التوصية (مبنية على ما وجدناه، لا على فرضية البند)

1. **إغلاق P2-5 بصيغته الأصلية بوصفه SUPERSEDED بالوقائع**، وتثبيت التصحيح في سجل القضايا: القفزة نُفّذت (P36)، والعائلتين أُغلقتا بالـoverrides (W2-3)، والادعاء بأن القفزة هي «الإصلاح الوحيد» ألغته `a8834cb` نصًا. البند الحقيقي الباقي أصغر بكثير مما صيغ.
2. **تنفيذ «موجة 58.0.22» المرحلية** (القسم 6): Smart-Menu أولًا داخل دفعة Wave-8 للجهوزية الإصدارية لأنه يحتاج إعادة بناء أصلًا (صفر كلفة بناء إضافية)، ثم SmartBot وSmart-Order كتغيير lockfile-only يحفظ NO-REBUILD ويغلق deepmerge في التدقيق المستودعي فورًا.
3. **smartlink-mobile: القفزة إلى 58 نعم — لكن بعد تطبيقات المنتج** وبأولوية P3 (هو تطبيق مظلة غير متجر، advisories مسندة أصلًا؛ مكسبه الأكبر توحيد الأسطول وإسقاط deepmerge من شجرته عبر @expo/config@58.0.10).
4. **تحديث محفز الاستثناء `dec-deepmerge-unpatched`**: يضاف إليه مسار تقاعد ثانٍ موثّق — «إسقاط deepmerge من شجرة الجوال باعتماد expo@58.0.22+ (يتحقق بغيابها من القفل بعد regen)» — مع بقاء مسار الويب (fb_dashboard عبر react-joyride/react-floater) رهن نشر deepmerge >4.3.1 من upstream، ومحفزها الأصلي كما هو.
5. **ما لا نوصي به:** فتح workstream OTA في هذا السياق (موثق خارج النطاق في مصفوفة التكافؤ)، أو أي بنيات EAS إضافية للتطبيقين NO-REBUILD (حصة الدورة 6/15 أندرويد — تُدَّخر لبناء Smart-Menu المطلوب أصلًا)، أو إزالة override الـzod قبل تحقق التنفيذ (القسم 7).

---

## 6. الخطة التنفيذية المرحلية (امتثال D6: لا ترقية تلقائية — تخطيط أولًا)

> كل مرحلة: فرع مستقل لكل مستودع + البوابات القائمة نفسها (لا بوابات جديدة تُخترع) + دمج متفرّع الصلاحية (branch-gated) بنمط W2-3 + إمكانية تراجع بـrevert أحادي. **لا شيء يبدأ قبل اعتماد هذه الخطة.**

- **المرحلة 0 — تثبيت خط الأساس (قراءة فقط):** إعادة تشغيل التدقيق (osv-scanner/Dependabot) على القفول الأربعة الحالية وتوثيق الناتج بجوار هذا المستند — حتى يكون إغلاق deepmerge بعد المرحلة 2 **قابلًا للقياس** لا مُدّعى.
- **المرحلة 1 — Smart-Menu (ترافق إعداد Wave-8):** `expo@~58.0.22` + `npx expo install --fix` + regen قفل pnpm → البوابات (typecheck · parity 362 · lint · `CI=1` export) + smoke على dev-client → دمج. **لا بناء مستقل** — ينتظر بناء الـREBUILD-REQUIRED المقرر أصلًا (أي تغيير جواله يركب نفس الثنائية).
- **المرحلة 2 — SmartBot ثم Smart-Order (يومان كحد أقصى):** نفس الرقعة عبر npm + regen → البوابات + **إعادة تشغيل دخان الـ@expo/cli فوق zod-4** (واجب عند كل رقعة expo لأن الoverride يفرطح نطاقًا major ضد نية upstream الأصلية) → دمج بلا أي بناء. مخرَج المرحلة: تأكيد غياب deepmerge عن القفلين + تحديث محفز الاستثناء في decisions-ledger.
- **المرحلة 3 — smartlink-mobile (اختيارية-منصوحة، P3):** قفزة 58 كاملة بنمط P36 (حذف node_modules + regen ذرّي — الحل التدريجي يموت على رسم peers المختلط 57/58) → بوابات ci.yml (typecheck + tests + CI=1 export android) → دخان جهاز/محاكي واحد → دمج. بعدها: fleet-wide إعادة تدقيق واحدة (المرحلة 0 template) — الهدف الموثق: **صفر advisories في أشجار الجوال الأربعة**.
- **المرحلة 4 — إغلاق السجلات:** تحديث `P42-ISSUE-REGISTER.md` (P2-5 → SUPERSEDED→DONE بالتصحيح) + `P42-MASTER-WORKLOG.md` + إيداع هذا المستند في `docs/p42/` — **ولا يُدّعى في أي منها أكثر مما أثبتته البوابات**.

---

## 7. ما لم نتمكن من التحقق منه (الحدود الصادقة)

1. **GitHub API محدود (HTTP 403 rate limit)** — لم نحصل على release notes لكل رقعة (58.0.21→58.0.22) من GitHub؛ اكتفينا بميتاداتا npm (أوقات النشر والأشجار) + ملاحظة الشانجلوج الرسمية أن Expo «تواصل backport الميزات إلى SDK 58». **الرقعة 58.0.22 لم تُقرأ ملاحظاتها التفصيلية** — البوابات هي الضامن عند تنفيذ المرحلة 2.
2. **`CHANGELOG.md` في مستودع expo يبدأ عند 57.0.0** — ملاحظات SDK 58 التفصيلية موجودة في منشور الشانجلوج فقط (جلبناه كاملًا ونقلنا عنه).
3. **تقاعد override الـzod على 58.0.22 «غير محقق من السجل» بالقدر الكافي للتنفيذ:** ثبت أن `@expo/cli@58.1.18` لم يعد يثبّت zod في deps المباشرة، لكن نفي وجود أي مُثبِّت ^3-only آخر في كامل الرسم الانتقالي يتطلب install فعليًا — يُحسم في المرحلة 2 (حذف الoverride يبقى قرارًا لاحقًا منفصلًا، لا رديفًا للرقعة).
4. **مسح deepmerge في شجرة 58.0.22** غطّى المستهلكين المباشرين المثبتين في قفولنا (كان `@expo/config` وحده) + عينة الحزم الرئيسية (10 حزم — كلها نظيفة)؛ **لم نفحص كل حزمة انتقالية** — يبقى «غير محقق من السجل» حتى regen المرحلة 2 (وهو نفسه الإثبات المطلوب).
5. **المحتوى السلوكي لـexpo-router@58.0.29** (مقابل 58.0.28) لم نقرأ له ملاحظات مستقلة — غير متوفرة في مصادرنا المفتوحة.
6. **وضع New Architecture الافتراضي في 58** لم يرد نصًا في الجزء الذي قرأناه من الشانجلوج («غير محقق من المصدر»)؛ المعروف والموثق: التطبيقات تعمل bridgeless منذ 57 (README Smart-Menu) ولا مفتاح `newArchEnabled` في أي app.json لدينا (تحقق grep)، والبنيات الست الناجحة 2026-11-01 برهان أن قالب 58 يبني سليمًا لثلاثتها.

---

## 8. سجل المصادر (كل ما رجعناه فعلًا، وما أخذنا من كل مصدر)

**سجل npm (استعلامات `npm view` / unpkg — كلها نجحت):**

| # | الاستعلام | ما أخذنا منه |
|---|---|---|
| 1 | `expo` dist-tags / versions / time | latest=**58.0.22**، لا SDK 59؛ نشر 58.0.21 (10-28) و58.0.22 (10-31 10:33)؛ 58.0.0 (09-29) |
| 2 | `expo@58.0.22` dependencies + peerDependencies | 25 اعتمادية مباشرة (`@expo/cli ^58.1.18`، `@expo/config ~58.0.10`…)؛ peers نجومية |
| 3 | `unpkg.com/expo@58.0.22/bundledNativeModules.json` | جدول الإصدارات المتوقعة (RN 0.88.1 · react 19.3.0 · expo-router ~58.0.29 · reanimated 4.7.1…) |
| 4 | `@expo/config@58.0.9` / `@58.0.10` deps | **58.0.9 يثبّت deepmerge ^4.3.1، و58.0.10 أسقطتها** |
| 5 | `@expo/cli@58.1.17` / `@58.1.18` deps | **58.1.17 يثبّت zod ^3.25.76، و58.1.18 بلا zod** |
| 6 | `deepmerge` versions/latest | **4.3.1 الأحدث — لا إصدار مُرقّع** |
| 7 | `zod` versions | حتى 4.6.7 (المُرقّعان 4.6.6/4.6.7 موجودان) |
| 8 | `decode-uri-component` versions | حتى 0.5.1 |
| 9 | `expo-router@58.0.28` deps | بلا query-string → مغادرة decode-uri-component شجرة 58 |
| 10 | `@expo/{config-plugins@58.0.11, prebuild-config@58.0.18, image-utils@0.12.6, devcert@1.2.2, metro-config@58.0.20, router-server@58.0.20, package-manager@1.14.2, devtools@58.0.2, metro@58.0.0, schema-utils@58.0.3}` | مسح deepmerge/zod/query-string — كلها نظيفة |

**الويب:**

| # | الرابط | النتيجة |
|---|---|---|
| 11 | `https://expo.dev/changelog/sdk-58` | HTTP 200 — ملاحظات إصدار SDK 58 كاملة (الميزات، الإهمالات، الكسور، bumps، خطوات الترقية) — منشور 2026-10-15 |
| 12 | `https://raw.githubusercontent.com/expo/expo/main/CHANGELOG.md` | HTTP 200 (627KB) — أحدث أقسامه **57.0.0** (لا 58 فيه بعد) |
| 13 | `https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/` | HTTP 200 — الخطوات الرسمية (install → --fix → doctor → حذف android/ios لـCNG) |
| 14 | `https://api.github.com/repos/expo/expo/releases` | **HTTP 403 (rate limit) — فشل، وموثق كفشل** |

**المستودعات (قراءة فقط):** `mobile/package.json` + القفول (npm ×3 / pnpm) + `app.json`/`eas.json` للتطبيقات الثلاثة وapp.json لـsmartlink-mobile (لا eas.json له)؛ سجل Git: قفزات P36 (`c6322340`/`2340df9`/`513682fc`) و`a6590be`/`a8834cb` وموجة W2-3 (`0cf7a208`/`c4716a8`/`d25f840`) وHEADs المرجعية (`832044d3`/`b26efe0`/`c98b183b` — وتحقق النسب)؛ `docs/p42/` (PARITY-MATRIX · OWNER-DECISIONS · ISSUE-REGISTER · MASTER-WORKLOG)؛ `SmartBot/docs/decisions-ledger.md` (`dec-deepmerge-unpatched`)؛ workflows (`ci.yml`/`mobile-release.yml` ×4)؛ greps الأنماط الكاسرة في `src/` للتطبيقات الأربعة.

---

*الخلاصة في سطر: القفزة التي طلب البندُ تقييمها وقعت قبل يومين من كتابته، وadvisoriesـه أُغلقت بغيرها، والعمل الحقيقي المتبقي رقعةٌ صغيرة تُغلق الاستثناء الأخير — والصدق هنا كان أن نكتشف ذلك ونقوله قبل أن ننفّذ أي شيء.*

---

## 10. سجل التنفيذ (Wave-9، 2026-11-03) — الخطة نُفّذت كما كُتبت، والحدود الصادقة أُقفلت بالبوابات

المراحل 1 و2 من §6 نُفّذت حرفيًا في ثلاثة commits ذرّية lockfile-only
(سجلات الوكلاء P42-9a/9b/9c)، والمرحلة 4 (إغلاق السجلات) هي هذا
التحديث نفسه:

| المرحلة | المستودع | الـcommit | الأدلة القافلة |
|---|---|---|---|
| 1 | Smart-Menu | `7ebf6a9f` | deepmerge: 3 مراجع قفل → **صفر** (rg exit 1) · `@expo/config@58.0.10` · `@expo/cli@58.1.18` · overrides الـ11 سليمة بايت-ببايت · expo-doctor **20/20** · OSV: استشارة واحدة → «No issues found» · CI 41558667724 ✅ |
| 2a | Smart-Order | `52a4dca` | قفل npm: محذوف 1 (deepmerge) · مضاف 0 · 18 متغيّرًا كلها داخل عائلة رقعة expo · CI 41558671936 ✅ |
| 2b | SmartBot | `e9fa9fb5` | القفل نفسه + **تقاعد `dec-deepmerge-unpatched`** في decisions-ledger بشرطه الخاص (§7.3 حُسم) · CI 41559913294 ✅ |

**ما أغلقته البوابات من «الحدود الصادقة» §7:** البند 3 (تقاعد override
الـzod في الشجرة — أثبته regen الفعلي) والبند 4 (مسح deepmerge الكامل —
إثباته القفل المُعاد توليده). **ما بقي مفتوحًا كما هو:** المرحلة 3
(smartlink-mobile — القفزة الكاملة، P3 موثّق، وهو مصدر F-04 في سجل
المشاكل) والبند 5 (ملاحظات expo-router@58.0.29 — لم تصدر بعدُ).

**بنيات الإصدار:** ست بنيات EAS أندرويد FINISHED فوق رؤوس الرقعة
(الجدول الكامل بمعرّفات البنيات في P42-MASTER-WORKLOG قسم W9) —
v1.0.0 / build 4. لا قنوات OTA في العائلة (تحقق grep: لا `updates` ولا
`runtimeVersion`) — كل إصلاح قادم يتطلب بنية جديدة؛ وهذا ما جعل F-01
(التي جاءت بعد يومين) تُغلق على الويب فورًا وتنتظر إعادة بناء binary
محجوبة على حصة EAS (تجدد 2026-12-01).
