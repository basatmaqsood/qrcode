"use client";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";

const formSchema = z.object({
  url: z.string().url().nonempty("URL is required"),
});

export default function Home() {
  const imageRef = useRef<HTMLImageElement>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const size: number = 400;

  const onSubmit = async (
    values: z.infer<typeof formSchema>
  ): Promise<void> => {
    console.log("Form submitted");

    if (values.url) {
      const { url } = values;
      const qrCodeDataUrl = await QRCode.toDataURL(url, {
        width: size,
      });
      setQrCodeData(qrCodeDataUrl); // Store the value in the state
    } else {
      console.log("URL is required");
    }
  };

  function handleCopy() {
    console.log("Copy QR Code");
    // copy the qr code image to the clipboard. not url
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    if (ctx && imageRef.current) {
      ctx.drawImage(imageRef.current, 0, 0);
      canvas.toBlob((blob) => {
        const clipboardItem = new ClipboardItem({
          [blob?.type || "image/png"]: blob || new Blob(),
        });
        return navigator.clipboard.write([clipboardItem]);
      });
    }
  }

  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-[48px] lg:p-24 ">
      <Form {...form}>
        <form
          className={cn("lg:w-1/2 flex flex-col lg:flex-row  gap-3")}
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit(onSubmit)(); // Call handleSubmit
          }}
        >
          <FormField
            name="url"
            control={form.control}
            render={({ field }) => (
              <FormItem className={cn("lg:flex-1")}>
                <Input {...field} placeholder="Enter URL" type="url" />
              </FormItem>
            )}
          />
          <Button type="submit" className={cn("bg-green-600")}>
            Generate QR Code
          </Button>
        </form>
      </Form>
      {qrCodeData && (
        <>
          <Image
          ref = {imageRef}
            src={qrCodeData}
            alt="Generated QrCode"
            width={size}
            height={size}
          />
          <div className="flex flex-col gap-2 lg:flex-row">
            <a href={qrCodeData} download="qrcode.png">
              <Button className={cn("bg-green-600")}>Download QR Code</Button>
            </a>
            <Button onClick={handleCopy} className={cn("bg-green-600")}>
              Copy QR Code
            </Button>
          </div>
        </>
      )}
    </main>
  );
}
