import fs from 'fs';

const filePath = 'src/app/page.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove heroSlides array
content = content.replace(/const heroSlides = \[[\s\S]*?\];/m, '');

// 2. Remove currentSlide state and interval
content = content.replace(/const \[currentSlide, setCurrentSlide\] = useState\(0\);/g, '');
content = content.replace(/const interval = setInterval\(\(\) => {[\s\S]*?return \(\) => clearInterval\(interval\);/m, '');

// 3. Remove nextSlide and prevSlide functions
content = content.replace(/const nextSlide = \(\) => [^\n]+;\n/g, '');
content = content.replace(/const prevSlide = \(\) => [^\n]+;\n/g, '');

// 4. Replace Desktop Carousel with Typography Hero
const desktopCarouselRegex = /\{\/\* ── Desktop Carousel ── \*\/\}[\s\S]*?\{\/\* ── Mobile Hero ── \*\/}/;

const newDesktopHero = `{/* ── Desktop Hero (Typography Focused) ── */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 h-[600px] py-3 px-4 text-center overflow-hidden relative">
          <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center z-10">
            <span className="inline-flex items-center gap-2 bg-white/10 text-cyan-300 text-sm font-bold px-5 py-2 rounded-full mb-8 border border-white/20 tracking-wider uppercase">
              🎓 GV Computer Center — Fazilnagar
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              Master Computer Skills & <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Transform Your Future
              </span>
            </h1>
            <p className="text-slate-300 text-lg lg:text-xl max-w-2xl leading-relaxed mb-10">
              From basics to advanced programming — join 10,000+ students with industry-recognized certifications and launch your tech career today.
            </p>
            <div className="flex gap-4">
              <Link href="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] text-lg"
              >
                <FaRocket /> Enroll Now
              </Link>
              <Link href="/courses"
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 text-lg"
              >
                <FaGraduationCap /> View Courses
              </Link>
            </div>
          </div>
          
          {/* Decorative background elements */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none"></div>
        </div>

        {/* ── Mobile Hero ── */}`;

content = content.replace(desktopCarouselRegex, newDesktopHero);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Hero section updated successfully');
