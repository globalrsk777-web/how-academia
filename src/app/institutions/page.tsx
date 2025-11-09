"use client";

import { useCollection } from "@/lib/firebase/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading";
import type { Institution } from "@/types";
import { GraduationCap, MapPin, Phone, Mail } from "lucide-react";

export default function InstitutionsPage() {
  const { data: institutions, loading } = useCollection<Institution>("institutions");

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-heading">Ugandan Institutions</h1>
        <p className="text-muted-foreground">
          Discover leading universities and educational institutions across Uganda
        </p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : institutions && institutions.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {institutions.map((institution, index) => (
            <Card 
              key={institution.id}
              className="hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 animate-fade-in group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 group-hover:scale-110 transition-transform duration-200">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{institution.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">
                      {institution.description || "No description"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {institution.address && (
                    <div className="flex items-start gap-2 p-2 bg-muted/50 rounded-md">
                      <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground flex-1">{institution.address}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    {institution.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={`tel:${institution.phone}`}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {institution.phone}
                        </a>
                      </div>
                    )}
                    {institution.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={`mailto:${institution.email}`}
                          className="text-muted-foreground hover:text-primary transition-colors truncate"
                        >
                          {institution.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">No institutions available at the moment</p>
            <p className="text-sm text-muted-foreground mt-2">Check back later for new institutions</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

