"use client";
import QrCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  url: z.string().url().nonempty("URL is required"),
});

export default function Home() {
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>): void => {
    console.log("Form submitted");
    console.log(values);

    if (values.url) {
      console.log("URL:", values.url);
      setQrCodeData(values.url); // Store the value in the state
    } else {
      console.log("URL is required");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Form {...form}>
        <form
          className={cn("w-1/2 flex gap-3")}
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit(onSubmit)(); // Call handleSubmit
          }}
        >
          <FormField
            name="url"
            control={form.control}
            render={({ field }) => (
              <FormItem className={cn("flex-1")}>
                <Input {...field} placeholder="Enter URL" type="url" />
              </FormItem>
            )}
          />
          <Button type="submit" className={cn("bg-green-600")}>
            Generate QR Code
          </Button>
        </form>
      </Form>

      {/* Display the stored URL */}
      {qrCodeData && (
        <div className="mt-4">
          <p>Stored URL: {qrCodeData}</p>
        </div>
      )}
    </main>
  );
}
