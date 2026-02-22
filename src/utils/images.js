import { Directory, File, Paths } from "expo-file-system";

export async function persistImageAsync(sourceUri) {
  const imagesDir = new Directory(Paths.document, "candidate_images");
  if (!imagesDir.exists) {
    await imagesDir.create({ intermediates: true });
  }

  const ext = sourceUri.split(".").pop()?.split("?")[0] ?? "jpg";
  const filename = `cand_${Date.now()}.${ext}`;

  const sourceFile = new File(sourceUri);

  const destinationFile = new File(imagesDir, filename);

  await sourceFile.copy(destinationFile);

  return destinationFile.uri;
}