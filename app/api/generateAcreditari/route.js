import { google } from "googleapis";
import { NextResponse } from "next/server";

let auth;
try {
  console.log("Initializing Google Auth...");
  auth = new google.auth.GoogleAuth({
    credentials: {
      type: process.env.GOOGLE_TYPE,
      private_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: process.env.GOOGLE_AUTH_URI,
      token_uri: process.env.GOOGLE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
    },
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/documents",
    ],
  });
  console.log("Google Auth initialized successfully.");
} catch (error) {
  console.error("Error during authentication:", error.message);
}

const drive = google.drive({ version: "v3", auth });
const docs = google.docs({ version: "v1", auth });

const createDocumentCopy = async (templateId, newTitle) => {
  console.log(
    `Creating a copy for templateId: ${templateId}, title: ${newTitle}`
  );
  try {
    const copy = await drive.files.copy({
      fileId: templateId,
      requestBody: { name: newTitle },
    });
    console.log(`Document copy created with ID: ${copy.data.id}`);
    return copy.data.id;
  } catch (error) {
    console.error(
      `Error creating document copy for templateId: ${templateId}`,
      error.message
    );
    throw new Error("Error creating document copy: " + error.message);
  }
};

const replaceVariables = async (documentId, variables) => {
  console.log(
    `Replacing variables in documentId: ${documentId} with variables:`,
    variables
  );
  const requests = Object.keys(variables).map((key) => ({
    replaceAllText: {
      containsText: {
        text: `{{${key}}}`,
        matchCase: true,
      },
      replaceText: variables[key],
    },
  }));

  try {
    await docs.documents.batchUpdate({
      documentId,
      requestBody: { requests },
    });
    console.log(`Variables replaced successfully in documentId: ${documentId}`);
  } catch (error) {
    console.error(
      `Error replacing variables in documentId: ${documentId}`,
      error.message
    );
    throw new Error("Error replacing variables: " + error.message);
  }
};

const setFilePermissions = async (fileId) => {
  console.log(`Setting permissions for fileId: ${fileId}`);
  try {
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    console.log(`Permissions set successfully for fileId: ${fileId}`);
  } catch (error) {
    console.error(
      `Error setting permissions for fileId: ${fileId}`,
      error.message
    );
    throw new Error("Error setting file permissions: " + error.message);
  }
};

// export async function POST(req) {
//   console.log("Processing POST request to generate documents...");
//   try {
//     const { documents } = await req.json();
//     console.log("Documents received for processing:", documents);

//     const generatedLinks = await Promise.all(
//       documents.map(async ({ templateId, variables, newTitle }) => {
//         console.log(
//           `Processing document with templateId: ${templateId}, newTitle: ${newTitle}`
//         );
//         const documentId = await createDocumentCopy(templateId, newTitle);
//         await setFilePermissions(documentId);
//         await replaceVariables(documentId, variables);

//         const wordLink = `https://docs.google.com/document/d/${documentId}/export?format=docx`;
//         console.log(`Generated document links for ${newTitle}:`, { wordLink });

//         return {
//           title: newTitle,
//           wordLink,
//         };
//       })
//     );

//     console.log("All documents generated successfully. Returning links.");
//     return NextResponse.json({ links: generatedLinks });
//   } catch (error) {
//     console.error("Failed to generate documents:", error.message);
//     return NextResponse.json(
//       { error: "Failed to generate documents: " + error.message },
//       { status: 500 }
//     );
//   }
// }

export async function POST(req) {
  try {
    const { documents } = await req.json();

    const generatedLinks = await Promise.all(
      documents.map(async ({ templateId, variables, newTitle }) => {
        const documentId = await createDocumentCopy(templateId, newTitle);
        await setFilePermissions(documentId);
        await replaceVariables(documentId, variables);

        const wordLink = `https://docs.google.com/document/d/${documentId}/export?format=docx`;

        let pdfLink = null;
        if (templateId === "1z5rCo8JiSY7f7atLX8YlHgXi7TQVua8pM5pgQM9DUAg") {
          pdfLink = `https://docs.google.com/document/d/${documentId}/export?format=pdf`;
        }

        return {
          title: newTitle,
          wordLink,
          ...(pdfLink && { pdfLink }), // Adaugă doar dacă există
        };
      })
    );

    return NextResponse.json({ links: generatedLinks });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate documents: " + error.message },
      { status: 500 }
    );
  }
}
