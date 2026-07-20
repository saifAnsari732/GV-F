import fs from 'fs';
import path from 'path';

const ensureDir = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };

const pages = [
  {
    path: 'src/app/admin/certificates/create/page.jsx',
    content: `import { CreateCertificate } from '../../../../components/AdminCertificate';\nexport default function Page() { return <CreateCertificate />; }`
  },
  {
    path: 'src/app/admin/certificates/page.jsx',
    content: `import { CertificateList } from '../../../components/AdminCertificate';\nexport default function Page() { return <CertificateList />; }`
  },
  {
    path: 'src/app/verify-certificate/page.jsx',
    content: `import { VerifyCertificate } from '../../components/AdminCertificate';\nexport default function Page() { return <VerifyCertificate />; }`
  },
  {
    path: 'src/app/certificates/[id]/page.jsx',
    content: `import { CertificateDetail } from '../../../components/AdminCertificate';\nexport default function Page() { return <CertificateDetail />; }`
  }
];

pages.forEach(p => {
  ensureDir(path.dirname(p.path));
  fs.writeFileSync(p.path, p.content);
});

// Remove src/pages
fs.rmSync('src/pages', { recursive: true, force: true });
