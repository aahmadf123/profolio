'use client'

import type React from 'react'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, Search, User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthContext } from '@/components/auth-provider'

export function AdminHeader() {
  const { userEmail, logout } = useAuthContext()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
    console.log('Searching for:', searchQuery)
  }

  return (
    <header className='h-16 border-b bg-background flex items-center px-6'>
      <div className='flex-1 flex items-center'>
        {/* Search */}
        <form onSubmit={handleSearch} className='relative w-full max-w-md'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
          <Input
            type='search'
            placeholder='Search...'
            className='pl-10 w-full'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <div className='flex items-center space-x-4'>
        {/* Notifications */}
        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='h-5 w-5' />
          <span className='absolute top-0 right-0 h-2 w-2 rounded-full bg-primary'></span>
        </Button>

        {/* View site */}
        <Link href='/'>
          <Button variant='outline' size='sm'>
            View Site
          </Button>
        </Link>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='flex items-center space-x-2'>
              <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
                <User className='h-4 w-4 text-primary' />
              </div>
              <div className='hidden md:block text-sm font-medium text-left'>
                <div className='truncate max-w-[150px]'>{userEmail}</div>
                <div className='text-xs text-muted-foreground'>Administrator</div>
              </div>
              <ChevronDown className='h-4 w-4 text-muted-foreground' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-56'>
            <DropdownMenuItem asChild>
              <Link href='/admin/settings/profile' className='cursor-pointer'>
                <User className='mr-2 h-4 w-4' />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/admin/settings' className='cursor-pointer'>
                <Settings className='mr-2 h-4 w-4' />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className='cursor-pointer text-destructive focus:text-destructive'>
              <LogOut className='mr-2 h-4 w-4' />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
