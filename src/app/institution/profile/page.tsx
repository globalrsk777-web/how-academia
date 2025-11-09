"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDb, type User, type Institution } from "@/lib/mock-data";

export default function InstitutionProfilePage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [institution, setInstitution] = useState<Institution | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const currentUser = mockDb.getCurrentUser();
    if (!currentUser) return;
    
    const userProfile = await mockDb.getUserById(currentUser.id);
    if (userProfile?.institutionId) {
      const inst = await mockDb.getInstitutionById(userProfile.institutionId);
      setInstitution(inst);
    }
    
    setProfile(userProfile);
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">Your institution profile information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Institution Information</CardTitle>
          <CardDescription>Your institution details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Name</p>
            <p className="text-lg">{profile.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="text-lg">{profile.email}</p>
          </div>
          {institution && (
            <>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Institution Name</p>
                <p className="text-lg">{institution.name}</p>
              </div>
              {institution.description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="text-lg">{institution.description}</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

