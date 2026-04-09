import React, { useState, useCallback } from 'react';

const GOOGLE_REVIEW_URL =
  'https://www.google.com/search?q=computer+institute+fazilnagar&rlz=1C1CHBF_enIN1181IN1181&sca_esv=d65858cf26cc40bb&sxsrf=ANbL-n7mBDbFo5XXENDdnXeou8Tu184z5A:1772625457951&udm=1&lsack=MR6oaaXgOYze4-EPspOByAc&sa=X&sqi=2&ved=2ahUKEwjlvPa1mIaTAxUM7zgGHbJJAHkQjGp6BAgkEAA&biw=1536&bih=695&dpr=1.25&lqi=Ch1jb21wdXRlciBpbnN0aXR1dGUgZmF6aWxuYWdhckjVi8PVzrKAgAhaKRAAEAEQAhgAGAIiHWNvbXB1dGVyIGluc3RpdHV0ZSBmYXppbG5hZ2FykgEDaXV0#lkt=LocalPoiReviews&rlimm=7834928093888213770&sv=CAESzQEKuQEStgEKd0FNbjMteVR1SFM0RjR6aFYyeWFqT2htM194SVd4dmdOck5zN2drdzh5bW1DZDlPQXRlektQUlI0NGRjWFZWdkFoY0VId1NVLTdOS2ljeTNkQnNWckNsQVVCVUpxd0RaYUZLY0N3UWszLUFnLWVXaWFzWW5JX1F3EhdsWVRYYWVqT0M3SFpzZU1QcDdEMHFBcxoiQUpLTEZtSWh5cG5wNVV4LUxFQk1fVDNvb2REWDk3TXdhURIEODA1MRoBMyoAMAA4AUAAGAAgoPbogwFKAhAC';
  // ☝️ Replace with your actual Google Place ID from your Google Business Profile

const REVIEWS = [
  // ── Hindi reviews ──
  "GV Computer Center se DCA course kiya — bilkul sahi jagah hai seekhne ke liye. Teachers bahut helpful hain aur practical knowledge pe focus hai. Highly recommended!",
  "Fazilnagar mein best computer institute hai GV Computer Center. Course material updated hai aur faculty experienced hai. Mera placement bhi isi ke baad hua. 5 star!",
  "Maine yahan se ADCA kiya. Classes regular hoti hain, notes diye jaate hain aur exams properly hote hain. Bahut achha experience raha. Zaroor join karo!",
  "GV Computer Center ka environment bahut friendly hai. Sir log personally dhyan dete hain har student pe. Maine yahan se typing aur Tally sikhi — ab job kar raha hoon. Thank you!",
  "Agar aap computer seekhna chahte hain Fazilnagar mein to GV Computer Center best option hai. Fees reasonable hai, staff supportive hai. Certificate bhi government recognized milta hai.",
  "Bahut hi achha institute hai. Mera beta yahan se DCA kiya aur usse immediately job mil gayi. Faculty bahut knowledgeable hai. 10 mein se 10 dunga!",
  "GV Computer Center ne meri zindagi badal di. Maine yahan se basic to advanced computer course kiya. Har topic clearly samjhaya jaata hai. Sabko join karna chahiye!",
  "Excellent teaching quality, clean classrooms, aur practical lab facilities. GV Computer Center Fazilnagar ka number 1 computer institute hai. Bohot satisfied hoon!",
  "Yahan ka mahaul bahut positive hai. Sir log students ko motivate karte hain. Maine MS Office, Internet aur Tally seekhi — sab kuch ek hi jagah. Great institute!",
  "Maine kai institutes compare kiye lekin GV Computer Center sabse best nikla — fees bhi kam, quality bhi zyada. Certificate bhi valid hai. 5 stars without any doubt!",
  "Genuine institute hai, koi timepass nahi. Regular classes, proper syllabus, aur caring teachers. Meri dost ne bhi yahan se course kiya aur wo bhi bahut khush hai!",
  "GV Computer Center mein admission lo — zaroor regret nahi hogi. Main khud wahan se ADCA kiya hoon. Placement mein bhi help karte hain. Superb experience!",
  "Computer skills seekhna ho toh GV Computer Center best choice hai Fazilnagar mein. Sirf theory nahi, practical bhi achhi tarah se sikhate hain. Recommended to all!",
  "Staff bahut cooperative hai. Doubt poochho, kabhi bura nahi lagate. Lab facilities achhi hain. Overall best computer institute of Fazilnagar. Keep it up GV team!",
  "Maine pehle socha nahi tha ki itni achhi learning milegi. GV Computer Center ne meri expectation se zyada diya. Certificate aur skills dono mile. Bohot shukriya!",

  // ── English reviews ──
  "GV Computer Center is the best computer training institute in Fazilnagar. I completed my DCA course here and got placed within 2 months. Highly recommended for anyone looking to build a career in IT!",
  "Excellent institute for computer education in Fazilnagar. The faculty is very experienced and the course content covers everything from MS Office to advanced programming. 5 stars!",
  "I enrolled in the ADCA course at GV Computer Center and it was a life-changing experience. The practical training is top-notch and the teachers are always ready to help. Best computer institute in the area!",
  "GV Computer Center offers quality computer education at very affordable fees. The Tally, MS Office, and typing courses are superb. The government-recognized certificate helped me land a great job!",
  "Best computer institute in Fazilnagar hands down. Clean classrooms, modern lab, experienced staff, and regular classes. My whole family has enrolled here. Strongly recommended!",
  "I was looking for a reliable computer course near Fazilnagar and GV Computer Center exceeded all my expectations. The DCA program is well-structured and job-oriented. Loved every class!",
  "GV Computer Center has transformed my career. I learned MS Excel, Tally ERP, and Internet skills here. The faculty gives personal attention to every student. 10/10 institute!",
  "Very professional and student-friendly environment at GV Computer Center. The ADCA course syllabus is comprehensive and up-to-date. Placement assistance is a huge bonus. Highly recommend!",
  "If you want to learn computer skills in Fazilnagar, GV Computer Center is the only name you need. Affordable fees, certified programs, and dedicated teachers. Best decision of my life!",
  "I completed my basic computer course at GV Computer Center and now I'm working confidently with computers every day. The teachers explain everything in a simple and practical way. Great place to learn!",
  "Outstanding computer training center in Fazilnagar. Covered MS Office, DTP, Internet, and Tally in a single course. The certificate is recognized and the staff is very supportive. 5 stars!",
  "GV Computer Center is a gem in Fazilnagar. My daughter completed her DCA course here and secured a government job. The faculty is knowledgeable, patient, and truly dedicated. Thank you GV team!",
  "The best institute for computer education near Kushinagar district. GV Computer Center provides world-class training at local prices. The practical labs are excellent. Strongly recommended to all students!",
  "Joined GV Computer Center for Tally and MS Office course — best investment I've ever made. The classes are regular, the notes are detailed, and the teachers are amazing. 5-star experience!",
  "GV Computer Center stands out as the top computer training institute in Fazilnagar. The course structure, faculty quality, and placement support are unmatched. Would recommend to everyone!",
  "Amazing learning experience at GV Computer Center! I learned programming, MS Office, and internet basics here. The faculty makes complex topics easy to understand. Truly the best in Fazilnagar!",
  "I searched for computer institutes near Fazilnagar and GV Computer Center came highly recommended — and it lived up to every expectation. Professional staff, modern curriculum, and great support!",
  "GV Computer Center is synonymous with quality computer education in Fazilnagar. The DCA and ADCA courses are excellent, well-paced, and career-focused. My career started here. Forever grateful!",
  "Brilliant institute! The teachers at GV Computer Center are patient, knowledgeable, and passionate about teaching. The practical sessions are very helpful. Best computer coaching in the region!",
  "GV Computer Center helped me build confidence in using computers for my business. Tally course was very practical and the instructors were always available to answer questions. Highly recommended!",
  "Top-rated computer institute in Fazilnagar. GV Computer Center provides excellent training in MS Office, DTP, Tally, and programming. Government-recognized certificate is a big plus. 5 stars!",
  "If you are in Fazilnagar or nearby areas and want quality computer education, GV Computer Center is the place to be. Affordable, professional, and results-oriented. Could not be happier!",
  "Great faculty, great facilities, great results — that's GV Computer Center in three words. I finished my ADCA course here and immediately got a job in data entry. Forever thankful!",
  "GV Computer Center is the most trusted computer training institute in Fazilnagar. The teaching methodology is practical, the fees are reasonable, and the staff truly cares about students. 5/5!",
  "Completed my computer diploma from GV Computer Center — best decision ever! The course covered everything I needed for my job. Teachers are friendly and very supportive. Highly recommend!",
];

