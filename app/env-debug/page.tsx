'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

interface EnvStatus {
  key: string;
  present: boolean;
  value?: string;
  isPublic: boolean;
}

export default function EnvDebugPage() {
  const [clientVars, setClientVars] = useState<EnvStatus[]>([]);
  const [serverVars, setServerVars] = useState<EnvStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Client-side variables
    const clientSideVars = [
      { key: 'NEXT_PUBLIC_SUPABASE_URL', isPublic: true },
      { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', isPublic: true },
      { key: 'UPSTASH_REDIS_REST_URL', isPublic: false },
      { key: 'UPSTASH_REDIS_REST_TOKEN', isPublic: false },
      { key: 'NEXT_PUBLIC_APP_URL', isPublic: true },
      { key: 'NEXT_PUBLIC_CALENDLY_ORGANIZATION', isPublic: true },
    ].map(({ key, isPublic }) => ({
      key,
      present: !!process.env[key],
      value: process.env[key],
      isPublic,
    }));

    setClientVars(clientSideVars);

    // Fetch server-side variables
    fetch('/api/debug')
      .then(res => res.json())
      .then(data => {
        const serverSideVars = Object.entries(data).map(([key, value]) => ({
          key,
          present: !!value,
          value: value as string,
          isPublic: key.startsWith('NEXT_PUBLIC_'),
        }));
        setServerVars(serverSideVars);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch server-side variables');
        setLoading(false);
      });
  }, []);

  const renderVarStatus = (vars: EnvStatus[]) => (
    <div className="space-y-2">
      {vars.map(({ key, present, value, isPublic }) => (
        <div key={key} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
          {present ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          <div className="flex-1">
            <div className="font-mono text-sm">
              {key}
              {isPublic && (
                <span className="ml-2 text-xs text-muted-foreground">(public)</span>
              )}
            </div>
            {present && (
              <div className="text-xs text-muted-foreground truncate">
                {value}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Environment Variables Debug</h1>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Client-Side Variables</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-muted-foreground">Loading...</div>
            ) : (
              renderVarStatus(clientVars)
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Server-Side Variables</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-muted-foreground">Loading...</div>
            ) : (
              renderVarStatus(serverVars)
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Debugging Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Important Notes:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Variables prefixed with <code className="bg-muted px-1 rounded">NEXT_PUBLIC_</code> are accessible on both client and server</li>
              <li>Non-public variables are only accessible on the server</li>
              <li>Environment variables are loaded from <code className="bg-muted px-1 rounded">.env.local</code> in development</li>
              <li>In production, variables should be set in your hosting platform (e.g., Vercel)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Troubleshooting:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Check the browser console for any errors</li>
              <li>Verify variables are properly set in your hosting platform</li>
              <li>Ensure <code className="bg-muted px-1 rounded">.env.local</code> is in the root directory</li>
              <li>Restart the development server after modifying environment variables</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
