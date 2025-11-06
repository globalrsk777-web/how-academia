"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDb, type Institution } from "@/lib/mock-data";
import { Building2 } from "lucide-react";

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);

  useEffect(() => {
    loadInstitutions();
  }, []);

  const loadInstitutions = async () => {
    const allInstitutions = await mockDb.getInstitutions();
    setInstitutions(allInstitutions);
  };

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">Institutions</h1>
        <p className="text-muted-foreground">Browse all institutions on the platform</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {institutions.map((institution) => (
          <Card key={institution.id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {institution.logo ? (
                    <img
                      src={institution.logo}
                      alt={institution.name}
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    <Building2 className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div>
                  <CardTitle>{institution.name}</CardTitle>
                  <CardDescription>{institution.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Founded: {new Date(institution.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
        {institutions.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No institutions available</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

