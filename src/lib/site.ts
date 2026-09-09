/* r9: Single source of truth for business constants.
   Before this file, the WhatsApp number lived in 3 display formats and 11
   files, the owner email in 11 files, and the product URLs in 7 files each —
   any business change required a 40-file hunt (see r9 audit, C6). */

export const SITE = {
  name: "SmartLink",
  url: "https://smart-link.ly",

  email: "ahmedmedo1012@gmail.com",

  whatsapp: {
    /** International format without "+", as wa.me expects. */
    number: "218910089975",
    url: "https://wa.me/218910089975",
    /** r9: the ONE display format — rendered inside dir="ltr" so the "+"
        never rides the bidi reversal again (footer used to show
        "218910089975+" and API errors used the bare local form). */
    display: "+218 91 008 9975",
    /** Local form used inside Arabic API error sentences. */
    local: "0910089975",
  },

  products: {
    menu: {
      short: "Smart Menu",
      label: "Smart Menu — المنيو الرقمي",
      url: "https://menu.smart-link.ly",
      desc: "حول منيو مطعمك إلى تجربة رقمية تفاعلية",
    },
    bot: {
      /** r9: "SmartBot" — one word, everywhere. Two API surfaces used
          "Smart Bot" with a space (audit C3). */
      short: "SmartBot",
      label: "SmartBot — البوت الذكي",
      url: "https://bot.smart-link.ly",
      desc: "أتمتة الردود على صفحات فيسبوك بذكاء",
    },
  },

  social: {
    facebook: "https://www.facebook.com/profile.php?id=61591502614404",
    instagram: "https://instagram.com/smart_link.0/",
  },

  address: "ليبيا",

  hours: {
    /** Support via WhatsApp is genuinely 24/7; the office keeps 9-to-9.
        The contact page used to mash both into one contradictory line
        (audit C1) — use these two separately, never one string. */
    support: "24/7",
    office: "9 صباحاً — 9 مساءً",
    /** JSON-LD openingHoursSpecification values (Mo-Su 09:00–21:00). */
    schemaOpens: "09:00",
    schemaCloses: "21:00",
  },
} as const
