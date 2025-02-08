import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserCog } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialFormState = {
  care_home_name: "",
  business_type: "",
  registration_number: "",
  vat_number: "",
  business_address: "",
  postcode: "",
  cqc_number: "",
  last_inspection_date: "",
  cqc_rating: "",
  insurance_expiry: "",
  key_policies: "",
  manager_name: "",
  manager_email: "",
  manager_phone: "",
  manager_nmc: "",
  terms_agreed: false,
  policies_agreed: false,
  updates_agreed: false,
};

export default function CareHomeRegistration() {
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialFormState);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const handleSubmit = async () => {
    try {
      // Generate a random 8-character password
      const password = Math.random().toString(36).substring(2, 10);

      // Generate a unique carehomeid using care home name and random string
      const carehomeid =
        `CH${Math.random().toString(36).substring(2, 8)}`.toUpperCase();

      const { data, error } = await supabase
        .from("carehomes")
        .insert([{ ...formData, carehomeid, password }])
        .select();

      if (error) throw error;

      toast({
        title: "Registration Successful",
      });

      resetForm();
    } catch (error) {
      console.error("Error during registration:", error);
      toast({
        title: "Registration Failed",
        description:
          "There was an error submitting your registration. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/50 to-slate-100/50 flex items-center justify-center p-6">
      <Card className="w-full max-w-4xl bg-white/95 p-8 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <UserCog className="h-6 w-6 text-blue-500" />
              </div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                Care Home Registration
              </h1>
            </div>
            <p className="text-muted-foreground">
              Register your care home to start posting shifts
            </p>
          </div>

          <Tabs defaultValue="business" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="business">Business Details</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="verification">Verification</TabsTrigger>
            </TabsList>

            <TabsContent value="business" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="careName">Care Home Name</Label>
                  <Input
                    id="careName"
                    placeholder="Enter care home name"
                    value={formData.care_home_name}
                    onChange={(e) =>
                      handleInputChange("care_home_name", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select
                    value={formData.business_type}
                    onValueChange={(value) =>
                      handleInputChange("business_type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">
                        Residential Care Home
                      </SelectItem>
                      <SelectItem value="nursing">Nursing Home</SelectItem>
                      <SelectItem value="specialist">
                        Specialist Care Facility
                      </SelectItem>
                      <SelectItem value="retirement">
                        Retirement Village
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="regNumber">Company Registration Number</Label>
                  <Input
                    id="regNumber"
                    placeholder="Enter registration number"
                    value={formData.registration_number}
                    onChange={(e) =>
                      handleInputChange("registration_number", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vatNumber">VAT Number (Optional)</Label>
                  <Input
                    id="vatNumber"
                    placeholder="Enter VAT number"
                    value={formData.vat_number}
                    onChange={(e) =>
                      handleInputChange("vat_number", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter full address"
                    className="min-h-[80px]"
                    value={formData.business_address}
                    onChange={(e) =>
                      handleInputChange("business_address", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input
                    id="postcode"
                    placeholder="Enter postcode"
                    value={formData.postcode}
                    onChange={(e) =>
                      handleInputChange("postcode", e.target.value)
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cqcNumber">CQC Registration Number</Label>
                  <Input
                    id="cqcNumber"
                    placeholder="Enter CQC number"
                    value={formData.cqc_number}
                    onChange={(e) =>
                      handleInputChange("cqc_number", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastInspection">
                    Last CQC Inspection Date
                  </Label>
                  <Input
                    id="lastInspection"
                    type="date"
                    value={formData.last_inspection_date}
                    onChange={(e) =>
                      handleInputChange("last_inspection_date", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">Current CQC Rating</Label>
                  <Select
                    value={formData.cqc_rating}
                    onValueChange={(value) =>
                      handleInputChange("cqc_rating", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="outstanding">Outstanding</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="requires-improvement">
                        Requires Improvement
                      </SelectItem>
                      <SelectItem value="inadequate">Inadequate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insurance">Insurance Expiry Date</Label>
                  <Input
                    id="insurance"
                    type="date"
                    value={formData.insurance_expiry}
                    onChange={(e) =>
                      handleInputChange("insurance_expiry", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="policies">Key Policies & Procedures</Label>
                  <Textarea
                    id="policies"
                    placeholder="List key policies and procedures in place"
                    className="min-h-[100px]"
                    value={formData.key_policies}
                    onChange={(e) =>
                      handleInputChange("key_policies", e.target.value)
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="verification" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="managerName">Registered Manager Name</Label>
                  <Input
                    id="managerName"
                    placeholder="Enter manager's name"
                    value={formData.manager_name}
                    onChange={(e) =>
                      handleInputChange("manager_name", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="managerEmail">Manager's Email</Label>
                  <Input
                    id="managerEmail"
                    type="email"
                    placeholder="Enter manager's email"
                    value={formData.manager_email}
                    onChange={(e) =>
                      handleInputChange("manager_email", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="managerPhone">Manager's Phone</Label>
                  <Input
                    id="managerPhone"
                    type="tel"
                    placeholder="Enter manager's phone"
                    value={formData.manager_phone}
                    onChange={(e) =>
                      handleInputChange("manager_phone", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="managerNMC">NMC Number (if applicable)</Label>
                  <Input
                    id="managerNMC"
                    placeholder="Enter NMC number"
                    value={formData.manager_nmc}
                    onChange={(e) =>
                      handleInputChange("manager_nmc", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.terms_agreed}
                    onCheckedChange={(checked) =>
                      handleInputChange("terms_agreed", !!checked)
                    }
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none"
                  >
                    I confirm all information provided is accurate
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="policies-check"
                    checked={formData.policies_agreed}
                    onCheckedChange={(checked) =>
                      handleInputChange("policies_agreed", !!checked)
                    }
                  />
                  <label
                    htmlFor="policies-check"
                    className="text-sm font-medium leading-none"
                  >
                    I agree to maintain up-to-date policies and procedures
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="updates"
                    checked={formData.updates_agreed}
                    onCheckedChange={(checked) =>
                      handleInputChange("updates_agreed", !!checked)
                    }
                  />
                  <label
                    htmlFor="updates"
                    className="text-sm font-medium leading-none"
                  >
                    I agree to provide regular compliance updates
                  </label>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Submit Registration</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
