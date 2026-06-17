import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

const BASE_URl = import.meta.env.VITE_API_URL;

/* ─── Responsive hook ───────────────────────────────────────── */
function useBreakpoint() {
  const [bp, setBp] = useState(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1200;
    return w < 640 ? "xs" : w < 768 ? "sm" : w < 1024 ? "md" : "lg";
  });
  useEffect(() => {
    const fn = () => {
      const w = window.innerWidth;
      setBp(w < 640 ? "xs" : w < 768 ? "sm" : w < 1024 ? "md" : "lg");
    };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return bp;
}

const LAND_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  /* exact same tokens as the app */
  --bg:#FAFAFA;
  --surf:#FFFFFF;
  --surf2:#F4F3F3;
  --surf3:#EBEAEA;
  --bdr:#E0DFDF;
  --bdr2:#CECECE;
  --accent:#4A4D4A;
  --accent2:#2E302E;
  --ahover:#5A5D5A;
  --tx:#1A1C1A;
  --tx2:#4A4D4A;
  --tx3:#8A8D8A;
  --green:#16A34A;
  --amber:#D97706;
  --red:#DC2626;
  --blue:#0284C7;
  --r:12px;--rs:8px;
  --font:'Plus Jakarta Sans',sans-serif;
  --shadow:0 1px 4px #00000010,0 4px 16px #00000008;
  --shadow-md:0 2px 8px #00000014,0 8px 32px #0000000C;
  --shadow-lg:0 4px 16px #00000018,0 16px 48px #00000010;
  /* accent palette for landing pops */
  --pop1:#0284C7;
  --pop2:#7C3AED;
  --pop3:#16A34A;
  --pop4:#D97706;
  --pop5:#DC2626;
  --pop6:#DB2777;
}

