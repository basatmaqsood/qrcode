"use client";

import { Button } from "@/components/ui/button";
import { FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  url: z.string().url(),
});

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>): void => {};
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form {...form}>
        <FormField
          name="url"
          control={form.control}
          render={(field) => (
            <FormItem>
              <Input {...field} placeholder="Enter URL" type="url" />
            </FormItem>
          )}
        />
        <Button type="submit">Generate QR Code</Button>
      </form>
    </main>
  );
}
