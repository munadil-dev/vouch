import { z } from "zod";
import { UPLOADCARE_FILE_ID } from "@/lib/constant/uploadcare.constant";

// Uploadcare serves each project from <prefix>.ucarecd.net (ucarecdn.com for older projects).
export const uploadcareImage = z
  .url({
    protocol: /^https$/,
    hostname: /^([a-z0-9]+\.ucarecd\.net|ucarecdn\.com)$/,
    error: "Upload the photo again",
  })
  .refine((url) => {
    try {
      return UPLOADCARE_FILE_ID.test(new URL(url).pathname.split("/")[1]);
    } catch {
      return false;
    }
  }, "Upload the photo again");
