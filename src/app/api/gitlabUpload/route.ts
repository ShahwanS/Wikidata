import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // JSON body parsing
    const { fileName, fileContent } = await request.json();

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

    // Return a success response to the client
    return NextResponse.json({
      message: "File successfully committed to GitLab!",
      result,
    });
  } catch (error) {
    console.error("Error handling the POST request:", error);

    // Return an error response to the client
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

//helper function to format date for filename
const formatDateForFilename = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
};
