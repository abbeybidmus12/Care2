import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserCog } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const initialFormState = {
  // Personal Details
  title: "",
  first_name: "",
  last_name: "",
  date_of_birth: "",
  email: "",
  phone: "",
  address: "",
  nationality: "",

  // Next of Kin
  nok_full_name: "",
  nok_email: "",
  nok_phone: "",
  nok_relationship: "",

  // Professional Details
  preferred_role: "",
  years_experience: "",
  availability: "",
  transport: "",
  resume: null,
  training_certificates: null,
  nmc_pin: "",

  // Documents & Checks
  right_to_work_doc: null,
  dbs_certificate: null,
  national_insurance: "",

  // Terms
  terms_agreed: false,
  privacy_agreed: false,
};

export default function Registration() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialFormState);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const password = Math.random().toString(36).slice(-8);
      const careworkerid = Math.random().toString(36).substring(2, 10);

      const { data, error } = await supabase
        .from("careworkers")
        .insert([{ ...formData, careworkerid, password }])
        .select();

      if (error) throw error;

      if (data) {
        toast({
          title: "Registration Successful",
          description:
            "Thank you for your registration. Your account setup is pending and you will be notified by email when approved.",
        });
        navigate("/worker-signin");
      }
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
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <Card className="w-full max-w-4xl bg-white p-8 shadow-sm rounded-lg border">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-2xl font-semibold text-gray-900">
                Care Worker Registration
              </h1>
            </div>
            <p className="text-gray-500">
              Complete all sections to register as a care worker
            </p>
          </div>

          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 bg-gray-50 p-1 rounded-lg gap-1">
              <TabsTrigger value="personal">Personal Details</TabsTrigger>
              <TabsTrigger value="nextofkin">Next of Kin</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    placeholder="Enter your first name"
                    value={formData.first_name}
                    onChange={(e) =>
                      handleInputChange("first_name", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    placeholder="Enter your last name"
                    value={formData.last_name}
                    onChange={(e) =>
                      handleInputChange("last_name", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) =>
                      handleInputChange("date_of_birth", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    placeholder="Enter your nationality"
                    value={formData.nationality}
                    onChange={(e) =>
                      handleInputChange("nationality", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your full address"
                    className="min-h-[80px]"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="nextofkin" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nok_full_name">Full Name</Label>
                  <Input
                    id="nok_full_name"
                    placeholder="Enter next of kin's full name"
                    value={formData.nok_full_name}
                    onChange={(e) =>
                      handleInputChange("nok_full_name", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nok_relationship">Relationship</Label>
                  <Input
                    id="nok_relationship"
                    placeholder="Enter relationship"
                    value={formData.nok_relationship}
                    onChange={(e) =>
                      handleInputChange("nok_relationship", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nok_email">Email Address</Label>
                  <Input
                    id="nok_email"
                    type="email"
                    placeholder="Enter next of kin's email"
                    value={formData.nok_email}
                    onChange={(e) =>
                      handleInputChange("nok_email", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nok_phone">Phone Number</Label>
                  <Input
                    id="nok_phone"
                    type="tel"
                    placeholder="Enter next of kin's phone"
                    value={formData.nok_phone}
                    onChange={(e) =>
                      handleInputChange("nok_phone", e.target.value)
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="professional" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="preferred_role">Preferred Role</Label>
                  <Select
                    value={formData.preferred_role}
                    onValueChange={(value) =>
                      handleInputChange("preferred_role", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nurse">Registered Nurse</SelectItem>
                      <SelectItem value="care-assistant">
                        Care Assistant
                      </SelectItem>
                      <SelectItem value="senior-carer">Senior Carer</SelectItem>
                      <SelectItem value="support-worker">
                        Support Worker
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="years_experience">Years of Experience</Label>
                  <Select
                    value={formData.years_experience}
                    onValueChange={(value) =>
                      handleInputChange("years_experience", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">0-1 years</SelectItem>
                      <SelectItem value="1-3">1-3 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="5-10">5-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resume">Resume Upload</Label>
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      handleInputChange("resume", e.target.files?.[0])
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="training_certificates">
                    Training Certificates
                  </Label>
                  <Input
                    id="training_certificates"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    multiple
                    onChange={(e) =>
                      handleInputChange("training_certificates", e.target.files)
                    }
                  />
                </div>

                {formData.preferred_role === "nurse" && (
                  <div className="space-y-2">
                    <Label htmlFor="nmc_pin">NMC PIN Number</Label>
                    <Input
                      id="nmc_pin"
                      placeholder="Enter your NMC PIN"
                      value={formData.nmc_pin}
                      onChange={(e) =>
                        handleInputChange("nmc_pin", e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="right_to_work_doc">
                    Right to Work Document
                  </Label>
                  <Input
                    id="right_to_work_doc"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      handleInputChange(
                        "right_to_work_doc",
                        e.target.files?.[0],
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dbs_certificate">DBS Certificate</Label>
                  <Input
                    id="dbs_certificate"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      handleInputChange("dbs_certificate", e.target.files?.[0])
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="national_insurance">
                    National Insurance Number
                  </Label>
                  <Input
                    id="national_insurance"
                    placeholder="Enter your NI number"
                    value={formData.national_insurance}
                    onChange={(e) =>
                      handleInputChange("national_insurance", e.target.value)
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="review" className="space-y-6">
              <div className="space-y-6">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-4">Personal Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Name</p>
                      <p className="text-sm text-muted-foreground">
                        {formData.first_name} {formData.last_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">
                        {formData.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">
                        {formData.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">
                        {formData.address}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-4">Next of Kin</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Name</p>
                      <p className="text-sm text-muted-foreground">
                        {formData.nok_full_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Relationship</p>
                      <p className="text-sm text-muted-foreground">
                        {formData.nok_relationship}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Contact</p>
                      <p className="text-sm text-muted-foreground">
                        {formData.nok_phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-4">Professional Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Role</p>
                      <p className="text-sm text-muted-foreground">
                        {formData.preferred_role}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Experience</p>
                      <p className="text-sm text-muted-foreground">
                        {formData.years_experience}
                      </p>
                    </div>
                    {formData.preferred_role === "nurse" && (
                      <div>
                        <p className="text-sm font-medium">NMC PIN</p>
                        <p className="text-sm text-muted-foreground">
                          {formData.nmc_pin}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-4">Documents</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">National Insurance</p>
                      <p className="text-sm text-muted-foreground">
                        {formData.national_insurance}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Uploaded Documents</p>
                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                        {formData.resume && <li>Resume</li>}
                        {formData.training_certificates && (
                          <li>Training Certificates</li>
                        )}
                        {formData.right_to_work_doc && (
                          <li>Right to Work Document</li>
                        )}
                        {formData.dbs_certificate && <li>DBS Certificate</li>}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms_agreed"
                      checked={formData.terms_agreed}
                      onCheckedChange={(checked) =>
                        handleInputChange("terms_agreed", !!checked)
                      }
                    />
                    <label
                      htmlFor="terms_agreed"
                      className="text-sm font-medium leading-none"
                    >
                      I agree to the terms and conditions
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="privacy_agreed"
                      checked={formData.privacy_agreed}
                      onCheckedChange={(checked) =>
                        handleInputChange("privacy_agreed", !!checked)
                      }
                    />
                    <label
                      htmlFor="privacy_agreed"
                      className="text-sm font-medium leading-none"
                    >
                      I agree to the privacy policy
                    </label>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
            <Button variant="outline" onClick={() => navigate("/")}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.terms_agreed || !formData.privacy_agreed}
            >
              Submit Registration
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
