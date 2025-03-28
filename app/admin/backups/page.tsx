'use client'

import { Suspense, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { ErrorBoundary } from '@/components/error-boundary'
import { useBackups, type Backup } from '@/hooks/useBackups'
import { Download, Upload, Trash2, RotateCcw } from 'lucide-react'

function BackupsContent() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { 
    backups,
    isExporting,
    isRestoring,
    createBackup,
    restoreBackup,
    deleteBackup,
    downloadBackup
  } = useBackups()

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      await restoreBackup(file)
      toast({
        title: 'Backup restored',
        description: 'Your backup has been successfully restored.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to restore backup. Please try again.',
        variant: 'destructive',
      })
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleCreateBackup = async () => {
    try {
      await createBackup()
      toast({
        title: 'Backup created',
        description: 'Your backup has been successfully created.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create backup. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleRestoreBackup = async (backup: Backup | File) => {
    try {
      await restoreBackup(backup)
      toast({
        title: 'Backup restored',
        description: 'Your backup has been successfully restored.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to restore backup. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteBackup = async (backupId: string) => {
    try {
      await deleteBackup(backupId)
      toast({
        title: 'Backup deleted',
        description: 'Your backup has been successfully deleted.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete backup. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleDownloadBackup = async (backup: Backup) => {
    try {
      await downloadBackup(backup)
      toast({
        title: 'Backup downloaded',
        description: 'Your backup has been successfully downloaded.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download backup. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className='container mx-auto py-8'>
      <Card>
        <CardHeader>
          <CardTitle>Backup Management</CardTitle>
          <CardDescription>
            Create, restore, and manage your website backups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            <div className='flex gap-4'>
              <Button
                onClick={handleCreateBackup}
                disabled={isExporting}
              >
                <Download className='mr-2 h-4 w-4' />
                Create Backup
              </Button>
              <Button
                variant='outline'
                onClick={() => fileInputRef.current?.click()}
                disabled={isRestoring}
              >
                <Upload className='mr-2 h-4 w-4' />
                Restore Backup
              </Button>
              <input
                ref={fileInputRef}
                type='file'
                accept='.json'
                className='hidden'
                onChange={handleFileSelect}
              />
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Backup History</h3>
              {backups.length === 0 ? (
                <p className='text-muted-foreground'>No backups found</p>
              ) : (
                <div className='space-y-4'>
                  {backups.map((backup: Backup) => (
                    <Card key={backup.id}>
                      <CardContent className='flex items-center justify-between p-4'>
                        <div>
                          <p className='font-medium'>{backup.name}</p>
                          <p className='text-sm text-muted-foreground'>
                            Created on {new Date(backup.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className='flex gap-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleDownloadBackup(backup)}
                          >
                            <Download className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleRestoreBackup(backup)}
                          >
                            <RotateCcw className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='destructive'
                            size='sm'
                            onClick={() => handleDeleteBackup(backup.id)}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function BackupsPageContent() {
  const searchParams = useSearchParams()
  return <BackupsContent />
}

export default function BackupsPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <BackupsPageContent />
      </Suspense>
    </ErrorBoundary>
  )
}
