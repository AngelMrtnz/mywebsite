import { Sidebar } from '@/components/Sidebar'
import { Navigation } from '@/components/Navigation'
import { Separator } from '@/components/ui/separator'

export default function Conferences() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 p-8 md:p-12 overflow-auto">
        <Navigation />
        
        <Separator className="my-8" />
        
        <article className="max-w-4xl">
          <h2 className="text-3xl font-bold mb-6 text-primary">Conferences</h2>
          
          <p className="text-lg leading-relaxed text-foreground mb-6">
            Information about conferences and presentations will be displayed here.
          </p>
          
          <div className="space-y-4">
            <div className="p-4 border border-primary border-opacity-30 rounded-lg">
              <h3 className="font-semibold text-primary mb-2">Conference Presentations</h3>
              <p className="text-foreground text-sm">
                Your conference presentations and talks will be listed here.
              </p>
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}
