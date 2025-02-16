'use client'

import { Button } from "@/components/ui/button"
import { useState } from 'react'
import { ReloadIcon } from "@radix-ui/react-icons"
import React from 'react'
import { migrateAllergens } from "./actions"

interface Result {
  success: boolean
  message: string
  details?: string
}

export default function MigrationClient() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [isCheckingSlugs, setIsCheckingSlugs] = useState(false)

  async function onSubmit() {
    setIsLoading(true)
    try {
      const result = await migrateAllergens()
      setResult(result)
    } catch (error) {
      setResult({
        success: false,
        message: 'Migration failed',
        details: error instanceof Error ? error.message : 'An unknown error occurred'
      })
    } finally {
      setIsLoading(false)
    }
  }


  
  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Admin Tools</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-medium mb-2">Allergen Data Migration</h3>
            <p className="text-gray-600 mb-4">
              This will migrate allergen data from the old array format to the new boolean fields.
            </p>
            <Button 
              onClick={onSubmit}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Migrating Allergen Data...
                </>
              ) : (
                'Start Migration'
              )}
            </Button>
          </div>

         
        </div>
      </div>

      {result && (
        <div className={`p-4 rounded-md ${
          result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          <h3 className="text-lg font-semibold">
            {result.success ? 'Success!' : 'Error'}
          </h3>
          <div className="mt-2">
            <p>{result.message}</p>
            {result.details && (
              <pre className="mt-2 w-full overflow-auto rounded-md bg-slate-950 p-4 text-white">
                {result.details}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 