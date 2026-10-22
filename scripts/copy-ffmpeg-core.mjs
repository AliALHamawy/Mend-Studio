/**
 * Copies the FFmpeg WebAssembly core from @ffmpeg/core into `public/ffmpeg/`, where the app serves
 * it from its own origin (see `CORE_BASE_URL` in `lib/ffmpeg-client.ts`).
 *
 * Hooked into `postinstall`, `predev` and `prebuild`, so a fresh clone — locally or on Vercel —
 * always has the assets and no one has to copy files by hand. Files already in place are left
 * untouched, which keeps repeated runs free.
 */
import { access, copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

const ASSETS = ["ffmpeg-core.js", "ffmpeg-core.wasm"];
const sourceDir = path.join(process.cwd(), "node_modules", "@ffmpeg", "core", "dist", "esm");
const targetDir = path.join(process.cwd(), "public", "ffmpeg");

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function copyCore() {
  if (!(await exists(sourceDir))) {
    throw new Error(`cannot read ${sourceDir}. Run \`pnpm install\` to install @ffmpeg/core.`);
  }

  await mkdir(targetDir, { recursive: true });

  for (const asset of ASSETS) {
    const target = path.join(targetDir, asset);
    if (await exists(target)) {
      console.log(`[ffmpeg] ${path.relative(process.cwd(), target)} is already in place, skipping.`);
      continue;
    }

    const source = path.join(sourceDir, asset);
    if (!(await exists(source))) {
      throw new Error(`${source} was not shipped in the installed @ffmpeg/core package.`);
    }

    await copyFile(source, target);
    console.log(`[ffmpeg] copied ${asset} into public/ffmpeg/.`);
  }
}

copyCore().catch((error) => {
  // Better to fail loudly here than to serve a converter that 404s on its WebAssembly core.
  console.error(`[ffmpeg] could not prepare the WebAssembly core: ${error.message}`);
  process.exitCode = 1;
});
