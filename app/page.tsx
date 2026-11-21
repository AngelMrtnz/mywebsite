import { MdEmail } from 'react-icons/md';
import { SiArxiv, SiGooglescholar, SiInstagram, SiOrcid, SiResearchgate } from 'react-icons/si';
import { PageTitle, SectionTitle } from '@/components/Headings';
import { asset } from '@/lib/paths';

const EMAIL = 'angel.martinezm@urv.cat';

const links = [
  { name: 'ORCID', href: 'https://orcid.org/0009-0002-8944-5403', icon: SiOrcid },
  { name: 'Google Scholar', href: 'https://scholar.google.com/citations?user=rC-onNMAAAAJ', icon: SiGooglescholar },
  { name: 'arXiv', href: 'https://arxiv.org/a/martinezmunoz_a_1.html', icon: SiArxiv },
  { name: 'ResearchGate', href: 'https://www.researchgate.net/profile/Angel-Martinez-Munoz', icon: SiResearchgate },
  { name: 'Instagram', href: 'https://www.instagram.com/angelmm__/', icon: SiInstagram },
];

function External({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function Home() {
  return (
    <section className="mb-12">
      <PageTitle>About me</PageTitle>

      {/* Round photo; from tablet width up the text flows around the circle */}
      <div className="flow-root text-lg leading-relaxed">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, no image optimizer */}
        <img
          src={asset('/images/yo.webp')}
          alt="Ángel Martínez Muñoz"
          width={256}
          height={256}
          fetchPriority="high"
          className="block mx-auto mb-6 w-56 lg:w-64 aspect-square object-cover object-[50%_30%] rounded-full shadow-lg ring-1 ring-black/5
            md:float-left md:mb-0 md:mr-0 md:[shape-outside:circle(50%)] md:[shape-margin:2.5rem]"
        />
        <div className="space-y-5">
          <p>
            I am a PhD student in Mathematics at the{' '}
            <External href="https://www.urv.cat/ca/">Universitat Rovira i Virgili</External>, Tarragona, Spain,
            supported by the Martí i Franqués grant (2025PMF-PIPF-14). My primary research interests lie in
            differential geometry, with a focus on its applications to mathematical physics.
          </p>
          <p>
            Currently, I am working on my PhD thesis on singular Lagrangian systems and the different geometrical
            structures that arise in this context, under the supervision of Professors{' '}
            <External href="https://web.mat.upc.edu/xavier.gracia/">Xavier Gràcia Sabaté</External> and{' '}
            <External href="https://xrivas.com/">Xavier Rivas Guijarro</External>.
          </p>
          <p>
            I completed my Degree in Mathematics (2020–2024) at the Universitat Politècnica de Catalunya (UPC). I
            wrote my bachelor&apos;s thesis on geometric integrators (see{' '}
            <External href={asset('/theses/bachelor-thesis.pdf')}>here</External>). I then obtained a master&apos;s
            degree in Advanced Mathematics and Mathematical Engineering (2025) from the same institution. I wrote my
            master&apos;s thesis on contact geometry and singular Lagrangian systems (see{' '}
            <External href={asset('/theses/master-thesis.pdf')}>here</External>).
          </p>
        </div>
      </div>

      <div className="pt-10">
        <SectionTitle>Some useful links</SectionTitle>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full text-urv-red shadow-sm">
              <MdEmail size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Email</p>
              <a
                href={`mailto:${EMAIL}`}
                className="text-lg font-bold text-urv-black hover:text-urv-red hover:no-underline transition-colors"
              >
                {EMAIL}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {links.map(({ name, href, icon: Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 hover:no-underline transition-colors group border border-gray-100"
              >
                <span className="text-urv-red group-hover:scale-110 transition-transform">
                  <Icon size={20} />
                </span>
                <span className="text-sm font-medium text-urv-black group-hover:text-urv-red">{name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
