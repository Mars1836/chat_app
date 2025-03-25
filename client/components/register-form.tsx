"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import apiPath from "@/api_path";

const formSchema = z.object({
  citizenIdentificationCard: z.string().min(1, "Citizen ID is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender",
  }),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
  }),
  address: z.string().min(1, "Address is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
});

// Generate years for the dropdown (from current year back to 1900)
const currentYear = new Date().getFullYear();
const years = Array.from(
  { length: currentYear - 1900 + 1 },
  (_, i) => currentYear - i
);

// Generate months for the dropdown
const months = [
  { value: 0, label: "January" },
  { value: 1, label: "February" },
  { value: 2, label: "March" },
  { value: 3, label: "April" },
  { value: 4, label: "May" },
  { value: 5, label: "June" },
  { value: 6, label: "July" },
  { value: 7, label: "August" },
  { value: 8, label: "September" },
  { value: 9, label: "October" },
  { value: 10, label: "November" },
  { value: 11, label: "December" },
];

// Function to check if a date is valid

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);

  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedMonth, setSelectedMonth] = useState<number>(0); // January
  const [selectedYear, setSelectedYear] = useState<number>(currentYear - 30);
  const [dateError, setDateError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      citizenIdentificationCard: "",
      username: "",
      name: "",
      password: "",
      address: "",
      phoneNumber: "",
      dateOfBirth: new Date(selectedYear, selectedMonth, selectedDay),
    },
  });
  // Handle year change
  const isValidDate = (year: number, month: number, day: number) => {
    const date = new Date(year, month, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day
    );
  };

  // Handle day change
  const handleDayChange = (day: number) => {
    setSelectedDay(day);
    updateDateOfBirth(selectedYear, selectedMonth, day);
  };

  // Handle month change
  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    updateDateOfBirth(selectedYear, month, selectedDay);
  };

  // Handle year change
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    updateDateOfBirth(year, selectedMonth, selectedDay);
  };

  // Update the date of birth field with validation
  const updateDateOfBirth = (year: number, month: number, day: number) => {
    setDateError(null);

    if (!isValidDate(year, month, day)) {
      setDateError(
        "Invalid date. Please check the day for the selected month and year."
      );
      return;
    }

    const newDate = new Date(year, month, day);
    form.setValue("dateOfBirth", newDate);
  };
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isValidDate(selectedYear, selectedMonth, selectedDay)) {
      setDateError(
        "Invalid date. Please check the day for the selected month and year."
      );
      return;
    }
    setIsLoading(true);

    try {
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth.toISOString().split("T")[0],
      };
      console.log(formattedValues);
      const response = await apiPath.register(
        formattedValues.username,
        formattedValues.password,
        formattedValues.name,
        formattedValues.gender,
        formattedValues.dateOfBirth,
        formattedValues.address,
        formattedValues.phoneNumber,
        formattedValues.citizenIdentificationCard
      );
      router.push("/");
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="citizenIdentificationCard"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Citizen ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter your citizen ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Choose a username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Choose a password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Birth</FormLabel>

              {/* Day, Month, Year Selectors */}
              <div className="flex gap-2">
                <Select
                  value={selectedDay.toString()}
                  onValueChange={(value) =>
                    handleDayChange(Number.parseInt(value))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedMonth.toString()}
                  onValueChange={(value) =>
                    handleMonthChange(Number.parseInt(value))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem
                        key={month.value}
                        value={month.value.toString()}
                      >
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedYear.toString()}
                  onValueChange={(value) =>
                    handleYearChange(Number.parseInt(value))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {dateError && (
                <p className="text-sm font-medium text-destructive mt-2">
                  {dateError}
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter your address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter your phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Register"}
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/" className="text-primary hover:underline">
          Login
        </Link>
      </div>
    </Form>
  );
}
