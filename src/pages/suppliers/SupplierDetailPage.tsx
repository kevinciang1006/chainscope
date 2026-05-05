import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/common/EmptyState';
import { useSupplier } from '@/hooks/useSupplier';

import { AuditTimeline } from './components/AuditTimeline';
import { CertificationsList } from './components/CertificationsList';
import { EsgBreakdown } from './components/EsgBreakdown';
import { KeyRisksList } from './components/KeyRisksList';
import { QuickStats } from './components/QuickStats';
import { ScoreHistory } from './components/ScoreHistory';
import { SupplierHeader } from './components/SupplierHeader';

export function SupplierDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: supplier, isLoading, isError } = useSupplier(id);

  return (
    <div className="animate-fade-in">
      {/* Back link */}
      <div className="px-6 pt-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/suppliers" className="gap-1.5">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Suppliers
          </Link>
        </Button>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="px-6 py-6 flex flex-col gap-6">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-[220px] w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      )}

      {/* Error state */}
      {isError && (
        <EmptyState
          title="Supplier not found"
          description="That supplier id doesn't exist or has been removed."
          action={
            <Button onClick={() => navigate('/suppliers')}>Back to suppliers</Button>
          }
        />
      )}

      {/* Main content */}
      {supplier && (
        <>
          <SupplierHeader supplier={supplier} />

          <Tabs defaultValue="overview" className="px-6 pt-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="audits">Audits</TabsTrigger>
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
            </TabsList>

            {/* Overview tab */}
            <TabsContent value="overview" className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* Main column */}
              <div className="flex flex-col gap-4 lg:col-span-2">
                <EsgBreakdown supplier={supplier} />
                <Card>
                  <CardHeader>
                    <CardTitle>Score History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScoreHistory history={supplier.scoreHistory} />
                  </CardContent>
                </Card>
                <KeyRisksList risks={supplier.keyRisks} />
              </div>

              {/* Sidebar column */}
              <div className="flex flex-col gap-4">
                <QuickStats meta={supplier.meta} />
                <Card>
                  <CardHeader>
                    <CardTitle>Certifications</CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <CertificationsList
                      certifications={supplier.certifications}
                      variant="compact"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Audits tab */}
            <TabsContent value="audits">
              <Card>
                <CardHeader>
                  <CardTitle>Audit History</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <AuditTimeline audits={supplier.auditHistory} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Certifications tab */}
            <TabsContent value="certifications">
              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <CertificationsList
                    certifications={supplier.certifications}
                    variant="full"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
