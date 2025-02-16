import { Metadata } from 'next'
import MigrationClient from './migration-client'

export const metadata: Metadata = {
  title: 'Admin - HealthyFastFood',
  description: 'Admin tools for HealthyFastFood',
}

export default function AdminPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-8">Admin Tools</h1>
      <MigrationClient />
    </main>
  )
} 