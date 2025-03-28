'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Check, Copy, ExternalLink } from 'lucide-react'

export function SetupGuide() {
  const [copied, setCopied] = useState(false)

  const copyEnvTemplate = () => {
    const template = `NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Redis - You need either Upstash OR Vercel KV, not both
UPSTASH_REDIS_REST_URL=your-upstash-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-token

# Optional - Vercel KV (alternative to Upstash)
# KV_REST_API_URL=your-kv-url
# KV_REST_API_TOKEN=your-kv-token`

    navigator.clipboard.writeText(template)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          Setup Guide
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>Environment Setup Guide</DialogTitle>
          <DialogDescription>Follow these steps to set up your environment variables</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue='local'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='local'>Local Development</TabsTrigger>
            <TabsTrigger value='vercel'>Vercel Deployment</TabsTrigger>
          </TabsList>

          <TabsContent value='local' className='space-y-4'>
            <div className='rounded-md bg-muted p-4'>
              <h3 className='font-medium mb-2'>1. Create a .env.local file</h3>
              <p className='text-sm mb-4'>
                Create a file named <code className='bg-background px-1 py-0.5 rounded'>.env.local</code> in the root of
                your project.
              </p>

              <h3 className='font-medium mb-2'>2. Add the following variables</h3>
              <div className='relative'>
                <pre className='bg-background p-4 rounded-md overflow-x-auto text-xs'>
                  <code>{`NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Redis - You need either Upstash OR Vercel KV, not both
UPSTASH_REDIS_REST_URL=your-upstash-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-token

# Optional - Vercel KV (alternative to Upstash)
# KV_REST_API_URL=your-kv-url
# KV_REST_API_TOKEN=your-kv-token`}</code>
                </pre>
                <Button variant='ghost' size='icon' className='absolute top-2 right-2' onClick={copyEnvTemplate}>
                  {copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
                </Button>
              </div>

              <h3 className='font-medium mt-4 mb-2'>3. Restart your development server</h3>
              <p className='text-sm'>After adding the variables, restart your Next.js development server.</p>
            </div>
          </TabsContent>

          <TabsContent value='vercel' className='space-y-4'>
            <div className='rounded-md bg-muted p-4'>
              <h3 className='font-medium mb-2'>1. Go to your Vercel project</h3>
              <p className='text-sm mb-4'>Navigate to your project on the Vercel dashboard.</p>

              <h3 className='font-medium mb-2'>2. Add environment variables</h3>
              <p className='text-sm mb-4'>Go to Settings → Environment Variables and add the following:</p>

              <ul className='space-y-2 text-sm mb-4'>
                <li>
                  <code className='bg-background px-1 py-0.5 rounded'>NEXT_PUBLIC_SUPABASE_URL</code> - Your Supabase
                  project URL
                </li>
                <li>
                  <code className='bg-background px-1 py-0.5 rounded'>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> - Your
                  Supabase anonymous key
                </li>
                <li>
                  <code className='bg-background px-1 py-0.5 rounded'>UPSTASH_REDIS_REST_URL</code> - Your Upstash Redis
                  URL
                </li>
                <li>
                  <code className='bg-background px-1 py-0.5 rounded'>UPSTASH_REDIS_REST_TOKEN</code> - Your Upstash
                  Redis token
                </li>
              </ul>

              <h3 className='font-medium mb-2'>3. Redeploy your application</h3>
              <p className='text-sm'>After adding the variables, trigger a new deployment.</p>

              <div className='mt-4'>
                <Button variant='outline' size='sm' asChild>
                  <a
                    href='https://vercel.com/dashboard'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-2'
                  >
                    Open Vercel Dashboard
                    <ExternalLink className='h-4 w-4' />
                  </a>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className='mt-4'>
          <h3 className='font-medium mb-2'>Where to get these values</h3>
          <ul className='space-y-3'>
            <li className='flex gap-2'>
              <div className='font-medium'>Supabase:</div>
              <a
                href='https://app.supabase.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary flex items-center gap-1 hover:underline'
              >
                Supabase Dashboard <ExternalLink className='h-3 w-3' />
              </a>
              <span className='text-muted-foreground'>(Project Settings → API)</span>
            </li>
            <li className='flex gap-2'>
              <div className='font-medium'>Upstash:</div>
              <a
                href='https://console.upstash.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary flex items-center gap-1 hover:underline'
              >
                Upstash Console <ExternalLink className='h-3 w-3' />
              </a>
              <span className='text-muted-foreground'>(Redis → Details)</span>
            </li>
            <li className='flex gap-2'>
              <div className='font-medium'>Vercel KV:</div>
              <a
                href='https://vercel.com/dashboard'
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary flex items-center gap-1 hover:underline'
              >
                Vercel Dashboard <ExternalLink className='h-3 w-3' />
              </a>
              <span className='text-muted-foreground'>(Storage → KV)</span>
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}
