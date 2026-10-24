"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/home/avatar";
import { errorMessage, request } from "@/lib/request";
import {
  updateProfileSchema,
  UpdateProfileType,
} from "@/schemas/update-profile";
import { UPLOADCARE_PUBLIC_KEY } from "@/lib/constant/uploadcare.constant";

import "@uploadcare/react-uploader/core.css";
const FileUploaderRegular = dynamic(
  () =>
    import("@uploadcare/react-uploader").then((mod) => mod.FileUploaderRegular),
  { ssr: false }
);

interface ProfileFormProps {
  user: {
    name: string;
    image: string;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [preview, setPreview] = useState(user.image);
  const [failed, setFailed] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileType>({
    resolver: zodResolver(updateProfileSchema),
    // image stays undefined until changed, so a Google avatar is never re-sent.
    defaultValues: { name: user.name },
  });

  const onSubmit = async (profile: UpdateProfileType) => {
    try {
      const data = await request<{ message: string }>(
        "/api/user",
        "PATCH",
        profile
      );

      toast.success(data.message);
      router.refresh();
    } catch (err) {
      toast.error(
        errorMessage(err, "Could not update your profile. Try again.")
      );
    }
  };

  const setImage = (url: string) => {
    setValue("image", url);
    setPreview(url);
    setFailed(false);
  };

  return (
    <form className="mt-8" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-7">
        <div>
          <Label className="block">Profile picture</Label>

          <div className="mt-3 flex items-center gap-4">
            {preview && !failed ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Your avatar"
                onError={() => setFailed(true)}
                className="size-16 shrink-0 rounded-full bg-zinc-100 object-cover"
              />
            ) : (
              <Avatar name={user.name} size="md" />
            )}

            <FileUploaderRegular
              pubkey={UPLOADCARE_PUBLIC_KEY}
              store={false}
              maxLocalFileSizeBytes={10000000}
              multiple={false}
              imgOnly={true}
              sourceList="local, camera"
              useCloudImageEditor={false}
              classNameUploader="my-config"
              className="my-2"
              onFileUploadSuccess={(e) => setImage(e.cdnUrl)}
              onFileRemoved={() => setImage("")}
            />
          </div>

          <p
            id="image-hint"
            className={`mt-2 text-sm ${errors.image ? "text-red-600" : "text-zinc-500"}`}
          >
            {errors.image?.message ??
              "JPG, PNG or WebP. Remove the photo to fall back to your initials."}
          </p>
        </div>

        <div>
          <Label htmlFor="name">Display name</Label>
          <Input
            {...register("name")}
            id="name"
            placeholder="Munadil"
            aria-required={true}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby="name-hint"
            className="mt-2 bg-white aria-invalid:border-red-500"
          />
          <p
            id="name-hint"
            className={`mt-2 text-sm ${errors.name ? "text-red-600" : "text-zinc-500"}`}
          >
            {errors.name?.message ?? "Shown on your dashboard and public pages."}
          </p>
        </div>
      </div>

      <Button
        className="mt-10 h-11 w-full"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
