import { Sidebar } from '@/components/Sidebar'
import { Navigation } from '@/components/Navigation'
import { Separator } from '@/components/ui/separator'

export default function Research() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 p-8 md:p-12 overflow-auto">
        <Navigation />
        
        <Separator className="my-8" />
        
        <article className="max-w-4xl">
          <h2 className="text-3xl font-bold mb-6 text-primary">Research</h2>
          
          <p className="text-lg leading-relaxed text-foreground mb-4">
            My research interests focus on differential geometry and its applications to mathematical physics, particularly in the study of singular Lagrangian systems.
          </p>
          
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-primary mb-3">Research Areas</h3>
            <ul className="list-disc list-inside space-y-2 text-foreground">
              <li>Differential Geometry</li>
              <li>Mathematical Physics</li>
              <li>Singular Lagrangian Systems</li>
              <li>Geometric Structures</li>
            </ul>
          </section>
        </article>
      </main>
    </div>
  )
}
