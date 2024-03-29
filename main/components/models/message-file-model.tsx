"use client";

import { useForm } from "react-hook-form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import axios from "axios"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import FileUpload from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { UseModel } from "@/hooks/use-modal-store";
import qs from 'query-string'

export const MessageFileModel = () => {

  const formSchema = z.object({
    fileUrl: z.string().min(1, {
      message: "Attachment is required",
    }),
  });

  const {isOpen, onClose, data, type} = UseModel();
  const router = useRouter();
  const { apiUrl, query } = data;

  const isModelOpen = isOpen && type === "messageFile";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleClose = () => {
    form.reset();
    onClose();
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => { //Describe what would happen if the form is submitted
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query
      });

      await axios.post(url, {...values, content: values.fileUrl});

      form.reset();
      router.refresh();
      handleClose();
    } catch(err) {
      console.log(err);
    }
  };

  return (
    <>
        <Dialog open={isModelOpen} onOpenChange={handleClose}>
          <DialogContent className="bg-white text-black p-0 overflow-hidden">
            <DialogHeader className="pt-8 px-6">
              <DialogTitle className="text-2xl text-center font-bold">
                Add an attachment
              </DialogTitle>
              <DialogDescription className="text-center text-zinc-500">
                Send a file as a message
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="space-y-8 px-6">
                  <div className="flex items-center justify-center text-center">
                    <FormField
                      control={form.control}
                      name="fileUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FileUpload
                              endpoint="messageFile"
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                  <Button variant="primary" disabled={isLoading} type="submit">
                    Send
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
    </>
  );
};
