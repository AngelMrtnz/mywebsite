import { Sidebar } from '@/components/Sidebar'
import { Navigation } from '@/components/Navigation'
import { Separator } from '@/components/ui/separator'

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 p-8 md:p-12 overflow-auto">
        <Navigation />
        
        <Separator className="my-8" />
        
        <article className="max-w-4xl">
          <h2 className="text-3xl font-bold mb-6 text-primary">About me</h2>
          
          <p className="text-lg leading-relaxed text-justify text-foreground">
            I am a PhD student in Mathematics at the{' '}
            <a 
              href="https://www.urv.cat/ca/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Universitat Rovira i Virgili
            </a>
            , Tarragona, Spain, supported by the Martí i Franqués grant (2025PMF-PIPF-14).
            My primary research interests lie in differential geometry, with a focus on its applications to mathematical physics. In particular, I study singular Lagrangian systems, and the different geometrical structures that arise in this context.
          </p>
        </article>
      </main>
    </div>
  )
}
