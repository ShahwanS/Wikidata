"use server";

import { serverFileToBase64, formatDateForFilename } from "@/utils/utils";

export async function commitToGitLab(fileName: string, fileContent: string) {
  try {
    // Setting filename and path
    const folderName = fileName;
    const formattedFileName = `${fileName}_${formatDateForFilename()}.md`;
    const filePath = `${folderName}/${formattedFileName}`;
    const apiUrl = process.env.API_URL || "";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify({
        branch: "main",
        commit_message: `Add ${formattedFileName} to ${folderName} via API`,
        actions: [
          {
            action: "create",
            file_path: filePath,
            content: fileContent,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`GitLab API responded with status ${response.status}`);
    }

    const result = await response.json();
    console.log("Commit created:", result);
  } catch (error) {
    console.error("Error handling the POST request:", error);
  }
}

export async function uploadImage(formData: FormData): Promise<boolean> {
  const fileName = formData.get("fileName") as string;
  const fileContent = formData.get("fileContent") as File;

  try {
    if (!(fileContent instanceof File)) {
      console.warn(`fileContent is not a File object for ${fileName}`);
      return false;
    }

    const folderName = fileName;
    const fileExtension = fileContent.name.split(".").pop() || "jpg";
    const formattedFileName = `${
      fileContent.name
    }_${formatDateForFilename()}.${fileExtension}`;
    const filePath = `./${folderName}/images/${formattedFileName}`;
    const apiUrl = process.env.API_URL;

    if (!apiUrl) {
      console.error("API_URL is not defined in environment variables");
      return false;
    }

    const arrayBuffer = await fileContent.arrayBuffer();
    const base64Content = await serverFileToBase64(arrayBuffer);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify({
        branch: "main",
        commit_message: `Add ${formattedFileName} to ${folderName} via API`,
        actions: [
          {
            action: "create",
            file_path: filePath,
            encoding: "base64",
            content: base64Content,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `GitLab API responded with status ${response.status}: ${errorText}`
      );
      return false;
    }

    const result = await response.json();
    console.log(`GitLab API response for ${fileName}:`, JSON.stringify(result));
    return true;
  } catch (error) {
    console.error(`Error in uploadImage for ${fileName}:`, error);
    return false;
  }
}
