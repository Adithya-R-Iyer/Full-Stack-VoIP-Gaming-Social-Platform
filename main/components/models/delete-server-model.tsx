"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { UseModel } from "@/hooks/use-modal-store";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const DeleteServerModel = () => {

  const { isOpen, onClose, type, data } = UseModel();
  const isModelOpen = isOpen && type === "deleteServer";

  const { server } = data;
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onClick = async ()=> {
    try{
      setIsLoading(true);

      await axios.delete(`/api/servers/${server?.id}/delete`);

      onClose();
      router.refresh();
      router.push("/");
      window.location.reload();
    } catch(err){
      console.log(err);
    } finally {
      setIsLoading(false);
    }

  }

  return (
    <>
        <Dialog open={isModelOpen} onOpenChange={onClose}>
          <DialogContent className="bg-white text-black p-0 overflow-hidden">
            <DialogHeader className="pt-8 px-6">
              <DialogTitle className="text-2xl text-center font-bold">
                Delete Server
              </DialogTitle>
              <DialogDescription className="text-center text-zinc-500">
                Are you sure you want to do this? <br />
                <span className="text-indigo-500 font-semibold">{server?.name}</span> will be permanently deleted.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <div className="flex items-center justify-between w-full">
                <Button
                  disabled={isLoading}
                  onClick={onClose}
                  variant={"ghost"}
                >
                  Cancel
                </Button>
                <Button
                  disabled={isLoading}
                  variant={"destructive"}
                  onClick={onClick}
                >
                  Confirm
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </>
  );
};
