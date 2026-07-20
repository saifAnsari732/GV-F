import { VerifyCertificate } from '../../components/AdminCertificate';

export const metadata = {
  title: 'Verify Certificate | GV Computer Center',
  description: 'Verify the authenticity of your GV Computer Center certificate or marksheet by entering the certificate number.',
};

export default function Page() {
  return <VerifyCertificate />;
}