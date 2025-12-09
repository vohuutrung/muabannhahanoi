import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Magic bytes for common image formats
const MAGIC_BYTES: Record<string, number[][]> = {
  "image/jpeg": [[0xFF, 0xD8, 0xFF]],
  "image/png": [[0x89, 0x50, 0x4E, 0x47]],
  "image/gif": [[0x47, 0x49, 0x46, 0x38]],
  "image/webp": [[0x52, 0x49, 0x46, 0x46]], // RIFF header, need to also check WEBP
};

function validateMagicBytes(bytes: Uint8Array, declaredType: string): boolean {
  const signatures = MAGIC_BYTES[declaredType];
  if (!signatures) return false;

  for (const signature of signatures) {
    let matches = true;
    for (let i = 0; i < signature.length; i++) {
      if (bytes[i] !== signature[i]) {
        matches = false;
        break;
      }
    }
    if (matches) {
      // Additional check for WebP - must have WEBP at offset 8
      if (declaredType === "image/webp") {
        const webpSignature = [0x57, 0x45, 0x42, 0x50]; // WEBP
        for (let i = 0; i < webpSignature.length; i++) {
          if (bytes[8 + i] !== webpSignature[i]) {
            return false;
          }
        }
      }
      return true;
    }
  }
  return false;
}

function detectActualType(bytes: Uint8Array): string | null {
  for (const [mimeType, signatures] of Object.entries(MAGIC_BYTES)) {
    for (const signature of signatures) {
      let matches = true;
      for (let i = 0; i < signature.length; i++) {
        if (bytes[i] !== signature[i]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        // Additional check for WebP
        if (mimeType === "image/webp") {
          const webpSignature = [0x57, 0x45, 0x42, 0x50];
          let webpMatches = true;
          for (let i = 0; i < webpSignature.length; i++) {
            if (bytes[8 + i] !== webpSignature[i]) {
              webpMatches = false;
              break;
            }
          }
          if (webpMatches) return mimeType;
        } else {
          return mimeType;
        }
      }
    }
  }
  return null;
}

interface ValidationResult {
  valid: boolean;
  error?: string;
  detectedType?: string;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authorization
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ valid: false, error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client to verify the user
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ valid: false, error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the multipart form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const declaredType = formData.get("type") as string | null;

    if (!file) {
      return new Response(
        JSON.stringify({ valid: false, error: "No file provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Validating file: ${file.name}, declared type: ${declaredType}, size: ${file.size}`);

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ valid: false, error: `File exceeds maximum size of ${MAX_FILE_SIZE / 1024 / 1024}MB` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check declared MIME type
    if (!declaredType || !ALLOWED_MIME_TYPES.includes(declaredType)) {
      return new Response(
        JSON.stringify({ valid: false, error: `Invalid file type: ${declaredType}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Read file bytes for magic byte validation
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Validate magic bytes match declared type
    const isValidMagic = validateMagicBytes(bytes, declaredType);
    const detectedType = detectActualType(bytes);

    if (!isValidMagic) {
      console.warn(`Magic bytes mismatch: declared ${declaredType}, detected ${detectedType || "unknown"}`);
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: `File content does not match declared type. Detected: ${detectedType || "unknown"}`,
          detectedType: detectedType || undefined
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`File validated successfully: ${file.name}, type: ${detectedType}`);

    const result: ValidationResult = {
      valid: true,
      detectedType: detectedType || declaredType,
    };

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Validation error:", error);
    return new Response(
      JSON.stringify({ valid: false, error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
