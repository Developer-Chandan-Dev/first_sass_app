import { UserButton } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExampleForm } from '@/components/example-form';
import { StatsDisplay } from '@/components/stats-display';

export default function Dashboard() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <UserButton />
      </div>
      
      <StatsDisplay />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Setup Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="default">✅ Next.js</Badge>
              <Badge variant="default">✅ TypeScript</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default">✅ Tailwind CSS</Badge>
              <Badge variant="default">✅ Shadcn/UI</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default">✅ Clerk Auth</Badge>
              <Badge variant="default">✅ Mongoose</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default">✅ React Hook Form</Badge>
              <Badge variant="default">✅ Zod</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default">✅ Recharts</Badge>
              <Badge variant="default">✅ Cloudinary</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Development Tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">ESLint</Badge>
              <Badge variant="secondary">Prettier</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">GitHub Actions</Badge>
              <Badge variant="secondary">Vercel Ready</Badge>
            </div>
          </CardContent>
        </Card>
        
        <div className="md:col-span-2 lg:col-span-1">
          <ExampleForm />
        </div>
      </div>
    </div>
  );
}