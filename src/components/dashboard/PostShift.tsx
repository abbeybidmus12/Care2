import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/hooks/useSession";
import Header from "./Header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function PostShift() {
  const { toast } = useToast();
  const { getSession } = useSession();
  const [formData, setFormData] = useState({
    date: "",
    start_time: "",
    end_time: "",
    role: "",
    hourly_rate: "",
    staff_required: "1",
    paid_break: false,
    required_skills: "",
    special_requirements: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const session = getSession();
      if (!session?.careHomeId) {
        throw new Error("Care home ID not found");
      }

      const shiftData = {
        care_home_id: session.careHomeId,
        date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        role: formData.role,
        hourly_rate: parseFloat(formData.hourly_rate),
        staff_required: parseInt(formData.staff_required),
        paid_break: formData.paid_break,
        required_skills: formData.required_skills,
        special_requirements: formData.special_requirements,
        status: "active",
      };

      const { data, error } = await supabase
        .from("shifts")
        .insert([shiftData])
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: `Shift posted successfully. ID: ${data[0].shift_id}`,
      });

      // Reset form
      setFormData({
        date: "",
        start_time: "",
        end_time: "",
        role: "",
        hourly_rate: "",
        staff_required: "1",
        paid_break: false,
        required_skills: "",
        special_requirements: "",
      });
    } catch (error) {
      console.error("Error posting shift:", error);
      toast({
        title: "Error",
        description: `Error posting shift: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col bg-gradient-to-br from-slate-50/50 to-slate-100/50 min-h-screen">
      <div className="sticky top-0 z-40">
        <Header title="Post New Shift" />
      </div>
      <div className="p-6">
        <Card className="w-full max-w-4xl mx-auto bg-white/95 p-8 backdrop-blur supports-[backdrop-filter]:bg-white/80">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Shift Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role Required</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="registered_nurse">
                      Registered Nurse
                    </SelectItem>
                    <SelectItem value="care_assistant">
                      Care Assistant
                    </SelectItem>
                    <SelectItem value="senior_carer">Senior Carer</SelectItem>
                    <SelectItem value="support_worker">
                      Support Worker
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_time">Start Time</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) =>
                    setFormData({ ...formData, start_time: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_time">End Time</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) =>
                    setFormData({ ...formData, end_time: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourly_rate">Hourly Rate (£)</Label>
                <Input
                  id="hourly_rate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.hourly_rate}
                  onChange={(e) =>
                    setFormData({ ...formData, hourly_rate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="staff_required">Number of Staff Required</Label>
                <Input
                  id="staff_required"
                  type="number"
                  min="1"
                  value={formData.staff_required}
                  onChange={(e) =>
                    setFormData({ ...formData, staff_required: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="required_skills">Required Skills</Label>
                <Textarea
                  id="required_skills"
                  placeholder="List required skills and qualifications..."
                  value={formData.required_skills}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      required_skills: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="special_requirements">
                  Special Requirements
                </Label>
                <Textarea
                  id="special_requirements"
                  placeholder="Any special requirements or notes..."
                  value={formData.special_requirements}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      special_requirements: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="paid_break"
                  checked={formData.paid_break}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, paid_break: checked })
                  }
                />
                <Label htmlFor="paid_break">Paid Break</Label>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData({ ...formData })}
              >
                Reset
              </Button>
              <Button type="submit">Post Shift</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
