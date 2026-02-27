// ====== إعدادات عامة ======
const PHONE = "0542076041";
const WHATSAPP = "0542076041"; // نفس الرقم

function normalizePhoneKSA(phone){
  const p = (phone || "").trim();
  if(!p) return "";
  if(p.startsWith("+")) return p;
  if(p.startsWith("0")) return "+966" + p.slice(1);
  if(/^\d+$/.test(p)) return "+966" + p;
  return p;
}

function setContactLinks(){
  const waNumber = normalizePhoneKSA(WHATSAPP);
  const phoneNumber = normalizePhoneKSA(PHONE);

  document.querySelectorAll("[data-wa]").forEach(a=>{
    const msg = encodeURIComponent("السلام عليكم، أبغى استفسار عن الأبواب الأوتوماتيكية (تركيب/صيانة).");
    a.href = `https://wa.me/${waNumber.replace("+","")}?text=${msg}`;
  });

  document.querySelectorAll("[data-phone]").forEach(a=>{
    a.href = `tel:${phoneNumber}`;
  });

  const fwa = document.querySelector("[data-float-wa]");
  const fph = document.querySelector("[data-float-phone]");
  if(fwa){
    const msg = encodeURIComponent("السلام عليكم، أبغى خدمة الأبواب الأوتوماتيكية بالدمام.");
    fwa.href = `https://wa.me/${waNumber.replace("+","")}?text=${msg}`;
  }
  if(fph) fph.href = `tel:${phoneNumber}`;
}

function setActiveNav(){
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".navlinks a, .drawer nav a").forEach(a=>{
    const href = (a.getAttribute("href") || "").toLowerCase();
    if(href === path) a.classList.add("active");
  });
}

// ====== FIX: تثبيت الناف بار تحت التوب بار مهما كان ارتفاعه ======
function syncNavbarOffset(){
  /* ✅ تعديل مهم:
     وقفنا الحركة بالكامل علشان ما يحصلش اختفاء للكلام/تداخل
     (خلي CSS هو اللي يتحكم: top = var(--topbar-h))
  */
  return;
}

// ====== Menu (Mobile Drawer) ======
function initDrawer(){
  // امسك الزر سواء data-burger أو كلاس burger أو ID (✅ أقوى)
  const openBtns = Array.from(document.querySelectorAll("#menuBtn, [data-burger], .burger"));
  let drawer = document.querySelector(".drawer");
  let backdrop = document.querySelector(".drawer-backdrop");
  let closeBtn = document.querySelector("#menuClose, [data-drawer-close], .drawer .close");

  // لو الخلفية مش موجودة اعملها
  if(!backdrop){
    backdrop = document.createElement("div");
    backdrop.className = "drawer-backdrop";
    document.body.appendChild(backdrop);
  }

  // لو الدروار مش موجود اعمله (كحل احتياطي)
  if(!drawer){
    drawer = document.createElement("aside");
    drawer.className = "drawer";
    drawer.setAttribute("aria-label", "قائمة الموبايل");
    drawer.innerHTML = `
      <div class="head">
        <b>القائمة</b>
        <button class="close" type="button" aria-label="إغلاق">×</button>
      </div>
      <nav>
        <a href="index.html">الرئيسية</a>
        <a href="about.html">من نحن</a>
        <a href="services.html">خدماتنا</a>
        <a href="contact.html">اتصل بنا</a>
      </nav>
      <div class="meta">الدمام • الأحساء • الخبر • القطيف • صفوة • رأس تنورة</div>
    `;
    document.body.appendChild(drawer);
    closeBtn = drawer.querySelector(".close");
  }

  // (إعادة قراءة) في حالة العناصر اتعملت فوق
  drawer = document.querySelector(".drawer");
  backdrop = document.querySelector(".drawer-backdrop");
  closeBtn = document.querySelector("#menuClose, [data-drawer-close], .drawer .close");

  const open = () => {
    document.body.classList.add("menu-open");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    document.body.classList.remove("menu-open");
    document.body.style.overflow = "";
  };

  // ✅ تعديل مهم: Capture = true عشان أي Overlay ما يمنعش الكليك
  openBtns.forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      e.preventDefault();
      e.stopPropagation();
      open();
    }, true);
  });

  if(closeBtn){
    closeBtn.addEventListener("click", (e)=>{
      e.preventDefault();
      e.stopPropagation();
      close();
    }, true);
  }

  if(backdrop){
    backdrop.addEventListener("click", (e)=>{
      e.preventDefault();
      close();
    }, true);
  }

  drawer.querySelectorAll("a").forEach(a=>{
    a.addEventListener("click", ()=> close());
  });

  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape") close();
  }, true);

  // حماية إضافية
  document.addEventListener("click", (e)=>{
    if(!document.body.classList.contains("menu-open")) return;
    const insideDrawer = drawer.contains(e.target);
    const isBurger = openBtns.some(b => b.contains(e.target));
    if(!insideDrawer && !isBurger) close();
  }, true);
}

// ====== Hero Slider ======
function initSlider(){
  const slider = document.querySelector("[data-slider]");
  if(!slider) return;

  const track = slider.querySelector(".slides");
  const pills = slider.querySelectorAll(".pill");
  const total = pills.length;
  let index = 0;
  let timer = null;

  const go = (i)=>{
    index = (i + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
    pills.forEach((p,pi)=> p.classList.toggle("active", pi === index));
  };

  const next = ()=> go(index + 1);

  pills.forEach((p,i)=> p.addEventListener("click", ()=> {
    go(i);
    restart();
  }));

  const restart = ()=>{
    if(timer) clearInterval(timer);
    timer = setInterval(next, 4500);
  };

  go(0);
  restart();

  slider.addEventListener("mouseenter", ()=> timer && clearInterval(timer));
  slider.addEventListener("mouseleave", restart);
}

// ====== WhatsApp Form ======
function initWhatsAppForm(){
  const form = document.querySelector("[data-wa-form]");
  if(!form) return;

  form.addEventListener("submit", (e)=>{
    e.preventDefault();

    const name = form.querySelector("[name='name']").value.trim();
    const city = form.querySelector("[name='city']").value.trim();
    const service = form.querySelector("[name='service']").value.trim();
    const details = form.querySelector("[name='details']").value.trim();

    const waNumber = normalizePhoneKSA(WHATSAPP).replace("+","");

    const text =
`السلام عليكم
الاسم: ${name || "-"}
المدينة/الحي: ${city || "-"}
الخدمة المطلوبة: ${service || "-"}
التفاصيل: ${details || "-"}

أبغى تواصل سريع لو سمحت.`;

    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
}

// ====== Init ======
document.addEventListener("DOMContentLoaded", ()=>{
  setContactLinks();
  setActiveNav();
  initDrawer();
  initSlider();
  initWhatsAppForm();

  // كانت بتسبب حركة وتداخل، خليناها no-op
  syncNavbarOffset();
  window.addEventListener("resize", syncNavbarOffset);

  const y = document.querySelector("[data-year]");
  if(y) y.textContent = new Date().getFullYear();
});