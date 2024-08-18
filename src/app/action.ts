"use server";

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

//helper function to format date for filename
const formatDateForFilename = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
};
