"use client";

import { useCollection } from "@/lib/firebase/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import type { Institution } from "@/types";
import { GraduationCap, MapPin, Users, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { dataStore } from "@/lib/store/dataStore";
import { useToast } from "@/components/ui/use-toast";

export default function InstitutionsPage() {
  const { data: institutions, loading } = useCollection<Institution>("institutions");
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [staffCount, setStaffCount] = useState("");
  const [price, setPrice] = useState("");
  const [priceType, setPriceType] = useState<"monthly" | "yearly" | "free">("monthly");
  const [loadingCreate, setLoadingCreate] = useState(false);

  // Mock institutions with enhanced data
  const mockInstitutions: Array<Institution & { staffCount?: number; price?: number; priceType?: "monthly" | "yearly" | "free" }> = [
    {
      id: "inst1",
      name: "Makerere University",
      description: "A premier institution of higher learning, offering a wide range of undergraduate and postgraduate courses.",
      address: "Kampala, Uganda",
      phone: "+256-414-532-752",
      email: "info@mak.ac.ug",
      staffCount: 85,
      price: 1200,
      priceType: "yearly",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "inst2",
      name: "St. Mary's College Kisubi",
      description: "A leading secondary school known for excellence in sciences and holistic education for boys.",
      address: "Wakiso, Uganda",
      phone: "+256-312-350-880",
      email: "info@smack.ac.ug",
      staffCount: 60,
      price: 150,
      priceType: "monthly",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "inst3",
      name: "King's College Budo",
      description: "One of the oldest and most prestigious mixed secondary schools in Uganda, with a strong tradition in leadership.",
      address: "Wakiso, Uganda",
      phone: "+256-414-286-161",
      email: "info@kcb.ac.ug",
      staffCount: 65,
      price: 165,
      priceType: "monthly",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "inst4",
      name: "Gayaza High School",
      description: "The oldest all-girls school in Uganda, championing female education and empowerment.",
      address: "Wakiso, Uganda",
      phone: "+256-772-420-330",
      email: "info@gayaza.ac.ug",
      staffCount: 55,
      price: 145,
      priceType: "monthly",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "inst5",
      name: "Kyambogo University",
      description: "A public university known for teacher education, vocational studies, and special needs education.",
      address: "Kampala, Uganda",
      phone: "+256-414-286-161",
      email: "info@kyu.ac.ug",
      staffCount: 70,
      price: 1100,
      priceType: "yearly",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "inst6",
      name: "Mbarara University",
      description: "A leading science and technology university with a strong focus on health sciences and research.",
      address: "Mbarara, Uganda",
      phone: "+256-485-420-330",
      email: "info@must.ac.ug",
      staffCount: 50,
      price: 1300,
      priceType: "yearly",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "inst7",
      name: "OIT",
      description: "A hub for innovation and technology, offering practical skills in IT, business, and public health in Northern Uganda.",
      address: "Gulu, Uganda",
      phone: "+256-471-420-330",
      email: "info@oit.ac.ug",
      staffCount: 60,
      price: 0,
      priceType: "free",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const displayInstitutions = institutions && institutions.length > 0 
    ? institutions.map(inst => ({
        ...inst,
        staffCount: (inst as any).staffCount || Math.floor(Math.random() * 100) + 20,
        price: (inst as any).price || 0,
        priceType: (inst as any).priceType || "free",
      }))
    : mockInstitutions;

  const handleCreateInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !address) return;

    setLoadingCreate(true);
    try {
      await dataStore.addDocument("institutions", {
        name,
        description,
        address,
        phone: phone || undefined,
        email: email || undefined,
        staffCount: staffCount ? parseInt(staffCount) : undefined,
        price: price && priceType !== "free" ? parseFloat(price) : 0,
        priceType,
      });

      toast({
        title: "Institution Added! 🎓",
        description: `${name} has been successfully added.`,
        variant: "success",
      });

      setName("");
      setDescription("");
      setAddress("");
      setPhone("");
      setEmail("");
      setStaffCount("");
      setPrice("");
      setPriceType("monthly");
      setOpen(false);
    } catch (error) {
      console.error("Error creating institution:", error);
      toast({
        title: "Error",
        description: "Failed to create institution. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingCreate(false);
    }
  };

  const formatPrice = (price: number, priceType: string) => {
    if (priceType === "free" || price === 0) return "Free";
    return `$${price.toLocaleString()}${priceType === "yearly" ? " / year" : " / month"}`;
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-heading">Institutions</h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Institution
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Institution</DialogTitle>
              <DialogDescription>
                Add a new educational institution to the platform.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateInstitution}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Institution Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Makerere University"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the institution..."
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g., Kampala, Uganda"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+256-XXX-XXX-XXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="info@institution.ac.ug"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="staffCount">Staff Count (Optional)</Label>
                    <Input
                      id="staffCount"
                      type="number"
                      value={staffCount}
                      onChange={(e) => setStaffCount(e.target.value)}
                      placeholder="e.g., 85"
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priceType">Price Type</Label>
                    <select
                      id="priceType"
                      value={priceType}
                      onChange={(e) => setPriceType(e.target.value as "monthly" | "yearly" | "free")}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      <option value="free">Free</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>
                {priceType !== "free" && (
                  <div className="space-y-2">
                    <Label htmlFor="price">Price in USD (Optional)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g., 150"
                      min="0"
                      step="0.01"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loadingCreate}>
                  {loadingCreate ? "Adding..." : "Add Institution"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading && institutions ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayInstitutions.map((institution, index) => (
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
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {institution.address || "Location not specified"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {institution.description || "No description"}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{institution.staffCount || 0} Staff</span>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      {formatPrice(institution.price || 0, institution.priceType || "free")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