export default function ReviewHelper() {
  const [state, setState] = useState('idle'); // idle | copied | opening

  const handleClick = useCallback(async () => {
    const review = REVIEWS[Math.floor(Math.random() * REVIEWS.length)];

    try {
      await navigator.clipboard.writeText(review);
    } catch {
      // fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = review;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }

    setState('copied');

    setTimeout(() => {
      setState('opening');
      window.open(GOOGLE_REVIEW_URL, '_blank', 'noopener,noreferrer');
      setTimeout(() => setState('idle'), 2500);
    }, 1200);
  }, []);

  /* ── Label text ── */
  const label =
    state === 'copied'  ? '✓ Copied!' :
    state === 'opening' ? 'Opening…'  :
    'Rate Us';

  const barColor =
    state === 'copied'  ? 'from-emerald-500 to-green-600' :
    state === 'opening' ? 'from-blue-500 to-indigo-600'   :
    'from-yellow-500 to-orange-600';

  return (
    <>
      {/* ── Floating Button ── */}
      <button
        onClick={handleClick}
        aria-label="Rate GV Computer Center on Google"
        className={`
          fixed right-0 top-1/2 -translate-y-1/2 z-50
          bg-gradient-to-b ${barColor}
          text-white rounded-l-2xl shadow-xl
          flex flex-col items-center gap-1.5
          px-4 py-2 lg:px-4 lg:py-3
          transition-all duration-300
         
          group cursor-pointer border-0 outline-none
        `}
        style={{ writingMode: 'vertical-rl' }}
      >
        <span
          className="text-sm lg:text-2xl font-bold tracking-widest select-none"
          style={{ transform: 'rotate(180deg)', writingMode: 'vertical-rl' }}
        >
          {label} ✳️
        </span>
        <span className="text-lg select-none" style={{ writingMode: 'horizontal-tb' }}>
          {state === 'copied' ? '✓' : state === 'opening' ? '↗' : ""}
        </span>
      </button>

      {/* ── Toast notification ── */}
      {state === 'copied' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] animate-bounce-in">
          <div className="bg-slate-900 border border-emerald-500/40 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-start gap-3 max-w-sm">
            <span className="text-emerald-400 text-xl shrink-0">📋</span>
            <div>
              <p className="font-bold text-sm text-emerald-400">Review copied!</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Google Review khulega — bas <strong className="text-white">Paste</strong> karo aur Submit!
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounceIn {
          0%   { opacity:0; transform: translateX(-50%) translateY(20px) scale(0.9); }
          60%  { transform: translateX(-50%) translateY(-4px) scale(1.02); }
          100% { opacity:1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        .animate-bounce-in { animation: bounceIn 0.4s ease-out forwards; }
      `}</style>
    </>
  );
}