html{scroll-behavior:smooth}
body{
  font-family:var(--font);
  background:var(--bg);
  color:var(--tx);
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-thumb{background:var(--bdr2);border-radius:99px}
button,a{cursor:pointer}

/* ══ NAV ══════════════════════════════════════════════════════════ */
.lnav{
  position:fixed;top:0;left:0;right:0;z-index:900;
  display:flex;align-items:center;padding:0 6%;
  height:60px;
  transition:background .25s,box-shadow .25s,backdrop-filter .25s;
  background:transparent;
}
.lnav.scrolled{
  background:#FAFAFAee;
  box-shadow:0 1px 0 var(--bdr),0 4px 16px #00000008;
  backdrop-filter:blur(12px);
}
.lnav-logo{
  display:flex;align-items:center;gap:8px;
  font-size:17px;font-weight:800;letter-spacing:-.4px;
  color:var(--accent2);text-decoration:none;
}
.lnav-logo-ico{font-size:20px}
.lnav-links{display:flex;align-items:center;gap:0;margin:0 auto}
.lnav-link{
  padding:6px 13px;border-radius:8px;
  font-size:13px;font-weight:500;color:var(--tx2);
  transition:color .15s,background .15s;text-decoration:none;
}
.lnav-link:hover{color:var(--tx);background:var(--surf3)}
.lnav-acts{display:flex;align-items:center;gap:7px}
.ln-btn{
  display:inline-flex;align-items:center;gap:6px;
  padding:8px 16px;border-radius:var(--rs);
  font-size:13px;font-weight:600;border:none;
  transition:all .18s;font-family:var(--font);
}
.ln-ghost{
  background:transparent;color:var(--tx2);
  border:1.5px solid var(--bdr2);
}
.ln-ghost:hover{background:var(--surf3);color:var(--tx);border-color:var(--accent)}
.ln-solid{
  background:var(--accent);color:#fff;
  box-shadow:0 2px 8px #4A4D4A25;
}
.ln-solid:hover{background:var(--accent2);transform:translateY(-1px);box-shadow:0 4px 14px #4A4D4A35}

/* ══ HERO ═════════════════════════════════════════════════════════ */
.hero{
  position:relative;min-height:100vh;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  overflow:hidden;padding:100px 6% 80px;
  background:var(--bg);
}
#cv-canvas{
  position:absolute;inset:0;z-index:0;
  width:100%;height:100%;
  pointer-events:none;
}
/* CSS gradient orbs behind canvas */
.hero-orbs{
  position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;
}
.hero-orb{
  position:absolute;border-radius:50%;filter:blur(80px);
  transform:translate(-50%,-50%);
}
.hero-orb-1{
  width:600px;height:600px;
  top:45%;left:50%;
  background:radial-gradient(circle,#0284C740 0%,#7C3AED28 40%,transparent 70%);
  animation:orbFloat1 8s ease-in-out infinite;
}
.hero-orb-2{
  width:440px;height:440px;
  top:30%;left:25%;
  background:radial-gradient(circle,#16A34A30 0%,#0891B220 50%,transparent 70%);
  animation:orbFloat2 10s ease-in-out infinite;
}
.hero-orb-3{
  width:380px;height:380px;
  top:60%;left:75%;
  background:radial-gradient(circle,#D9770635 0%,#DB277720 50%,transparent 70%);
  animation:orbFloat3 12s ease-in-out infinite;
}
.hero-orb-4{
  width:280px;height:280px;
  top:20%;left:70%;
  background:radial-gradient(circle,#7C3AED25 0%,transparent 70%);
  animation:orbFloat1 9s ease-in-out infinite reverse;
}
.hero-orb-5{
  width:200px;height:200px;
  top:75%;left:20%;
  background:radial-gradient(circle,#DC262628 0%,transparent 70%);
  animation:orbFloat2 7s ease-in-out infinite reverse;
}
@keyframes orbFloat1{
  0%,100%{transform:translate(-50%,-50%) scale(1)}
  33%{transform:translate(-50%,-50%) scale(1.08) translate(18px,-12px)}
  66%{transform:translate(-50%,-50%) scale(0.95) translate(-12px,16px)}
}
@keyframes orbFloat2{
  0%,100%{transform:translate(-50%,-50%) scale(1)}
  40%{transform:translate(-50%,-50%) scale(1.12) translate(-20px,10px)}
  70%{transform:translate(-50%,-50%) scale(0.92) translate(14px,-18px)}
}
@keyframes orbFloat3{
  0%,100%{transform:translate(-50%,-50%) scale(1)}
  30%{transform:translate(-50%,-50%) scale(1.1) translate(10px,20px)}
  60%{transform:translate(-50%,-50%) scale(0.9) translate(-16px,-10px)}
}
.hero-content{position:relative;z-index:2;text-align:center;max-width:1060px}

.hero-badge{
  display:inline-flex;align-items:center;gap:8px;
  padding:5px 14px 5px 8px;
  background:var(--surf);border:1.5px solid var(--bdr2);
  border-radius:99px;font-size:12px;font-weight:600;
  color:var(--tx2);margin-bottom:28px;
  box-shadow:var(--shadow);
  animation:fadeup .55s both;
}
.hero-badge-dot{
  width:8px;height:8px;border-radius:50%;
  background:var(--green);
  box-shadow:0 0 0 3px #16A34A22;
  animation:ping 2s ease-in-out infinite;
}
@keyframes ping{0%,100%{box-shadow:0 0 0 3px #16A34A22}50%{box-shadow:0 0 0 7px #16A34A12}}

.hero-h1{
  font-size:clamp(120px,7vw,82px);font-weight:800;
  line-height:1.01;letter-spacing:-2.5px;
  color:var(--tx);margin-bottom:22px;
  animation:fadeup .55s .08s both;
}
.hero-h1 em{
  font-style:normal;
  background:linear-gradient(135deg,var(--pop1) 0%,var(--pop2) 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
}
.hero-sub{
  font-size:clamp(15px,2vw,18px);color:var(--tx2);
  line-height:1.75;max-width:520px;margin:0 auto 38px;
  animation:fadeup .55s .16s both;
}
.hero-ctas{
  display:flex;gap:10px;justify-content:center;
  flex-wrap:wrap;animation:fadeup .55s .24s both;
}
.ln-hero{padding:13px 28px;font-size:14.5px;border-radius:10px}

.hero-proof{
  display:flex;align-items:center;justify-content:center;
  gap:20px;margin-top:20px;
  animation:fadeup .55s .32s both;flex-wrap:wrap;
}
.hero-proof-item{font-size:12px;color:var(--tx3);display:flex;align-items:center;gap:5px}
.hero-proof-dot{width:3px;height:3px;border-radius:50%;background:var(--bdr2)}

.hero-stats{
  display:flex;gap:0;justify-content:center;
  margin-top:64px;animation:fadeup .55s .4s both;
  background:var(--surf);border:1.5px solid var(--bdr);
  border-radius:16px;box-shadow:var(--shadow);
  overflow:hidden;flex-wrap:wrap;
  position:relative;z-index:2;
}
.hero-stat{
  padding:18px 32px;text-align:center;
  border-right:1px solid var(--bdr);flex:1;min-width:120px;
}
.hero-stat:last-child{border-right:none}
.hero-stat-val{
  font-size:22px;font-weight:800;letter-spacing:-.5px;
  color:var(--tx);
}
.hero-stat-lbl{font-size:11.5px;color:var(--tx3);margin-top:2px}

@keyframes fadeup{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

/* ══ LOGO MARQUEE ════════════════════════════════════════════════ */
.logo-bar{
  padding:22px 0;
  border-top:1px solid var(--bdr);border-bottom:1px solid var(--bdr);
  background:var(--surf);overflow:hidden;position:relative;
}
.logo-bar::before,.logo-bar::after{
  content:'';position:absolute;top:0;bottom:0;width:100px;z-index:2;pointer-events:none;
}
.logo-bar::before{left:0;background:linear-gradient(90deg,var(--surf),transparent)}
.logo-bar::after{right:0;background:linear-gradient(-90deg,var(--surf),transparent)}
.logo-track{
  display:flex;gap:56px;align-items:center;
  animation:marquee 20s linear infinite;white-space:nowrap;
}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.logo-item{
  font-size:12.5px;font-weight:700;letter-spacing:.8px;
  text-transform:uppercase;color:var(--tx3);flex-shrink:0;
}

/* ══ SECTION COMMONS ═════════════════════════════════════════════ */
.lsec{padding:96px 6%}
.lsec-inner{max-width:1080px;margin:0 auto}
.lsec-label{
  display:inline-flex;align-items:center;gap:6px;
  font-size:11px;font-weight:700;letter-spacing:1.5px;
  text-transform:uppercase;color:var(--tx3);margin-bottom:12px;
}
.lsec-label::before{content:'';width:16px;height:2px;background:var(--accent);border-radius:99px}
.lsec-h{
  font-size:clamp(26px,3.8vw,42px);font-weight:800;
  letter-spacing:-1.2px;color:var(--tx);line-height:1.1;margin-bottom:14px;
}
.lsec-sub{font-size:16px;color:var(--tx2);line-height:1.7;max-width:500px}

/* ══ FEATURES ════════════════════════════════════════════════════ */
.feat-grid{
  display:grid;grid-template-columns:repeat(3,1fr);
  gap:14px;margin-top:52px;
}
.feat-card{
  background:var(--surf);border:1.5px solid var(--bdr);
  border-radius:16px;padding:26px;
  transition:border-color .2s,transform .2s,box-shadow .2s;
  position:relative;overflow:hidden;
}
.feat-card:hover{
  border-color:var(--bdr2);
  transform:translateY(-4px);
  box-shadow:0 12px 40px #00000010;
}
.feat-card-stripe{
  position:absolute;top:0;left:0;right:0;height:3px;
  border-radius:16px 16px 0 0;
}
.feat-ico{
  width:44px;height:44px;border-radius:12px;
  display:flex;align-items:center;justify-content:center;
  font-size:20px;margin-bottom:16px;
  border:1.5px solid var(--bdr);
}
.feat-title{font-size:15.5px;font-weight:700;color:var(--tx);margin-bottom:8px}
.feat-desc{font-size:13px;color:var(--tx2);line-height:1.65}
.feat-badge{
  display:inline-flex;margin-top:14px;padding:3px 9px;
  border-radius:99px;font-size:10.5px;font-weight:700;
  letter-spacing:.3px;
}

/* ══ SHOWCASE SPLIT ══════════════════════════════════════════════ */
.showcase{
  display:grid;grid-template-columns:1fr 1fr;
  gap:56px;align-items:center;
}
.showcase-visual{
  background:var(--surf);border:1.5px solid var(--bdr);
  border-radius:20px;padding:20px;
  box-shadow:var(--shadow-md);position:relative;overflow:hidden;
}
.showcase-visual::before{
  content:'';position:absolute;
  top:-60px;right:-60px;width:220px;height:220px;
  border-radius:50%;
  background:radial-gradient(circle,var(--pop1)08,transparent 70%);
  pointer-events:none;
}
.mock-topbar{
  display:flex;align-items:center;gap:8px;
  padding-bottom:14px;margin-bottom:14px;
  border-bottom:1px solid var(--bdr);
}
.mock-dot-r{width:9px;height:9px;border-radius:50%;background:#FF5F57}
.mock-dot-y{width:9px;height:9px;border-radius:50%;background:#FFBD2E}
.mock-dot-g{width:9px;height:9px;border-radius:50%;background:#28C840}
.mock-titlebar{font-size:11.5px;font-weight:600;color:var(--tx3);margin:0 auto}
.mock-file{
  display:flex;align-items:center;gap:10px;
  padding:9px 10px;border-radius:10px;
  margin-bottom:4px;transition:background .12s;
}
.mock-file:hover{background:var(--surf2)}
.mock-fname{font-size:12.5px;font-weight:600;color:var(--tx);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mock-fmeta{font-size:10.5px;color:var(--tx3);flex-shrink:0}
.mock-pbar{height:4px;border-radius:99px;background:var(--surf3);overflow:hidden;margin-top:3px}
.mock-pfill{height:100%;border-radius:99px}
.mock-footer{
  margin-top:12px;padding:10px 12px;
  background:var(--surf2);border-radius:10px;
  display:flex;justify-content:space-between;
  font-size:11.5px;color:var(--tx3);
  border:1px solid var(--bdr);
}

/* ══ HOW IT WORKS ════════════════════════════════════════════════ */
.steps{
  display:grid;grid-template-columns:repeat(3,1fr);
  gap:0;margin-top:52px;position:relative;
}
.steps::before{
  content:'';position:absolute;
  top:21px;left:calc(12.5% + 12px);right:calc(12.5% + 12px);
  height:2px;
  background:linear-gradient(90deg,var(--surf3),var(--bdr2) 30%,var(--bdr2) 70%,var(--surf3));
}
.step{text-align:center;padding:0 14px}
.step-num{
  width:42px;height:42px;border-radius:50%;
  background:var(--surf);border:2px solid var(--bdr2);
  display:flex;align-items:center;justify-content:center;
  font-size:13px;font-weight:800;color:var(--accent2);
  margin:0 auto 16px;position:relative;z-index:1;
  box-shadow:var(--shadow);
}
.step-title{font-size:14.5px;font-weight:700;color:var(--tx);margin-bottom:6px}
.step-desc{font-size:12.5px;color:var(--tx2);line-height:1.6}

/* ══ PRICING ═════════════════════════════════════════════════════ */
.pricing-grid{
  display:grid;grid-template-columns:repeat(3,1fr);
  gap:14px;margin-top:52px;
}
.plan-card{
  background:var(--surf);border:1.5px solid var(--bdr);
  border-radius:20px;padding:28px 24px;
  transition:border-color .2s,transform .2s,box-shadow .2s;
  position:relative;
}
.plan-card:hover{transform:translateY(-3px);box-shadow:var(--shadow-md)}
.plan-card.featured{
  background:linear-gradient(160deg,#1A1C1A 0%,#2E302E 100%);
  border-color:#4A4D4A;color:#FAFAFA;
}
.plan-top-badge{
  position:absolute;top:-12px;left:50%;transform:translateX(-50%);
  background:var(--accent);color:#fff;font-size:10.5px;font-weight:700;
  padding:3px 12px;border-radius:99px;white-space:nowrap;letter-spacing:.5px;
}
.plan-name{font-size:15px;font-weight:800;color:var(--tx);margin-bottom:4px}
.plan-card.featured .plan-name{color:#FAFAFA}
.plan-desc{font-size:12.5px;color:var(--tx3);margin-bottom:22px}
.plan-card.featured .plan-desc{color:#8A8D8A}
.plan-price{
  font-size:38px;font-weight:800;letter-spacing:-1px;
  color:var(--tx);line-height:1;
}
.plan-card.featured .plan-price{color:#FAFAFA}
.plan-price sup{font-size:18px;vertical-align:top;margin-top:6px}
.plan-price span{font-size:13px;font-weight:500;color:var(--tx3)}
.plan-divider{height:1px;background:var(--bdr);margin:20px 0}
.plan-card.featured .plan-divider{background:#4A4D4A}
.plan-perks{display:flex;flex-direction:column;gap:10px;margin-bottom:22px}
.plan-perk{display:flex;align-items:flex-start;gap:8px;font-size:13px;color:var(--tx2)}
.plan-card.featured .plan-perk{color:#EBEAEA}
.plan-perk-check{font-size:12px;flex-shrink:0;margin-top:1px}
.plan-btn{
  width:100%;padding:12px;border-radius:10px;
  font-size:13px;font-weight:700;border:none;
  font-family:var(--font);transition:all .18s;
}
.plan-btn-light{background:var(--surf3);color:var(--tx)}
.plan-btn-light:hover{background:var(--bdr2);color:var(--accent2)}
.plan-btn-dark{background:var(--surf);color:var(--accent2)}
.plan-btn-dark:hover{background:var(--surf2)}

/* ══ TESTIMONIALS ════════════════════════════════════════════════ */
.testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:52px}
.testi-card{
  background:var(--surf);border:1.5px solid var(--bdr);
  border-radius:16px;padding:22px;
  transition:box-shadow .2s;
}
.testi-card:hover{box-shadow:var(--shadow-md)}
.testi-stars{color:var(--amber);font-size:13px;letter-spacing:2px;margin-bottom:14px}
.testi-text{font-size:13.5px;color:var(--tx2);line-height:1.7;font-style:italic}
.testi-author{display:flex;align-items:center;gap:10px;margin-top:16px}
.testi-av{
  width:34px;height:34px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-size:12px;font-weight:700;color:#fff;flex-shrink:0;
}
.testi-name{font-size:12.5px;font-weight:700;color:var(--tx)}
.testi-role{font-size:11px;color:var(--tx3)}

/* ══ FAQ ══════════════════════════════════════════════════════════ */
.faq-list{max-width:960px;margin:48px auto 0;display:flex;flex-direction:column;gap:8px;}
.faq-item{
  background:var(--surf);border:1.5px solid var(--bdr);
  border-radius:12px;overflow:hidden;
}
.faq-q{
  display:flex;align-items:center;justify-content:space-between;
  padding:17px 20px;cursor:pointer;transition:background .12s;
}
.faq-q:hover{background:var(--surf2)}
.faq-q-text{font-size:14px;font-weight:600;color:var(--tx)}
.faq-chevron{color:var(--tx3);transition:transform .25s;flex-shrink:0}
.faq-chevron.open{transform:rotate(180deg)}
.faq-a{
  font-size:13.5px;color:var(--tx2);line-height:1.75;
  padding:0 20px;max-height:0;overflow:hidden;
  transition:max-height .3s ease,padding .3s;
}
.faq-a.open{max-height:200px;padding:0 20px 17px}

/* ══ CTA BANNER ══════════════════════════════════════════════════ */
.cta-banner{
  margin:0 6% 96px;
  border-radius:24px;
  background:linear-gradient(135deg,var(--accent2) 0%,var(--accent) 100%);
  padding:64px;text-align:center;
  position:relative;overflow:hidden;
}
.cta-banner::before{
  content:'☁️';
  position:absolute;right:40px;top:50%;transform:translateY(-50%);
  font-size:120px;opacity:.05;
}
.cta-banner-h{
  font-size:clamp(26px,4vw,44px);font-weight:800;
  letter-spacing:-1.2px;color:#fff;margin-bottom:12px;
  position:relative;
}
.cta-banner-sub{
  font-size:16px;color:#EBEAEACC;margin-bottom:32px;position:relative;
}
.cta-banner-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;position:relative}
.cta-light{background:#fff;color:var(--accent2);padding:13px 28px;font-size:14.5px}
.cta-light:hover{background:var(--surf2);transform:translateY(-1px)}
.cta-outline{
  background:transparent;color:#fff;
  border:1.5px solid #ffffff50;padding:13px 24px;font-size:14.5px;
}
.cta-outline:hover{background:#ffffff14;border-color:#ffffff80}

/* ══ FOOTER ══════════════════════════════════════════════════════ */
.lfooter{border-top:1px solid var(--bdr);padding:56px 6% 36px;background:var(--surf)}
.lfooter-top{
  display:grid;grid-template-columns:2fr 1fr 1fr 1fr;
  gap:48px;max-width:1080px;margin:0 auto 44px;
}
.lfooter-brand{font-size:16px;font-weight:800;color:var(--accent2);margin-bottom:8px;display:flex;align-items:center;gap:7px}
.lfooter-sub{font-size:13px;color:var(--tx3);line-height:1.6;max-width:230px}
.lfooter-col-title{font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--tx3);margin-bottom:14px}
.lfooter-link{display:block;font-size:13px;color:var(--tx3);margin-bottom:9px;transition:color .15s;text-decoration:none}
.lfooter-link:hover{color:var(--tx)}
.lfooter-bottom{
  max-width:1080px;margin:0 auto;
  display:flex;align-items:center;justify-content:space-between;
  padding-top:28px;border-top:1px solid var(--bdr);
  flex-wrap:wrap;gap:10px;
}
.lfooter-copy{font-size:12px;color:var(--tx3)}
.lfooter-socials{display:flex;gap:6px}
.lfooter-soc{
  width:30px;height:30px;border-radius:7px;
  border:1.5px solid var(--bdr);background:var(--surf2);
  display:flex;align-items:center;justify-content:center;
  font-size:12px;color:var(--tx3);transition:all .15s;
}
.lfooter-soc:hover{border-color:var(--bdr2);color:var(--tx);background:var(--surf3)}

/* ══ RESPONSIVE ══════════════════════════════════════════════════ */
@media(max-width:1024px){
  .feat-grid{grid-template-columns:repeat(2,1fr)}
  .pricing-grid{grid-template-columns:repeat(2,1fr)}
  .testi-grid{grid-template-columns:repeat(2,1fr)}
  .showcase{grid-template-columns:1fr;gap:28px}
  .lfooter-top{grid-template-columns:1fr 1fr}
}
@media(max-width:768px){
  .lnav-links{display:none}
  .feat-grid{grid-template-columns:1fr}
  .steps{grid-template-columns:1fr 1fr}
  .steps::before{display:none}
  .pricing-grid{grid-template-columns:1fr}
  .testi-grid{grid-template-columns:1fr}
  .cta-banner{padding:40px 24px;margin:0 4% 72px}
  .lsec{padding:64px 5%}
  .lfooter-top{grid-template-columns:1fr 1fr}
  .hero-stats{flex-direction:column}
  .hero-stat{border-right:none;border-bottom:1px solid var(--bdr)}
  .hero-stat:last-child{border-bottom:none}
}
@media(max-width:640px){
  .steps{grid-template-columns:1fr}
  .hero-ctas{flex-direction:column;align-items:center}
  .lfooter-top{grid-template-columns:1fr}
  .lfooter-bottom{flex-direction:column;text-align:center}
  .lnav{padding:0 4%}
  .lsec{padding:52px 4%}
  .cta-banner{padding:36px 20px;margin:0 3% 60px}
}
`;
export default function LandingPage({ onLogin, onSignup }) {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const threeRef = useRef({});
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  async function createsession() {
    const response = await fetch(`${BASE_URl}/user/session`, {
      method: "POST",
      credentials: "include",
    });
    const data = await response.json();
    if (data === "already login") {
      navigate("/drive");
    }
  }
  /* ── scroll listener ── */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* ── 2D canvas gradient circle animation ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let W, H;

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    /* circle definitions — center coords are 0..1 normalized */
    const circles = [
      {
        cx: 0.5,
        cy: 0.48,
        r: 0.32,
        c1: "rgba(2,132,199,0.28)",
        c2: "rgba(124,58,237,0.18)",
        c3: "rgba(0,0,0,0)",
        speed: 0.0007,
        dx: 0.04,
        dy: 0.03,
      },
      {
        cx: 0.28,
        cy: 0.35,
        r: 0.24,
        c1: "rgba(22,163,74,0.22)",
        c2: "rgba(8,145,178,0.14)",
        c3: "rgba(0,0,0,0)",
        speed: 0.0009,
        dx: -0.03,
        dy: 0.04,
      },
      {
        cx: 0.72,
        cy: 0.6,
        r: 0.22,
        c1: "rgba(217,119,6,0.22)",
        c2: "rgba(219,39,119,0.14)",
        c3: "rgba(0,0,0,0)",
        speed: 0.0008,
        dx: 0.02,
        dy: -0.05,
      },
      {
        cx: 0.72,
        cy: 0.25,
        r: 0.17,
        c1: "rgba(124,58,237,0.20)",
        c2: "rgba(2,132,199,0.10)",
        c3: "rgba(0,0,0,0)",
        speed: 0.001,
        dx: -0.04,
        dy: 0.03,
      },
      {
        cx: 0.22,
        cy: 0.7,
        r: 0.15,
        c1: "rgba(220,38,38,0.18)",
        c2: "rgba(217,119,6,0.10)",
        c3: "rgba(0,0,0,0)",
        speed: 0.0011,
        dx: 0.03,
        dy: -0.03,
      },
      {
        cx: 0.5,
        cy: 0.5,
        r: 0.42,
        c1: "rgba(2,132,199,0.07)",
        c2: "rgba(124,58,237,0.05)",
        c3: "rgba(0,0,0,0)",
        speed: 0.0004,
        dx: 0.01,
        dy: 0.01,
      },
    ];

    /* give each circle its own phase offset */
    const phases = circles.map((_, i) => i * 1.1);

    let t = 0;
    let mx = 0.5,
      my = 0.5;
    const onMouse = (e) => {
      mx = e.clientX / window.innerWidth;
      my = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMouse);

    const draw = () => {
      animId = requestAnimationFrame(draw);
      t += 0.006;
      ctx.clearRect(0, 0, W, H);

      circles.forEach((c, i) => {
        /* parallax offset based on mouse — each layer moves differently */
        const depth = 0.04 + i * 0.015;
        const px = (mx - 0.5) * depth * W;
        const py = (my - 0.5) * depth * H;

        /* floating oscillation */
        const ox = Math.sin(t * c.speed * 900 + phases[i]) * c.dx * W;
        const oy = Math.cos(t * c.speed * 700 + phases[i] * 1.3) * c.dy * H;

        const cx = c.cx * W + ox + px;
        const cy = c.cy * H + oy + py;
        const r = c.r * Math.min(W, H);

        /* breathing scale */
        const scale = 1 + Math.sin(t * c.speed * 600 + phases[i]) * 0.08;
        const rad = r * scale;

        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        grd.addColorStop(0, c.c1);
        grd.addColorStop(0.5, c.c2);
        grd.addColorStop(1, c.c3);

        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });

      /* soft central bloom */
      const bx = W * 0.5 + (mx - 0.5) * 20;
      const by = H * 0.46 + (my - 0.5) * 12;
      const br = Math.min(W, H) * (0.18 + Math.sin(t * 0.4) * 0.02);
      const bloom = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      bloom.addColorStop(0, "rgba(250,250,250,0.55)");
      bloom.addColorStop(0.4, "rgba(250,250,250,0.12)");
      bloom.addColorStop(1, "rgba(250,250,250,0)");
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fillStyle = bloom;
      ctx.fill();
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  useEffect(() => {
    createsession();
  }, []);
  /* ── data ── */
  const features = [
    
    {
      ico: "⚡",
      title: "Global CDN Delivery",
      desc: "Files served from 300+ edge nodes. Blazing-fast downloads anywhere in the world, every time.",
      badge: "Speed",
      badgeBg: "#DBEAFE",
      badgeTx: "#0284C7",
      stripe: "#0284C7",
      bg: "#EFF6FF",
    },
    {
      ico: "🤝",
      title: "Real-Time Collaboration",
      desc: "Share folders, set permissions, and co-edit with your team without version conflicts.",
      badge: "Teamwork",
      badgeBg: "#F3E8FF",
      badgeTx: "#7C3AED",
      stripe: "#7C3AED",
      bg: "#FAF5FF",
    },
    {
      ico: "📦",
      title: "One-Click Import",
      desc: "Migrate from Google Drive, Dropbox or OneDrive in minutes — folder structure preserved.",
      badge: "Migration",
      badgeBg: "#FEF9C3",
      badgeTx: "#D97706",
      stripe: "#D97706",
      bg: "#FEFCE8",
    },
    // {
    //   ico: "📱",
    //   title: "Every Device",
    //   desc: "Native iOS, Android, macOS and Windows apps. Offline-capable and always in sync.",
    //   badge: "Cross-Platform",
    //   badgeBg: "#FCE7F3",
    //   badgeTx: "#DB2777",
    //   stripe: "#DB2777",
    //   bg: "#FDF2F8",
    // },
    // {
    //   ico: "♻️",
    //   title: "Full Version History",
    //   desc: "Roll back any file to any point in time. Every change is saved — nothing ever lost.",
    //   badge: "Recovery",
    //   badgeBg: "#FEE2E2",
    //   badgeTx: "#DC2626",
    //   stripe: "#DC2626",
    //   bg: "#FFF5F5",
    // },
  ];

  const plans = [
    {
      name: "Free",
      desc: "For personal use",
      price: "0",
      period: "/mo",
      perks: [
        "10 GB storage",
        "Up to 2 GB per file",
        "Share with 5 people",
        "Google Drive import",
      ],
      btn: "Get Started Free",
      btnCls: "plan-btn-light",
      featured: false,
    },
    {
      name: "Pro",
      desc: "For power users",
      price: "9",
      period: "/mo",
      perks: [
        "1 TB storage",
        "Up to 50 GB per file",
        "Unlimited sharing",
        "Priority support",
        "Advanced analytics",
        "Password links",
      ],
      btn: "Start 14-Day Trial",
      btnCls: "plan-btn-dark",
      featured: true,
    },
    {
      name: "Team",
      desc: "For growing teams",
      price: "24",
      period: "/mo per user",
      perks: [
        "5 TB shared storage",
        "Up to 500 GB per file",
        "Admin & audit logs",

        "SSO & 2FA",
        "Account manager",
        "Custom branding",
      ],
      btn: "Contact Sales",
      btnCls: "plan-btn-light",
      featured: false,
    },
  ];

  const testimonials = [
    {
      stars: 5,
      text: "CloudVault completely replaced Dropbox for our 40-person studio. Upload speeds are night and day — and the UI is beautiful.",
      name: "Marcus R.",
      role: "Creative Director, Studio8",
      color: "#7C3AED",
    },
    {
      stars: 5,
      text: "The folder-level permissions and real-time collaboration are exactly what we needed. Setting up took minutes.",
      name: "Sarah K.",
      role: "Product Manager, TechFlow",
      color: "#0284C7",
    },
    {
      stars: 5,
      text: "Moved 800 GB from Google Drive in under two hours. Zero data loss. The encryption gives me total peace of mind.",
      name: "Dev P.",
      role: "Independent Consultant",
      color: "#16A34A",
    },
  ];

  const faqs = [
    {
      q: "Is my data actually private?",
      a: "Yes. All files are encrypted with AES-256 before leaving your device. We use zero-knowledge encryption — our engineers cannot access your data or keys.",
    },
    {
      q: "Can I import from Google Drive?",
      a: "Absolutely. Our one-click importer moves all files, folders, and shared items from Google Drive, Dropbox, OneDrive and Box, preserving folder structure exactly.",
    },
    {
      q: "What happens if I hit my storage limit?",
      a: "Uploads pause at 100% — no data is deleted. You'll receive email notifications as you approach the limit so you can upgrade in time.",
    },
    {
      q: "Is there a free trial for Pro?",
      a: "Yes — every new account gets a 14-day Pro trial with no credit card required. Downgrade to Free at any time.",
    },
    {
      q: "Does CloudVault work offline?",
      a: "Our desktop and mobile apps support offline mode. Files you've marked for offline use are cached locally and sync when you reconnect.",
    },
  ];

  const mockFiles = [
    {
      ico: "🎨",
      name: "Design System v2.fig",
      pct: 85,
      size: "24.3 MB",
      color: "#7C3AED",
    },
    {
      ico: "📊",
      name: "Q4 Financial Report.xlsx",
      pct: 45,
      size: "8.7 MB",
      color: "#16A34A",
    },
    {
      ico: "🎬",
      name: "Campaign Video.mp4",
      pct: 95,
      size: "428 MB",
      color: "#DB2777",
    },
    {
      ico: "📄",
      name: "Product Roadmap.pdf",
      pct: 30,
      size: "3.2 MB",
      color: "#DC2626",
    },
    {
      ico: "📁",
      name: "Brand Assets /",
      pct: 70,
      size: "1.2 GB",
      color: "#0284C7",
    },
  ];

  return (
    <>
      <style>{LAND_CSS}</style>

      {/* ── NAV ── */}
      <nav className={`lnav ${scrolled ? "scrolled" : ""}`}>
        <a className="lnav-logo" href="#">
          <span className="lnav-logo-ico">☁️</span> CloudVault
        </a>
        <div className="lnav-links">
          {[
            ["Features", "#features"],
            ["Pricing", "#pricing"],
            ["How It Works", "#how"],
            ["FAQ", "#faq"],
          ].map(([l, h]) => (
            <a key={l} className="lnav-link" href={h}>
              {l}
            </a>
          ))}
        </div>
        <div className="lnav-acts">
          <button className="ln-btn ln-ghost">
            <Link to={"/login"} className="">
              Sign In
            </Link>
          </button>
          <button className="ln-btn ln-solid">
            <Link to={"/Register"}>Get Started Free</Link>
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        {/* CSS gradient orbs — behind everything */}
        <div className="hero-orbs">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
          <div className="hero-orb hero-orb-4" />
          <div className="hero-orb hero-orb-5" />
        </div>
        {/* 2D canvas for animated gradient circles */}
        <canvas ref={canvasRef} id="cv-canvas" />

        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            New — Google Drive import now live
          </div>
          <h1 className="hero-h1">
            Cloud storage
            <br />
            built for <em>speed</em>
            <br />
            and privacy.
          </h1>
          <p className="hero-sub ">
            CloudVault is the modern cloud storage platform that's fast,
            beautiful, and end-to-end encrypted. Store, share, and collaborate
            on anything — from anywhere.
          </p>
          <div className="hero-ctas">
            <button className="ln-btn ln-solid ln-hero" onClick={onSignup}>
              Start Free — No Credit Card
            </button>
            <button className="ln-btn ln-ghost ln-hero" onClick={onLogin}>
              Sign In to Dashboard →
            </button>
          </div>
          <div className="hero-proof">
            {[
              "No credit card required",
              "14-day Pro trial",
              "Cancel anytime",
            ].map((t, i) => (
              <span key={t} className="hero-proof-item">
                {i > 0 && <span className="hero-proof-dot" />}
                <span>✓</span> {t}
              </span>
            ))}
          </div>
        </div>

        {/* <div className="hero-stats">
          {[
            ["2.4M+", "Files stored daily"],
            ["99.99%", "Uptime SLA"],
            ["300+", "Edge locations"],
            ["AES-256", "Encryption"],
          ].map(([v, l]) => (
            <div key={l} className="hero-stat">
              <div className="hero-stat-val">{v}</div>
              <div className="hero-stat-lbl">{l}</div>
            </div>
          ))}
        </div> */}
      </section>

      {/* ── LOGO BAR ──
      <div className="logo-bar">
        <div className="logo-track">
          {[
            "Trusted by teams at",
            "Stripe",
            "Shopify",
            "Figma",
            "Notion",
            "Vercel",
            "Linear",
            "Loom",
            "Zapier",
            "Framer",
            "Raycast",
            "Trusted by teams at",
            "Stripe",
            "Shopify",
            "Figma",
            "Notion",
            "Vercel",
            "Linear",
            "Loom",
            "Zapier",
            "Framer",
            "Raycast",
          ].map((n, i) => (
            <span key={i} className="logo-item">
              {n}
            </span>
          ))}
        </div>
      </div> */}

      <div className="screenshot w-screen h-[110vh]  flex items-center justify-center">
        <div className="main w-[75%] h-[75%] bg-white rounded-xl overflow-hidden shadow-2xl">
          
          <div className="flex items-center justify-start gap-[33vw]  w-full h-12 bg-gray-200 ">
            <div className="flex items-center justify-center gap-2 w-16 h-3 ">
              <div className="w-3 h-3 bg-red-400 rounded-full "></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>

            <div className=" text-[12px] text-gray-500 bg-gray-300 rounded-xl shadow-2xl w-40 h-6 flex items-center justify-center">
              app.CloudVault.cloud
            </div>
          </div>
          <div className="img w-full h-[76vh] bg-blue-700">
            <img src="/landing-ui.png" className="w-full h-full"></img>
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="lsec" id="features">
        <div className="lsec-inner">
          <div style={{ textAlign: "center" }}>
            <div className="lsec-label" style={{ justifyContent: "center" }}>
              Features
            </div>
            <h2 className="lsec-h" style={{ textAlign: "center" }}>
              Everything you need.
              <br />
              Nothing you don't.
            </h2>
            <p className="lsec-sub" style={{ margin: "0 auto" }}>
              Built for people and teams who demand the best from their cloud
              storage.
            </p>
          </div>
          <div className="feat-grid">
            {features.map((f, i) => (
              <div key={i} className="feat-card">
                <div
                  className="feat-card-stripe"
                  style={{ background: f.stripe }}
                />
                <div
                  className="feat-ico"
                  style={{ background: f.bg, borderColor: f.stripe + "30" }}
                >
                  {f.ico}
                </div>
                <div className="feat-title">{f.title}</div>
                <div className="feat-desc">{f.desc}</div>
                <div
                  className="feat-badge"
                  style={{ background: f.badgeBg, color: f.badgeTx }}
                >
                  {f.badge}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="lsec" id="how">
        <div className="lsec-inner">
          <div style={{ textAlign: "center" }}>
            <div className="lsec-label" style={{ justifyContent: "center" }}>
              How It Works
            </div>
            <h2 className="lsec-h" style={{ textAlign: "center" }}>
              Up and running in 60 seconds
            </h2>
          </div>
          <div className="steps">
            {[
              {
                n: "01",
                title: "Create account",
                desc: "Sign up free with email or Google. No credit card needed ever.",
              },
              {
                n: "02",
                title: "Upload or import",
                desc: "Drag & drop files or import everything from Google Drive in one click.",
              },
              {
                n: "03",
                title: "Organize & share",
                desc: "Create folders, star favorites, share with custom permissions.",
              },
              // {
              //   n: "04",
              //   title: "Access anywhere",
              //   desc: "Synced across all devices, available offline too.",
              // },
            ].map((s, i) => (
              <div key={i} className="step">
                <div className="step-num">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOWCASE ── */}
      <section
        className="lsec"
        style={{
          background:
            "linear-gradient(180deg,var(--bg) 0%,var(--surf) 50%,var(--bg) 100%)",
          padding: "80px 6%",
        }}
      >
        <div className="lsec-inner">
          <div className="showcase">
            <div>
              <div className="lsec-label">Smart Storage</div>
              <h2 className="lsec-h">
                Your files, organized the way you think
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--tx2)",
                  lineHeight: 1.75,
                  marginBottom: 26,
                }}
              >
                CloudVault learns from how you work. Instant search,
                auto-tagging, and smart folders mean you spend less time hunting
                and more time doing.
              </p>
              {[
                ["⚡", "Instant full-text search across all files"],
                ["🏷️", "Auto-tag and categorize uploads automatically"],
                ["🔗", "Shareable links with custom expiry dates"],
                ["📊", "Usage analytics and storage breakdowns"],
              ].map(([ico, txt]) => (
                <div
                  key={txt}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 11,
                    marginBottom: 13,
                    fontSize: 13.5,
                    color: "var(--tx2)",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "var(--surf2)",
                      border: "1.5px solid var(--bdr)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      flexShrink: 0,
                    }}
                  >
                    {ico}
                  </div>
                  {txt}
                </div>
              ))}
              <button
                className="ln-btn ln-solid"
                style={{ marginTop: 10 }}
                onClick={onSignup}
              >
                Try it free →
              </button>
            </div>

            <div className="showcase-visual">
              <div className="mock-topbar">
                <span className="mock-dot-r" />
                <span className="mock-dot-y" />
                <span className="mock-dot-g" />
                <span className="mock-titlebar">CloudVault — My Files</span>
              </div>
              {mockFiles.map((f, i) => (
                <div key={i} className="mock-file">
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{f.ico}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="mock-fname">{f.name}</div>
                    <div className="mock-pbar">
                      <div
                        className="mock-pfill"
                        style={{ width: `${f.pct}%`, background: f.color }}
                      />
                    </div>
                  </div>
                  <span className="mock-fmeta">{f.size}</span>
                </div>
              ))}
              <div className="mock-footer">
                <span>5 items · 462 MB</span>
                <span style={{ color: "var(--green)", fontWeight: 700 }}>
                  ↑ Synced
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section
        className="lsec"
        id="pricing"
        style={{ background: "var(--surf)" }}
      >
        <div className="lsec-inner">
          <div style={{ textAlign: "center" }}>
            <div className="lsec-label" style={{ justifyContent: "center" }}>
              Pricing
            </div>
            <h2 className="lsec-h" style={{ textAlign: "center" }}>
              Simple, transparent pricing
            </h2>
            <p className="lsec-sub" style={{ margin: "0 auto" }}>
              Start free. Upgrade as you grow. No hidden fees.
            </p>
          </div>
          <div className="pricing-grid">
            {plans.map((p, i) => (
              <div
                key={i}
                className={`plan-card ${p.featured ? "featured" : ""}`}
              >
                {p.featured && (
                  <div className="plan-top-badge">✦ MOST POPULAR</div>
                )}
                <div className="plan-name">{p.name}</div>
                <div className="plan-desc">{p.desc}</div>
                <div className="plan-price">
                  {p.price}$<span>{p.period}</span>
                </div>
                <div className="plan-divider" />
                <div className="plan-perks">
                  {p.perks.map((pk, j) => (
                    <div key={j} className="plan-perk">
                      <span
                        className="plan-perk-check"
                        style={{ color: "var(--green)" }}
                      >
                        ✓
                      </span>
                      {pk}
                    </div>
                  ))}
                </div>
                <button
                  className={`plan-btn ${p.btnCls}`}
                  onClick={i === 2 ? () => {} : onSignup}
                >
                  {p.btn}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      {/* <section className="lsec">
        <div className="lsec-inner">
          <div style={{ textAlign: "center" }}>
            <div className="lsec-label" style={{ justifyContent: "center" }}>
              Testimonials
            </div>
            <h2 className="lsec-h" style={{ textAlign: "center" }}>
              Loved by teams worldwide
            </h2>
          </div>
          <div className="testi-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testi-card">
                <div className="testi-stars">{"★".repeat(t.stars)}</div>
                <div className="testi-text">"{t.text}"</div>
                <div className="testi-author">
                  <div className="testi-av" style={{ background: t.color }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── FAQ ── */}
      {/* <section className="lsec" id="faq" style={{ background: "var(--surf)" }}>
        <div className="lsec-inner">
          <div style={{ textAlign: "center" }}>
            <div className="lsec-label" style={{ justifyContent: "center" }}>
              FAQ
            </div>
            <h2 className="lsec-h" style={{ textAlign: "center" }}>
              Got questions?
            </h2>
          </div>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <div key={i} className="faq-item">
                <div
                  className="faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="faq-q-text">{f.q}</span>
                  <svg
                    className={`faq-chevron ${openFaq === i ? "open" : ""}`}
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
                <div className={`faq-a ${openFaq === i ? "open" : ""}`}>
                  {f.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── CTA ── */}
      {/* <div className="cta-banner">
        <h2 className="cta-banner-h">Start storing smarter today.</h2>
        <p className="cta-banner-sub">
          Join 2.4 million people who trust CloudVault with their most important
          files.
        </p>
        <div className="cta-banner-btns">
          <button
            className="ln-btn cta-light"
            style={{ borderRadius: 10 }}
            onClick={onSignup}
          >
            Create Free Account →
          </button>
          <button
            className="ln-btn cta-outline"
            style={{ borderRadius: 10 }}
            onClick={onLogin}
          >
            Sign In
          </button>
        </div>
      </div> */}

      {/* ── FOOTER ── */}
      <footer className="lfooter">
        <div className="lfooter-top">
          <div>
            <div className="lfooter-brand">
              <span>☁️</span> CloudVault
            </div>
            <div className="lfooter-sub">
              Modern cloud storage built for speed, privacy, and collaboration.
            </div>
            {/* <div style={{ marginTop: 16, fontSize: 12, color: "var(--tx3)" }}>
              © 2025 CloudVault Inc.
            </div> */}
          </div>
          {[
            {
              title: "Product",
              links: ["Features", "Pricing", "Changelog", "Roadmap", "Status"],
            },
            {
              title: "Company",
              links: ["About", "Blog", "Careers", "Press", "Contact"],
            },
            {
              title: "Legal",
              links: [
                "Privacy Policy",
                "Terms of Service",
                "Cookie Policy",
                "Security",
                "GDPR",
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <div className="lfooter-col-title">{col.title}</div>
              {col.links.map((l) => (
                <a key={l} className="lfooter-link" href="#">
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className="lfooter-bottom">
          <div className="lfooter-copy">
            Built with ♥ for teams who move fast
          </div>
          <div className="lfooter-socials">
            {["𝕏", "in", "gh", "▶"].map((s, i) => (
              <div key={i} className="lfooter-soc">
                {s}
              </div>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
